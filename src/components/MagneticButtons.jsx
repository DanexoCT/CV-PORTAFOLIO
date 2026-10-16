import { useEffect } from "react";
import "./MagneticButtons.css";

export default function MagneticButtons() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let active = null;
    let bounds = null;
    let frame = null;
    function reset() {
      cancelAnimationFrame(frame);
      active?.style.removeProperty("--magnetic-x");
      active?.style.removeProperty("--magnetic-y");
      active = null;
      bounds = null;
    }
    function move(event) {
      if (event.pointerType !== "mouse" || reduced.matches || !fine.matches) {
        reset();
        return;
      }
      const target = event.target.closest?.("[data-magnetic]");
      if (
        target &&
        target !== active &&
        !target.matches(":disabled, [aria-disabled='true']")
      ) {
        reset();
        active = target;
        // Measure once at rest to avoid feedback as the button moves.
        bounds = active.getBoundingClientRect();
      }
      if (!active || !bounds) return;
      const { clientX: x, clientY: y } = event;
      if (
        x < bounds.left - 12 ||
        x > bounds.right + 12 ||
        y < bounds.top - 12 ||
        y > bounds.bottom + 12
      ) {
        reset();
        return;
      }
      const strength = Math.min(
        14,
        Math.max(0, Number(active.dataset.magnetic) || 8),
      );
      const dx =
        Math.max(
          -1,
          Math.min(
            1,
            (x - bounds.left - bounds.width / 2) / (bounds.width / 2 || 1),
          ),
        ) * strength;
      const dy =
        Math.max(
          -1,
          Math.min(
            1,
            (y - bounds.top - bounds.height / 2) / (bounds.height / 2 || 1),
          ),
        ) * strength;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        active?.style.setProperty("--magnetic-x", `${dx}px`);
        active?.style.setProperty("--magnetic-y", `${dy}px`);
      });
    }
    function focus(event) {
      if (event.target.matches?.(":focus-visible")) reset();
    }
    function leave(event) {
      if (!event.relatedTarget) reset();
    }
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave);
    document.addEventListener("focusin", focus);
    window.addEventListener("scroll", reset, { passive: true, capture: true });
    window.addEventListener("resize", reset);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);
    reduced.addEventListener("change", reset);
    fine.addEventListener("change", reset);
    return () => {
      reset();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("focusin", focus);
      window.removeEventListener("scroll", reset, true);
      window.removeEventListener("resize", reset);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset);
      reduced.removeEventListener("change", reset);
      fine.removeEventListener("change", reset);
    };
  }, []);
  return null;
}
