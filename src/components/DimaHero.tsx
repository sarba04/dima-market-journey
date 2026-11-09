import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, ChevronRight } from "lucide-react";
import { IMG } from "@/lib/images";
import { useLanguage, type Lang } from "@/lib/language";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { LanguageToggle } from "@/components/ExperienceLayer";
import { Button } from "@/components/ui/button";
import logo from "@/assets/dima-m-logo-transparent.png";

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
  const ar = lang === "ar";

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
        const photos = gsap.utils.toArray<HTMLElement>(".tour-photo");
        const captions = gsap.utils.toArray<HTMLElement>(".tour-caption");
        const progress = stage.current?.querySelector(".tour-progress-fill");
        let last = -1;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.55,
            onUpdate: self => {
              const idx = Math.min(SCENE_COUNT - 1, Math.floor(self.progress * SCENE_COUNT));
              if (idx !== last) {
                last = idx;
                setActive(idx);
                window.dispatchEvent(new CustomEvent("dima:scene", { detail: { idx, total: SCENE_COUNT, name: SCENE_NAMES[lang][idx] } }));
              }
              if (progress) gsap.set(progress, { scaleX: self.progress });
              window.dispatchEvent(new CustomEvent("dima:heroProgress", { detail: { progress: self.progress } }));
            },
            onLeave: () => window.dispatchEvent(new CustomEvent("dima:heroDone")),
            onEnterBack: () => window.dispatchEvent(new CustomEvent("dima:heroEnter")),
          },
        });
        timeline.current = tl;
        photos.forEach((photo, i) => {
          const caption = captions[i];
          const image = photo.querySelector("img");
          if (i > 0) {
            gsap.set(photo, { clipPath: "inset(0 0 100% 0)" });
            gsap.set(caption, { autoAlpha: 0, y: 24 });
            tl.to(photo, { clipPath: "inset(0 0 0% 0)", duration: 0.38, ease: "power2.inOut" }, i)
              .to(captions[i - 1], { autoAlpha: 0, y: -18, duration: 0.16 }, i)
              .to(caption, { autoAlpha: 1, y: 0, duration: 0.24 }, i + 0.18);
          }
          tl.fromTo(image, { scale: 1.055 }, { scale: 1, duration: 1.15, ease: "none" }, i);
        });
        tl.to({}, { duration: 0.3 }, SCENE_COUNT - 0.3);
      }, stage);
      cleanup = () => { ctx.revert(); timeline.current = null; };
    })();
    return () => { disposed = true; cleanup(); };
  }, [lang, reduced]);

  const goTo = (idx: number) => {
    const trigger = timeline.current?.scrollTrigger;
    if (!trigger) return;
    window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * (idx + 0.45) / SCENE_COUNT, behavior: "smooth" });
  };
  const skip = () => {
    const next = document.getElementById("manifeste");
    next?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
    window.dispatchEvent(new CustomEvent("dima:heroDone"));
  };

  return (
    <section ref={root} className={`tour ${reduced ? "tour-static" : ""}`} aria-label={ar ? "جولة في DIMA M Market" : "Visite de DIMA M Market"}>
      <div ref={stage} className="tour-stage">
        <div className="tour-visual" aria-hidden="true">
          {SCENES.map((s, i) => <div className="tour-photo" key={s.img} style={{ zIndex: i }}>
            <img src={IMG[s.img]} alt="" draggable={false} fetchPriority={i === 0 ? "high" : "auto"} loading={i < 2 ? "eager" : "lazy"} className={`tour-img tour-img-${i}`} />
          </div>)}
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
          <div className="tour-bottom-heading"><div className="flex items-center gap-3"><ArrowDown className="tour-scroll-arrow" size={18} /><span>{ar ? "اكتشفوا المتجر" : "Une visite, à votre rythme"}</span></div><span className="tour-location" dir="ltr">09:00 — 22:00 · 7/7</span></div>
          <div className="tour-chapters" dir="ltr">{SCENES.map((s, i) => <Button key={s.img} variant="ghost" className={`tour-chapter ${i === active ? "is-active" : ""}`} onClick={() => goTo(i)} aria-label={SCENE_NAMES[lang][i]} aria-current={i === active ? "step" : undefined}><img src={IMG[s.img]} alt="" /><span>{String(i + 1).padStart(2,"0")}</span></Button>)}</div>
          <div className="tour-progress"><div className="tour-progress-fill" /></div>
          <div className="tour-bottom-note"><span>{SCENE_NAMES[lang][active]}</span><Button variant="link" onClick={skip}>{ar ? "اكتشفوا أقسامنا" : "Découvrir le magasin"}<ChevronRight size={14} /></Button></div>
        </div>
      </div>
    </section>
  );
}
