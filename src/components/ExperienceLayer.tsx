import { useEffect, useRef, useState } from "react";
import { ALL_IMAGES } from "@/lib/images";
import { SCENE_COUNT, LogoMark } from "./DimaHero";

/* ------------------------------------------------------------------ */
/* Intro Preloader — cinematic splash, no counter                      */
/* ------------------------------------------------------------------ */
export function IntroPreloader() {
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let count = 0;
    ALL_IMAGES.forEach((src) => {
      const im = new Image();
      im.decoding = "async";
      im.onload = im.onerror = () => {
        if (cancelled) return;
        count++;
        setLoaded(count);
        if (count >= ALL_IMAGES.length) {
          setTimeout(() => setReady(true), 300);
        }
      };
      im.src = src;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!dismissed) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }, [dismissed]);

  const pct = loaded / ALL_IMAGES.length;

  return (
    <div
      aria-hidden={dismissed}
      onClick={() => ready && setDismissed(true)}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-700 ${
        dismissed ? "pointer-events-none opacity-0" : "opacity-100"
      } ${ready ? "cursor-pointer" : ""}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center px-6">
        <LogoMark className="dima-logo-pulse h-14 w-14 text-[color:var(--dima)]" />

        <div className="mt-8 font-mono-tight text-[10px] uppercase tracking-[0.5em] text-white/60">
          DIMA • Market
        </div>

        <div className="mt-14 h-[2px] w-56 overflow-hidden bg-white/10 sm:w-72">
          <div
            className="h-full bg-[color:var(--dima)] transition-[width] duration-300 ease-out"
            style={{ width: `${pct * 100}%` }}
          />
        </div>

        <div className="mt-5 font-mono-tight text-[10px] uppercase tracking-[0.4em] text-white/40">
          {ready ? "Prêt" : "Préparation de la visite"}
        </div>

        <div
          className={`mt-12 transition-all duration-500 ${
            ready ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          <div className="group flex items-center gap-4 border border-white/20 px-6 py-3 hover:border-[color:var(--dima)] sm:px-8 sm:py-4">
            <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-white/80 group-hover:text-[color:var(--dima)]">
              Entrer dans l&apos;expérience
            </span>
            <span className="h-px w-6 bg-white/40 group-hover:bg-[color:var(--dima)] sm:w-8" />
            <span className="text-white/80 group-hover:text-[color:var(--dima)]">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Top scroll progress bar (page-wide)                                 */
/* ------------------------------------------------------------------ */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const p = max > 0 ? h.scrollTop / max : 0;
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[2px] bg-white/5">
      <div
        ref={barRef}
        className="h-full origin-left bg-[color:var(--dima)] scale-x-0"
        style={{ transformOrigin: "0 50%" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Floating Nav — appears after hero                                   */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
  { label: "Manifeste", href: "#manifeste" },
  { label: "Rayons", href: "#rayons" },
  { label: "Engagements", href: "#engagements" },
  { label: "Visiter", href: "#visiter" },
];

export function FloatingNav() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onDone = () => setVisible(true);
    const onScene = (e: Event) => {
      const d = (e as CustomEvent).detail as { idx: number };
      if (d.idx >= SCENE_COUNT - 1) setVisible(true);
    };
    window.addEventListener("dima:heroDone", onDone);
    window.addEventListener("dima:scene", onScene);
    return () => {
      window.removeEventListener("dima:heroDone", onDone);
      window.removeEventListener("dima:scene", onScene);
    };
  }, []);

  return (
    <>
      <nav
        aria-label="Navigation principale"
        className={`fixed left-1/2 top-4 z-[90] w-[calc(100%-1.5rem)] max-w-[min(96vw,720px)] -translate-x-1/2 transition-all duration-500 sm:top-6 ${
          visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-4"
        }`}
      >
        <div className="glass flex items-center justify-between gap-1 rounded-full px-2 py-2">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[color:var(--dima)] hover:bg-white/5"
            aria-label="Retour au début"
          >
            <LogoMark className="h-5 w-5" />
          </a>
          <div className="mx-1 hidden h-5 w-px bg-white/10 sm:block" />
          <div className="hidden min-w-0 items-center gap-0.5 sm:flex">
            {NAV_ITEMS.map((it) => (
              <a
                key={it.href}
                href={it.href}
                className="shrink-0 rounded-full px-3 py-2 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-white/70 transition-colors hover:bg-white/5 hover:text-white sm:px-4"
              >
                {it.label}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Ouvrir le menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/80 hover:bg-white/5 sm:hidden"
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-300 ${open ? "translate-y-[6px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute bottom-0 left-0 h-px w-4 bg-current transition-transform duration-300 ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
        <div
          className={`glass mt-2 overflow-hidden rounded-2xl sm:hidden ${
            open ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 opacity-0"
          } transition-all duration-300`}
        >
          <div className="flex flex-col p-2">
            {NAV_ITEMS.map((it) => (
              <a
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 font-mono-tight text-[11px] uppercase tracking-[0.3em] text-white/80 hover:bg-white/5 hover:text-white"
              >
                {it.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Revenir au début"
        className={`fixed bottom-5 right-5 z-[90] flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-background/70 backdrop-blur-md transition-all duration-500 hover:border-[color:var(--dima)] hover:text-[color:var(--dima)] sm:bottom-6 sm:right-6 sm:h-12 sm:w-12 ${
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <span className="text-lg leading-none">↑</span>
      </button>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Scene HUD                                                           */
/* ------------------------------------------------------------------ */
export function SceneHUD() {
  const [scene, setScene] = useState<{ idx: number; name: string } | null>({
    idx: 0,
    name: "Chapitre 01 — Arrivée",
  });
  const [inHero, setInHero] = useState(true);

  useEffect(() => {
    const onScene = (e: Event) => {
      const d = (e as CustomEvent).detail as { idx: number; name: string };
      setScene({ idx: d.idx, name: d.name });
    };
    const onDone = () => setInHero(false);
    const onEnter = () => setInHero(true);
    window.addEventListener("dima:scene", onScene);
    window.addEventListener("dima:heroDone", onDone);
    window.addEventListener("dima:heroEnter", onEnter);
    return () => {
      window.removeEventListener("dima:scene", onScene);
      window.removeEventListener("dima:heroDone", onDone);
      window.removeEventListener("dima:heroEnter", onEnter);
    };
  }, []);

  if (!scene) return null;

  return (
    <div
      className={`pointer-events-none fixed bottom-20 left-4 z-[85] max-w-[calc(100%-2rem)] transition-all duration-500 sm:bottom-24 sm:left-6 md:bottom-28 md:left-10 ${
        inHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="glass flex items-center gap-3 rounded-full px-3 py-2 sm:px-4">
        <div className="flex gap-[3px]">
          {Array.from({ length: SCENE_COUNT }).map((_, i) => (
            <span
              key={i}
              className="h-[3px] w-1.5 rounded-full transition-colors duration-300 sm:w-2"
              style={{
                backgroundColor:
                  i <= scene.idx ? "var(--dima)" : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
        <span className="truncate font-mono-tight text-[9px] uppercase tracking-[0.3em] text-white/80 sm:text-[10px]">
          {scene.name}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Custom Magnetic Cursor (desktop only)                               */
/* ------------------------------------------------------------------ */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let dx = mx;
    let dy = my;
    let hovering = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest(
        "a,button,[role=button],input,textarea,select,summary,[data-cursor='hover']"
      );
      hovering = interactive;
      if (ringRef.current) ringRef.current.dataset.hover = interactive ? "1" : "0";
    };
    document.addEventListener("mousemove", onMove);

    let raf = 0;
    const tick = () => {
      dx += (mx - dx) * 0.35;
      dy += (my - dy) * 0.35;
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      if (dotRef.current)
        dotRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      if (ringRef.current) {
        const s = hovering ? 1.9 : 1;
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${s})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    document.documentElement.style.cursor = "none";
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[120] h-1.5 w-1.5 rounded-full bg-[color:var(--dima)]"
        style={{ mixBlendMode: "difference" }}
      />
      <div
        ref={ringRef}
        data-hover="0"
        className="pointer-events-none fixed left-0 top-0 z-[119] h-9 w-9 rounded-full border border-white/60 transition-[border-color,background-color,width,height] duration-200 data-[hover='1']:border-[color:var(--dima)] data-[hover='1']:bg-[color:var(--dima)]/10"
        style={{ mixBlendMode: "difference" }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Auto Scene Tick — silent WebAudio, no UI, tiny click on each scene  */
/* ------------------------------------------------------------------ */
export function SceneTick() {
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const ensure = () => {
      if (ctxRef.current) return ctxRef.current;
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      try {
        ctxRef.current = new AC();
      } catch {
        return null;
      }
      return ctxRef.current;
    };

    // Warm-up on first user gesture (required by browser autoplay policy)
    const warm = () => {
      const ctx = ensure();
      if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
    };
    window.addEventListener("pointerdown", warm, { once: true, passive: true });
    window.addEventListener("touchstart", warm, { once: true, passive: true });
    window.addEventListener("keydown", warm, { once: true });

    const onScene = () => {
      const ctx = ctxRef.current;
      if (!ctx || ctx.state !== "running") return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(1480, t);
      o.frequency.exponentialRampToValueAtTime(880, t + 0.12);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.018, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.16);
    };

    const onVis = () => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      if (document.hidden) ctx.suspend().catch(() => {});
      else ctx.resume().catch(() => {});
    };

    window.addEventListener("dima:scene", onScene);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("dima:scene", onScene);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointerdown", warm);
      window.removeEventListener("touchstart", warm);
      window.removeEventListener("keydown", warm);
    };
  }, []);

  return null;
}

/* ------------------------------------------------------------------ */
/* Composite                                                           */
/* ------------------------------------------------------------------ */
export function ExperienceLayer() {
  return (
    <>
      <IntroPreloader />
      <ScrollProgress />
      <SceneTick />
      <FloatingNav />
      <SceneHUD />
      <CustomCursor />
    </>
  );
}
