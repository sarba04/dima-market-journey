import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { IMG } from "@/lib/images";
import { ROOM_DISTANCE, TOUR_PATH, tourSample, type TourStop } from "@/lib/tour-path";

type Props = { progress: MutableRefObject<number>; onReady: () => void; onFailure: () => void };
/** Damped walk state shared by every object of the scene (no React state per frame). */
type Motion = {
  p: number;
  speed: number;
  roll: number;
  t: number;
  lookX: number;
  lookY: number;
  doors: [number, number][];
};
type MotionRef = MutableRefObject<Motion>;

const OVERSCAN = 1.5;
const LAST = TOUR_PATH.length - 1;

/* ---------------------------------------------------------------------------
 * Photographic rooms: each photo is sculpted into a relief around its vanishing
 * point (corridors recede, people lean towards the lens) so the camera gets real
 * parallax. Walking into the vanishing point opens a doorway to the next room.
 * ------------------------------------------------------------------------- */
const roomVertex = /* glsl */ `
  uniform vec2 uVp;
  uniform vec2 uFocus;
  uniform float uRelief;
  uniform float uPlaneAspect;
  uniform float uImageAspect;
  varying vec2 vUv;
  vec2 cover(vec2 uv) {
    vec2 s = vec2(1.0);
    if (uPlaneAspect > uImageAspect) s.y = uImageAspect / uPlaneAspect;
    else s.x = uPlaneAspect / uImageAspect;
    return uv * s + (1.0 - s) * uFocus;
  }
  void main() {
    vec2 iuv = cover(uv);
    vUv = iuv;
    float r = length((iuv - uVp) * vec2(uImageAspect, 1.0));
    float shape = uRelief >= 0.0 ? 1.0 - smoothstep(0.0, 1.05, r) : exp(-r * r * 4.5);
    vec3 p = position;
    p.z -= shape * uRelief;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const roomFragment = /* glsl */ `
  uniform sampler2D uImage;
  uniform vec2 uDoor;
  uniform float uImageAspect;
  uniform float uReveal;
  uniform float uBlur;
  uniform float uTime;
  uniform vec3 uRim;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  void main() {
    vec3 c;
    if (uBlur > 0.003) {
      // Radial motion blur towards the vanishing point, with a slight optical split.
      vec2 dir = (uDoor - vUv) * uBlur * 0.055;
      vec3 acc = vec3(0.0);
      for (int i = 0; i < 8; i++) {
        vec2 o = dir * (float(i) / 7.0);
        acc.r += texture2D(uImage, vUv + o * 1.18).r;
        acc.g += texture2D(uImage, vUv + o).g;
        acc.b += texture2D(uImage, vUv + o * 0.82).b;
      }
      c = acc / 8.0;
    } else {
      c = texture2D(uImage, vUv).rgb;
    }
    float alpha = 1.0;
    if (uReveal > 0.001) {
      float r = length((vUv - uDoor) * vec2(uImageAspect, 1.0));
      float n = noise(vUv * 6.0 + uTime * 0.12) * 0.14 + noise(vUv * 26.0) * 0.035;
      float edge = r + n - uReveal * 1.7;
      alpha = smoothstep(0.0, 0.05, edge);
      float rim = (1.0 - smoothstep(0.0, 0.035, abs(edge - 0.018))) * (1.0 - uReveal);
      c = mix(c, uRim, rim * 0.7);
      if (alpha < 0.01) discard;
    }
    gl_FragColor = vec4(c, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function Room({
  stop,
  index,
  motion,
  baseFov,
}: {
  stop: TourStop;
  index: number;
  motion: MotionRef;
  baseFov: number;
}) {
  const texture = useTexture(IMG[stop.image]);
  const gl = useThree((s) => s.gl);
  const aspect = useThree((s) => s.size.width / s.size.height);
  const mesh = useRef<THREE.Mesh>(null);
  if (texture.colorSpace !== THREE.SRGBColorSpace) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
  }
  const image = texture.image as { width: number; height: number };
  const height = 2 * ROOM_DISTANCE * Math.tan(THREE.MathUtils.degToRad(baseFov / 2)) * OVERSCAN;
  // Portrait screens get extra lateral room for the yaw of the walk.
  const planeAspect = aspect < 0.85 ? aspect * 1.3 : aspect;
  const width = height * planeAspect;
  // One stable uniforms object per material: three.js binds it when the program compiles.
  const uniforms = useMemo(
    () => ({
      uImage: { value: texture },
      uVp: { value: new THREE.Vector2(stop.vp[0], stop.vp[1]) },
      uDoor: { value: new THREE.Vector2(stop.door[0], stop.door[1]) },
      uFocus: { value: new THREE.Vector2(stop.focus[0], 1 - stop.focus[1]) },
      uRelief: { value: stop.relief },
      uPlaneAspect: { value: 1 },
      uImageAspect: { value: 1 },
      uReveal: { value: 0 },
      uBlur: { value: 0 },
      uTime: { value: 0 },
      uRim: { value: new THREE.Color("#c4f25a") },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  // Built by hand so the live uniforms object is the one the program reads every frame.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: roomVertex,
        fragmentShader: roomFragment,
        uniforms,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      }),
    [uniforms],
  );
  useEffect(() => () => material.dispose(), [material]);
  uniforms.uImage.value = texture;
  uniforms.uPlaneAspect.value = planeAspect;
  uniforms.uImageAspect.value = image.width / image.height;
  const planeZ = stop.z - ROOM_DISTANCE;
  // Where this room's doorway sits in world space, relative to the plane centre.
  useEffect(() => {
    const ia = image.width / image.height;
    const sx = planeAspect > ia ? 1 : planeAspect / ia,
      sy = planeAspect > ia ? ia / planeAspect : 1;
    const u = (stop.door[0] - (1 - sx) * stop.focus[0]) / sx;
    const v = (stop.door[1] - (1 - sy) * (1 - stop.focus[1])) / sy;
    motion.current.doors[index] = [(u - 0.5) * width, (v - 0.5) * height];
  }, [planeAspect, image.width, image.height, stop, width, height, index, motion]);

  useFrame(({ camera }) => {
    const m = motion.current;
    const el = mesh.current;
    if (!el) return;
    const relative = m.p * LAST - index;
    el.visible = relative > -1.6 && (index === LAST || relative < 0.74);
    if (!el.visible) return;
    // Rooms further away are scaled so they always fill the doorway that reveals them.
    const dist = camera.position.z - planeZ;
    const s = Math.max(1, Math.pow(Math.max(dist, 0.001) / ROOM_DISTANCE, 0.85));
    el.scale.set(width * s, height * s, 1);
    const reveal = index === LAST ? 0 : THREE.MathUtils.smoothstep(relative, 0.2, 0.66);
    uniforms.uReveal.value = reveal;
    // The sculpted relief settles as we step through, so nothing brushes the lens.
    uniforms.uRelief.value = stop.relief * (1 - reveal * 0.85);
    uniforms.uBlur.value = m.speed;
    uniforms.uTime.value = m.t;
  });

  return (
    <mesh
      ref={mesh}
      material={material}
      position={[stop.x, 0, planeZ]}
      rotation={[0, stop.yaw * 0.25, 0]}
      renderOrder={-index}
      frustumCulled={false}
    >
      <planeGeometry args={[1, 1, 144, 96]} />
    </mesh>
  );
}

/* Floating dust in the shop light: gives depth cues between the rooms. */
const dustVertex = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSpeed;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.22 + aSeed * 6.28) * 0.4;
    p.x += cos(uTime * 0.17 + aSeed * 12.0) * 0.35;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    gl_PointSize = min(22.0, (0.7 + aSeed * 1.8) * uPixelRatio * (34.0 / depth) * (1.0 + uSpeed * 0.8));
    vAlpha = (0.3 + 0.7 * fract(aSeed * 7.13)) * smoothstep(34.0, 8.0, depth) * smoothstep(0.4, 2.2, depth);
    vAlpha *= 0.6 + 0.4 * sin(uTime * 1.2 + aSeed * 40.0);
  }
`;
const dustFragment = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(1.0, 0.95, 0.84, a * a * vAlpha * 0.55);
  }
`;
function Dust({ motion }: { motion: MotionRef }) {
  const dpr = useThree((s) => s.viewport.dpr);
  const geometry = useMemo(() => {
    const count = 900;
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = 6 - Math.random() * (Math.abs(TOUR_PATH[LAST].z) + 30);
      seed[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, []);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 }, uSpeed: { value: 0 } }),
    [],
  );
  uniforms.uPixelRatio.value = dpr;
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: dustVertex,
        fragmentShader: dustFragment,
        uniforms,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [uniforms],
  );
  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame(() => {
    uniforms.uTime.value = motion.current.t;
    uniforms.uSpeed.value = motion.current.speed;
  });
  return <points geometry={geometry} material={material} renderOrder={10} frustumCulled={false} />;
}

/* Damps the scroll progress into a walk, and measures how fast we move. */
function MotionDriver({
  progress,
  motion,
}: {
  progress: MutableRefObject<number>;
  motion: MotionRef;
}) {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const tilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      pointer.current.x = THREE.MathUtils.clamp(e.gamma / 25, -1, 1);
      pointer.current.y = THREE.MathUtils.clamp((e.beta - 50) / 25, -1, 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("deviceorientation", tilt, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("deviceorientation", tilt);
    };
  }, []);
  useFrame((_, delta) => {
    const m = motion.current;
    const dt = Math.min(delta, 1 / 20);
    const before = tourSample(m.p);
    m.p += (progress.current - m.p) * (1 - Math.exp(-dt * 5));
    if (Math.abs(progress.current - m.p) < 1e-5) m.p = progress.current;
    const after = tourSample(m.p);
    const zSpeed = Math.abs(after.z - before.z) / Math.max(dt, 1e-3);
    m.speed += (Math.min(1, zSpeed / 38) - m.speed) * (1 - Math.exp(-dt * 7));
    const lateral = (after.x - before.x) / Math.max(dt, 1e-3);
    m.roll +=
      (THREE.MathUtils.clamp(-lateral * 0.012, -0.05, 0.05) - m.roll) * (1 - Math.exp(-dt * 4));
    m.lookX += (pointer.current.x - m.lookX) * (1 - Math.exp(-dt * 2.6));
    m.lookY += (pointer.current.y - m.lookY) * (1 - Math.exp(-dt * 2.6));
    m.t += dt;
  });
  return null;
}

function CameraRig({
  motion,
  baseFov,
  onReady,
}: {
  motion: MotionRef;
  baseFov: number;
  onReady: () => void;
}) {
  const ready = useRef(false);
  const aim = useMemo(() => new THREE.Vector3(), []);
  const gl = useThree((s) => s.gl);
  useFrame(({ camera }) => {
    const cam = camera as THREE.PerspectiveCamera;
    const m = motion.current;
    const s = tourSample(m.p);
    // Steer gently towards the doorway of the room we are leaving.
    const seg = Math.min(LAST - 1, Math.floor(m.p * LAST));
    const door = m.doors[seg] ?? [0, 0];
    const steer = Math.sin(Math.PI * Math.min(1, s.local * 1.15)) * 0.2;
    const sx = door[0] * steer,
      sy = door[1] * steer;
    // A breathing hand-held camera, footsteps while walking, and the visitor's gaze.
    const breath = Math.sin(m.t * 0.8) * 0.05 + Math.sin(m.t * 0.37) * 0.03;
    const step = Math.sin(s.z * 0.62) * 0.09 * m.speed;
    cam.position.set(s.x + sx + m.lookX * 0.45, s.y + sy + breath + step - m.lookY * 0.25, s.z);
    const yaw = s.yaw + m.lookX * 0.065;
    aim.set(
      cam.position.x + sx * 0.4 - Math.sin(yaw) * 10,
      cam.position.y + sy * 0.4 - m.lookY * 0.45 + breath * 0.4,
      s.z - 10,
    );
    cam.lookAt(aim);
    cam.rotateZ(m.roll + Math.sin(m.t * 0.5) * 0.004);
    const fov = baseFov + m.speed * 9;
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
    if (!ready.current) {
      ready.current = true;
      requestAnimationFrame(() => requestAnimationFrame(onReady));
    }
    if (import.meta.env.DEV) {
      const el = gl.domElement;
      el.dataset.cameraZ = s.z.toFixed(2);
      el.dataset.cameraX = s.x.toFixed(2);
      el.dataset.speed = m.speed.toFixed(2);
      el.dataset.walk = m.p.toFixed(4);
      el.dataset.drawCalls = String(gl.info.render.calls);
    }
  });
  return null;
}

function World({ progress, onReady }: Pick<Props, "progress" | "onReady">) {
  const motion = useRef<Motion>({
    p: progress.current,
    speed: 0,
    roll: 0,
    t: 0,
    lookX: 0,
    lookY: 0,
    doors: [],
  });
  const portrait = useThree((s) => s.size.width / s.size.height < 0.85);
  const baseFov = portrait ? 70 : 58;
  return (
    <>
      <MotionDriver progress={progress} motion={motion} />
      {TOUR_PATH.map((stop, i) => (
        <Room key={stop.image} stop={stop} index={i} motion={motion} baseFov={baseFov} />
      ))}
      <Dust motion={motion} />
      <CameraRig motion={motion} baseFov={baseFov} onReady={onReady} />
    </>
  );
}

export default function SpatialTour({ progress, onReady, onFailure }: Props) {
  const [live, setLive] = useState(true);
  useEffect(() => {
    let visible = !document.hidden,
      inTour = true;
    const update = () => setLive(visible && inTour);
    const visibility = () => {
      visible = !document.hidden;
      update();
    };
    const progressEvent = (e: Event) => {
      inTour = (e as CustomEvent<{ progress: number }>).detail.progress < 1;
      update();
    };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("dima:heroProgress", progressEvent);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("dima:heroProgress", progressEvent);
    };
  }, []);
  return (
    <Canvas
      camera={{ position: [0, 0, 0], fov: 58, near: 0.1, far: 260 }}
      dpr={[1, 2]}
      frameloop={live ? "always" : "demand"}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.NoToneMapping,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0, 0);
        gl.domElement.addEventListener("webglcontextlost", onFailure, { once: true });
      }}
      fallback={null}
    >
      <Suspense fallback={null}>
        <World progress={progress} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
