import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { IMG } from "@/lib/images";

const PANELS = [
  { src: IMG.facadeWide, label: "La façade" },
  { src: IMG.facadeEntrance, label: "L'entrée" },
  { src: IMG.staffEpicerie, label: "L'équipe" },
  { src: IMG.bakery, label: "La boulangerie" },
  { src: IMG.customers, label: "Nos clients" },
  { src: IMG.staffHygiene, label: "Hygiène & loisirs" },
  { src: IMG.aisleDrinks, label: "Rayon boissons" },
];

function GalleryHeading() {
  return (
    <div className="reveal max-w-2xl">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px w-10 bg-[color:var(--dima)]" />
        <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-white/60">Galerie</span>
      </div>
      <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-[-0.03em] text-white">
        Le magasin en images.
      </h2>
    </div>
  );
}

// A pinned, horizontally-scrolling sequence — the body's one big cinematic
// set-piece, echoing the hero's scroll-driven camera language instead of a
// static grid of photos.
export function CinematicGallery() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || typeof window === "undefined") return;
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default ?? gsapMod;
      const ScrollTrigger = (stMod as any).ScrollTrigger ?? (stMod as any).default;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });

      ctx = gsap.context(() => {
        const track = trackRef.current;
        if (!track) return;
        const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${getDistance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, sectionRef);
    })();

    return () => ctx?.revert();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="relative px-6 py-32 md:px-16 md:py-48">
        <div className="mx-auto max-w-7xl">
          <GalleryHeading />
          <div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {PANELS.map((p) => (
              <div key={p.label} className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <img src={p.src} alt={p.label} loading="lazy" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-6 pt-16 md:px-16 md:pt-20">
        <GalleryHeading />
      </div>
      <div ref={trackRef} className="flex h-full w-max items-center gap-4 px-6 will-change-transform md:gap-6 md:px-16">
        {PANELS.map((p, i) => (
          <div
            key={p.label}
            className="relative h-[58vh] w-[74vw] shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:w-[46vw] md:h-[62vh] md:w-[32vw]"
          >
            <img
              src={p.src}
              alt={p.label}
              loading={i < 2 ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 flex items-center gap-3">
              <span className="font-mono-tight text-[10px] tracking-[0.3em] text-[color:var(--dima)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-white/70">
                {p.label}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] grain" />
    </section>
  );
}
