import { useEffect, useRef } from "react";
import { Nfc, Banknote, ShieldCheck } from "lucide-react";
import { IMG } from "@/lib/images";
import { BUSINESS, whatsappHref } from "@/lib/business";
import { CountUp } from "./CountUp";
import { ParallaxImage } from "./ParallaxImage";
import { CinematicGallery } from "./CinematicGallery";
import { useTilt } from "@/hooks/use-tilt";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useLanguage } from "@/lib/language";
import dimaMLogo from "@/assets/dima-m-logo-transparent.png";

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
      fr: "Tous les jours de 7h30 à 23h00. Boulangerie ouverte dès 6h30.",
      ar: "كل يوم من 7:30 صباحاً إلى 23:00 مساءً. المخبزة تفتح من الساعة 6:30 صباحاً.",
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
    mark: <span className="font-display text-xl font-bold italic tracking-tight text-[#1A1F71]">VISA</span>,
  },
  {
    name: { fr: "Mastercard", ar: "Mastercard" },
    desc: { fr: "Carte bancaire", ar: "بطاقة بنكية" },
    mark: (
      <span className="relative flex h-7 w-11 items-center justify-center">
        <span className="absolute left-0 h-7 w-7 rounded-full bg-[#EB001B]" />
        <span className="absolute right-0 h-7 w-7 rounded-full bg-[#F79E1B] mix-blend-multiply" />
      </span>
    ),
  },
  {
    name: { fr: "Sans contact", ar: "بدون تلامس" },
    desc: { fr: "NFC / Apple Pay", ar: "NFC / Apple Pay" },
    mark: <Nfc className="h-7 w-7 text-neutral-700" strokeWidth={1.5} />,
  },
  {
    name: { fr: "CMI", ar: "CMI" },
    desc: { fr: "Monétique MA", ar: "الأداء الإلكتروني" },
    mark: (
      <span className="rounded-md bg-[#0B4EA2] px-2.5 py-1 font-display text-sm font-bold text-white">
        CMI
      </span>
    ),
  },
  {
    name: { fr: "Wafacash", ar: "Wafacash" },
    desc: { fr: "Transfert mobile", ar: "تحويل عبر الهاتف" },
    mark: (
      <span className="rounded-md bg-[#F58220] px-2 py-1 text-center font-display text-[11px] font-bold leading-tight text-white">
        Wafa<br />cash
      </span>
    ),
  },
  {
    name: { fr: "CashPlus", ar: "CashPlus" },
    desc: { fr: "Transfert mobile", ar: "تحويل عبر الهاتف" },
    mark: (
      <span className="rounded-md bg-[#C8102E] px-2 py-1 font-display text-xs font-bold text-white">
        Cash Plus
      </span>
    ),
  },
  {
    name: { fr: "Espèces", ar: "نقداً" },
    desc: { fr: "En caisse", ar: "عند الأداء" },
    mark: <Banknote className="h-7 w-7 text-neutral-700" strokeWidth={1.5} />,
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
      "« J'ai ouvert DIMA M pour une raison simple : offrir à mon quartier un magasin où chacun se sent reçu, respecté, servi comme un proche.\n\nIci, chaque produit est choisi à la main. Chaque bonjour est sincère. Le commerce, c'est d'abord un lien humain. »",
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
      "« فتحتُ DIMA M لسبب بسيط: أن أقدّم لحيّي متجراً يشعر فيه كل شخص بالترحيب والاحترام، ويُعامَل كأنه من العائلة.\n\nهنا، كل منتج يُختار بيد أمينة. وكل تحية صادقة. فالتجارة، قبل كل شيء، علاقة إنسانية. »",
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

function RayonCard({ r, i }: { r: (typeof RAYONS)[number]; i: number }) {
  const tiltRef = useTilt<HTMLElement>(6);
  const { lang } = useLanguage();
  const otherLang = lang === "fr" ? "ar" : "fr";
  return (
    <article
      ref={tiltRef}
      className={`reveal reveal-delay-${(i % 4) + 1} tilt-card group relative overflow-hidden rounded-2xl border border-black/5 bg-black/[0.02] hover:border-[color:var(--dima)]/40`}
    >
      <div className="parallax-frame relative aspect-[4/5] overflow-hidden">
        <ParallaxImage src={r.img} alt={r.name[lang]} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
        <div className="absolute left-5 top-5 font-mono-tight text-[10px] uppercase tracking-[0.35em] text-[color:var(--dima)]">
          {r.name[otherLang]}
        </div>
        <div className="absolute right-5 top-5 font-mono-tight text-[10px] tracking-[0.3em] text-neutral-400">
          {String(i + 1).padStart(2, "0")}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-display text-3xl tracking-[-0.02em] text-neutral-900">{r.name[lang]}</h3>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">{r.desc[lang]}</p>
      </div>
    </article>
  );
}

// Scrolling word-band whose pace surges with scroll velocity and eases back
// to a steady drift — a small living detail rather than a static loop.
function MarqueeRow() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") return;
    let ctx: { revert: () => void } | null = null;
    let raf = 0;

    (async () => {
      const gsapMod = await import("gsap");
      const gsap = gsapMod.default ?? gsapMod;
      const track = trackRef.current;
      if (!track) return;

      ctx = gsap.context(() => {
        const tween = gsap.to(track, { xPercent: -50, duration: 34, ease: "none", repeat: -1 });

        let lastY = window.scrollY;
        let lastT = performance.now();

        const tick = () => {
          const now = performance.now();
          const dt = Math.max(16, now - lastT);
          const velocity = Math.abs(window.scrollY - lastY) / dt;
          lastY = window.scrollY;
          lastT = now;

          const target = 1 + Math.min(5, velocity * 40);
          const current = tween.timeScale();
          tween.timeScale(current + (target - current) * 0.08);
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      });
    })();

    return () => {
      cancelAnimationFrame(raf);
      ctx?.revert();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={trackRef}
      className="flex w-max items-center gap-16 whitespace-nowrap font-display text-[clamp(3rem,10vw,10rem)] leading-none tracking-[-0.04em] text-black/[0.06]"
      dir="ltr"
    >
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex items-center gap-16">
          <span>DIMA M Market</span>
          <Dot />
          <span className="dima-glow-text">Alimentation</span>
          <Dot />
          <span>Bricolage</span>
          <Dot />
          <span className="dima-glow-text">Hygiène</span>
          <Dot />
          <span>Boulangerie</span>
          <Dot />
          <span className="dima-glow-text">دائماً</span>
          <Dot />
        </div>
      ))}
    </div>
  );
}

export function PostHero() {
  const { lang } = useLanguage();
  const t = TEXT[lang];

  return (
    <div className="relative bg-white text-neutral-900">
      {/* Trust bar — surfaces real proof points immediately, right where the
          cinematic hero hands off, instead of burying them at page bottom. */}
      <section className="relative border-t border-black/5 px-6 py-10 md:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4">
          <div className="reveal text-center sm:text-left">
            <div className="font-display text-2xl tracking-[-0.02em] text-[color:var(--dima)] sm:text-3xl">
              <CountUp to={BUSINESS.ratingValue} decimals={1} />/5
            </div>
            <div className="mt-1 font-mono-tight text-[9px] uppercase tracking-[0.25em] text-neutral-500 sm:text-[10px]">
              <CountUp to={BUSINESS.reviewCountValue} suffix={t.trustReviews} />
            </div>
          </div>
          {TRUST_POINTS.map((p, i) => (
            <div key={p.d.fr} className={`reveal reveal-delay-${((i + 1) % 4) + 1} text-center sm:text-left`}>
              <div className="font-display text-2xl tracking-[-0.02em] text-[color:var(--dima)] sm:text-3xl">
                {p.t[lang]}
              </div>
              <div className="mt-1 font-mono-tight text-[9px] uppercase tracking-[0.25em] text-neutral-500 sm:text-[10px]">
                {p.d[lang]}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Manifesto */}
      <section id="manifeste" className="relative border-t border-black/5 px-6 py-32 md:px-16 md:py-48">
        <div className="mx-auto max-w-6xl">
          <div className="reveal mb-10 flex items-center gap-3">
            <span className="h-px w-10 bg-[color:var(--dima)]" />
            <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-neutral-500">
              {t.manifesteLabel}
            </span>
          </div>
          <h2 className="reveal reveal-delay-1 font-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.95] tracking-[-0.03em] text-neutral-900">
            {t.manifestoPre}
            <em className="not-italic dima-glow-text">{t.manifestoEm}</em>
            {t.manifestoPost}
          </h2>
          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <p className="reveal reveal-delay-2 text-lg leading-relaxed text-neutral-600 md:text-xl">
              {t.manifestoP1}
            </p>
            <p className="reveal reveal-delay-3 text-lg leading-relaxed text-neutral-600 md:text-xl">
              {t.manifestoP2}
            </p>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="relative overflow-hidden border-y border-black/5 py-16">
        <MarqueeRow />
      </section>

      {/* Rayons */}
      <section id="rayons" className="relative px-6 py-32 md:px-16 md:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
            <div>
              <div className="reveal mb-4 flex items-center gap-3">
                <span className="h-px w-10 bg-[color:var(--dima)]" />
                <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-neutral-500">
                  {t.rayonsLabel}
                </span>
              </div>
              <h2 className="reveal reveal-cinematic font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] tracking-[-0.03em] text-neutral-900">
                {t.rayonsHeading}
              </h2>
            </div>
            <p className="reveal reveal-delay-2 max-w-md text-neutral-600">{t.rayonsSubtitle}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {RAYONS.map((r, i) => (
              <RayonCard key={r.name.fr} r={r} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section id="engagements" className="relative border-y border-black/5 bg-black/[0.015] px-6 py-32 md:px-16 md:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <div className="reveal mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-[color:var(--dima)]" />
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-neutral-500">
                {t.engagementsLabel}
              </span>
            </div>
            <h2 className="reveal reveal-cinematic font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] tracking-[-0.03em] text-neutral-900">
              {t.engagementsHeadingLine1} <br />
              <em className="not-italic text-neutral-400">{t.engagementsHeadingEm}</em>
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl bg-black/10 md:grid-cols-2 lg:grid-cols-4">
            {ENGAGEMENTS.map((e, i) => (
              <div key={e.n} className={`reveal reveal-delay-${(i % 4) + 1} group bg-white p-8 transition-colors hover:bg-black/[0.03]`}>
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-mono-tight text-xs tracking-[0.3em] text-[color:var(--dima)]">
                    {e.n}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[color:var(--dima)] shadow-[0_0_18px_var(--dima)] transition-transform duration-500 group-hover:scale-150" />
                </div>
                <h3 className="font-display text-2xl leading-tight tracking-[-0.02em] text-neutral-900">{e.t[lang]}</h3>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">{e.d[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Le fondateur */}
      <section id="fondateur" className="relative border-t border-black/5 px-6 pb-20 pt-32 md:px-16 md:pb-24 md:pt-48">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <div className="reveal">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <img
                src={IMG.staffEpicerie}
                alt={`${t.fondateurName}, ${t.fondateurTitle}`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="reveal reveal-delay-2">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-[color:var(--dima)]" />
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-neutral-500">
                {t.fondateurLabel}
              </span>
            </div>
            <blockquote className="whitespace-pre-line font-display text-2xl leading-snug tracking-[-0.01em] text-neutral-900 md:text-3xl">
              {t.fondateurQuote}
            </blockquote>
            <div className="mt-8">
              <div className="font-display text-xl text-neutral-900">{t.fondateurName}</div>
              <div className="mt-1 font-mono-tight text-[10px] uppercase tracking-[0.3em] text-[color:var(--dima)]">
                {t.fondateurTitle}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CinematicGallery />

      {/* Horaires + Localisation */}
      <section id="visiter" className="relative border-t border-black/5 px-6 py-32 md:px-16 md:py-48">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          <div>
            <div className="reveal mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-[color:var(--dima)]" />
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-neutral-500">
                {t.visiterLabel}
              </span>
            </div>
            <h2 className="reveal reveal-cinematic font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] text-neutral-900">
              {t.visiterHeading}
            </h2>
            <div className="mt-12 space-y-4 border-t border-black/10">
              {BUSINESS.hours.map(([d, h]) => (
                <div
                  key={d}
                  className="flex items-baseline justify-between border-b border-black/10 pb-4 pt-2"
                >
                  <span className="font-mono-tight text-xs uppercase tracking-[0.3em] text-neutral-500">
                    {lang === "ar" ? DAY_LABEL_AR[d] ?? d : d}
                  </span>
                  <span className="font-display text-2xl text-neutral-900">{h}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <a
                href={BUSINESS.phoneHref}
                className="group relative flex items-center justify-between rounded-xl border border-black/10 bg-black/[0.02] px-5 py-4 transition-colors hover:border-[color:var(--dima)]/60"
              >
                <span>
                  <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                    {t.telephone}
                  </div>
                  <div className="mt-1 font-display text-xl text-neutral-900" dir="ltr">{BUSINESS.phoneDisplay}</div>
                </span>
                <Arrow />
              </a>
              <a
                href={whatsappHref(t.whatsappOrderMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-between rounded-xl border border-[color:var(--dima)]/40 bg-[color:var(--dima)]/10 px-5 py-4 transition-colors hover:bg-[color:var(--dima)]/20"
              >
                <span>
                  <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-[color:var(--dima)]">
                    {t.livraison}
                  </div>
                  <div className="mt-1 font-display text-xl text-neutral-900">{t.commanderWhatsapp}</div>
                </span>
                <Arrow />
              </a>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-black/10">
            <iframe
              title={t.mapLabel}
              src={BUSINESS.mapsEmbedSrc}
              className="h-full min-h-[420px] w-full grayscale-[0.6] contrast-[1.1]"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
            <div className="pointer-events-none absolute bottom-6 left-6 rounded-xl glass px-4 py-3">
              <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-white/60">
                {t.mapLabel}
              </div>
              <div className="font-display text-lg text-white">{t.addressLabel}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Moyens de paiement */}
      <section className="relative border-t border-black/5 bg-black/[0.015] px-6 py-32 md:px-16 md:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-2xl">
            <div className="reveal mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-[color:var(--dima)]" />
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-neutral-500">
                {t.paiementLabel}
              </span>
            </div>
            <h2 className="reveal reveal-cinematic font-display text-[clamp(2.25rem,5vw,4rem)] leading-[0.95] tracking-[-0.03em] text-neutral-900">
              {t.paiementHeading}
            </h2>
            <p className="reveal reveal-delay-2 mt-6 text-lg leading-relaxed text-neutral-600">
              {t.paiementSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {PAYMENT_METHODS.map((m, i) => (
              <div
                key={m.name.fr}
                className={`reveal reveal-delay-${(i % 4) + 1} card-lift flex flex-col items-center gap-4 rounded-2xl border border-black/10 bg-white px-4 py-6 text-center`}
              >
                <div className="flex h-10 items-center justify-center">{m.mark}</div>
                <div>
                  <div className="font-display text-base text-neutral-900">{m.name[lang]}</div>
                  <div className="mt-1 font-mono-tight text-[9px] uppercase tracking-[0.25em] text-neutral-400">
                    {m.desc[lang]}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="reveal reveal-delay-3 mt-12 flex flex-wrap items-center gap-3 border-t border-black/10 pt-8 text-neutral-500">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[color:var(--dima)]" strokeWidth={1.75} />
            <p className="font-mono-tight text-[11px] uppercase tracking-[0.2em]">{t.paiementTrust}</p>
          </div>
        </div>
      </section>

      {/* Avis */}
      <section className="relative border-y border-black/5 bg-black/[0.015] px-6 py-32 md:px-16 md:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <h2 className="reveal reveal-cinematic font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] text-neutral-900">
              {t.avisPre}
              <em className="not-italic dima-glow-text">{t.avisEm}</em>
            </h2>
            <div className="reveal reveal-delay-2 font-mono-tight text-[11px] uppercase tracking-[0.3em] text-neutral-500">
              <CountUp to={BUSINESS.ratingValue} decimals={1} /> / 5 — <CountUp to={BUSINESS.reviewCountValue} suffix={t.trustReviewsShort} />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {AVIS.map((a, i) => (
              <blockquote
                key={a.n}
                className={`reveal reveal-delay-${(i % 4) + 1} card-lift rounded-2xl border border-black/10 bg-white p-6`}
              >
                <div className="text-[color:var(--dima)]">{a.r}</div>
                <p className="mt-4 text-neutral-800">« {a.t[lang]} »</p>
                <footer className="mt-6 font-mono-tight text-[10px] uppercase tracking-[0.3em] text-neutral-500" dir="ltr">
                  {a.n}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative px-6 py-32 md:px-16 md:py-48">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="reveal mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-[color:var(--dima)]" />
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-neutral-500">
                {t.faqLabel}
              </span>
            </div>
            <h2 className="reveal reveal-cinematic font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.03em] text-neutral-900">
              {t.faqHeadingLine1} <br /> {t.faqHeadingLine2}
            </h2>
          </div>
          <div className="divide-y divide-black/10 border-y border-black/10">
            {FAQ.map((f, i) => (
              <details key={f.q.fr} className={`reveal reveal-delay-${(i % 4) + 1} group py-6`}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                  <span className="font-display text-xl text-neutral-900 md:text-2xl">{f.q[lang]}</span>
                  <span className="mt-1 font-mono-tight text-xs text-[color:var(--dima)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-neutral-600">{f.a[lang]}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + Footer */}
      <section id="contact" className="relative overflow-hidden border-t border-black/5 px-6 py-32 md:px-16 md:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-end">
            <h2 className="reveal reveal-cinematic font-display text-[clamp(3rem,10vw,10rem)] leading-[0.9] tracking-[-0.04em] text-neutral-900">
              {t.ctaHeadingLine1} <br />
              <em className="not-italic dima-glow-text">{t.ctaHeadingEm}</em>
            </h2>
            <div>
              <p className="reveal reveal-delay-2 text-lg text-neutral-600">{t.ctaParagraph}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={whatsappHref(t.whatsappOrderMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-glow inline-flex items-center gap-3 rounded-full bg-[color:var(--dima)] px-6 py-3 text-sm font-medium text-[color:var(--ink)] transition-transform hover:scale-[1.03]"
                >
                  {t.commanderWhatsapp} <Arrow dark />
                </a>
                <a
                  href={BUSINESS.phoneHref}
                  className="inline-flex items-center gap-3 rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-black/5"
                >
                  {t.appelerLeMagasin} <Arrow />
                </a>
                <a
                  href="#rayons"
                  className="link-sweep inline-flex items-center gap-2 self-center px-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
                >
                  {t.explorerLesRayons}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/10 bg-[color:var(--ink)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-16 md:py-20">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <img src={dimaMLogo} alt="DIMA M Market" className="h-12 w-12" />
              </div>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">{t.footerDesc}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={whatsappHref(t.whatsappContactMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--dima)] px-4 py-2 text-xs font-medium text-[color:var(--ink)] transition-transform hover:scale-[1.03]"
                >
                  {t.whatsappShort}
                </a>
                <a
                  href={BUSINESS.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10"
                >
                  {t.appeler}
                </a>
                <a
                  href="#visiter"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10"
                >
                  {t.itineraire}
                </a>
              </div>
            </div>

            <div>
              <div className="font-mono-tight text-[10px] uppercase tracking-[0.35em] text-white/40">
                {t.explorer}
              </div>
              <ul className="mt-5 space-y-3 text-sm text-white/70">
                <li><a href="#manifeste" className="hover:text-[color:var(--dima)]">{t.navManifeste}</a></li>
                <li><a href="#rayons" className="hover:text-[color:var(--dima)]">{t.navRayons}</a></li>
                <li><a href="#engagements" className="hover:text-[color:var(--dima)]">{t.navEngagements}</a></li>
                <li><a href="#visiter" className="hover:text-[color:var(--dima)]">{t.navVisiter}</a></li>
              </ul>
            </div>

            <div>
              <div className="font-mono-tight text-[10px] uppercase tracking-[0.35em] text-white/40">
                {t.horaires}
              </div>
              <ul className="mt-5 space-y-3 text-sm text-white/70">
                {BUSINESS.hours.map(([d, h]) => (
                  <li key={d} className="flex justify-between gap-4">
                    <span>{lang === "ar" ? DAY_LABEL_AR[d] ?? d : d}</span>
                    <span className={d === "Boulangerie" ? "text-[color:var(--dima)]" : "text-white/50"}>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-mono-tight text-[10px] uppercase tracking-[0.35em] text-white/40">
                {t.contact}
              </div>
              <ul className="mt-5 space-y-3 text-sm text-white/70">
                <li>{t.addressLabel}</li>
                <li><a href={BUSINESS.phoneHref} className="hover:text-[color:var(--dima)]" dir="ltr">{BUSINESS.phoneDisplay}</a></li>
                <li><a href={`mailto:${BUSINESS.email}`} className="hover:text-[color:var(--dima)]" dir="ltr">{BUSINESS.email}</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
            <span className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-white/40">
              {t.copyright(new Date().getFullYear())}
            </span>
            <span className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-white/40">
              {t.tagline}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Arrow({ dark = false }: { dark?: boolean }) {
  const { dir } = useLanguage();
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={`${dark ? "text-[color:var(--ink)]" : "text-neutral-900"} ${dir === "rtl" ? "-scale-x-100" : ""}`}
    >
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Dot() {
  return <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--dima)]" />;
}
