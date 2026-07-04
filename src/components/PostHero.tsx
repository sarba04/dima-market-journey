import { useEffect, useRef } from "react";
import { Nfc, Banknote, ShieldCheck } from "lucide-react";
import { IMG } from "@/lib/images";
import { BUSINESS, whatsappHref } from "@/lib/business";
import { CountUp } from "./CountUp";
import { ParallaxImage } from "./ParallaxImage";
import { CinematicGallery } from "./CinematicGallery";
import { useTilt } from "@/hooks/use-tilt";
import { useReducedMotion } from "@/lib/useReducedMotion";
import dimaMLogo from "@/assets/dima-m-logo-transparent.png";

const RAYONS = [
  { name: "Alimentation", ar: "المواد الغذائية", img: IMG.aisleEpicerie, desc: "Épicerie salée & sucrée, produits frais, essentiels du quotidien soigneusement sélectionnés." },
  { name: "Boissons", ar: "مشروبات", img: IMG.aisleDrinks, desc: "Eaux minérales, jus pressés, sodas et boissons chaudes servis à la bonne température." },
  { name: "Biscuits & Confiserie", ar: "حلويات وبسكويت", img: IMG.aisleBiscuits, desc: "Marques marocaines et importées, chocolats fins, gourmandises pour toutes les envies." },
  { name: "Boulangerie", ar: "مخبوزات", img: IMG.bakery, desc: "Pain frais, viennoiseries dorées et pâtisseries préparées sur place chaque matin." },
  { name: "Produits importés", ar: "منتجات مستوردة", img: IMG.aisleEpicerie, desc: "Le meilleur d’ailleurs : sauces, spécialités, épiceries fines des cinq continents." },
  { name: "Snacks & Grignotage", ar: "وجبات خفيفة", img: IMG.aisleSnacks, desc: "Chips, gaufrettes, encas salés et sucrés — pour les petits plaisirs improvisés." },
];

const ENGAGEMENTS = [
  { n: "01", t: "Sélection experte", d: "Chaque référence est goûtée, comparée, choisie. Nous refusons ce que nous ne consommerions pas." },
  { n: "02", t: "Fraîcheur quotidienne", d: "Livraisons matinales, boulangerie sur place, rotation stricte des stocks. Zéro compromis." },
  { n: "03", t: "Proximité vraie", d: "Une équipe qui vous reconnaît, vous conseille, retient vos habitudes." },
  { n: "04", t: "Made in Morocco", d: "Nous mettons en avant les producteurs marocains à côté des grandes marques internationales." },
];

const AVIS = [
  { n: "Salma B.", r: "★★★★★", t: "Le meilleur quartier a enfin sa supérette. Propre, bien rangée, personnel adorable." },
  { n: "Karim L.", r: "★★★★★", t: "La boulangerie est bluffante. Croissants au niveau des grandes enseignes." },
  { n: "Yasmine A.", r: "★★★★★", t: "On trouve des produits qu’on ne voit nulle part ailleurs. C’est devenu mon rendez-vous du samedi." },
  { n: "Mehdi R.", r: "★★★★★", t: "Ouvert tard, toujours frais, prix corrects. Rien à redire." },
];

const FAQ = [
  { q: "Où êtes-vous situés ?", a: "À Tabriquet, Salé — à une minute de la poste de Tabriquet, avec un parking accessible et une entrée piétonne à double battant." },
  { q: "Quels sont vos horaires ?", a: "Tous les jours de 7h30 à 23h00. Boulangerie ouverte dès 6h30." },
  { q: "Proposez-vous la livraison ?", a: "Oui, livraison locale via téléphone. Commande minimum 100 MAD." },
  { q: "Acceptez-vous la carte bancaire ?", a: "Bien sûr. Cartes locales et internationales, ainsi que les paiements sans contact." },
  { q: "Avez-vous des produits sans gluten / bio ?", a: "Une sélection dédiée est disponible en rayon épicerie fine — demandez à notre équipe." },
];

const TRUST_POINTS = [
  { t: "06:30", d: "Boulangerie fraîche chaque matin" },
  { t: "07j/7", d: "Ouvert tous les jours" },
  { t: "Local", d: "Livraison de proximité" },
];

const PAYMENT_METHODS = [
  {
    name: "Visa",
    desc: "Carte bancaire",
    mark: <span className="font-display text-xl font-bold italic tracking-tight text-[#1A1F71]">VISA</span>,
  },
  {
    name: "Mastercard",
    desc: "Carte bancaire",
    mark: (
      <span className="relative flex h-7 w-11 items-center justify-center">
        <span className="absolute left-0 h-7 w-7 rounded-full bg-[#EB001B]" />
        <span className="absolute right-0 h-7 w-7 rounded-full bg-[#F79E1B] mix-blend-multiply" />
      </span>
    ),
  },
  {
    name: "Sans contact",
    desc: "NFC / Apple Pay",
    mark: <Nfc className="h-7 w-7 text-neutral-700" strokeWidth={1.5} />,
  },
  {
    name: "CMI",
    desc: "Monétique MA",
    mark: (
      <span className="rounded-md bg-[#0B4EA2] px-2.5 py-1 font-display text-sm font-bold text-white">
        CMI
      </span>
    ),
  },
  {
    name: "Wafacash",
    desc: "Transfert mobile",
    mark: (
      <span className="rounded-md bg-[#F58220] px-2 py-1 text-center font-display text-[11px] font-bold leading-tight text-white">
        Wafa<br />cash
      </span>
    ),
  },
  {
    name: "CashPlus",
    desc: "Transfert mobile",
    mark: (
      <span className="rounded-md bg-[#C8102E] px-2 py-1 font-display text-xs font-bold text-white">
        Cash Plus
      </span>
    ),
  },
  {
    name: "Espèces",
    desc: "En caisse",
    mark: <Banknote className="h-7 w-7 text-neutral-700" strokeWidth={1.5} />,
  },
];

function RayonCard({ r, i }: { r: (typeof RAYONS)[number]; i: number }) {
  const tiltRef = useTilt<HTMLElement>(6);
  return (
    <article
      ref={tiltRef}
      className={`reveal reveal-delay-${(i % 4) + 1} tilt-card group relative overflow-hidden rounded-2xl border border-black/5 bg-black/[0.02] hover:border-[color:var(--dima)]/40`}
    >
      <div className="parallax-frame relative aspect-[4/5] overflow-hidden">
        <ParallaxImage src={r.img} alt={r.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
        <div className="absolute left-5 top-5 font-mono-tight text-[10px] uppercase tracking-[0.35em] text-[color:var(--dima)]">
          {r.ar}
        </div>
        <div className="absolute right-5 top-5 font-mono-tight text-[10px] tracking-[0.3em] text-neutral-400">
          {String(i + 1).padStart(2, "0")}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-display text-3xl tracking-[-0.02em] text-neutral-900">{r.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">{r.desc}</p>
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
              <CountUp to={BUSINESS.reviewCountValue} suffix="+ avis clients" />
            </div>
          </div>
          {TRUST_POINTS.map((p, i) => (
            <div key={p.d} className={`reveal reveal-delay-${((i + 1) % 4) + 1} text-center sm:text-left`}>
              <div className="font-display text-2xl tracking-[-0.02em] text-[color:var(--dima)] sm:text-3xl">
                {p.t}
              </div>
              <div className="mt-1 font-mono-tight text-[9px] uppercase tracking-[0.25em] text-neutral-500 sm:text-[10px]">
                {p.d}
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
              Le manifeste
            </span>
          </div>
          <h2 className="reveal reveal-delay-1 font-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.95] tracking-[-0.03em] text-neutral-900">
            Une supérette ne devrait <em className="not-italic dima-glow-text">jamais</em> être ordinaire.
          </h2>
          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <p className="reveal reveal-delay-2 text-lg leading-relaxed text-neutral-600 md:text-xl">
              DIMA M Market est né d’une conviction simple : le quotidien mérite mieux qu’un
              néon blafard et des rayons anonymes. Nous avons pensé chaque détail comme
              une expérience — la lumière, la circulation, la sélection, le service.
            </p>
            <p className="reveal reveal-delay-3 text-lg leading-relaxed text-neutral-600 md:text-xl">
              Le résultat est un lieu à part. Une supérette où l’on entre pour un pain
              et où l’on ressort avec l’envie de revenir. Bienvenue chez DIMA M — bienvenue
              chez vous.
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
                  Nos rayons
                </span>
              </div>
              <h2 className="reveal reveal-cinematic font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] tracking-[-0.03em] text-neutral-900">
                Tout, sous un même toit.
              </h2>
            </div>
            <p className="reveal reveal-delay-2 max-w-md text-neutral-600">
              Six univers pensés pour vous faire gagner du temps sans sacrifier la qualité.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {RAYONS.map((r, i) => (
              <RayonCard key={r.name} r={r} i={i} />
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
                Pourquoi choisir DIMA M
              </span>
            </div>
            <h2 className="reveal reveal-cinematic font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] tracking-[-0.03em] text-neutral-900">
              Quatre engagements. <br />
              <em className="not-italic text-neutral-400">Zéro compromis.</em>
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
                <h3 className="font-display text-2xl leading-tight tracking-[-0.02em] text-neutral-900">{e.t}</h3>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">{e.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Le fondateur */}
      <section id="fondateur" className="relative border-t border-black/5 px-6 pb-40 pt-32 md:px-16 md:pb-64 md:pt-48">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <div className="reveal">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <img
                src={IMG.staffEpicerie}
                alt="Mohammed El Abd, fondateur de DIMA M Market"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="reveal reveal-delay-2">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-[color:var(--dima)]" />
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-neutral-500">
                Le fondateur
              </span>
            </div>
            <blockquote className="font-display text-2xl leading-snug tracking-[-0.01em] text-neutral-900 md:text-3xl">
              « J'ai ouvert DIMA M pour une raison simple : offrir à mon quartier un
              magasin où chacun se sent reçu, respecté, servi comme un proche.
              <br />
              <br />
              Ici, chaque produit est choisi à la main. Chaque bonjour est sincère.
              Le commerce, c'est d'abord un lien humain. »
            </blockquote>
            <div className="mt-8">
              <div className="font-display text-xl text-neutral-900">Mohammed El Abd</div>
              <div className="mt-1 font-mono-tight text-[10px] uppercase tracking-[0.3em] text-[color:var(--dima)]">
                Fondateur · DIMA M Market, Salé
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
                Nous rendre visite
              </span>
            </div>
            <h2 className="reveal reveal-cinematic font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] text-neutral-900">
              Ouvert quand vous en avez besoin.
            </h2>
            <div className="mt-12 space-y-4 border-t border-black/10">
              {BUSINESS.hours.map(([d, h]) => (
                <div
                  key={d}
                  className="flex items-baseline justify-between border-b border-black/10 pb-4 pt-2"
                >
                  <span className="font-mono-tight text-xs uppercase tracking-[0.3em] text-neutral-500">
                    {d}
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
                    Téléphone
                  </div>
                  <div className="mt-1 font-display text-xl text-neutral-900">{BUSINESS.phoneDisplay}</div>
                </span>
                <Arrow />
              </a>
              <a
                href={whatsappHref("Bonjour, je voudrais passer une commande chez DIMA M Market.")}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-between rounded-xl border border-[color:var(--dima)]/40 bg-[color:var(--dima)]/10 px-5 py-4 transition-colors hover:bg-[color:var(--dima)]/20"
              >
                <span>
                  <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-[color:var(--dima)]">
                    Livraison
                  </div>
                  <div className="mt-1 font-display text-xl text-neutral-900">Commander sur WhatsApp</div>
                </span>
                <Arrow />
              </a>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-black/10">
            <iframe
              title="Localisation DIMA M Market"
              src={BUSINESS.mapsEmbedSrc}
              className="h-full min-h-[420px] w-full grayscale-[0.6] contrast-[1.1]"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
            <div className="pointer-events-none absolute bottom-6 left-6 rounded-xl glass px-4 py-3">
              <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-white/60">
                DIMA M Market
              </div>
              <div className="font-display text-lg text-white">{BUSINESS.addressLabel}</div>
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
                Paiement
              </span>
            </div>
            <h2 className="reveal reveal-cinematic font-display text-[clamp(2.25rem,5vw,4rem)] leading-[0.95] tracking-[-0.03em] text-neutral-900">
              Payez comme vous le souhaitez.
            </h2>
            <p className="reveal reveal-delay-2 mt-6 text-lg leading-relaxed text-neutral-600">
              Toutes les méthodes courantes acceptées en caisse. Rapidement, sans complication.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {PAYMENT_METHODS.map((m, i) => (
              <div
                key={m.name}
                className={`reveal reveal-delay-${(i % 4) + 1} card-lift flex flex-col items-center gap-4 rounded-2xl border border-black/10 bg-white px-4 py-6 text-center`}
              >
                <div className="flex h-10 items-center justify-center">{m.mark}</div>
                <div>
                  <div className="font-display text-base text-neutral-900">{m.name}</div>
                  <div className="mt-1 font-mono-tight text-[9px] uppercase tracking-[0.25em] text-neutral-400">
                    {m.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="reveal reveal-delay-3 mt-12 flex flex-wrap items-center gap-3 border-t border-black/10 pt-8 text-neutral-500">
            <ShieldCheck className="h-5 w-5 text-[color:var(--dima)]" strokeWidth={1.75} />
            <p className="font-mono-tight text-[11px] uppercase tracking-[0.2em]">
              Paiements 100% sécurisés — Commerce agréé · RC Salé — Conforme réglementation ANSS Maroc.
            </p>
          </div>
        </div>
      </section>

      {/* Avis */}
      <section className="relative border-y border-black/5 bg-black/[0.015] px-6 py-32 md:px-16 md:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <h2 className="reveal reveal-cinematic font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] text-neutral-900">
              Ils reviennent. <em className="not-italic dima-glow-text">Souvent.</em>
            </h2>
            <div className="reveal reveal-delay-2 font-mono-tight text-[11px] uppercase tracking-[0.3em] text-neutral-500">
              <CountUp to={BUSINESS.ratingValue} decimals={1} /> / 5 — <CountUp to={BUSINESS.reviewCountValue} suffix="+ avis" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {AVIS.map((a, i) => (
              <blockquote
                key={a.n}
                className={`reveal reveal-delay-${(i % 4) + 1} card-lift rounded-2xl border border-black/10 bg-white p-6`}
              >
                <div className="text-[color:var(--dima)]">{a.r}</div>
                <p className="mt-4 text-neutral-800">« {a.t} »</p>
                <footer className="mt-6 font-mono-tight text-[10px] uppercase tracking-[0.3em] text-neutral-500">
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
                FAQ
              </span>
            </div>
            <h2 className="reveal reveal-cinematic font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.03em] text-neutral-900">
              Les questions <br /> qu’on nous pose.
            </h2>
          </div>
          <div className="divide-y divide-black/10 border-y border-black/10">
            {FAQ.map((f, i) => (
              <details key={i} className={`reveal reveal-delay-${(i % 4) + 1} group py-6`}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                  <span className="font-display text-xl text-neutral-900 md:text-2xl">{f.q}</span>
                  <span className="mt-1 font-mono-tight text-xs text-[color:var(--dima)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-neutral-600">{f.a}</p>
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
              Passez <br />
              <em className="not-italic dima-glow-text">nous voir.</em>
            </h2>
            <div>
              <p className="reveal reveal-delay-2 text-lg text-neutral-600">
                Un thé, un conseil, une découverte : chez DIMA M Market, on ne fait pas que
                vendre — on reçoit.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={whatsappHref("Bonjour, je voudrais passer une commande chez DIMA M Market.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-glow inline-flex items-center gap-3 rounded-full bg-[color:var(--dima)] px-6 py-3 text-sm font-medium text-[color:var(--ink)] transition-transform hover:scale-[1.03]"
                >
                  Commander sur WhatsApp <Arrow dark />
                </a>
                <a
                  href={BUSINESS.phoneHref}
                  className="inline-flex items-center gap-3 rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-black/5"
                >
                  Appeler le magasin <Arrow />
                </a>
                <a
                  href="#rayons"
                  className="link-sweep inline-flex items-center gap-2 self-center px-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Explorer les rayons
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
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
                Une supérette moderne à Tabriquet, Salé. Alimentation, boulangerie,
                produits importés — servis avec exigence, chaque jour.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={whatsappHref("Bonjour, je vous contacte depuis le site DIMA M Market.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--dima)] px-4 py-2 text-xs font-medium text-[color:var(--ink)] transition-transform hover:scale-[1.03]"
                >
                  WhatsApp
                </a>
                <a
                  href={BUSINESS.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10"
                >
                  Appeler
                </a>
                <a
                  href="#visiter"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10"
                >
                  Itinéraire
                </a>
              </div>
            </div>

            <div>
              <div className="font-mono-tight text-[10px] uppercase tracking-[0.35em] text-white/40">
                Explorer
              </div>
              <ul className="mt-5 space-y-3 text-sm text-white/70">
                <li><a href="#manifeste" className="hover:text-[color:var(--dima)]">Manifeste</a></li>
                <li><a href="#rayons" className="hover:text-[color:var(--dima)]">Rayons</a></li>
                <li><a href="#engagements" className="hover:text-[color:var(--dima)]">Engagements</a></li>
                <li><a href="#visiter" className="hover:text-[color:var(--dima)]">Nous rendre visite</a></li>
              </ul>
            </div>

            <div>
              <div className="font-mono-tight text-[10px] uppercase tracking-[0.35em] text-white/40">
                Horaires
              </div>
              <ul className="mt-5 space-y-3 text-sm text-white/70">
                {BUSINESS.hours.map(([d, h]) => (
                  <li key={d} className="flex justify-between gap-4">
                    <span>{d}</span>
                    <span className={d === "Boulangerie" ? "text-[color:var(--dima)]" : "text-white/50"}>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-mono-tight text-[10px] uppercase tracking-[0.35em] text-white/40">
                Contact
              </div>
              <ul className="mt-5 space-y-3 text-sm text-white/70">
                <li>{BUSINESS.addressLabel}</li>
                <li><a href={BUSINESS.phoneHref} className="hover:text-[color:var(--dima)]">{BUSINESS.phoneDisplay}</a></li>
                <li><a href={`mailto:${BUSINESS.email}`} className="hover:text-[color:var(--dima)]">{BUSINESS.email}</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
            <span className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-white/40">
              © {new Date().getFullYear()} DIMA M Market — Tous droits réservés
            </span>
            <span className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-white/40">
              Une expérience. Pas juste une supérette.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Arrow({ dark = false }: { dark?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={dark ? "text-[color:var(--ink)]" : "text-neutral-900"}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Dot() {
  return <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--dima)]" />;
}
