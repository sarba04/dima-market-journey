import { LogoMark } from "./DimaHero";
import { IMG } from "@/lib/images";

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
  { q: "Où êtes-vous situés ?", a: "En plein cœur du quartier, avec un parking accessible et une entrée piétonne à double battant." },
  { q: "Quels sont vos horaires ?", a: "Tous les jours de 7h30 à 23h00. Boulangerie ouverte dès 6h30." },
  { q: "Proposez-vous la livraison ?", a: "Oui, livraison locale via téléphone. Commande minimum 100 MAD." },
  { q: "Acceptez-vous la carte bancaire ?", a: "Bien sûr. Cartes locales et internationales, ainsi que les paiements sans contact." },
  { q: "Avez-vous des produits sans gluten / bio ?", a: "Une sélection dédiée est disponible en rayon épicerie fine — demandez à notre équipe." },
];

export function PostHero() {
  return (
    <div className="relative bg-background text-foreground">
      {/* Manifesto */}
      <section className="relative border-t border-white/5 px-6 py-32 md:px-16 md:py-48">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center gap-3">
            <span className="h-px w-10 bg-[color:var(--dima)]" />
            <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-white/60">
              Le manifeste
            </span>
          </div>
          <h2 className="font-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.95] tracking-[-0.03em]">
            Une supérette ne devrait <em className="not-italic dima-glow-text">jamais</em> être ordinaire.
          </h2>
          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <p className="text-lg leading-relaxed text-white/70 md:text-xl">
              DIMA Market est né d’une conviction simple : le quotidien mérite mieux qu’un
              néon blafard et des rayons anonymes. Nous avons pensé chaque détail comme
              une expérience — la lumière, la circulation, la sélection, le service.
            </p>
            <p className="text-lg leading-relaxed text-white/70 md:text-xl">
              Le résultat est un lieu à part. Une supérette où l’on entre pour un pain
              et où l’on ressort avec l’envie de revenir. Bienvenue chez DIMA — bienvenue
              chez vous.
            </p>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="relative overflow-hidden border-y border-white/5 py-16">
        <div className="marquee-track flex w-max items-center gap-16 whitespace-nowrap font-display text-[clamp(3rem,10vw,10rem)] leading-none tracking-[-0.04em] text-white/10">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-16">
              <span>DIMA Market</span>
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
      </section>

      {/* Rayons */}
      <section id="rayons" className="relative px-6 py-32 md:px-16 md:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-10 bg-[color:var(--dima)]" />
                <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-white/60">
                  Nos rayons
                </span>
              </div>
              <h2 className="font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] tracking-[-0.03em]">
                Tout, sous un même toit.
              </h2>
            </div>
            <p className="max-w-md text-white/60">
              Six univers pensés pour vous faire gagner du temps sans sacrifier la qualité.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {RAYONS.map((r) => (
              <article
                key={r.name}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-colors hover:border-[color:var(--dima)]/40"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={r.img}
                    alt={r.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute left-5 top-5 font-mono-tight text-[10px] uppercase tracking-[0.35em] text-[color:var(--dima)]">
                    {r.ar}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-3xl tracking-[-0.02em]">{r.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{r.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="relative border-y border-white/5 bg-white/[0.015] px-6 py-32 md:px-16 md:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-[color:var(--dima)]" />
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-white/60">
                Pourquoi choisir DIMA
              </span>
            </div>
            <h2 className="font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] tracking-[-0.03em]">
              Quatre engagements. <br />
              <em className="not-italic text-white/40">Zéro compromis.</em>
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-2 lg:grid-cols-4">
            {ENGAGEMENTS.map((e) => (
              <div key={e.n} className="group bg-background p-8 transition-colors hover:bg-white/[0.03]">
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-mono-tight text-xs tracking-[0.3em] text-[color:var(--dima)]">
                    {e.n}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[color:var(--dima)] shadow-[0_0_18px_var(--dima)]" />
                </div>
                <h3 className="font-display text-2xl leading-tight tracking-[-0.02em]">{e.t}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/60">{e.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="relative overflow-hidden px-6 py-32 md:px-16 md:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-[color:var(--dima)]" />
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-white/60">
                Galerie
              </span>
            </div>
            <h2 className="font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] tracking-[-0.03em]">
              Le magasin en images.
            </h2>
          </div>
          <div className="grid grid-cols-6 gap-3 md:gap-4">
            <GalleryTile src={IMG.facadeWide} className="col-span-6 aspect-[16/9] md:col-span-4" />
            <GalleryTile src={IMG.facadeEntrance} className="col-span-3 aspect-square md:col-span-2" />
            <GalleryTile src={IMG.aisleDrinks} className="col-span-3 aspect-square md:col-span-2" />
            <GalleryTile src={IMG.bakery} className="col-span-6 aspect-[21/9] md:col-span-4" />
            <GalleryTile src={IMG.aisleBiscuits} className="col-span-3 aspect-[4/5] md:col-span-2" />
            <GalleryTile src={IMG.customers} className="col-span-3 aspect-[4/5] md:col-span-2" />
            <GalleryTile src={IMG.interiorAisle} className="col-span-6 aspect-[16/9] md:col-span-4" />
          </div>
        </div>
      </section>

      {/* Horaires + Localisation */}
      <section id="visiter" className="relative border-t border-white/5 px-6 py-32 md:px-16 md:py-48">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-[color:var(--dima)]" />
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-white/60">
                Nous rendre visite
              </span>
            </div>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em]">
              Ouvert quand vous en avez besoin.
            </h2>
            <div className="mt-12 space-y-4 border-t border-white/10">
              {[
                ["Lundi — Vendredi", "07:30 — 23:00"],
                ["Samedi", "07:30 — 23:30"],
                ["Dimanche", "08:00 — 22:00"],
                ["Boulangerie", "Dès 06:30"],
              ].map(([d, h]) => (
                <div
                  key={d}
                  className="flex items-baseline justify-between border-b border-white/10 pb-4 pt-2"
                >
                  <span className="font-mono-tight text-xs uppercase tracking-[0.3em] text-white/60">
                    {d}
                  </span>
                  <span className="font-display text-2xl">{h}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              <a
                href="tel:+212000000000"
                className="group relative flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 transition-colors hover:border-[color:var(--dima)]/60"
              >
                <span>
                  <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-white/50">
                    Téléphone
                  </div>
                  <div className="mt-1 font-display text-xl">+212 — DIMA</div>
                </span>
                <Arrow />
              </a>
              <a
                href="#contact"
                className="group relative flex items-center justify-between rounded-xl border border-[color:var(--dima)]/40 bg-[color:var(--dima)]/10 px-5 py-4 transition-colors hover:bg-[color:var(--dima)]/20"
              >
                <span>
                  <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-[color:var(--dima)]">
                    Livraison
                  </div>
                  <div className="mt-1 font-display text-xl">Commander</div>
                </span>
                <Arrow />
              </a>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/10">
            <iframe
              title="Localisation DIMA Market"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-7.65%2C33.55%2C-7.55%2C33.62&amp;layer=mapnik"
              className="h-full min-h-[420px] w-full grayscale-[0.6] contrast-[1.1]"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/30" />
            <div className="pointer-events-none absolute bottom-6 left-6 rounded-xl glass px-4 py-3">
              <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-white/60">
                DIMA Market
              </div>
              <div className="font-display text-lg">Casablanca, Maroc</div>
            </div>
          </div>
        </div>
      </section>

      {/* Avis */}
      <section className="relative border-y border-white/5 bg-white/[0.015] px-6 py-32 md:px-16 md:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em]">
              Ils reviennent. <em className="not-italic dima-glow-text">Souvent.</em>
            </h2>
            <div className="font-mono-tight text-[11px] uppercase tracking-[0.3em] text-white/60">
              4.9 / 5 — 340+ avis
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {AVIS.map((a) => (
              <blockquote
                key={a.n}
                className="rounded-2xl border border-white/10 bg-background p-6"
              >
                <div className="text-[color:var(--dima)]">{a.r}</div>
                <p className="mt-4 text-white/80">« {a.t} »</p>
                <footer className="mt-6 font-mono-tight text-[10px] uppercase tracking-[0.3em] text-white/50">
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
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-[color:var(--dima)]" />
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-white/60">
                FAQ
              </span>
            </div>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.03em]">
              Les questions <br /> qu’on nous pose.
            </h2>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {FAQ.map((f, i) => (
              <details key={i} className="group py-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                  <span className="font-display text-xl md:text-2xl">{f.q}</span>
                  <span className="mt-1 font-mono-tight text-xs text-[color:var(--dima)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-white/60">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + Footer */}
      <section id="contact" className="relative overflow-hidden border-t border-white/5 px-6 py-32 md:px-16 md:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-end">
            <h2 className="font-display text-[clamp(3rem,10vw,10rem)] leading-[0.9] tracking-[-0.04em]">
              Passez <br />
              <em className="not-italic dima-glow-text">nous voir.</em>
            </h2>
            <div>
              <p className="text-lg text-white/70">
                Un thé, un conseil, une découverte : chez DIMA Market, on ne fait pas que
                vendre — on reçoit.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="tel:+212000000000"
                  className="inline-flex items-center gap-3 rounded-full bg-[color:var(--dima)] px-6 py-3 text-sm font-medium text-[color:var(--ink)] transition-transform hover:scale-[1.03]"
                >
                  Appeler le magasin <Arrow dark />
                </a>
                <a
                  href="#rayons"
                  className="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/10"
                >
                  Explorer les rayons <Arrow />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-12 md:px-16">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <LogoMark className="h-7 w-7 text-[color:var(--dima)]" />
            <span className="font-mono-tight text-[11px] uppercase tracking-[0.3em] text-white/60">
              DIMA Market — © {new Date().getFullYear()}
            </span>
          </div>
          <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-white/40">
            Une expérience. Pas juste une supérette.
          </div>
        </div>
      </footer>
    </div>
  );
}

function GalleryTile({ src, className = "" }: { src: string; className?: string }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl ${className}`}>
      <img
        src={src}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
}

function Arrow({ dark = false }: { dark?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={dark ? "text-[color:var(--ink)]" : "text-white"}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Dot() {
  return <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--dima)]" />;
}
