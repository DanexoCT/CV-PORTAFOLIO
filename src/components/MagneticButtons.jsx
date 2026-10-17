import { useEffect } from "react";
import "./MagneticButtons.css";

export default function MagneticButtons() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let active = null;
    let fields = null;
    let frame = null;
    function reset() {
      cancelAnimationFrame(frame);
      active?.removeAttribute("data-magnetic-active");
      active?.style.removeProperty("--magnetic-x");
      active?.style.removeProperty("--magnetic-y");
      active = null;
    }
    function invalidate() {
      reset();
      fields = null;
    }
    function move(event) {
      if (event.pointerType !== "mouse" || reduced.matches || !fine.matches) {
        reset();
        return;
      }
      const { clientX: x, clientY: y } = event;
      const reach = 48;
      if (!fields) {
        fields = [...document.querySelectorAll("[data-magnetic]")]
          .filter(
            (element) =>
              !element.matches(":disabled, [aria-disabled='true']") &&
              element.getClientRects().length,
          )
          .map((element) => {
            const rect = element.getBoundingClientRect();
            // Remove any ongoing magnetic translation from the resting bounds.
            const translation = getComputedStyle(element).translate.split(" ");
            const dx = parseFloat(translation[0]) || 0;
            const dy = parseFloat(translation[1]) || 0;
            return {
              element,
              left: rect.left - dx,
              right: rect.right - dx,
              top: rect.top - dy,
              bottom: rect.bottom - dy,
              width: rect.width,
              height: rect.height,
            };
          });
      }
      const direct = event.target.closest?.("[data-magnetic]");
      const nearby = fields.filter(
        (field) =>
          field.element.isConnected &&
          x >= field.left - reach &&
          x <= field.right + reach &&
          y >= field.top - reach &&
          y <= field.bottom + reach,
      );
      nearby.sort(
        (a, b) =>
          Math.hypot(x - (a.left + a.width / 2), y - (a.top + a.height / 2)) -
          Math.hypot(x - (b.left + b.width / 2), y - (b.top + b.height / 2)),
      );
      const field =
        nearby.find((item) => item.element === direct) ??
        nearby.find((item) => item.element === active) ??
        nearby[0];
      if (!field) {
        reset();
        return;
      }
      if (active !== field.element) {
        reset();
        active = field.element;
      }
      const bounds = field;
      active.setAttribute("data-magnetic-active", "true");
      const strength = Math.min(
        70,
        Math.max(0, Number(active.dataset.magnetic) || 8) * 5,
      );
      const dx =
        Math.max(
          -1,
          Math.min(
            1,
            (x - bounds.left - bounds.width / 2) / (bounds.width / 2 + reach),
          ),
        ) * strength;
      const dy =
        Math.max(
          -1,
          Math.min(
            1,
            (y - bounds.top - bounds.height / 2) / (bounds.height / 2 + reach),
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
    const observer = new MutationObserver(() => {
      fields = null;
    });
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave);
    document.addEventListener("focusin", focus);
    window.addEventListener("scroll", invalidate, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", invalidate);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);
    reduced.addEventListener("change", reset);
    fine.addEventListener("change", invalidate);
    return () => {
      observer.disconnect();
      reset();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("focusin", focus);
      window.removeEventListener("scroll", invalidate, true);
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset);
      reduced.removeEventListener("change", reset);
      fine.removeEventListener("change", invalidate);
    };
  }, []);
  return null;
}
