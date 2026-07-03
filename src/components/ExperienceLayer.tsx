import { useEffect, useRef, useState } from "react";
import { ALL_IMAGES } from "@/lib/images";
import { SCENE_COUNT, LogoMark } from "./DimaHero";

/* ------------------------------------------------------------------ */
/* Intro Preloader — cinematic splash with counter                     */
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
          // small delay so the 100% flash is visible
          setTimeout(() => setReady(true), 350);
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

  const pct = Math.round((loaded / ALL_IMAGES.length) * 100);

  return (
    <div
      aria-hidden={dismissed}
      onClick={() => ready && setDismissed(true)}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-700 ${
        dismissed ? "pointer-events-none opacity-0" : "opacity-100"
      } ${ready ? "cursor-pointer" : ""}`}
      style={{ transitionDelay: dismissed ? "0ms" : "0ms" }}
    >
      {/* Grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center">
        <LogoMark className="dima-logo-pulse h-14 w-14 text-[color:var(--dima)]" />

        <div className="mt-8 font-mono-tight text-[10px] uppercase tracking-[0.5em] text-white/60">
          DIMA • Market
        </div>

        <div className="mt-16 flex items-baseline gap-3">
          <span className="font-display text-7xl leading-none text-white tabular-nums">
            {String(pct).padStart(3, "0")}
          </span>
          <span className="font-mono-tight text-xs text-white/40">%</span>
        </div>

        <div className="mt-8 h-[2px] w-64 overflow-hidden bg-white/10">
          <div
            className="h-full bg-[color:var(--dima)] transition-[width] duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-6 font-mono-tight text-[10px] uppercase tracking-[0.4em] text-white/40">
          {ready ? "Chargement terminé" : "Préparation de la visite"}
        </div>

        <div
          className={`mt-14 transition-all duration-500 ${
            ready ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <div className="group flex items-center gap-4 border border-white/20 px-8 py-4 hover:border-[color:var(--dima)] transition-colors">
            <span className="font-mono-tight text-[10px] uppercase tracking-[0.4em] text-white/80 group-hover:text-[color:var(--dima)]">
              Entrer dans l&apos;expérience
            </span>
            <span className="h-px w-8 bg-white/40 group-hover:bg-[color:var(--dima)] transition-colors" />
            <span className="text-white/80 group-hover:text-[color:var(--dima)] transition-colors">→</span>
          </div>
          <div className="mt-4 text-center font-mono-tight text-[9px] uppercase tracking-[0.35em] text-white/30">
            Casque recommandé
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
/* Floating Nav — appears after hero completes                         */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
  { label: "Manifeste", href: "#manifeste" },
  { label: "Rayons", href: "#rayons" },
  { label: "Engagements", href: "#engagements" },
  { label: "Visite", href: "#top" },
];

export function FloatingNav() {
  const [visible, setVisible] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.6;
      setScrolledPastHero(past);
      setVisible(past);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        aria-label="Navigation principale"
        className={`fixed left-1/2 top-6 z-[90] -translate-x-1/2 transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-4"
        }`}
      >
        <div className="glass flex items-center gap-1 rounded-full px-2 py-2">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--dima)] hover:bg-white/5"
            aria-label="Retour à la visite"
          >
            <LogoMark className="h-5 w-5" />
          </a>
          <div className="mx-1 h-5 w-px bg-white/10" />
          {NAV_ITEMS.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className="rounded-full px-4 py-2 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              {it.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Back to top pill */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Revenir au début"
        className={`fixed bottom-6 right-6 z-[90] flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-background/70 backdrop-blur-md transition-all duration-500 hover:border-[color:var(--dima)] hover:text-[color:var(--dima)] ${
          scrolledPastHero ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <span className="text-lg leading-none">↑</span>
      </button>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Scene HUD — floating scene indicator while in hero                  */
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
      className={`pointer-events-none fixed bottom-24 left-6 z-[85] transition-all duration-500 md:bottom-28 md:left-10 ${
        inHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="glass flex items-center gap-3 rounded-full px-4 py-2">
        <div className="flex gap-[3px]">
          {Array.from({ length: SCENE_COUNT }).map((_, i) => (
            <span
              key={i}
              className="h-[3px] w-2 rounded-full transition-colors duration-300"
              style={{
                backgroundColor:
                  i <= scene.idx ? "var(--dima)" : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
        <span className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-white/80">
          {scene.name}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Custom Magnetic Cursor                                              */
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
      const interactive = !!target?.closest("a,button,[role=button],input,textarea,select,[data-cursor='hover']");
      hovering = interactive;
      if (ringRef.current) {
        ringRef.current.dataset.hover = interactive ? "1" : "0";
      }
    };
    document.addEventListener("mousemove", onMove);

    let raf = 0;
    const tick = () => {
      dx += (mx - dx) * 0.35;
      dy += (my - dy) * 0.35;
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
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
/* Ambient Audio — WebAudio drone + tick, volume + persistence         */
/* ------------------------------------------------------------------ */
const AUDIO_STORAGE_KEY = "dima:audio:v1";
type AudioPrefs = { muted: boolean; volume: number };

function loadPrefs(): AudioPrefs {
  if (typeof window === "undefined") return { muted: true, volume: 0.35 };
  try {
    const raw = window.localStorage.getItem(AUDIO_STORAGE_KEY);
    if (!raw) return { muted: true, volume: 0.35 };
    const p = JSON.parse(raw) as Partial<AudioPrefs>;
    return {
      muted: p.muted ?? true,
      volume: Math.min(1, Math.max(0, p.volume ?? 0.35)),
    };
  } catch {
    return { muted: true, volume: 0.35 };
  }
}

export function AudioAmbience() {
  const [prefs, setPrefs] = useState<AudioPrefs>({ muted: true, volume: 0.35 });
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Master level cap — keeps the pad discreet even at max slider.
  const targetLevel = (v: number) => v * 0.14;

  useEffect(() => {
    setPrefs(loadPrefs());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs, hydrated]);

  const ensure = () => {
    if (ctxRef.current) return ctxRef.current;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const o1 = ctx.createOscillator();
    o1.type = "sine";
    o1.frequency.value = 110;
    const o2 = ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.value = 138.6;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.Q.value = 0.7;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.25;
    lfo.connect(lfoGain);
    const padGain = ctx.createGain();
    padGain.gain.value = 0.45;
    lfoGain.connect(padGain.gain);

    o1.connect(filter);
    o2.connect(filter);
    filter.connect(padGain);
    padGain.connect(master);

    o1.start();
    o2.start();
    lfo.start();

    ctxRef.current = ctx;
    gainRef.current = master;
    return ctx;
  };

  const applyGain = (muted: boolean, volume: number, ramp = 0.5) => {
    const g = gainRef.current;
    const ctx = ctxRef.current;
    if (!g || !ctx) return;
    const now = ctx.currentTime;
    g.gain.cancelScheduledValues(now);
    g.gain.linearRampToValueAtTime(muted ? 0 : targetLevel(volume), now + ramp);
  };

  const tick = () => {
    if (prefs.muted) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 1320;
    g.gain.value = 0;
    o.connect(g);
    g.connect(ctx.destination);
    const t = ctx.currentTime;
    const peak = 0.012 * prefs.volume;
    g.gain.linearRampToValueAtTime(peak, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.start(t);
    o.stop(t + 0.2);
  };

  useEffect(() => {
    const onScene = () => tick();
    window.addEventListener("dima:scene", onScene);
    return () => window.removeEventListener("dima:scene", onScene);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs]);

  // Auto-pause when tab hidden
  useEffect(() => {
    const onVis = () => {
      if (!ctxRef.current) return;
      if (document.hidden) applyGain(true, prefs.volume, 0.2);
      else applyGain(prefs.muted, prefs.volume, 0.4);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs]);

  // Close panel on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const toggleMute = () => {
    const next = !prefs.muted;
    setPrefs((p) => ({ ...p, muted: next }));
    const ctx = ensure();
    if (ctx.state === "suspended") ctx.resume();
    applyGain(next, prefs.volume, 0.6);
  };

  const setVolume = (v: number) => {
    setPrefs((p) => ({ ...p, volume: v }));
    if (ctxRef.current && !prefs.muted) applyGain(false, v, 0.15);
  };

  const iconMuted = prefs.muted || prefs.volume === 0;

  return (
    <div
      ref={panelRef}
      className="fixed left-6 top-6 z-[95] md:left-10 md:top-8"
    >
      <div className="glass flex items-center gap-1 rounded-full p-1 pr-2 transition-colors hover:border-[color:var(--dima)]/40">
        <button
          type="button"
          onClick={toggleMute}
          aria-label={iconMuted ? "Activer le son" : "Couper le son"}
          aria-pressed={!iconMuted}
          className="flex h-9 items-center gap-2 rounded-full px-3 text-white/80 hover:text-[color:var(--dima)]"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inset-0 rounded-full ${
                iconMuted ? "bg-white/30" : "bg-[color:var(--dima)]"
              }`}
            />
            {!iconMuted && (
              <span className="absolute inset-0 animate-ping rounded-full bg-[color:var(--dima)]/60" />
            )}
          </span>
          <span className="font-mono-tight text-[10px] uppercase tracking-[0.35em]">
            {iconMuted ? "Son off" : "Ambiance"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Réglages audio"
          aria-expanded={open}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/5 hover:text-[color:var(--dima)]"
        >
          <span className="text-xs leading-none">{open ? "×" : "···"}</span>
        </button>
      </div>

      {/* Volume panel */}
      <div
        className={`glass absolute left-0 top-[calc(100%+8px)] w-64 rounded-2xl p-4 transition-all duration-300 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono-tight text-[9px] uppercase tracking-[0.4em] text-white/50">
            Volume
          </span>
          <span className="font-mono-tight text-[10px] tabular-nums text-white/70">
            {Math.round(prefs.volume * 100)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={prefs.volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          aria-label="Volume ambiance"
          className="mt-3 h-1 w-full cursor-pointer appearance-none rounded-full accent-[color:var(--dima)]"
          style={{
            background: `linear-gradient(to right, var(--dima) 0%, var(--dima) ${
              prefs.volume * 100
            }%, rgba(255,255,255,0.1) ${prefs.volume * 100}%, rgba(255,255,255,0.1) 100%)`,
          }}
        />
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setVolume(0.15)}
            className="font-mono-tight text-[9px] uppercase tracking-[0.3em] text-white/50 hover:text-[color:var(--dima)]"
          >
            Discret
          </button>
          <button
            type="button"
            onClick={() => setVolume(0.5)}
            className="font-mono-tight text-[9px] uppercase tracking-[0.3em] text-white/50 hover:text-[color:var(--dima)]"
          >
            Confort
          </button>
          <button
            type="button"
            onClick={() => setVolume(0.85)}
            className="font-mono-tight text-[9px] uppercase tracking-[0.3em] text-white/50 hover:text-[color:var(--dima)]"
          >
            Immersion
          </button>
        </div>
        <p className="mt-3 font-mono-tight text-[9px] leading-relaxed text-white/40">
          Ambiance générée en temps réel. Préférence mémorisée.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Composite                                                           */
/* ------------------------------------------------------------------ */
export function ExperienceLayer() {
  return (
    <>
      <IntroPreloader />
      <ScrollProgress />
      <AudioAmbience />
      <FloatingNav />
      <SceneHUD />
      <CustomCursor />
    </>
  );
}
