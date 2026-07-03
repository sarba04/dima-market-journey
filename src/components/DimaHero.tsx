import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IMG, ALL_IMAGES } from "@/lib/images";

type Scene = {
  img: keyof typeof IMG;
  // Camera transform for the image layer during this scene
  cam: {
    fromScale: number;
    toScale: number;
    fromX?: number;
    toX?: number;
    fromY?: number;
    toY?: number;
    fromRot?: number;
    toRot?: number;
    fromBlur?: number;
    toBlur?: number;
    fromBrightness?: number;
    toBrightness?: number;
  };
  // Transition mode into this scene
  transition:
    | "fade"
    | "flash"
    | "wipeRight"
    | "wipeUp"
    | "zoomIn"
    | "irisIn"
    | "blur";
  // Text lines shown during this scene
  text?: { top?: string; big?: string[]; small?: string; align?: "center" | "left" | "right" };
};

const SCENES: Scene[] = [
  {
    img: "facadeWide",
    cam: { fromScale: 1.15, toScale: 1.28, fromY: 20, toY: -10 },
    transition: "fade",
    text: { top: "Chapitre 01 — Arrivée", big: ["DIMA", "Market"], small: "Votre supérette moderne." },
  },
  {
    img: "facadeEntrance",
    cam: { fromScale: 1.05, toScale: 1.35, fromY: 0, toY: 10, fromBlur: 4, toBlur: 0 },
    transition: "zoomIn",
    text: { top: "02 — Approche", small: "Un pas de plus vers l’expérience." },
  },
  {
    img: "facadeEntrance",
    cam: { fromScale: 1.35, toScale: 1.8, toBrightness: 1.35, toBlur: 2 },
    transition: "flash",
    text: { top: "03 — Seuil", small: "Poussez la porte." },
  },
  {
    img: "interiorCounter",
    cam: { fromScale: 1.25, toScale: 1.05, fromX: 30, toX: -10, fromBrightness: 1.4, toBrightness: 1 },
    transition: "flash",
    text: {
      top: "04 — Intérieur",
      big: ["Bienvenue", "chez DIMA."],
      small: "Des centaines de références soigneusement sélectionnées.",
    },
  },
  {
    img: "interiorAisle",
    cam: { fromScale: 1.15, toScale: 1.08, fromX: -20, toX: 25, fromRot: -1, toRot: 0.5 },
    transition: "wipeRight",
    text: { top: "05 — Allée principale", small: "Chaque rayon, une histoire." },
  },
  {
    img: "aisleDrinks",
    cam: { fromScale: 1.4, toScale: 1.1, fromX: 40, toX: -15 },
    transition: "zoomIn",
    text: { top: "06 — Rayon boissons", big: ["Eaux.", "Boissons.", "Jus."] },
  },
  {
    img: "aisleDrinks",
    cam: { fromScale: 1.1, toScale: 1.15, fromX: -15, toX: -70 },
    transition: "wipeRight",
    text: { top: "07 — Travelling", small: "La profondeur du rayon." },
  },
  {
    img: "aisleBiscuits",
    cam: { fromScale: 1.2, toScale: 1.0, fromX: 30, toX: -10, fromRot: 1, toRot: 0 },
    transition: "wipeUp",
    text: { top: "08 — Biscuits & confiseries", small: "Sucre, croquant, souvenirs." },
  },
  {
    img: "aisleSnacks",
    cam: { fromScale: 1.5, toScale: 1.15, fromX: 20, toX: -5, fromBlur: 3, toBlur: 0 },
    transition: "blur",
    text: { top: "09 — Macro", small: "Les produits prennent vie." },
  },
  {
    img: "aisleEpicerie",
    cam: { fromScale: 1.05, toScale: 1.18, fromX: -25, toX: 30 },
    transition: "fade",
    text: { top: "10 — Épicerie", small: "Le quotidien, mieux choisi." },
  },
  {
    img: "aisleEpicerie",
    cam: { fromScale: 1.18, toScale: 1.28, fromY: 0, toY: -20 },
    transition: "irisIn",
    text: { top: "11 — Produits importés", big: ["Le meilleur", "du Maroc.", "Le meilleur", "d’ailleurs."] },
  },
  {
    img: "bakery",
    cam: { fromScale: 1.25, toScale: 1.0, fromBrightness: 0.8, toBrightness: 1.1 },
    transition: "flash",
    text: { top: "12 — Boulangerie", big: ["Du pain frais.", "Chaque jour."], small: "Viennoiseries dorées, sortie du four." },
  },
  {
    img: "customers",
    cam: { fromScale: 1.05, toScale: 1.15, fromX: 0, toX: -20 },
    transition: "wipeUp",
    text: { top: "13 — Vue d’ensemble", small: "Un lieu où l’on se retrouve." },
  },
  {
    img: "interiorCounter",
    cam: { fromScale: 1.2, toScale: 1.05, fromBlur: 8, toBlur: 0, fromBrightness: 0.4, toBrightness: 0.9 },
    transition: "flash",
    text: {
      top: "14 — DIMA",
      big: ["Bienvenue", "chez vous."],
      small: "Descendez pour découvrir nos services.",
    },
  },
];

const SCENE_DURATION = 1; // relative
const HERO_VH = 900; // total scroll length in vh — ~9000px on 1000px viewport

function useReducedMotion() {
  const [rm, setRm] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setRm(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return rm;
}

export function DimaHero({ onComplete }: { onComplete?: () => void }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const stepLabelRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(0);

  // Preload images
  useEffect(() => {
    let cancelled = false;
    let count = 0;
    ALL_IMAGES.forEach((src) => {
      const im = new Image();
      im.decoding = "async";
      im.onload = im.onerror = () => {
        if (cancelled) return;
        count++;
        setLoaded(count);
      };
      im.src = src;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    let ctx: { revert: () => void } | null = null;
    let lenis: { destroy: () => void } | null = null;
    let cleanup = () => {};

    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      const LenisMod = await import("lenis");
      const gsap = gsapMod.default ?? gsapMod;
      const ScrollTrigger = (stMod as any).ScrollTrigger ?? (stMod as any).default;
      const Lenis = (LenisMod as any).default ?? LenisMod;
      gsap.registerPlugin(ScrollTrigger);

      // Lenis smooth scroll
      const l = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.1,
      });
      lenis = l;
      l.on("scroll", ScrollTrigger.update);
      const rafId = { id: 0 };
      const raf = (t: number) => {
        l.raf(t);
        rafId.id = requestAnimationFrame(raf);
      };
      rafId.id = requestAnimationFrame(raf);

      const c = gsap.context(() => {
        const layers = layerRefs.current;
        const texts = textRefs.current;

        // Initialize: hide all layers except first
        layers.forEach((el, i) => {
          if (!el) return;
          gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, scale: SCENES[i].cam.fromScale, x: SCENES[i].cam.fromX ?? 0, y: SCENES[i].cam.fromY ?? 0, rotate: SCENES[i].cam.fromRot ?? 0, filter: `blur(${SCENES[i].cam.fromBlur ?? 0}px) brightness(${SCENES[i].cam.fromBrightness ?? 1})` });
        });
        texts.forEach((el, i) => {
          if (!el) return;
          gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, y: 20 });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: () => `+=${HERO_VH * window.innerHeight / 100}`,
            scrub: 1.1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`;
              const idx = Math.min(SCENES.length - 1, Math.floor(self.progress * SCENES.length));
              if (stepLabelRef.current) stepLabelRef.current.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(SCENES.length).padStart(2, "0")}`;
              if (typeof window !== "undefined") {
                const w = window as unknown as { __dimaScene?: number };
                if (w.__dimaScene !== idx) {
                  w.__dimaScene = idx;
                  window.dispatchEvent(new CustomEvent("dima:scene", { detail: { idx, total: SCENES.length, name: SCENE_NAMES[idx] } }));
                }
                window.dispatchEvent(new CustomEvent("dima:heroProgress", { detail: { progress: self.progress } }));
              }
            },
            onLeave: () => {
              onComplete?.();
              if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("dima:heroDone"));
            },
            onEnterBack: () => {
              if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("dima:heroEnter"));
            },
          },
        });

        SCENES.forEach((scene, i) => {
          const el = layers[i];
          const txt = texts[i];
          if (!el) return;
          const label = `s${i}`;
          tl.addLabel(label);

          // Transition-in for this scene
          if (i > 0) {
            const prev = layers[i - 1];
            if (prev) {
              switch (scene.transition) {
                case "flash":
                  tl.to(flashRef.current, { autoAlpha: 1, duration: 0.18 }, label)
                    .to(flashRef.current, { autoAlpha: 0, duration: 0.4 }, `${label}+=0.2`);
                  tl.to(prev, { autoAlpha: 0, duration: 0.3 }, label);
                  tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, label);
                  break;
                case "wipeRight":
                  gsap.set(el, { clipPath: "inset(0 100% 0 0)", autoAlpha: 1 });
                  tl.to(el, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.inOut" }, label);
                  tl.to(prev, { autoAlpha: 0, duration: 0.6 }, `${label}+=0.4`);
                  break;
                case "wipeUp":
                  gsap.set(el, { clipPath: "inset(100% 0 0 0)", autoAlpha: 1 });
                  tl.to(el, { clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "power3.inOut" }, label);
                  tl.to(prev, { autoAlpha: 0, duration: 0.6 }, `${label}+=0.4`);
                  break;
                case "zoomIn":
                  tl.to(prev, { scale: (prev as any)._gsap?.scale ? undefined : 1.6, autoAlpha: 0, duration: 0.7 }, label);
                  tl.fromTo(el, { autoAlpha: 0, scale: scene.cam.fromScale * 0.9 }, { autoAlpha: 1, duration: 0.7 }, label);
                  break;
                case "irisIn":
                  gsap.set(el, { clipPath: "circle(0% at 50% 50%)", autoAlpha: 1 });
                  tl.to(el, { clipPath: "circle(85% at 50% 50%)", duration: 1, ease: "power2.inOut" }, label);
                  tl.to(prev, { autoAlpha: 0, duration: 0.6 }, `${label}+=0.4`);
                  break;
                case "blur":
                  tl.to(prev, { filter: "blur(20px) brightness(0.4)", autoAlpha: 0, duration: 0.6 }, label);
                  tl.fromTo(el, { autoAlpha: 0, filter: "blur(20px)" }, { autoAlpha: 1, filter: `blur(${scene.cam.fromBlur ?? 0}px) brightness(${scene.cam.fromBrightness ?? 1})`, duration: 0.7 }, label);
                  break;
                case "fade":
                default:
                  tl.to(prev, { autoAlpha: 0, duration: 0.7 }, label);
                  tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, label);
              }
            }
          }

          // Camera move during scene
          tl.to(
            el,
            {
              scale: scene.cam.toScale,
              x: scene.cam.toX ?? 0,
              y: scene.cam.toY ?? 0,
              rotate: scene.cam.toRot ?? 0,
              filter: `blur(${scene.cam.toBlur ?? 0}px) brightness(${scene.cam.toBrightness ?? 1})`,
              duration: SCENE_DURATION,
              ease: "none",
            },
            label
          );

          // Text in/out
          if (txt) {
            const chars = txt.querySelectorAll<HTMLElement>(".split-char");
            tl.fromTo(txt, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, `${label}+=0.05`);
            if (chars.length) {
              tl.fromTo(
                chars,
                { yPercent: 110, opacity: 0, filter: "blur(8px)" },
                { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.5, stagger: 0.012, ease: "power3.out" },
                `${label}+=0.08`
              );
            }
            tl.to(txt, { autoAlpha: 0, y: -30, duration: 0.35, ease: "power2.in" }, `${label}+=${SCENE_DURATION - 0.15}`);
          }
        });
      }, rootRef);
      ctx = c;

      cleanup = () => {
        cancelAnimationFrame(rafId.id);
        c.revert();
        l.destroy();
        ScrollTrigger.getAll().forEach((s: any) => s.kill());
      };
    })();

    return () => cleanup();
  }, [onComplete, reducedMotion]);

  const splitText = (t: string) =>
    t.split("").map((ch, i) => (
      <span key={i} className="split-char">
        {ch === " " ? "\u00A0" : ch}
      </span>
    ));

  return (
    <section
      ref={rootRef}
      className="relative h-screen w-full overflow-hidden bg-background"
      aria-label="Visite immersive DIMA Market"
    >
      {/* Stage */}
      <div ref={stageRef} className="absolute inset-0">
        {SCENES.map((scene, i) => (
          <div
            key={i}
            ref={(el) => {
              layerRefs.current[i] = el;
            }}
            className="absolute inset-0"
            style={{ willChange: "transform, opacity, filter, clip-path" }}
          >
            <img
              src={IMG[scene.img]}
              alt=""
              className="scene-img"
              draggable={false}
              loading={i < 3 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        ))}

        {/* Cinematic overlays */}
        <div className="pointer-events-none absolute inset-0 z-[3]" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.75) 100%)" }} />
        <div className="pointer-events-none absolute inset-0 z-[4] vignette" />
        <div className="pointer-events-none absolute inset-0 z-[6] grain" />

        {/* Flash */}
        <div ref={flashRef} className="pointer-events-none absolute inset-0 z-[8] bg-white opacity-0" />
      </div>

      {/* Top HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-10">
        <div className="flex items-center gap-3">
          <LogoMark className="dima-logo-pulse h-9 w-9 text-[color:var(--dima)]" />
          <div className="font-mono-tight text-[11px] uppercase tracking-[0.25em] text-white/80">
            DIMA • Market
          </div>
        </div>
        <div ref={stepLabelRef} className="font-mono-tight text-[11px] uppercase tracking-[0.35em] text-white/70">
          01 / {String(SCENES.length).padStart(2, "0")}
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-6 pb-6 md:px-10 md:pb-8">
        <div className="mb-3 flex items-end justify-between">
          <div className="font-mono-tight text-[10px] uppercase tracking-[0.35em] text-white/60">
            Scroll — pilotez la caméra
          </div>
          <div className="font-mono-tight text-[10px] uppercase tracking-[0.35em] text-white/60">
            Casablanca • MA
          </div>
        </div>
        <div className="h-[2px] w-full origin-left bg-white/10">
          <div ref={progressRef} className="h-full w-full origin-left bg-[color:var(--dima)] scale-x-0" style={{ transformOrigin: "0 50%" }} />
        </div>
      </div>

      {/* Scene text overlays */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {SCENES.map((scene, i) => (
          <div
            key={i}
            ref={(el) => {
              textRefs.current[i] = el;
            }}
            className="absolute inset-0 flex items-center justify-center px-6 opacity-0"
          >
            <div className={`max-w-6xl ${scene.text?.align === "left" ? "text-left mr-auto" : scene.text?.align === "right" ? "text-right ml-auto" : "text-center mx-auto"}`}>
              {scene.text?.top && (
                <div className="mb-6 flex items-center justify-center gap-3">
                  <span className="h-px w-10 bg-[color:var(--dima)]" />
                  <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-white/70">
                    {scene.text.top}
                  </span>
                  <span className="h-px w-10 bg-[color:var(--dima)]" />
                </div>
              )}
              {scene.text?.big?.map((line, j) => (
                <h2
                  key={j}
                  className="font-display text-huge overflow-hidden text-white"
                  style={j === 0 ? {} : { marginTop: "-0.05em" }}
                >
                  <span className="inline-block" aria-hidden>
                    {line.split(" ").map((w, k) => (
                      <span key={k} className="mr-[0.25em] inline-block whitespace-nowrap overflow-hidden align-bottom">
                        {splitText(w)}
                      </span>
                    ))}
                  </span>
                  <span className="sr-only">{line}</span>
                </h2>
              ))}
              {scene.text?.small && (
                <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
                  {scene.text.small}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Loading gate */}
      {loaded < ALL_IMAGES.length && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background">
          <div className="text-center">
            <LogoMark className="mx-auto h-12 w-12 text-[color:var(--dima)] dima-logo-pulse" />
            <div className="mt-6 font-mono-tight text-[11px] uppercase tracking-[0.4em] text-white/60">
              Préparation de la visite
            </div>
            <div className="mx-auto mt-4 h-[2px] w-40 overflow-hidden bg-white/10">
              <div
                className="h-full bg-[color:var(--dima)] transition-[width] duration-300"
                style={{ width: `${(loaded / ALL_IMAGES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M8 12 h6 l4 22 h16 l4 -14 H16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="40" r="2.6" fill="currentColor" />
      <circle cx="34" cy="40" r="2.6" fill="currentColor" />
      <path
        d="M22 8 c 4 4, 4 8, 0 12 c -2 -4, -2 -8, 0 -12 z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}
