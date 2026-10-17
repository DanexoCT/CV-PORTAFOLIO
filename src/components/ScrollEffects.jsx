import { useEffect } from "react";

export default function ScrollEffects() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stop = () => {};

    function start() {
      stop();
      if (preference.matches || !("IntersectionObserver" in window)) return;

      const elements = new Set();
      const selector = "[data-scroll-reveal]";
      const heroArt = document.querySelector(".hero-art");
      const hero = document.getElementById("inicio");
      let frame = null;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0, rootMargin: "0px 0px -6% 0px" },
      );

      function collect(node) {
        if (!(node instanceof Element)) return [];
        return [
          ...(node.matches(selector) ? [node] : []),
          ...node.querySelectorAll(selector),
        ];
      }

      function register(node) {
        collect(node).forEach((element) => {
          if (elements.has(element)) return;
          elements.add(element);
          const order = Math.min(
            4,
            Math.max(0, Number(element.dataset.revealOrder) || 0),
          );
          element.style.setProperty("--reveal-delay", `${order * 85}ms`);
          const bounds = element.getBoundingClientRect();
          if (bounds.top < window.innerHeight * 0.94) {
            element.classList.add("is-revealed");
          } else {
            element.classList.add("scroll-reveal-ready");
            observer.observe(element);
          }
        });
      }

      function focusReveal(event) {
        const element = event.target.closest?.(selector);
        if (!element) return;
        element.classList.remove("scroll-reveal-ready");
        element.classList.add("is-revealed");
        observer.unobserve(element);
      }

      function updateParallax() {
        frame = null;
        if (!hero || !heroArt) return;
        const bounds = hero.getBoundingClientRect();
        const offset =
          window.innerWidth > 800
            ? Math.min(36, Math.max(0, -bounds.top * 0.09))
            : 0;
        heroArt.style.setProperty("--hero-parallax", `${offset}px`);
      }
      function scheduleParallax() {
        if (window.innerWidth <= 800) {
          heroArt?.style.removeProperty("--hero-parallax");
          return;
        }
        if (frame === null) frame = requestAnimationFrame(updateParallax);
      }

      register(document.body);
      const mutations = new MutationObserver((records) => {
        records.forEach((record) => {
          record.removedNodes.forEach((node) =>
            collect(node).forEach((element) => {
              observer.unobserve(element);
              elements.delete(element);
            }),
          );
          record.addedNodes.forEach(register);
        });
      });
      mutations.observe(document.getElementById("root"), {
        childList: true,
        subtree: true,
      });
      document.addEventListener("focusin", focusReveal);
      window.addEventListener("scroll", scheduleParallax, { passive: true });
      window.addEventListener("resize", scheduleParallax);
      scheduleParallax();

      stop = () => {
        observer.disconnect();
        mutations.disconnect();
        cancelAnimationFrame(frame);
        document.removeEventListener("focusin", focusReveal);
        window.removeEventListener("scroll", scheduleParallax);
        window.removeEventListener("resize", scheduleParallax);
        heroArt?.style.removeProperty("--hero-parallax");
        elements.forEach((element) => {
          element.classList.remove("scroll-reveal-ready", "is-revealed");
          element.style.removeProperty("--reveal-delay");
        });
      };
    }

    start();
    preference.addEventListener("change", start);
    return () => {
      preference.removeEventListener("change", start);
      stop();
    };
  }, []);
  return null;
}
