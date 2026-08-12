import { IMG } from "@/lib/images";
import { useLanguage } from "@/lib/language";

const PANELS = [
  { src: IMG.facadeWide, label: { fr: "La façade", ar: "الواجهة" } },
  { src: IMG.facadeEntrance, label: { fr: "L'entrée", ar: "المدخل" } },
  { src: IMG.staffEpicerie, label: { fr: "L'équipe", ar: "الفريق" } },
  { src: IMG.bakery, label: { fr: "La boulangerie", ar: "المخبزة" } },
  { src: IMG.customers, label: { fr: "Nos clients", ar: "زبناؤنا" } },
  { src: IMG.staffHygiene, label: { fr: "Hygiène & loisirs", ar: "نظافة وترفيه" } },
  { src: IMG.aisleDrinks, label: { fr: "Rayon boissons", ar: "قسم المشروبات" } },
];

const TEXT = {
  fr: { label: "Galerie", heading: "Le magasin en images." },
  ar: { label: "معرض الصور", heading: "المتجر في صور." },
} as const;

// Compact photo grid — replaces the old pinned horizontal track, which
// reserved a multi-screen scroll spacer and left a large empty gap right
// after the founder section.
export function CinematicGallery() {
  const { lang } = useLanguage();
  const t = TEXT[lang];

  return (
    <section className="relative bg-background px-5 py-16 md:px-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="reveal max-w-2xl" dir={lang === "ar" ? "rtl" : "ltr"}>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-[color:var(--dima)]" />
            <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-white/60">{t.label}</span>
          </div>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-[-0.03em] text-white">
            {t.heading}
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-4 md:gap-4">
          {PANELS.map((p, i) => (
            <div
              key={p.label.fr}
              className={`card-lift reveal relative overflow-hidden rounded-2xl border border-white/10 ${
                i === 0 ? "col-span-2 aspect-[16/10] md:row-span-2 md:aspect-auto md:min-h-[420px]" : "aspect-[4/5]"
              }`}
            >
              <img
                src={p.src}
                alt={p.label[lang]}
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent" />
              <div
                className="absolute bottom-4 left-4 flex items-center gap-2"
                dir={lang === "ar" ? "rtl" : "ltr"}
              >
                <span className="font-mono-tight text-[10px] tracking-[0.3em] text-[color:var(--dima)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-white/75">
                  {p.label[lang]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
