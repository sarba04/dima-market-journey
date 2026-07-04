import { useLayoutEffect, useRef } from "react";
import { IMG } from "@/lib/images";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { splitChars } from "@/lib/splitText";
import { useLanguage, type Lang } from "@/lib/language";
import dimaMLogo from "@/assets/dima-m-logo-transparent.png";

type SceneCam = {
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

type SceneMeta = {
  img: keyof typeof IMG;
  cam: SceneCam;
  transition: "fade" | "flash" | "wipeRight" | "wipeUp" | "zoomIn" | "irisIn" | "blur";
};

type SceneText = { top?: string; big?: string[]; small?: string };

// The hero's "big" titles are split character-by-character for the stagger
// animation, and each character becomes its own inline-block box. Inline-block
// boxes are atomic to the bidi algorithm, so a run of them inherits the
// paragraph's base direction rather than the script of the text inside —
// under a global RTL page, a plain-Latin word like "DIMA" would visually
// reverse into "AMID". Splitting each line into same-script runs and tagging
// every run with its own `dir` keeps Latin runs (like the brand name) always
// reading left-to-right, and Arabic runs right-to-left, regardless of which
// language is currently active.
const RTL_CHAR_RE = /[؀-ۿݐ-ݿ]/;

function splitIntoRuns(line: string): { text: string; dir: "ltr" | "rtl" }[] {
  const runs: { words: string[]; dir: "ltr" | "rtl" }[] = [];
  for (const word of line.split(" ")) {
    const dir: "ltr" | "rtl" = RTL_CHAR_RE.test(word) ? "rtl" : "ltr";
    const last = runs[runs.length - 1];
    if (last && last.dir === dir) last.words.push(word);
    else runs.push({ words: [word], dir });
  }
  return runs.map((r) => ({ text: r.words.join(" "), dir: r.dir }));
}

const SCENES: SceneMeta[] = [
  { img: "facadeWide", cam: { fromScale: 1.15, toScale: 3, fromY: 20, toY: -100 }, transition: "fade" },
  { img: "facadeEntrance", cam: { fromScale: 1.05, toScale: 1.35, fromY: 0, toY: 10, fromBlur: 4, toBlur: 0 }, transition: "zoomIn" },
  { img: "facadeEntrance", cam: { fromScale: 1.35, toScale: 2.8, toBrightness: 1.35, toBlur: 2 }, transition: "flash" },
  { img: "interiorCounter", cam: { fromScale: 1.25, toScale: 1.05, fromX: 30, toX: -10, fromBrightness: 1.4, toBrightness: 1 }, transition: "flash" },
  { img: "interiorAisle", cam: { fromScale: 1.15, toScale: 1.08, fromX: -20, toX: 25, fromRot: -1, toRot: 0.5 }, transition: "wipeRight" },
  { img: "aisleDrinks", cam: { fromScale: 1.4, toScale: 1.1, fromX: 40, toX: -15 }, transition: "zoomIn" },
  { img: "aisleDrinks", cam: { fromScale: 1.1, toScale: 1.15, fromX: -15, toX: -70 }, transition: "wipeRight" },
  { img: "aisleBiscuits", cam: { fromScale: 1.2, toScale: 1.0, fromX: 30, toX: -10, fromRot: 1, toRot: 0 }, transition: "wipeUp" },
  { img: "aisleSnacks", cam: { fromScale: 1.5, toScale: 1.15, fromX: 20, toX: -5, fromBlur: 3, toBlur: 0 }, transition: "blur" },
  { img: "staffEpicerie", cam: { fromScale: 1.1, toScale: 1.02, fromX: 10, toX: -10 }, transition: "fade" },
  { img: "aisleEpicerie", cam: { fromScale: 1.18, toScale: 1.28, fromY: 0, toY: -20 }, transition: "irisIn" },
  { img: "bakery", cam: { fromScale: 1.25, toScale: 1.0, fromBrightness: 0.8, toBrightness: 1.1 }, transition: "flash" },
  { img: "customers", cam: { fromScale: 1.05, toScale: 1.12, fromX: 0, toX: -15 }, transition: "wipeUp" },
  { img: "staffHygiene", cam: { fromScale: 1.08, toScale: 1.18, fromX: -10, toX: 15 }, transition: "wipeRight" },
  { img: "interiorCounter", cam: { fromScale: 1.2, toScale: 1.05, fromBlur: 8, toBlur: 0, fromBrightness: 0.4, toBrightness: 0.9 }, transition: "flash" },
];

const SCENE_TEXT: Record<Lang, SceneText[]> = {
  fr: [
    { top: "Chapitre 01 — Arrivée", big: ["DIMA M", "Market"], small: "Votre supérette moderne." },
    { top: "02 — Approche", small: "Un pas de plus vers l’expérience." },
    { top: "03 — Seuil", small: "Poussez la porte." },
    {
      top: "04 — Intérieur",
      big: ["Bienvenue", "chez DIMA M."],
      small: "Des centaines de références soigneusement sélectionnées.",
    },
    { top: "05 — Allée principale", small: "Chaque rayon, une histoire." },
    { top: "06 — Rayon boissons", big: ["Eaux.", "Boissons.", "Jus."] },
    { top: "07 — Travelling", small: "La profondeur du rayon." },
    { top: "08 — Biscuits & confiseries", small: "Sucre, croquant, souvenirs." },
    { top: "09 — Macro", small: "Les produits prennent vie." },
    { top: "10 — Notre équipe", big: ["Des visages.", "Des conseils."], small: "Une équipe qui connaît chaque référence." },
    { top: "11 — Produits importés", big: ["Le meilleur", "du Maroc.", "Le meilleur", "d’ailleurs."] },
    { top: "12 — Boulangerie", big: ["Du pain frais.", "Chaque jour."], small: "Viennoiseries dorées, sortie du four." },
    { top: "13 — Conseil & proximité", small: "On prend le temps, comme au marché." },
    { top: "14 — Hygiène & loisirs", small: "Soins du quotidien, jouets et détente." },
    {
      top: "15 — DIMA M",
      big: ["Bienvenue", "chez vous."],
      small: "Descendez pour découvrir nos services.",
    },
  ],
  ar: [
    { top: "الفصل 01 — الوصول", big: ["DIMA M", "Market"], small: "متجركم العصري." },
    { top: "02 — الاقتراب", small: "خطوة أخرى نحو التجربة." },
    { top: "03 — العتبة", small: "ادفعوا الباب." },
    {
      top: "04 — الداخل",
      big: ["مرحباً بكم", "في DIMA M."],
      small: "مئات المنتجات المُنتقاة بعناية.",
    },
    { top: "05 — الممر الرئيسي", small: "كل قسم له حكايته." },
    { top: "06 — قسم المشروبات", big: ["مياه.", "مشروبات.", "عصائر."] },
    { top: "07 — تنقل الكاميرا", small: "عمق القسم." },
    { top: "08 — حلويات وبسكويت", small: "سكر، قرمشة، ذكريات." },
    { top: "09 — تصوير مقرّب", small: "المنتجات تنبض بالحياة." },
    { top: "10 — فريقنا", big: ["وجوه.", "نصائح."], small: "فريق يعرف كل منتج." },
    { top: "11 — منتجات مستوردة", big: ["الأفضل", "من المغرب.", "الأفضل", "من الخارج."] },
    { top: "12 — المخبزة", big: ["خبز طازج.", "كل يوم."], small: "معجنات ذهبية، طازجة من الفرن." },
    { top: "13 — نصيحة وقرب", small: "نأخذ وقتنا، كما في السوق." },
    { top: "14 — نظافة وترفيه", small: "عناية يومية، ألعاب واسترخاء." },
    {
      top: "15 — DIMA M",
      big: ["مرحباً", "بكم في بيتكم."],
      small: "انزلوا لاكتشاف خدماتنا.",
    },
  ],
};

export const SCENE_COUNT = SCENES.length;
export const SCENE_NAMES: Record<Lang, string[]> = {
  fr: SCENE_TEXT.fr.map((s) => s.top ?? ""),
  ar: SCENE_TEXT.ar.map((s) => s.top ?? ""),
};

const SCENE_DURATION = 1; // relative

const HERO_TEXT = {
  fr: {
    reducedMotionAria: "DIMA M Market, superette moderne a Tabriquet, Sale",
    title: "DIMA M Market",
    reducedMotionDesc:
      "Votre superette moderne a Tabriquet, Sale, alimentation, boulangerie, produits importes et boissons, servis avec exigence.",
    heroAria: "Visite immersive DIMA M Market",
    skip: "Passer",
    scrollHint: "Scroll — pilotez la caméra",
    locationTag: "Tabriquet, Salé • MA",
  },
  ar: {
    reducedMotionAria: "DIMA M Market, superette moderne a Tabriquet, Sale",
    title: "DIMA M Market",
    reducedMotionDesc:
      "متجركم العصري في Tabriquet, Salé — مواد غذائية، مخبزة، منتجات مستوردة ومشروبات، بخدمة متميزة.",
    heroAria: "جولة تفاعلية في DIMA M Market",
    skip: "تخطي",
    scrollHint: "مرروا الشاشة — تحكموا بالكاميرا",
    locationTag: "Tabriquet, Salé • MA",
  },
} as const;

// Total scroll length in vh. Shorter on small/mobile viewports — 15 scenes of
// scroll-jacking is a lot of dead scrolling to ask from a phone visitor.
function heroScrollVh() {
  if (typeof window === "undefined") return 900;
  return window.innerWidth < 640 ? 620 : 900;
}

export function DimaHero({ onComplete }: { onComplete?: () => void }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const stepLabelRef = useRef<HTMLDivElement | null>(null);
  const skipCleanupRef = useRef<() => void>(() => {});
  const reducedMotion = useReducedMotion();
  const { lang } = useLanguage();
  const sceneText = SCENE_TEXT[lang];
  const ht = HERO_TEXT[lang];

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    // Vestibular-safe fallback: no scroll-jacking, no parallax camera moves.
    if (reducedMotion) {
      onComplete?.();
      window.dispatchEvent(new CustomEvent("dima:heroDone"));
      return;
    }

    let cleanup = () => {};

    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      const LenisMod = await import("lenis");
      const gsap = gsapMod.default ?? gsapMod;
      const ScrollTrigger = (stMod as any).ScrollTrigger ?? (stMod as any).default;
      const Lenis = (LenisMod as any).default ?? LenisMod;
      gsap.registerPlugin(ScrollTrigger);
      // Prevent the iOS/Android address-bar show/hide resize from
      // re-triggering ScrollTrigger.refresh() mid-pin, which is the classic
      // cause of the pinned hero jumping or re-snapping on mobile scroll.
      ScrollTrigger.config({ ignoreMobileResize: true });

      // Lenis smooth scroll
      const l = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.1,
      });
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
            end: () => `+=${heroScrollVh() * window.innerHeight / 100}`,
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
                  window.dispatchEvent(new CustomEvent("dima:scene", { detail: { idx, total: SCENES.length, name: SCENE_NAMES[lang][idx] } }));
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

        const onSkip = () => {
          const st = tl.scrollTrigger;
          if (st) l.scrollTo(st.end + 4, { duration: 1.1 });
        };
        window.addEventListener("dima:skipIntro", onSkip);
        skipCleanupRef.current = () => window.removeEventListener("dima:skipIntro", onSkip);

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

      cleanup = () => {
        cancelAnimationFrame(rafId.id);
        skipCleanupRef.current();
        // c.revert() already kills/reverts every ScrollTrigger created inside
        // this gsap.context — a blanket ScrollTrigger.getAll().kill() here
        // would also wipe out unrelated ScrollTriggers elsewhere on the page
        // (parallax cards, the cinematic gallery, etc).
        c.revert();
        l.destroy();
      };
    })();

    return () => cleanup();
    // Rebuilding on `lang` change is intentional: scene text (and its
    // per-character split spans) changes shape, so the GSAP timeline and its
    // stagger targets must be rebuilt against the freshly rendered DOM.
  }, [onComplete, reducedMotion, lang]);

  if (reducedMotion) {
    return (
      <section
        ref={rootRef}
        className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-6 py-24 text-center"
        aria-label={ht.reducedMotionAria}
      >
        <img src={IMG.facadeWide} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/75 to-background" />
        <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
          <img src={dimaMLogo} alt="" className="h-20 w-20" />
          <h1 className="sr-only">{ht.title}</h1>
          <p className="text-base text-white/70 md:text-lg">{ht.reducedMotionDesc}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      className="relative h-screen w-full overflow-hidden bg-background"
      aria-label={ht.heroAria}
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
          <img src={dimaMLogo} alt="DIMA M Market" className="dima-logo-pulse h-11 w-11" />
        </div>
        <div className="flex items-center gap-5">
          <div ref={stepLabelRef} className="font-mono-tight text-[11px] uppercase tracking-[0.35em] text-white/70" dir="ltr">
            01 / {String(SCENES.length).padStart(2, "0")}
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("dima:skipIntro"))}
            className="pointer-events-auto group flex items-center gap-2 font-mono-tight text-[10px] uppercase tracking-[0.3em] text-white/50 transition-colors hover:text-[color:var(--dima)]"
          >
            {ht.skip}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-6 pb-6 md:px-10 md:pb-8">
        <div className="mb-3 flex items-end justify-between">
          <div className="font-mono-tight text-[10px] uppercase tracking-[0.35em] text-white/60">
            {ht.scrollHint}
          </div>
          <div className="font-mono-tight text-[10px] uppercase tracking-[0.35em] text-white/60">
            {ht.locationTag}
          </div>
        </div>
        <div className="h-[2px] w-full origin-left bg-white/10">
          <div ref={progressRef} className="h-full w-full origin-left bg-[color:var(--dima)] scale-x-0" style={{ transformOrigin: "0 50%" }} />
        </div>
      </div>

      {/* Scene text overlays */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {sceneText.map((text, i) => (
          <div
            key={i}
            ref={(el) => {
              textRefs.current[i] = el;
            }}
            className="absolute inset-0 flex items-center justify-center px-6 opacity-0"
          >
            <div className="mx-auto max-w-6xl text-center">
              {text.top && (
                <div className="mb-6 flex items-center justify-center gap-3">
                  <span className="h-px w-10 bg-[color:var(--dima)]" />
                  <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-white/70">
                    {text.top}
                  </span>
                  <span className="h-px w-10 bg-[color:var(--dima)]" />
                </div>
              )}
              {text.big?.map((line, j) => (
                <h2
                  key={j}
                  dir={lang === "ar" ? "rtl" : "ltr"}
                  className="font-display text-huge overflow-hidden text-white"
                  style={j === 0 ? {} : { marginTop: "-0.05em" }}
                >
                  <span className="inline-block" aria-hidden>
                    {splitIntoRuns(line).map((run, ri) => (
                      <span key={ri} dir={run.dir} className="inline-block">
                        {run.text.split(" ").map((w, k) => (
                          <span key={k} className="mr-[0.25em] inline-block whitespace-nowrap overflow-hidden align-bottom">
                            {splitChars(w)}
                          </span>
                        ))}
                      </span>
                    ))}
                  </span>
                  <span className="sr-only">{line}</span>
                </h2>
              ))}
              {text.small && (
                <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
                  {text.small}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
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
