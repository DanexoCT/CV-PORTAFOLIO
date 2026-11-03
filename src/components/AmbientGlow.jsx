import { useEffect } from "react";
import "./AmbientGlow.css";

export default function AmbientGlow() {
  useEffect(() => {
    const groups = document.querySelectorAll(
      ".hero-specialties, .tags, .about-process, .stack-tools, .stack-card-top",
    );
    const visible = new Set();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    function update() {
      groups.forEach((group) => {
        group.classList.toggle(
          "ambient-glow-visible",
          visible.has(group) && !document.hidden && !reduced.matches,
        );
      });
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) visible.add(target);
          else visible.delete(target);
        });
        update();
      },
      { threshold: 0.15 },
    );
    groups.forEach((group) => observer.observe(group));
    document.addEventListener("visibilitychange", update);
    reduced.addEventListener("change", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      reduced.removeEventListener("change", update);
      groups.forEach((group) => group.classList.remove("ambient-glow-visible"));
    };
  }, []);
  return null;
}
