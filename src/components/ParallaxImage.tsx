import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Renders just the <img> — the caller's wrapper needs `overflow-hidden` and
// `position: relative` (the `.parallax-frame` utility provides both) so this
// image can drift beyond the frame without exposing edges.
export function ParallaxImage({
  src,
  alt = "",
  className = "",
  strength = 14,
}: {
  src: string;
  alt?: string;
  className?: string;
  strength?: number;
}) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || typeof window === "undefined" || !imgRef.current) return;
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default ?? gsapMod;
      const ScrollTrigger = (stMod as any).ScrollTrigger ?? (stMod as any).default;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          imgRef.current,
          { yPercent: -strength },
          {
            yPercent: strength,
            ease: "none",
            scrollTrigger: {
              trigger: imgRef.current?.parentElement ?? imgRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    })();

    return () => ctx?.revert();
  }, [reducedMotion, strength]);

  return <img ref={imgRef} src={src} alt={alt} loading="lazy" decoding="async" className={className} />;
}
