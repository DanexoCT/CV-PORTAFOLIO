import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import * as Motion from "motion/react-m";
import {
  ArrowUpRight,
  Terminal,
  Code2,
  BriefcaseBusiness,
  Layers3,
  UserRound,
  Boxes,
} from "lucide-react";
import LiquidGlass from "./LiquidGlass";
import "./Navbar.css";

const compactQuery = "(max-width: 900px)";
function subscribeCompact(listener) {
  const query = window.matchMedia(compactQuery);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}
const getCompact = () => window.matchMedia(compactQuery).matches;

const links = [
  { id: "experiencia", label: "Experiencia", icon: BriefcaseBusiness },
  { id: "proyectos", label: "Proyectos", icon: Layers3 },
  { id: "demos", label: "Demos", icon: Code2 },
  { id: "sobre-mi", label: "Sobre mí", icon: UserRound },
  { id: "tecnologias", label: "Tecnologías", icon: Boxes },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");
  const compact = useSyncExternalStore(subscribeCompact, getCompact, () => false);
  const nav = useRef(null);
  const surface = useRef(null);
  const tiltFrame = useRef(null);
  const toggle = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });

  function resetTilt() {
    cancelAnimationFrame(tiltFrame.current);
    surface.current?.style.removeProperty("--nav-tilt-x");
    surface.current?.style.removeProperty("--nav-tilt-y");
  }

  function moveTilt(event) {
    if (
      open ||
      reducedMotion ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const element = surface.current;
    const header = nav.current;
    if (!element || !header) return;
    // Measure against the untransformed header to avoid feedback at the edges.
    const bounds = header.getBoundingClientRect();
    const x = Math.max(
      -0.5,
      Math.min(
        0.5,
        (event.clientX - bounds.left - element.offsetLeft) /
        element.offsetWidth -
        0.5,
      ),
    );
    const y = Math.max(
      -0.5,
      Math.min(
        0.5,
        (event.clientY - bounds.top - element.offsetTop) /
        element.offsetHeight -
        0.5,
      ),
    );
    cancelAnimationFrame(tiltFrame.current);
    tiltFrame.current = requestAnimationFrame(() => {
      element.style.setProperty("--nav-tilt-x", `${-y * 4}deg`);
      element.style.setProperty("--nav-tilt-y", `${x * 2}deg`);
    });
  }

  useEffect(() => {
    if (open || reducedMotion) {
      cancelAnimationFrame(tiltFrame.current);
      surface.current?.style.removeProperty("--nav-tilt-x");
      surface.current?.style.removeProperty("--nav-tilt-y");
    }
    return () => cancelAnimationFrame(tiltFrame.current);
  }, [open, reducedMotion]);

  useEffect(() => {
    let frame;
    const update = () => {
      const sections = [...document.querySelectorAll("main section[id]")];
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 8;
      const current = atBottom
        ? sections.at(-1)
        : sections
          .filter(
            (section) =>
              section.getBoundingClientRect().top <=
              window.innerHeight * 0.32,
          )
          .at(-1);
      setActive(current?.id ?? "inicio");
      frame = undefined;
    };
    const schedule = () => {
      if (frame === undefined) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.type === "pointerdown" && !nav.current?.contains(event.target))
        setOpen(false);
    };
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", dismiss);
    return () => {
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("pointerdown", dismiss);
    };
  }, [open]);

  return (
    <header className="site-header" ref={nav}>
      <nav
        ref={surface}
        className="container navigation"
        aria-label="Navegación principal"
        data-menu-open={open}
        onPointerMove={moveTilt}
        onPointerLeave={resetTilt}
        onPointerCancel={resetTilt}
      >
        <LiquidGlass refract={false} />
        <a
          className="brand nav-brand"
          href="#inicio"
          onClick={() => setOpen(false)}
          aria-label="Dan Valle, inicio"
        >
          <span className="brand-terminal" aria-hidden="true">
            <Terminal size={19} />
          </span>
          <span className="brand-name">
            <span>{"<"}</span>davm<span>{" />"}</span>
            <small>CV / PORTAFOLIO</small>
          </span>
        </a>
        <div
          className={`nav-links ${open ? "is-open" : ""}`}
          id="navigation-links"
          style={{ "--nav-last-link": links.length }}
          aria-hidden={compact && !open ? true : undefined}
          inert={compact && !open}
        >
          <LiquidGlass className="mobile-liquid-glass" refract={false} />
          {links.map(({ id, label, icon: Icon }, index) => (
            <a
              key={id}
              style={{ "--nav-link-order": index }}
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              {active === id && (
                <Motion.span
                  className="nav-active-pill"
                  layoutId="nav-active-pill"
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 32 }
                  }
                />
              )}
              <Icon size={15} aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
          <a
            className="nav-contact"
            style={{ "--nav-link-order": links.length }}
            data-magnetic="0.8"
            href="#contacto"
            aria-current={active === "contacto" ? "location" : undefined}
            onClick={() => setOpen(false)}
          >
            <span className="nav-contact-label">Contacto</span>
            <span className="nav-contact-icon" aria-hidden="true">
              <ArrowUpRight size={16} />
              <ArrowUpRight size={16} />
            </span>
          </a>
        </div>
        <button
          type="button"
          className="menu-toggle"
          ref={toggle}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="navigation-links"
          onClick={() => setOpen((previous) => !previous)}
        >
          <span className="menu-toggle-icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
        <div className="nav-progress" aria-hidden="true">
          <Motion.div
            style={{ scaleX: reducedMotion ? scrollYProgress : progress }}
          />
        </div>
      </nav>
    </header>
  );
}
