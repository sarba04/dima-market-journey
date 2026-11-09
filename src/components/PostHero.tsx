import { useEffect, useRef } from "react";
import { ArrowUpRight, Phone, MessageCircle, MapPin, Plus, Nfc, Banknote, ShieldCheck } from "lucide-react";
import { IMG } from "@/lib/images";
import { BUSINESS, whatsappHref } from "@/lib/business";
import { Button } from "@/components/ui/button";



import { useReducedMotion } from "@/lib/useReducedMotion";
import { useLanguage } from "@/lib/language";
import dimaMLogo from "@/assets/dima-m-logo-transparent.png";
import meemLogo from "@/assets/meem-logo.png";


const RAYONS = [
  {
    img: IMG.aisleEpicerie,
    name: { fr: "Alimentation", ar: "المواد الغذائية" },
    desc: {
      fr: "Épicerie salée & sucrée, produits frais, essentiels du quotidien soigneusement sélectionnés.",
      ar: "مواد غذائية مالحة وحلوة، منتجات طازجة، وأساسيات يومية مُنتقاة بعناية.",
    },
  },
  {
    img: IMG.aisleDrinks,
    name: { fr: "Boissons", ar: "مشروبات" },
    desc: {
      fr: "Eaux minérales, jus pressés, sodas et boissons chaudes servis à la bonne température.",
      ar: "مياه معدنية، عصائر طازجة، مشروبات غازية وساخنة تُقدَّم في درجة الحرارة المثالية.",
    },
  },
  {
    img: IMG.aisleBiscuits,
    name: { fr: "Biscuits & Confiserie", ar: "حلويات وبسكويت" },
    desc: {
      fr: "Marques marocaines et importées, chocolats fins, gourmandises pour toutes les envies.",
      ar: "علامات مغربية ومستوردة، شوكولاطة فاخرة، وحلويات تُرضي كل الأذواق.",
    },
  },
  {
    img: IMG.bakery,
    name: { fr: "Boulangerie", ar: "مخبوزات" },
    desc: {
      fr: "Pain frais, viennoiseries dorées et pâtisseries préparées sur place chaque matin.",
      ar: "خبز طازج، معجنات ذهبية وحلويات تُحضَّر في المكان كل صباح.",
    },
  },
  {
    img: IMG.aisleEpicerie,
    name: { fr: "Produits importés", ar: "منتجات مستوردة" },
    desc: {
      fr: "Le meilleur d’ailleurs : sauces, spécialités, épiceries fines des cinq continents.",
      ar: "الأفضل من الخارج: صلصات، تخصصات، ومنتجات راقية من خمس قارات.",
    },
  },
  {
    img: IMG.aisleSnacks,
    name: { fr: "Snacks & Grignotage", ar: "وجبات خفيفة" },
    desc: {
      fr: "Chips, gaufrettes, encas salés et sucrés — pour les petits plaisirs improvisés.",
      ar: "شيبس، ويفر، ووجبات خفيفة مالحة وحلوة — لمتعة صغيرة في أي وقت.",
    },
  },
];

const ENGAGEMENTS = [
  {
    n: "01",
    t: { fr: "Sélection experte", ar: "انتقاء احترافي" },
    d: {
      fr: "Chaque référence est goûtée, comparée, choisie. Nous refusons ce que nous ne consommerions pas.",
      ar: "كل منتج نتذوقه، نقارنه، ونختاره بعناية. نرفض ما لا نستهلكه بأنفسنا.",
    },
  },
  {
    n: "02",
    t: { fr: "Fraîcheur quotidienne", ar: "طزاجة يومية" },
    d: {
      fr: "Livraisons matinales, boulangerie sur place, rotation stricte des stocks. Zéro compromis.",
      ar: "توريد صباحي، مخبزة داخل المتجر، وتدوير صارم للمخزون. بدون أي تنازل.",
    },
  },
  {
    n: "03",
    t: { fr: "Proximité vraie", ar: "قرب حقيقي" },
    d: {
      fr: "Une équipe qui vous reconnaît, vous conseille, retient vos habitudes.",
      ar: "فريق يعرفكم، ينصحكم، ويتذكر عاداتكم.",
    },
  },
  {
    n: "04",
    t: { fr: "Made in Morocco", ar: "صنع في المغرب" },
    d: {
      fr: "Nous mettons en avant les producteurs marocains à côté des grandes marques internationales.",
      ar: "نُبرز المنتجين المغاربة إلى جانب كبرى العلامات العالمية.",
    },
  },
];

const AVIS = [
  {
    n: "Salma B.",
    r: "★★★★★",
    t: {
      fr: "Le meilleur quartier a enfin sa supérette. Propre, bien rangée, personnel adorable.",
      ar: "أخيراً حيّنا حصل على متجره الخاص. نظيف، مرتب، وطاقم لطيف جداً.",
    },
  },
  {
    n: "Karim L.",
    r: "★★★★★",
    t: {
      fr: "La boulangerie est bluffante. Croissants au niveau des grandes enseignes.",
      ar: "المخبزة رائعة حقاً. الكرواسون بمستوى كبرى العلامات.",
    },
  },
  {
    n: "Yasmine A.",
    r: "★★★★★",
    t: {
      fr: "On trouve des produits qu’on ne voit nulle part ailleurs. C’est devenu mon rendez-vous du samedi.",
      ar: "نجد منتجات لا نجدها في أي مكان آخر. أصبح موعدي الأسبوعي كل سبت.",
    },
  },
  {
    n: "Mehdi R.",
    r: "★★★★★",
    t: {
      fr: "Ouvert tard, toujours frais, prix corrects. Rien à redire.",
      ar: "مفتوح لوقت متأخر، دائماً طازج، وأسعار مناسبة. لا شيء نعيبه.",
    },
  },
];

const FAQ = [
  {
    q: { fr: "Où êtes-vous situés ?", ar: "أين يقع متجركم؟" },
    a: {
      fr: "À Tabriquet, Salé — à une minute de la poste de Tabriquet, avec un parking accessible et une entrée piétonne à double battant.",
      ar: "في Tabriquet, Salé — على بعد دقيقة واحدة من بريد Tabriquet، مع موقف سيارات سهل الوصول ومدخل للمشاة بمصراعين.",
    },
  },
  {
    q: { fr: "Quels sont vos horaires ?", ar: "ما هي أوقات عملكم؟" },
    a: {
      fr: "Tous les jours de 09h00 à 22h00.",
      ar: "كل يوم من 09:00 صباحاً إلى 22:00 مساءً.",
    },
  },
  {
    q: { fr: "Proposez-vous la livraison ?", ar: "هل تقدمون خدمة التوصيل؟" },
    a: {
      fr: "Oui, livraison locale via téléphone. Commande minimum 100 MAD.",
      ar: "نعم، توصيل محلي عبر الهاتف. الحد الأدنى للطلب 100 درهم.",
    },
  },
  {
    q: { fr: "Acceptez-vous la carte bancaire ?", ar: "هل تقبلون البطاقة البنكية؟" },
    a: {
      fr: "Bien sûr. Cartes locales et internationales, ainsi que les paiements sans contact.",
      ar: "بالتأكيد. البطاقات المحلية والدولية، وكذلك الدفع بدون تلامس.",
    },
  },
  {
    q: { fr: "Avez-vous des produits sans gluten / bio ?", ar: "هل لديكم منتجات خالية من الغلوتين / بيولوجية؟" },
    a: {
      fr: "Une sélection dédiée est disponible en rayon épicerie fine — demandez à notre équipe.",
      ar: "تتوفر تشكيلة خاصة في قسم المواد الغذائية الفاخرة — اسألوا فريقنا.",
    },
  },
];

const TRUST_POINTS = [
  { t: { fr: "06:30", ar: "06:30" }, d: { fr: "Boulangerie fraîche chaque matin", ar: "خبز طازج كل صباح" } },
  { t: { fr: "07j/7", ar: "7/7" }, d: { fr: "Ouvert tous les jours", ar: "مفتوح كل أيام الأسبوع" } },
  { t: { fr: "Local", ar: "محلي" }, d: { fr: "Livraison de proximité", ar: "توصيل من الجوار" } },
];

const PAYMENT_METHODS = [
  {
    name: { fr: "Visa", ar: "Visa" },
    desc: { fr: "Carte bancaire", ar: "بطاقة بنكية" },
    mark: <span className="font-display text-xl font-bold italic tracking-tight text-payment-visa">VISA</span>,
  },
  {
    name: { fr: "Mastercard", ar: "Mastercard" },
    desc: { fr: "Carte bancaire", ar: "بطاقة بنكية" },
    mark: (
      <span className="relative flex h-7 w-11 items-center justify-center">
        <span className="absolute left-0 h-7 w-7 rounded-full bg-payment-mastercard-red" />
        <span className="absolute right-0 h-7 w-7 rounded-full bg-payment-mastercard-gold mix-blend-multiply" />
      </span>
    ),
  },
  {
    name: { fr: "Sans contact", ar: "بدون تلامس" },
    desc: { fr: "NFC / Apple Pay", ar: "NFC / Apple Pay" },
    mark: <Nfc className="h-7 w-7 text-editorial" strokeWidth={1.5} />,
  },
  {
    name: { fr: "CMI", ar: "CMI" },
    desc: { fr: "Monétique MA", ar: "الأداء الإلكتروني" },
    mark: (
      <span className="rounded-md bg-payment-cmi px-2.5 py-1 font-display text-sm font-bold text-paper">
        CMI
      </span>
    ),
  },
  {
    name: { fr: "Wafacash", ar: "Wafacash" },
    desc: { fr: "Transfert mobile", ar: "تحويل عبر الهاتف" },
    mark: (
      <span className="rounded-md bg-payment-wafa px-2 py-1 text-center font-display text-[11px] font-bold leading-tight text-paper">
        Wafa<br />cash
      </span>
    ),
  },
  {
    name: { fr: "CashPlus", ar: "CashPlus" },
    desc: { fr: "Transfert mobile", ar: "تحويل عبر الهاتف" },
    mark: (
      <span className="rounded-md bg-payment-cashplus px-2 py-1 font-display text-xs font-bold text-paper">
        Cash Plus
      </span>
    ),
  },
  {
    name: { fr: "Espèces", ar: "نقداً" },
    desc: { fr: "En caisse", ar: "عند الأداء" },
    mark: <Banknote className="h-7 w-7 text-editorial" strokeWidth={1.5} />,
  },
];

const DAY_LABEL_AR: Record<string, string> = {
  "Lundi — Vendredi": "الاثنين — الجمعة",
  "Samedi": "السبت",
  "Dimanche": "الأحد",
  "Boulangerie": "المخبزة",
};

const TEXT = {
  fr: {
    trustReviews: "+ avis clients",
    trustReviewsShort: "+ avis",
    manifesteLabel: "Le manifeste",
    manifestoPre: "Une supérette ne devrait ",
    manifestoEm: "jamais",
    manifestoPost: " être ordinaire.",
    manifestoP1:
      "DIMA M Market est né d’une conviction simple : le quotidien mérite mieux qu’un néon blafard et des rayons anonymes. Nous avons pensé chaque détail comme une expérience — la lumière, la circulation, la sélection, le service.",
    manifestoP2:
      "Le résultat est un lieu à part. Une supérette où l’on entre pour un pain et où l’on ressort avec l’envie de revenir. Bienvenue chez DIMA M — bienvenue chez vous.",
    rayonsLabel: "Nos rayons",
    rayonsHeading: "Tout, sous un même toit.",
    rayonsSubtitle: "Six univers pensés pour vous faire gagner du temps sans sacrifier la qualité.",
    engagementsLabel: "Pourquoi choisir DIMA M",
    engagementsHeadingLine1: "Quatre engagements.",
    engagementsHeadingEm: "Zéro compromis.",
    fondateurLabel: "Le fondateur",
    fondateurQuote:
      "« Nous avons ouvert DIMA M pour une raison simple : offrir à notre quartier un magasin où chacun se sent reçu, respecté, servi comme un proche.\n\nIci, on choisit chaque produit à la main. Chaque bonjour est sincère. Le commerce, c'est d'abord un lien humain. »",
    fondateurName: "Mohammed El Abd",
    fondateurTitle: "Fondateur · DIMA M Market, Salé",
    visiterLabel: "Nous rendre visite",
    visiterHeading: "Ouvert quand vous en avez besoin.",
    telephone: "Téléphone",
    livraison: "Livraison",
    commanderWhatsapp: "Commander sur WhatsApp",
    mapLabel: "DIMA M Market",
    addressLabel: BUSINESS.addressLabel,
    paiementLabel: "Paiement",
    paiementHeading: "Payez comme vous le souhaitez.",
    paiementSubtitle: "Toutes les méthodes courantes acceptées en caisse. Rapidement, sans complication.",
    paiementTrust: "Paiements 100% sécurisés — Commerce agréé · RC Salé — Conforme réglementation ANSS Maroc.",
    avisPre: "Ils reviennent. ",
    avisEm: "Souvent.",
    faqLabel: "FAQ",
    faqHeadingLine1: "Les questions",
    faqHeadingLine2: "qu’on nous pose.",
    ctaHeadingLine1: "Passez",
    ctaHeadingEm: "nous voir.",
    ctaParagraph:
      "Un thé, un conseil, une découverte : chez DIMA M Market, on ne fait pas que vendre — on reçoit.",
    appelerLeMagasin: "Appeler le magasin",
    explorerLesRayons: "Explorer les rayons",
    footerDesc:
      "Une supérette moderne à Tabriquet, Salé. Alimentation, boulangerie, produits importés — servis avec exigence, chaque jour.",
    whatsappShort: "WhatsApp",
    appeler: "Appeler",
    itineraire: "Itinéraire",
    explorer: "Explorer",
    navManifeste: "Manifeste",
    navRayons: "Rayons",
    navEngagements: "Engagements",
    navVisiter: "Nous rendre visite",
    horaires: "Horaires",
    contact: "Contact",
    copyright: (year: number) => `© ${year} DIMA M Market — Tous droits réservés`,
    tagline: "Une expérience. Pas juste une supérette.",
    whatsappOrderMsg: "Bonjour, je voudrais passer une commande chez DIMA M Market.",
    whatsappContactMsg: "Bonjour, je vous contacte depuis le site DIMA M Market.",
  },
  ar: {
    trustReviews: "+ تقييم من الزبناء",
    trustReviewsShort: "+ تقييم",
    manifesteLabel: "فلسفتنا",
    manifestoPre: "المتجر لا يجب أن يكون ",
    manifestoEm: "أبداً",
    manifestoPost: " عادياً.",
    manifestoP1:
      "وُلد DIMA M Market من قناعة بسيطة: يستحق يومكم أفضل من إضاءة باهتة ورفوف بلا روح. فكّرنا في كل تفصيل كتجربة متكاملة — الإضاءة، حركة التنقل، انتقاء المنتجات، والخدمة.",
    manifestoP2:
      "والنتيجة مكان مختلف تماماً. متجر تدخله من أجل رغيف خبز، وتخرج منه برغبة في العودة. مرحباً بكم في DIMA M — مرحباً بكم في بيتكم.",
    rayonsLabel: "أقسامنا",
    rayonsHeading: "كل شيء تحت سقف واحد.",
    rayonsSubtitle: "ستة عوالم صُممت لتوفير وقتكم دون التنازل عن الجودة.",
    engagementsLabel: "لماذا تختار DIMA M",
    engagementsHeadingLine1: "أربعة التزامات.",
    engagementsHeadingEm: "بدون تنازلات.",
    fondateurLabel: "كلمة المؤسس",
    fondateurQuote:
      "« فتحنا DIMA M لسبب بسيط: أن نقدّم لحيّنا متجراً يشعر فيه كل شخص بالترحيب والاحترام، ويُعامَل كأنه من العائلة.\n\nهنا، نختار كل منتج بأيدينا. وكل تحية صادقة. فالتجارة، قبل كل شيء، علاقة إنسانية. »",
    fondateurName: "محمد العبد",
    fondateurTitle: "المؤسس · DIMA M Market, Salé",
    visiterLabel: "زوروا متجرنا",
    visiterHeading: "مفتوح وقتما احتجتم إلينا.",
    telephone: "الهاتف",
    livraison: "التوصيل",
    commanderWhatsapp: "اطلب عبر واتساب",
    mapLabel: "DIMA M Market",
    addressLabel: BUSINESS.addressLabel,
    paiementLabel: "الدفع",
    paiementHeading: "ادفعوا بالطريقة التي تناسبكم.",
    paiementSubtitle: "جميع وسائل الدفع الشائعة مقبولة في الصندوق. بسرعة وبدون تعقيد.",
    paiementTrust: "دفع آمن 100% — تجارة معتمدة · السجل التجاري بـ Salé — مطابق لتنظيم ANSS بالمغرب.",
    avisPre: "يعودون. ",
    avisEm: "دائماً.",
    faqLabel: "الأسئلة الشائعة",
    faqHeadingLine1: "الأسئلة",
    faqHeadingLine2: "التي يطرحونها علينا.",
    ctaHeadingLine1: "مرّوا",
    ctaHeadingEm: "لزيارتنا.",
    ctaParagraph: "كأس شاي، نصيحة، أو اكتشاف جديد: في DIMA M Market لا نكتفي بالبيع — نستقبلكم كضيوف.",
    appelerLeMagasin: "اتصل بالمتجر",
    explorerLesRayons: "اكتشف أقسامنا",
    footerDesc: "متجر عصري في Tabriquet, Salé. مواد غذائية، مخبزة، ومنتجات مستوردة — بخدمة متميزة كل يوم.",
    whatsappShort: "واتساب",
    appeler: "اتصال",
    itineraire: "الاتجاهات",
    explorer: "استكشف",
    navManifeste: "فلسفتنا",
    navRayons: "أقسامنا",
    navEngagements: "التزاماتنا",
    navVisiter: "زوروا متجرنا",
    horaires: "أوقات العمل",
    contact: "تواصل معنا",
    copyright: (year: number) => `© ${year} DIMA M Market — جميع الحقوق محفوظة`,
    tagline: "تجربة. وليست مجرد متجر.",
    whatsappOrderMsg: "مرحباً، أود تقديم طلب من DIMA M Market.",
    whatsappContactMsg: "مرحباً، أتواصل معكم من موقع DIMA M Market.",
  },
} as const;

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return <div className="section-label"><span dir="ltr">{n} /</span>{children}</div>;
}
function MovingBand() {
  const { lang } = useLanguage();
  return <div className="moving-band" aria-hidden="true"><div className="moving-band-track" dir="ltr">{[0,1,2,3].map(i => <span key={i}>DIMA M MARKET <span className="band-star">✳</span> {lang === "fr" ? "LE QUOTIDIEN, AUTREMENT." : "يومكم، بروح مختلفة."} <span className="band-star">✳</span> </span>)}</div></div>;
}
export function PostHero() {
  const { lang } = useLanguage();
  const t = TEXT[lang];
  const ar = lang === "ar";
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".editorial-image img").forEach(image => gsap.fromTo(image, { yPercent: -4, scale: 1.06 }, { yPercent: 4, scale: 1, ease: "none", scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 } }));
        gsap.utils.toArray<HTMLElement>(".editorial-heading").forEach(heading => {
          const accent = heading.querySelector(".heading-accent");
          if (accent) gsap.fromTo(accent, { opacity: .3 }, { opacity: 1, scrollTrigger: { trigger: heading, start: "top 85%", end: "bottom 45%", scrub: .5 } });
          gsap.fromTo(heading, { y: 42, rotateX: -12, transformPerspective: 900 }, { y: 0, rotateX: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: heading, start: "top 90%", toggleActions: "play none none reverse" } });
        });
        const manifesto = gsap.timeline({ scrollTrigger: { trigger: ".manifesto-photo", start: "top 90%", end: "top 25%", scrub: .7 } });
        manifesto.fromTo(".manifesto-photo", { clipPath: "inset(8% 14% 8% 14%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out" });
        gsap.fromTo(".department-photo", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: .85, stagger: .075, ease: "power3.inOut", scrollTrigger: { trigger: ".departments-grid", start: "top 90%", toggleActions: "play none none reverse" } });
        gsap.utils.toArray<HTMLElement>(".commitment-row").forEach(row => {
          gsap.fromTo(row, { x: ar ? -24 : 24, opacity: .25 }, { x: 0, opacity: 1, scrollTrigger: { trigger: row, start: "top 90%", end: "top 50%", scrub: .5 } });
        });
        gsap.fromTo(".family-stamp", { rotation: -13, scale: .8 }, { rotation: -5, scale: 1, scrollTrigger: { trigger: ".family-photo", start: "top 90%", end: "center 50%", scrub: .6 } });
        gsap.fromTo(".family-copy blockquote", { opacity: .25 }, { opacity: 1, scrollTrigger: { trigger: ".family-copy", start: "top 90%", end: "bottom 65%", scrub: .7 } });
        gsap.utils.toArray<HTMLElement>(".photo-strip-item img").forEach((image,i) => gsap.fromTo(image, { yPercent: i % 2 ? -12 : 12, scale: 1.15 }, { yPercent: i % 2 ? 8 : -8, scale: 1.15, ease: "none", scrollTrigger: { trigger: ".photo-strip", start: "top bottom", end: "bottom top", scrub: .6 } }));
        gsap.fromTo(".footer-wordmark", { yPercent: 70 }, { yPercent: 0, ease: "power2.out", scrollTrigger: { trigger: ".market-footer", start: "top 80%", end: "bottom bottom", scrub: .7 } });
      }, root);
      cleanup = () => ctx.revert();
    })();
    return () => { disposed = true; cleanup(); };
  }, [reduced, ar]);
  return <div ref={root} className="market-body">
    <section id="manifeste" className="manifesto-section section-wrap">
      <div className="manifesto-meta"><span>{ar ? "متجر الحي · سلا" : "LE COMMERCE DE QUARTIER · SALÉ"}</span><span className="manifesto-hours" dir="ltr">09:00 — 22:00 / 7J·7</span></div>
      <div className="manifesto-grid">
        <div><SectionLabel n="01">{t.manifesteLabel}</SectionLabel><h2 className="editorial-heading reveal">{ar ? "قريب منكم." : "LE QUOTIDIEN."}<br /><span className="heading-accent">{ar ? "مختلف دائماً." : "RIEN D’ORDINAIRE."}</span></h2></div>
        <div className="manifesto-aside reveal"><p>{t.manifestoP1}</p><p>{t.manifestoP2}</p><Button asChild variant="link" className="editorial-link"><a href="#rayons">{t.explorerLesRayons}<ArrowUpRight /></a></Button></div>
      </div>
      <div className="manifesto-photo editorial-image reveal"><img src={IMG.interiorCounter} alt={ar ? "داخل متجر DIMA M" : "L’intérieur du magasin DIMA M Market"} loading="lazy" /><div className="image-caption"><span>{ar ? "مكانكم في الحي" : "VOTRE ADRESSE, DANS LE QUARTIER."}</span><span dir="ltr">DIMA M — TABRIQUET</span></div></div>
    </section>
    <MovingBand />
    <section id="rayons" className="departments-section section-wrap">
      <div className="section-heading-row"><div><SectionLabel n="02">{t.rayonsLabel}</SectionLabel><h2 className="editorial-heading reveal">{ar ? "كل شيء." : "TOUT."}<br /><span className="heading-accent">{ar ? "في مكان واحد." : "AU MÊME ENDROIT."}</span></h2></div><p className="section-side-copy">{t.rayonsSubtitle}</p></div>
      <div className="departments-grid">{RAYONS.map((r,i) => <article key={r.name.fr} className="department group"><div className="department-photo"><img src={r.img} alt={r.name[lang]} loading="lazy" /><span className="department-index" dir="ltr">0{i+1}</span></div><div className="department-title"><h3>{r.name[lang]}</h3><span className="department-other" dir={ar ? "ltr" : "rtl"}>{r.name[ar ? "fr" : "ar"]}</span></div><p>{r.desc[lang]}</p></article>)}</div>
    </section>
    <section id="engagements" className="commitments-section section-wrap">
      <div className="commitments-grid"><div><SectionLabel n="03">{t.engagementsLabel}</SectionLabel><h2 className="editorial-heading reveal">{ar ? "اهتمام أكثر." : "UN PEU PLUS"}<br /><span>{ar ? "كل يوم." : "D’ATTENTION."}</span></h2><div className="commitment-photo editorial-image reveal"><img src={IMG.customers} alt={ar ? "النصيحة في المتجر" : "Un échange entre l’équipe et les clients"} loading="lazy" /></div></div><div className="commitments-list">{ENGAGEMENTS.map(e => <article key={e.n} className="commitment-row reveal"><span className="commitment-number">{e.n}</span><div><h3>{e.t[lang]}</h3><p>{e.d[lang]}</p></div><ArrowUpRight size={22} /></article>)}</div></div>
    </section>
    <section id="fondateur" className="family-section section-wrap"><div className="family-grid"><div className="family-photo editorial-image reveal"><img src={IMG.staffEpicerie} alt={ar ? "فريق DIMA M" : "L’équipe de DIMA M Market"} loading="lazy" /><span className="family-stamp" dir="ltr">DIMA M<br />C’EST NOUS.</span></div><div className="family-copy"><SectionLabel n="04">{ar ? "متجر عائلي" : "UNE HISTOIRE DE FAMILLE"}</SectionLabel><span className="quote-mark" aria-hidden="true">“</span><blockquote className="reveal">{t.fondateurQuote.replace(/^« /,'').replace(/ »$/,'')}</blockquote><div className="founder-signature"><span>{t.fondateurName}</span><small>{t.fondateurTitle}</small></div></div></div></section>
    <section className="photo-strip" aria-label={ar ? "المتجر في صور" : "Le magasin en images"}>{[IMG.facadeEntrance,IMG.bakery,IMG.staffHygiene,IMG.aisleDrinks].map((src,i) => <div className="photo-strip-item" key={src}><img src={src} loading="lazy" alt={[ar ? "الواجهة" : "La façade",ar ? "المخبزة" : "La boulangerie",ar ? "الفريق" : "L’équipe",ar ? "المشروبات" : "Les boissons"][i]} /><span dir="ltr">DIMA M / 0{i+1}</span></div>)}</section>
    <section id="visiter" className="visit-section section-wrap"><div className="visit-grid"><div><SectionLabel n="05">{t.visiterLabel}</SectionLabel><h2 className="editorial-heading reveal">{ar ? "مرّوا" : "À DEUX PAS."}<br /><span className="heading-accent">{ar ? "لزيارتنا." : "ON VOUS ATTEND."}</span></h2><p className="visit-address"><MapPin size={20} />{t.addressLabel}</p><div className="hours-list">{BUSINESS.hours.map(([day,h],i) => <div key={day}><span>{ar ? DAY_LABEL_AR[day] : day}</span><strong dir="ltr">{h}</strong></div>)}</div><div className="visit-actions"><Button asChild><a href={whatsappHref(t.whatsappOrderMsg)} target="_blank" rel="noopener noreferrer"><MessageCircle />{t.commanderWhatsapp}<ArrowUpRight /></a></Button><Button asChild variant="outline"><a href={BUSINESS.phoneHref}><Phone /><span dir="ltr">{BUSINESS.phoneDisplay}</span></a></Button></div></div><div className="visit-map"><iframe title={t.mapLabel} src={BUSINESS.mapsEmbedSrc} loading="lazy" allowFullScreen /><Button asChild className="map-directions"><a href={BUSINESS.mapsLink} target="_blank" rel="noopener noreferrer">{t.itineraire}<ArrowUpRight /></a></Button></div></div></section>
    <section className="payment-section section-wrap"><div><SectionLabel n="06">{t.paiementLabel}</SectionLabel><h2>{t.paiementHeading}</h2><p>{t.paiementSubtitle}</p></div><div className="payment-list">{PAYMENT_METHODS.map(m => <div key={m.name.fr}><span className="payment-symbol">{m.mark}</span><span>{m.name[lang]}</span></div>)}</div></section>
    <section className="reviews-section section-wrap"><div className="section-heading-row"><h2 className="editorial-heading reveal">{ar ? "يعودون." : "ILS REVIENNENT."}<br /><span className="heading-accent">{ar ? "دائماً." : "ET ÇA NOUS TOUCHE."}</span></h2><div className="review-rating"><strong>{BUSINESS.ratingValue}<small>/5</small></strong><span>{BUSINESS.reviewCountValue} {t.trustReviewsShort.replace('+ ','')}</span></div></div><div className="review-grid">{AVIS.map(a => <blockquote key={a.n} className="review-item reveal"><span className="review-stars">{a.r}</span><p>« {a.t[lang]} »</p><footer>{a.n}</footer></blockquote>)}</div></section>
    <section className="faq-section section-wrap"><div><SectionLabel n="07">{t.faqLabel}</SectionLabel><h2 className="editorial-heading">{ar ? "لديكم" : "UNE QUESTION ?"}<br /><span className="heading-accent">{ar ? "سؤال؟" : "TOUT SIMPLEMENT."}</span></h2></div><div className="faq-list">{FAQ.map(f => <details key={f.q.fr}><summary>{f.q[lang]}<Plus size={20} /></summary><p>{f.a[lang]}</p></details>)}</div></section>
    <footer id="contact" className="market-footer section-wrap"><div className="footer-invitation"><h2>{ar ? "نراكم قريباً." : "À TRÈS VITE."}</h2><Button asChild className="footer-cta"><a href={whatsappHref(t.whatsappContactMsg)} target="_blank" rel="noopener noreferrer">{t.whatsappShort}<ArrowUpRight /></a></Button></div><div className="footer-grid"><div className="footer-brand"><img src={dimaMLogo} alt="DIMA M Market" /><p>{t.footerDesc}</p></div><div><h3>{t.explorer}</h3>{[["#manifeste",t.navManifeste],["#rayons",t.navRayons],["#engagements",t.navEngagements],["#visiter",t.navVisiter]].map(([href,label]) => <a key={href} href={href}>{label}</a>)}</div><div><h3>{t.horaires}</h3><span>{ar ? "كل يوم" : "Tous les jours"}</span><strong dir="ltr">09:00 — 22:00</strong><a href={BUSINESS.mapsLink} target="_blank" rel="noopener noreferrer">{t.addressLabel}<ArrowUpRight size={14} /></a></div><div><h3>{t.contact}</h3><a href={BUSINESS.phoneHref} dir="ltr">{BUSINESS.phoneDisplay}</a><a href={`mailto:${BUSINESS.email}`} dir="ltr">{BUSINESS.email}</a><a href={whatsappHref(t.whatsappContactMsg)} target="_blank" rel="noopener noreferrer">WhatsApp<ArrowUpRight size={14} /></a></div></div><div className="footer-bottom"><span>{t.copyright(new Date().getFullYear())}</span><a href="https://www.agencemeem.com" target="_blank" rel="noopener noreferrer" className="agency-credit" dir="ltr"><span>{ar ? "الموقع من إنجاز" : "Site créé par"}</span><img src={meemLogo} alt="Agence MEEM" loading="lazy" /><ArrowUpRight size={14} /></a></div><div className="footer-wordmark" dir="ltr">DIMA M<span>®</span></div></footer>
  </div>;
}
