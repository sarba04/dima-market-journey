import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUpRight, ChevronRight } from "lucide-react";
import { IMG } from "@/lib/images";
import { useLanguage, type Lang } from "@/lib/language";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { LanguageToggle } from "@/components/ExperienceLayer";
import { Button } from "@/components/ui/button";
import logo from "@/assets/dima-m-logo-transparent.png";
import { chapterProgress, tourSample } from "@/lib/tour-path";

const SpatialTour = lazy(() => import("@/components/tour/SpatialTour"));
class TourBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

const SCENES = [
  { img: "facadeWide", focus: "50% 60%", fr: ["Bienvenue à Salé", "DIMA M", "MARKET.", "Le quotidien. Avec un peu plus d’attention."], ar: ["مرحباً بكم في سلا", "DIMA M", "MARKET.", "يومكم يستحق اهتماماً أكثر."] },
  { img: "facadeEntrance", focus: "55% 55%", fr: ["La porte est ouverte", "ENTREZ.", "VOUS ÊTES CHEZ VOUS.", "Une adresse de quartier, une autre idée du commerce."], ar: ["الباب مفتوح", "تفضلوا.", "أنتم في بيتكم.", "متجر الحي، بروح مختلفة."] },
  { img: "interiorAisle", focus: "50% 55%", fr: ["À l’intérieur", "LE CHOIX.", "SANS LE DÉTOUR.", "Des rayons soignés, des essentiels à portée de main."], ar: ["داخل المتجر", "اختياراتكم.", "في مكان واحد.", "أقسام مرتبة، وأساسيات في متناولكم."] },
  { img: "aisleDrinks", focus: "55% 50%", fr: ["Les boissons", "UNE PAUSE.", "BIEN FRAÎCHE.", "Eaux, jus et boissons pour chaque envie."], ar: ["المشروبات", "استراحة.", "منعشة.", "مياه وعصائر ومشروبات لكل الأذواق."] },
  { img: "aisleBiscuits", focus: "50% 50%", fr: ["Les petits plaisirs", "LE GOÛT", "DE LA DÉCOUVERTE.", "Biscuits, confiseries et trouvailles d’ici et d’ailleurs."], ar: ["متعة صغيرة", "مذاق", "الاكتشاف.", "بسكويت وحلويات ومنتجات محلية ومستوردة."] },
  { img: "bakery", focus: "50% 38%", fr: ["La boulangerie", "LE PAIN.", "LES PETITS BONHEURS.", "Du pain frais, des viennoiseries et le plaisir de choisir."], ar: ["المخبزة", "الخبز.", "لحظات السعادة.", "خبز طازج ومعجنات ومتعة الاختيار."] },
  { img: "staffEpicerie", focus: "50% 35%", fr: ["Notre équipe", "DES VISAGES.", "PAS DES NUMÉROS.", "Un bonjour, un conseil. On prend le temps."], ar: ["فريقنا", "وجوه.", "لا مجرد أرقام.", "تحية ونصيحة. نمنحكم وقتنا."] },
  { img: "customers", focus: "50% 40%", fr: ["Le lien humain", "LE COMMERCE.", "ET LA RENCONTRE.", "Une boutique familiale qui vit avec son quartier."], ar: ["العلاقة الإنسانية", "تجارة.", "ولقاء.", "متجر عائلي يعيش مع حيّه."] },
  { img: "staffHygiene", focus: "50% 35%", fr: ["À bientôt chez DIMA M", "TOUJOURS", "À VOS CÔTÉS.", "Tout pour votre quotidien. Découvrez la suite."], ar: ["نراكم قريباً في DIMA M", "دائماً", "بجانبكم.", "كل ما تحتاجونه ليومكم. اكتشفوا المزيد."] },
] as const;
export const SCENE_COUNT = SCENES.length;
export const SCENE_NAMES: Record<Lang, string[]> = { fr: SCENES.map(s => s.fr[0]), ar: SCENES.map(s => s.ar[0]) };

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
  const travel = useRef(0);
  const markReady = useCallback(() => setReady(true), []);
  const markFailed = useCallback(() => setFailed(true), []);
  const ar = lang === "ar";

  useEffect(() => { setMounted(true); }, []);

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
        const captions = gsap.utils.toArray<HTMLElement>(".tour-caption");
        const progress = stage.current?.querySelector(".tour-progress-fill");
        let last = -1;
        const sync = () => {
          const idx = tourSample(travel.current).index;
          if (idx !== last) {
            last = idx;
            setActive(idx);
            window.dispatchEvent(new CustomEvent("dima:scene", { detail: { idx, total: SCENE_COUNT, name: SCENE_NAMES[lang][idx] } }));
          }
          if (progress) gsap.set(progress, { scaleX: travel.current });
          window.dispatchEvent(new CustomEvent("dima:heroProgress", { detail: { progress: travel.current } }));
        };
        const tl = gsap.timeline({
          onUpdate: sync,
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            onLeave: () => window.dispatchEvent(new CustomEvent("dima:heroDone")),
            onEnterBack: () => window.dispatchEvent(new CustomEvent("dima:heroEnter")),
          },
        });
        timeline.current = tl;
        tl.fromTo(travel, { current: 0 }, { current: 1, duration: SCENE_COUNT - 1, ease: "none" }, 0);
        captions.forEach((caption, i) => {
          if (i > 0) {
            gsap.set(caption, { autoAlpha: 0 });
            tl.to(captions[i - 1], { autoAlpha: 0, duration: 0.15 }, i - .8)
              .to(caption, { autoAlpha: 1, duration: 0.15 }, i - .65);
            tl.fromTo(caption.querySelectorAll(".tour-title span"), { yPercent: 105, rotateX: -35, opacity: 0 }, { yPercent: 0, rotateX: 0, opacity: 1, stagger: .025, duration: .18, ease: "power3.out" }, i - .65);
          }
        });
      }, stage);
      cleanup = () => { ctx.revert(); timeline.current = null; };
    })();
    return () => { disposed = true; cleanup(); };
  }, [lang, reduced]);

  const goTo = (idx: number) => {
    const trigger = timeline.current?.scrollTrigger;
    if (!trigger) return;
    window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * chapterProgress(idx), behavior: "smooth" });
  };
  const skip = () => {
    const next = document.getElementById("manifeste");
    next?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
    window.dispatchEvent(new CustomEvent("dima:heroDone"));
  };

  return (
    <section ref={root} className={`tour spatial-visit ${reduced ? "tour-static" : ""}`} aria-label={ar ? "جولة في DIMA M Market" : "Visite de DIMA M Market"}>
      <div ref={stage} className="tour-stage" data-scene-ready={ready && !failed && !reduced ? "true" : undefined}>
        <div className="tour-visual" aria-hidden="true">
          <div className={`spatial-fallback ${ready && !failed && !reduced ? "spatial-fallback-hidden" : ""}`}><img src={IMG[SCENES[reduced ? 0 : active].img]} alt="" className="tour-img" fetchPriority="high" /></div>
          {mounted && !reduced && !failed && <div className={`spatial-canvas ${ready ? "spatial-canvas-ready" : ""}`}><TourBoundary onFailure={markFailed}><Suspense fallback={null}><SpatialTour progress={travel} onReady={markReady} onFailure={markFailed} /></Suspense></TourBoundary></div>}
          <div className="tour-shade" />
        </div>
        <div className="tour-top">
          <a href="#top" aria-label="DIMA M Market" className="tour-brand"><img src={logo} alt="" /><span dir="ltr">DIMA M<span>MARKET</span></span></a>
          <div className="flex items-center gap-2"><LanguageToggle /><Button onClick={skip} className="skip-tour">{ar ? "تخطي الجولة" : "Passer la visite"}<ArrowUpRight /></Button></div>
        </div>
        <div className="tour-copy">
          {SCENES.map((s, i) => { const t = s[lang]; return <div key={s.img} className={`tour-caption ${i === 0 ? "tour-caption-first" : ""}`}>
            <div className="tour-eyebrow"><span className="chapter-number" dir="ltr">{String(i + 1).padStart(2, "0")}</span>{t[0]}<span className="tour-eyebrow-rule" /></div>
            {i === 0 ? <h1 className="tour-title" dir="ltr"><span>{t[1]}</span><span>{t[2]}</span></h1> : <h2 className="tour-title"><span>{t[1]}</span><span className="tour-title-secondary">{t[2]}</span></h2>}
            <p>{t[3]}</p>
          </div>; })}
        </div>
        <div className="tour-side-label" dir="ltr">TABRIQUET · SALÉ · MAROC</div>
        <div className="tour-bottom">
          <div className="tour-bottom-heading"><div className="flex items-center gap-3"><ArrowDown className="tour-scroll-arrow" size={18} /><span>{ar ? "جولة داخل المتجر" : "Entrez. Avancez. Découvrez."}</span></div><span className="tour-location" dir="ltr">09:00 — 22:00 · 7/7</span></div>
          <div className="tour-chapters" dir="ltr">{SCENES.map((s, i) => <Button key={s.img} variant="ghost" className={`tour-chapter ${i === active ? "is-active" : ""}`} onClick={() => goTo(i)} aria-label={SCENE_NAMES[lang][i]} aria-current={i === active ? "step" : undefined}><img src={IMG[s.img]} alt="" /><span>{String(i + 1).padStart(2,"0")}</span></Button>)}</div>
          <div className="tour-progress"><div className="tour-progress-fill" /></div>
          <div className="tour-bottom-note"><span>{SCENE_NAMES[lang][active]}</span><Button variant="link" onClick={skip}>{ar ? "اكتشفوا أقسامنا" : "Découvrir le magasin"}<ChevronRight size={14} /></Button></div>
        </div>
      </div>
    </section>
  );
}
