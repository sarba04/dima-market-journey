import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { IMG } from "@/lib/images";
import { TOUR_PATH, tourSample } from "@/lib/tour-path";

type Props = { progress: MutableRefObject<number>; onReady: () => void; onFailure: () => void };
const vertex = `
 varying vec2 vUv;
 uniform float uDepth;
 void main(){
  vUv=uv;
  vec3 p=position;
  float edge=pow(abs(uv.x-.5)*2.,2.);
  p.z-=edge*uDepth;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
 }`;
const fragment = `
 uniform sampler2D uImage;
 uniform float uOpacity;
 varying vec2 vUv;
 void main(){
  vec3 c=texture2D(uImage,vUv).rgb;
  gl_FragColor=vec4(c,uOpacity);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
 }`;
function PhotoSpace({ index, progress }: { index: number; progress: MutableRefObject<number> }) {
  const stop = TOUR_PATH[index];
  const texture = useTexture(IMG[stop.image]);
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const uniforms = useMemo(() => ({ uImage: { value:texture }, uOpacity:{ value:1 }, uDepth:{ value:index < 2 ? 1.2 : 3.4 } }), [texture,index]);
  useEffect(() => { texture.colorSpace=THREE.SRGBColorSpace; texture.anisotropy=4; }, [texture]);
  const image = texture.image as { width: number; height: number };
  const ratio = image.width / image.height;
  const height = 26;
  const width = Math.max(height * ratio, viewport.aspect * 18);
  useFrame(() => {
    const sample = tourSample(progress.current);
    const relative = progress.current * (TOUR_PATH.length-1) - index;
    if (!mesh.current) return;
    // Broad photo shells overlap in depth; they disappear before the lens crosses them.
    const fade = THREE.MathUtils.smoothstep(relative, 0.22, 0.62);
    uniforms.uOpacity.value = 1-fade;
    mesh.current.visible = relative > -1.35 && relative < 0.62;
    mesh.current.scale.setScalar(relative < 0 ? 1-relative : Math.max(.85, 1-relative*.25));
    mesh.current.rotation.y = stop.yaw * .25;
    mesh.current.position.x = stop.x;
    mesh.current.position.y = index === 6 || index === 8 ? -0.9 : 0;
    // Peripheral curvature gives actual perspective/parallax during camera travel.
    uniforms.uDepth.value = index < 2 ? 1.2 : 3.4 + Math.abs(sample.yaw)*2;
  });
  return <mesh ref={mesh} position={[stop.x,0,stop.z-18]} renderOrder={-index}>
    <planeGeometry args={[width,height,48,12]} />
    <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} toneMapped={false} transparent depthWrite={false} side={THREE.DoubleSide} />
  </mesh>;
}
function CameraRig({ progress, onReady }: Pick<Props,"progress"|"onReady">) {
  const ready = useRef(false);
  const aim = useMemo(() => new THREE.Vector3(), []);
  const { gl } = useThree();
  useFrame(({ camera, scene }) => {
    const sample=tourSample(progress.current);
    camera.position.set(sample.x,sample.y,sample.z);
    aim.set(sample.x-Math.sin(sample.yaw)*10,sample.y,sample.z-10);
    camera.lookAt(aim);
    if (!ready.current && scene.children.length > 2) { ready.current=true; requestAnimationFrame(onReady); }
    if (import.meta.env.DEV) {
      const el=gl.domElement;
      el.dataset.cameraZ=sample.z.toFixed(2);
      el.dataset.cameraX=sample.x.toFixed(2);
      el.dataset.drawCalls=String(gl.info.render.calls);
    }
  });
  return null;
}
function World({ progress, onReady }: Pick<Props,"progress"|"onReady">) {
  return <>
    {TOUR_PATH.map((_,i) => <PhotoSpace key={i} index={i} progress={progress} />)}
    <CameraRig progress={progress} onReady={onReady} />
  </>;
}
export default function SpatialTour({ progress, onReady, onFailure }: Props) {
  const [live,setLive] = useState(true);
  useEffect(() => {
    const visibility = () => setLive(!document.hidden);
    const progressEvent = (e: Event) => { const p=(e as CustomEvent<{progress:number}>).detail.progress; if (!document.hidden) setLive(p < 1); };
    document.addEventListener("visibilitychange",visibility);
    window.addEventListener("dima:heroProgress",progressEvent);
    return () => { document.removeEventListener("visibilitychange",visibility); window.removeEventListener("dima:heroProgress",progressEvent); };
  }, []);
  return <Canvas camera={{ position:[0,0,0], fov:65, near:.1, far:220 }} dpr={[1,2]} frameloop={live ? "always" : "demand"} gl={{ antialias:true, alpha:true, powerPreference:"high-performance", toneMapping:THREE.NoToneMapping }} onCreated={({ gl }) => {
    gl.setClearColor(0,0);
    gl.domElement.addEventListener("webglcontextlost", onFailure, { once:true });
  }} fallback={null}>
    <Suspense fallback={null}><World progress={progress} onReady={onReady} /></Suspense>
  </Canvas>;
}
