import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { IMG } from "@/lib/images";
import { BUSINESS } from "@/lib/business";
import { useLanguage, type Lang } from "@/lib/language";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { LanguageToggle } from "@/components/ExperienceLayer";
import { Button } from "@/components/ui/button";
import logo from "@/assets/dima-m-logo-transparent.png";
import { chapterProgress, TOUR_PATH, tourSample } from "@/lib/tour-path";

const SpatialTour = lazy(() => import("@/components/tour/SpatialTour"));
class TourBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const SCENES = [
  {
    img: "facadeWide",
    focus: "50% 60%",
    fr: ["Bienvenue à Salé", "DIMA M", "MARKET.", "Le quotidien. Avec un peu plus d’attention."],
    ar: ["مرحباً بكم في سلا", "DIMA M", "MARKET.", "يومكم يستحق اهتماماً أكثر."],
  },
  {
    img: "facadeEntrance",
    focus: "55% 55%",
    fr: [
      "La porte est ouverte",
      "ENTREZ.",
      "VOUS ÊTES CHEZ VOUS.",
      "Une adresse de quartier, une autre idée du commerce.",
    ],
    ar: ["الباب مفتوح", "تفضلوا.", "أنتم في بيتكم.", "متجر الحي، بروح مختلفة."],
  },
  {
    img: "interiorAisle",
    focus: "50% 55%",
    fr: [
      "À l’intérieur",
      "LE CHOIX.",
      "SANS LE DÉTOUR.",
      "Des rayons soignés, des essentiels à portée de main.",
    ],
    ar: ["داخل المتجر", "اختياراتكم.", "في مكان واحد.", "أقسام مرتبة، وأساسيات في متناولكم."],
  },
  {
    img: "aisleDrinks",
    focus: "55% 50%",
    fr: ["Les boissons", "UNE PAUSE.", "BIEN FRAÎCHE.", "Eaux, jus et boissons pour chaque envie."],
    ar: ["المشروبات", "استراحة.", "منعشة.", "مياه وعصائر ومشروبات لكل الأذواق."],
  },
  {
    img: "aisleBiscuits",
    focus: "50% 50%",
    fr: [
      "Les petits plaisirs",
      "LE GOÛT",
      "DE LA DÉCOUVERTE.",
      "Biscuits, confiseries et trouvailles d’ici et d’ailleurs.",
    ],
    ar: ["متعة صغيرة", "مذاق", "الاكتشاف.", "بسكويت وحلويات ومنتجات محلية ومستوردة."],
  },
  {
    img: "bakery",
    focus: "50% 38%",
    fr: [
      "La boulangerie",
      "LE PAIN.",
      "LES PETITS BONHEURS.",
      "Du pain frais, des viennoiseries et le plaisir de choisir.",
    ],
    ar: ["المخبزة", "الخبز.", "لحظات السعادة.", "خبز طازج ومعجنات ومتعة الاختيار."],
  },
  {
    img: "staffEpicerie",
    focus: "50% 35%",
    fr: [
      "Notre équipe",
      "DES VISAGES.",
      "PAS DES NUMÉROS.",
      "Un bonjour, un conseil. On prend le temps.",
    ],
    ar: ["فريقنا", "وجوه.", "لا مجرد أرقام.", "تحية ونصيحة. نمنحكم وقتنا."],
  },
  {
    img: "customers",
    focus: "50% 40%",
    fr: [
      "Le lien humain",
      "LE COMMERCE.",
      "ET LA RENCONTRE.",
      "Une boutique familiale qui vit avec son quartier.",
    ],
    ar: ["العلاقة الإنسانية", "تجارة.", "ولقاء.", "متجر عائلي يعيش مع حيّه."],
  },
  {
    img: "staffHygiene",
    focus: "50% 35%",
    fr: [
      "À bientôt chez DIMA M",
      "TOUJOURS",
      "À VOS CÔTÉS.",
      "Tout pour votre quotidien. Découvrez la suite.",
    ],
    ar: ["نراكم قريباً في DIMA M", "دائماً", "بجانبكم.", "كل ما تحتاجونه ليومكم. اكتشفوا المزيد."],
  },
] as const;
export const SCENE_COUNT = SCENES.length;
export const SCENE_NAMES: Record<Lang, string[]> = {
  fr: SCENES.map((s) => s.fr[0]),
  ar: SCENES.map((s) => s.ar[0]),
};

const pad = (n: number, size = 2) => String(n).padStart(size, "0");
// Floor plan of the walk, drawn from the camera path (x → width, z → depth).
const PLAN = TOUR_PATH.map((stop) => ({
  x: 24 + stop.x * 4,
  y: 8 + (-stop.z / Math.abs(TOUR_PATH[TOUR_PATH.length - 1].z)) * 224,
}));
const PLAN_D = PLAN.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");
const COORDS = `${BUSINESS.mapLat.toFixed(4)}° N · ${Math.abs(BUSINESS.mapLng).toFixed(4)}° W`;

export function DimaHero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const timeline = useRef<{ scrollTrigger?: { start: number; end: number } } | null>(null);
  const { lang } = useLanguage();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const travel = useRef(0);
  const markReady = useCallback(() => setReady(true), []);
  const markFailed = useCallback(() => setFailed(true), []);
  const ar = lang === "ar";
  const spatial = mounted && !reduced && !failed;

  useEffect(() => {
    setMounted(true);
  }, []);
  // The shutter rises once the scene is ready — or after a short wait, never blocking the page.
  useEffect(() => {
    if (ready || failed || reduced) {
      const t = setTimeout(() => setDoorsOpen(true), reduced ? 0 : 250);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDoorsOpen(true), 2600);
    return () => clearTimeout(t);
  }, [ready, failed, reduced]);

  useEffect(() => {
    if (reduced) {
      window.dispatchEvent(new CustomEvent("dima:heroDone"));
      return;
    }
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (disposed || !root.current || !stage.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
      const ctx = gsap.context(() => {
        const el = stage.current!;
        const captions = gsap.utils.toArray<HTMLElement>(".tour-caption");
        const fills = el.querySelectorAll<HTMLElement>(".tour-progress-fill");
        const railFill = el.querySelector<SVGPathElement>(".tour-plan-walked");
        const dot = el.querySelector<SVGCircleElement>(".tour-plan-you");
        const percent = el.querySelector<HTMLElement>(".tour-readout-percent");
        let last = -1;
        const sync = () => {
          const p = travel.current;
          const idx = tourSample(p).index;
          if (idx !== last) {
            last = idx;
            setActive(idx);
            window.dispatchEvent(
              new CustomEvent("dima:scene", {
                detail: { idx, total: SCENE_COUNT, name: SCENE_NAMES[lang][idx] },
              }),
            );
          }
          fills.forEach((f) => gsap.set(f, { scaleX: p }));
          if (railFill) railFill.style.strokeDashoffset = String(1 - p);
          if (dot) {
            const scaled = p * (PLAN.length - 1),
              i = Math.min(PLAN.length - 2, Math.floor(scaled)),
              t = scaled - i;
            dot.setAttribute("cx", String(PLAN[i].x + (PLAN[i + 1].x - PLAN[i].x) * t));
            dot.setAttribute("cy", String(PLAN[i].y + (PLAN[i + 1].y - PLAN[i].y) * t));
          }
          if (percent) percent.textContent = pad(Math.round(p * 100), 3);
          el.toggleAttribute("data-moved", p > 0.015);
          window.dispatchEvent(new CustomEvent("dima:heroProgress", { detail: { progress: p } }));
        };
        const tl = gsap.timeline({
          onUpdate: sync,
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            onLeave: () => window.dispatchEvent(new CustomEvent("dima:heroDone")),
            onEnterBack: () => window.dispatchEvent(new CustomEvent("dima:heroEnter")),
          },
        });
        timeline.current = tl;
        tl.fromTo(
          travel,
          { current: 0 },
          { current: 1, duration: SCENE_COUNT - 1, ease: "none" },
          0,
        );
        captions.forEach((caption, i) => {
          if (i === 0) return;
          gsap.set(caption, { autoAlpha: 0 });
          const prev = captions[i - 1];
          tl.to(
            prev.querySelectorAll(".tour-line > span"),
            { yPercent: -110, duration: 0.14, stagger: 0.03, ease: "power2.in" },
            i - 0.86,
          )
            .to(prev, { autoAlpha: 0, duration: 0.12 }, i - 0.76)
            .to(caption, { autoAlpha: 1, duration: 0.1 }, i - 0.6)
            .fromTo(
              caption.querySelectorAll(".tour-line > span"),
              { yPercent: 115, rotate: ar ? -4 : 4 },
              { yPercent: 0, rotate: 0, stagger: 0.05, duration: 0.22, ease: "power3.out" },
              i - 0.6,
            )
            .fromTo(
              caption.querySelectorAll(".tour-sign, .tour-caption p"),
              { y: 18, opacity: 0 },
              { y: 0, opacity: 1, stagger: 0.05, duration: 0.18, ease: "power2.out" },
              i - 0.55,
            );
        });
      }, stage);
      cleanup = () => {
        ctx.revert();
        timeline.current = null;
      };
    })();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [lang, reduced, ar]);

  const goTo = (idx: number) => {
    const trigger = timeline.current?.scrollTrigger;
    if (!trigger) return;
    window.scrollTo({
      top: trigger.start + (trigger.end - trigger.start) * chapterProgress(idx),
      behavior: "smooth",
    });
  };
  const skip = () => {
    const next = document.getElementById("manifeste");
    next?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
    window.dispatchEvent(new CustomEvent("dima:heroDone"));
  };
  const live = ready && !failed && !reduced;

  return (
    <section
      ref={root}
      className={`tour spatial-visit ${reduced ? "tour-static" : ""}`}
      aria-label={ar ? "جولة في DIMA M Market" : "Visite de DIMA M Market"}
    >
      <div ref={stage} className="tour-stage" data-scene-ready={live ? "true" : undefined}>
        <div className="tour-visual" aria-hidden="true">
          <div className={`spatial-fallback ${live ? "spatial-fallback-hidden" : ""}`}>
            <img
              src={IMG[SCENES[reduced ? 0 : active].img]}
              alt=""
              className="tour-img"
              style={{ objectPosition: SCENES[reduced ? 0 : active].focus }}
              fetchPriority="high"
            />
          </div>
          {spatial && (
            <div className={`spatial-canvas ${ready ? "spatial-canvas-ready" : ""}`}>
              <TourBoundary onFailure={markFailed}>
                <Suspense fallback={null}>
                  <SpatialTour progress={travel} onReady={markReady} onFailure={markFailed} />
                </Suspense>
              </TourBoundary>
            </div>
          )}
          <div className="tour-shade" />
          <div className="tour-grain" />
        </div>

        {!reduced && (
          <div className={`tour-shutter ${doorsOpen ? "is-open" : ""}`} aria-hidden="true">
            <div className="tour-shutter-label">
              <img src={logo} alt="" />
              <span dir="ltr">DIMA M MARKET</span>
              <small>{ar ? "نفتح الأبواب…" : "Ouverture des portes…"}</small>
            </div>
            <div className="tour-shutter-handle" />
          </div>
        )}

        <div className="tour-hud" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <div className="tour-reticle" />
        </div>

        <div className="tour-top">
          <a href="#top" aria-label="DIMA M Market" className="tour-brand">
            <img src={logo} alt="" />
            <span dir="ltr">
              DIMA M<span>MARKET · SALÉ</span>
            </span>
          </a>
          <div className="tour-status" dir="ltr" aria-hidden="true">
            <span className="tour-live-dot" />
            {ar ? "جولة ثلاثية الأبعاد" : "VISITE 3D"}
            <span className="tour-status-sep">/</span>
            <span>{COORDS}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Button onClick={skip} className="skip-tour">
              {ar ? "تخطي الجولة" : "Passer la visite"}
              <ArrowUpRight />
            </Button>
          </div>
        </div>

        <div className="tour-copy">
          {SCENES.map((s, i) => {
            const t = s[lang];
            const first = i === 0;
            return (
              <div key={s.img} className={`tour-caption ${first ? "tour-caption-first" : ""}`}>
                <div className="tour-sign">
                  <span className="tour-sign-n" dir="ltr">
                    {pad(i + 1)}
                  </span>
                  <span className="tour-sign-fr" lang="fr" dir="ltr">
                    {s.fr[0]}
                  </span>
                  <span className="tour-sign-ar" lang="ar" dir="rtl">
                    {s.ar[0]}
                  </span>
                </div>
                {first ? (
                  <h1 className="tour-title tour-title-brand" dir="ltr">
                    <span className="tour-line">
                      <span>{t[1]}</span>
                    </span>
                    <span className="tour-line tour-line-outline">
                      <span>{t[2]}</span>
                    </span>
                  </h1>
                ) : (
                  <h2 className="tour-title">
                    <span className="tour-line">
                      <span>{t[1]}</span>
                    </span>
                    <span className="tour-line tour-line-soft">
                      <span>{t[2]}</span>
                    </span>
                  </h2>
                )}
                <p>{t[3]}</p>
              </div>
            );
          })}
        </div>

        <nav className="tour-rail" aria-label={ar ? "محطات الجولة" : "Étapes de la visite"}>
          <svg className="tour-plan" viewBox="0 0 48 240" aria-hidden="true">
            <path d={PLAN_D} className="tour-plan-route" />
            <path d={PLAN_D} className="tour-plan-walked" pathLength={1} />
            {PLAN.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={i === active ? 3.2 : 2}
                className={i <= active ? "is-past" : ""}
              />
            ))}
            <circle className="tour-plan-you" cx={PLAN[0].x} cy={PLAN[0].y} r={5.5} />
          </svg>
          <ol>
            {SCENES.map((s, i) => (
              <li key={s.img}>
                <Button
                  variant="ghost"
                  className={`tour-stop ${i === active ? "is-active" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`${pad(i + 1)} — ${SCENE_NAMES[lang][i]}`}
                  aria-current={i === active ? "step" : undefined}
                >
                  <span className="tour-stop-name">{SCENE_NAMES[lang][i]}</span>
                  <span className="tour-stop-n" dir="ltr">
                    {pad(i + 1)}
                  </span>
                </Button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="tour-bottom">
          <div className="tour-hint">
            <span className="tour-mouse" aria-hidden="true">
              <ArrowDown size={14} />
            </span>
            <span>
              {ar ? "مرّروا للتقدم داخل المتجر" : "Faites défiler pour avancer dans le magasin"}
            </span>
          </div>
          <div className="tour-ticks" dir="ltr">
            {SCENES.map((s, i) => (
              <Button
                key={s.img}
                variant="ghost"
                className={`tour-tick ${i <= active ? "is-past" : ""} ${i === active ? "is-active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`${pad(i + 1)} — ${SCENE_NAMES[lang][i]}`}
                aria-current={i === active ? "step" : undefined}
              >
                <span />
              </Button>
            ))}
          </div>
          <div className="tour-readout" dir="ltr">
            <span>
              <b>{pad(active + 1)}</b>/{pad(SCENE_COUNT)}
            </span>
            <span className="tour-readout-bar">
              <span className="tour-progress-fill" />
            </span>
            <span>
              <b className="tour-readout-percent">000</b>%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
