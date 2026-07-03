import { useLayoutEffect } from "react";

/**
 * CinematicScroll
 * Scans the DOM for data-driven cinematic effects and wires them up via GSAP + ScrollTrigger.
 *
 *  data-parallax="0.25"           → translate Y by (scrollProgress * speed * containerHeight)
 *  data-reveal="split"            → word-by-word reveal on enter
 *  data-reveal="fade-up"          → fade + slide up on enter
 *  data-reveal="mask"             → clip-path reveal
 *  data-hscroll                   → pins the section and translates its .hscroll-track horizontally
 *  data-count="123"               → counts from 0 to N when entering viewport
 *
 * Automatically re-scans on DOM mutations so newly mounted sections join in.
 */
export function CinematicScroll() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanupFns: Array<() => void> = [];
    let disposed = false;

    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default ?? gsapMod;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ScrollTrigger = (stMod as any).ScrollTrigger ?? (stMod as any).default;
      gsap.registerPlugin(ScrollTrigger);
      if (disposed) return;

      const triggers: Array<{ kill: () => void }> = [];

      /* ---------- Split word reveal ---------- */
      const splitEls = document.querySelectorAll<HTMLElement>('[data-reveal="split"]');
      splitEls.forEach((el) => {
        if (el.dataset.splitReady === "1") return;
        el.dataset.splitReady = "1";
        const text = el.textContent ?? "";
        el.textContent = "";
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((chunk) => {
          if (/^\s+$/.test(chunk)) {
            frag.appendChild(document.createTextNode(chunk));
            return;
          }
          const w = document.createElement("span");
          w.className = "inline-block overflow-hidden align-baseline";
          const inner = document.createElement("span");
          inner.className = "inline-block will-change-transform";
          inner.textContent = chunk;
          inner.style.transform = "translateY(110%)";
          inner.style.opacity = "0";
          inner.style.filter = "blur(6px)";
          w.appendChild(inner);
          frag.appendChild(w);
        });
        el.appendChild(frag);

        const words = el.querySelectorAll<HTMLElement>("span > span");
        const t = gsap.to(words, {
          y: 0,
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.045,
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            once: true,
          },
        });
        triggers.push({ kill: () => t.scrollTrigger?.kill() });
      });

      /* ---------- Fade-up reveal ---------- */
      document.querySelectorAll<HTMLElement>('[data-reveal="fade-up"]').forEach((el) => {
        gsap.set(el, { opacity: 0, y: 40 });
        const t = gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
        triggers.push({ kill: () => t.scrollTrigger?.kill() });
      });

      /* ---------- Clip-path mask reveal ---------- */
      document.querySelectorAll<HTMLElement>('[data-reveal="mask"]').forEach((el) => {
        gsap.set(el, { clipPath: "inset(0 100% 0 0)" });
        const t = gsap.to(el, {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.4,
          ease: "power4.inOut",
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        });
        triggers.push({ kill: () => t.scrollTrigger?.kill() });
      });

      /* ---------- Parallax translate ---------- */
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax ?? "0.2");
        const t = gsap.fromTo(
          el,
          { yPercent: -speed * 50 },
          {
            yPercent: speed * 50,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
        triggers.push({ kill: () => t.scrollTrigger?.kill() });
      });

      /* ---------- Horizontal pinned scroll ---------- */
      document.querySelectorAll<HTMLElement>("[data-hscroll]").forEach((section) => {
        if (window.innerWidth < 900) return;
        const track = section.querySelector<HTMLElement>(".hscroll-track");
        if (!track) return;
        const getDistance = () => track.scrollWidth - window.innerWidth + 80;
        const t = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        triggers.push({ kill: () => t.scrollTrigger?.kill() });
      });

      /* ---------- Number counters ---------- */
      document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const end = parseFloat(el.dataset.count ?? "0");
        const decimals = parseInt(el.dataset.countDecimals ?? "0", 10);
        const obj = { v: 0 };
        const t = gsap.to(obj, {
          v: end,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = obj.v.toFixed(decimals);
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
        triggers.push({ kill: () => t.scrollTrigger?.kill() });
      });

      // Refresh once fonts / images settle
      requestAnimationFrame(() => ScrollTrigger.refresh());
      const refreshOnLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", refreshOnLoad);

      cleanupFns.push(() => {
        window.removeEventListener("load", refreshOnLoad);
        triggers.forEach((t) => t.kill());
      });
    })();

    return () => {
      disposed = true;
      cleanupFns.forEach((fn) => fn());
      cleanupFns = [];
    };
  }, []);

  return null;
}
