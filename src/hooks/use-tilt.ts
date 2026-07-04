import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Pointer-driven magnetic tilt. Attach the returned ref to any element that
// already has the `.tilt-card` CSS class (perspective + --rx/--ry/--tz vars).
export function useTilt<T extends HTMLElement>(maxTilt = 8) {
  const ref = useRef<T | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let rx = 0;
    let ry = 0;
    let tz = 0;
    let targetRx = 0;
    let targetRy = 0;
    let targetTz = 0;
    let raf = 0;

    const tick = () => {
      rx += (targetRx - rx) * 0.12;
      ry += (targetRy - ry) * 0.12;
      tz += (targetTz - tz) * 0.12;
      el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      el.style.setProperty("--tz", `${tz.toFixed(1)}px`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      targetRy = px * maxTilt * 2;
      targetRx = -py * maxTilt * 2;
      targetTz = 14;
    };
    const onLeave = () => {
      targetRx = 0;
      targetRy = 0;
      targetTz = 0;
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reducedMotion, maxTilt]);

  return ref;
}
