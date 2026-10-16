import { useEffect, useRef } from "react";

export default function MouseGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    const enabled = window.matchMedia(
      "(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let frame = null;
    let x = 0;
    let y = 0;

    function hide() {
      cancelAnimationFrame(frame);
      frame = null;
      glow.classList.remove("is-visible");
    }

    function move(event) {
      if (!enabled.matches || event.pointerType === "touch") {
        hide();
        return;
      }
      x = event.clientX;
      y = event.clientY;
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        const diameter = glow.offsetWidth;
        const radius = diameter / 2;
        glow.style.transform = `translate3d(${x - radius}px, ${y - radius}px, 0)`;
        glow.classList.add("is-visible");
        frame = null;
      });
    }

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", hide);
    enabled.addEventListener("change", hide);
    return () => {
      hide();
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", hide);
      enabled.removeEventListener("change", hide);
    };
  }, []);

  return (
    <div className="cursor-glow-viewport" aria-hidden="true">
      <div ref={glowRef} className="page-cursor-glow" />
    </div>
  );
}
