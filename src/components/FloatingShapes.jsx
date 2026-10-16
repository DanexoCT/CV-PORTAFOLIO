import { useEffect } from "react";
import "./FloatingShapes.css";

const symbols = ["</>", "{ }", "[ ]", "=>"];
const colors = ["184, 155, 225", "154, 169, 191", "148, 188, 180"];

function drawShape(ctx, particle, x, y, time) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(particle.angle + Math.sin(time * 0.2 + particle.phase) * 0.2);
  ctx.strokeStyle = `rgba(${particle.color}, ${particle.opacity})`;
  ctx.fillStyle = ctx.strokeStyle;
  ctx.lineWidth = 1;
  const radius = particle.size / 2;
  ctx.beginPath();
  if (particle.type < 4) {
    ctx.font = `400 ${particle.size * 0.65}px Consolas, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(symbols[particle.type], 0, 0);
  } else if (particle.type === 4) {
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.65, -0.7, 0.8);
    ctx.stroke();
  } else {
    const sides = particle.type === 5 ? 3 : particle.type === 6 ? 4 : 6;
    for (let index = 0; index <= sides; index++) {
      const angle = (index / sides) * Math.PI * 2 - Math.PI / 2;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      if (index === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();
}

export default function FloatingShapes() {
  useEffect(() => {
    if (!("ResizeObserver" in window) || !("IntersectionObserver" in window))
      return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mobile = window.matchMedia("(max-width: 650px)");
    const pointer = { x: 0, y: 0, active: false };
    let frame = null;
    let lastFrame = 0;
    let elapsed = 0;
    let disposed = false;
    const scenes = [
      ...document.querySelectorAll("main > section, .site-footer"),
    ].map((host) => {
      const canvas = document.createElement("canvas");
      canvas.className = "floating-shapes-canvas";
      canvas.setAttribute("aria-hidden", "true");
      host.classList.add("floating-shapes-host");
      host.appendChild(canvas);
      return {
        host,
        canvas,
        ctx: canvas.getContext("2d"),
        particles: [],
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        visible: false,
      };
    });

    function sizeScene(scene) {
      const rect = scene.host.getBoundingClientRect();
      scene.left = rect.left + window.scrollX;
      scene.top = rect.top + window.scrollY;
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (!scene.ctx || width < 1 || height < 1) return;
      if (scene.width === width && scene.height === height) return;
      const ratio = Math.min(
        window.devicePixelRatio || 1,
        mobile.matches ? 1.25 : 1.5,
      );
      scene.width = width;
      scene.height = height;
      scene.canvas.width = Math.round(width * ratio);
      scene.canvas.height = Math.round(height * ratio);
      scene.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(
        mobile.matches ? 5 : 12,
        Math.max(3, Math.round((width * height) / 110000)),
      );
      while (scene.particles.length < count) {
        scene.particles.push({
          u:
            Math.random() < 0.7
              ? Math.random() < 0.5
                ? 0.04 + Math.random() * 0.17
                : 0.79 + Math.random() * 0.17
              : 0.25 + Math.random() * 0.5,
          v: Math.random(),
          size:
            (mobile.matches ? 15 : 22) +
            Math.random() * (mobile.matches ? 13 : 22),
          type: Math.floor(Math.random() * 8),
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 0.13 + Math.random() * 0.1,
          angle: (Math.random() - 0.5) * 0.5,
          phase: Math.random() * Math.PI * 2,
          amplitude: 7 + Math.random() * 10,
          dx: 0,
          dy: 0,
        });
      }
      scene.particles.length = count;
    }

    function render(scene, dt) {
      const { ctx, width, height } = scene;
      if (!ctx || !width || !height) return;
      ctx.clearRect(0, 0, width, height);
      const localX = pointer.x + window.scrollX - scene.left;
      const localY = pointer.y + window.scrollY - scene.top;
      for (const particle of scene.particles) {
        const driftX = reduced.matches
          ? 0
          : Math.sin(elapsed * 0.3 + particle.phase) * particle.amplitude;
        const driftY = reduced.matches
          ? 0
          : Math.cos(elapsed * 0.24 + particle.phase) *
            particle.amplitude *
            1.25;
        const x = particle.u * Math.max(0, width - 50) + 25 + driftX;
        const y = particle.v * Math.max(0, height - 80) + 40 + driftY;
        const distance = Math.hypot(localX - x, localY - y);
        const attracted =
          pointer.active && fine.matches && !reduced.matches && distance < 230;
        const pull = attracted ? (1 - distance / 230) * 0.55 : 0;
        const smoothing = 1 - Math.exp(-dt / (attracted ? 0.24 : 0.9));
        particle.dx += ((localX - x) * pull - particle.dx) * smoothing;
        particle.dy += ((localY - y) * pull - particle.dy) * smoothing;
        if (reduced.matches) {
          particle.dx = 0;
          particle.dy = 0;
        }
        drawShape(
          ctx,
          particle,
          x + particle.dx,
          y + particle.dy,
          reduced.matches ? 0 : elapsed,
        );
      }
    }

    function tick(now) {
      frame = null;
      if (disposed || document.hidden || reduced.matches) return;
      if (now - lastFrame >= 1000 / 30) {
        const dt = Math.min((now - (lastFrame || now)) / 1000, 0.08);
        elapsed += dt;
        lastFrame = now;
        scenes
          .filter((scene) => scene.visible)
          .forEach((scene) => render(scene, dt));
      }
      if (scenes.some((scene) => scene.visible))
        frame = requestAnimationFrame(tick);
    }
    function start() {
      if (disposed || document.hidden) return;
      if (reduced.matches) {
        scenes
          .filter((scene) => scene.visible)
          .forEach((scene) => render(scene, 1));
        return;
      }
      if (frame === null) {
        lastFrame = 0;
        frame = requestAnimationFrame(tick);
      }
    }
    function measure() {
      scenes.forEach(sizeScene);
      start();
    }
    function move(event) {
      pointer.active =
        event.pointerType === "mouse" && fine.matches && !reduced.matches;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    }
    function leave() {
      pointer.active = false;
    }
    function visibility() {
      leave();
      cancelAnimationFrame(frame);
      frame = null;
      start();
    }
    function preference() {
      leave();
      cancelAnimationFrame(frame);
      frame = null;
      measure();
    }
    const resize = new ResizeObserver(measure);
    scenes.forEach((scene) => resize.observe(scene.host));
    const intersection = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const scene = scenes.find((item) => item.host === entry.target);
          if (scene) scene.visible = entry.isIntersecting;
        });
        measure();
      },
      { rootMargin: "100px" },
    );
    scenes.forEach((scene) => intersection.observe(scene.host));
    measure();
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", preference);
    fine.addEventListener("change", preference);
    mobile.addEventListener("change", preference);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", preference);
      fine.removeEventListener("change", preference);
      mobile.removeEventListener("change", preference);
      scenes.forEach(({ canvas, host }) => {
        canvas.remove();
        host.classList.remove("floating-shapes-host");
      });
    };
  }, []);
  return null;
}
