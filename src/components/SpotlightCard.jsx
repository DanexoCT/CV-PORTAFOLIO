import { useEffect, useRef } from "react";

export default function SpotlightCard({
  children,
  className = "",
  tilt = false,
  tiltIntensity = 5,
  reveal = false,
  revealOrder = 0,
}) {
  const cardRef = useRef(null);
  const frameRef = useRef(null);
  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  useEffect(() => {
    cardRef.current?.style.setProperty("--tilt-x", "0deg");
    cardRef.current?.style.setProperty("--tilt-y", "0deg");
  }, [tilt, tiltIntensity]);

  function handlePointerMove(event) {
    if (
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
      if (tilt) {
        card.style.setProperty(
          "--tilt-x",
          `${(0.5 - y / rect.height) * tiltIntensity}deg`,
        );
        card.style.setProperty(
          "--tilt-y",
          `${(x / rect.width - 0.5) * tiltIntensity}deg`,
        );
      }
    });
  }
  function resetTilt() {
    cancelAnimationFrame(frameRef.current);
    const card = cardRef.current;
    card?.style.setProperty("--tilt-x", "0deg");
    card?.style.setProperty("--tilt-y", "0deg");
  }
  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      className={`spotlight-card ${tilt ? "tilt-card" : ""} ${className}`}
      data-scroll-reveal={reveal ? "rise" : undefined}
      data-reveal-order={reveal ? revealOrder : undefined}
    >
      {children}
    </div>
  );
}
