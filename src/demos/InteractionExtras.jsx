import { AnimatedDetails } from "../components/InterfaceMotion";
import DemoSelect from "./DemoSelect";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  Check,
  Code2,
  Layers3,
  MoveHorizontal,
  Sparkles,
} from "lucide-react";
import "./interactions.css";

const scenes = [
  {
    title: "Estructura",
    description: "Espacio, ritmo y jerarquía para ordenar una interfaz.",
    icon: Layers3,
    color: "#bba0e4",
  },
  {
    title: "Detalle",
    description: "Contraste y pequeños acentos para guiar la atención.",
    icon: Sparkles,
    color: "#9cbfb7",
  },
  {
    title: "Movimiento",
    description: "Transiciones que acompañan un cambio de estado.",
    icon: MoveHorizontal,
    color: "#d0b299",
  },
];

export function ExpandingGallery() {
  const [selected, setSelected] = useState(0);
  const [speed, setSpeed] = useState("550");
  const buttons = useRef([]);
  const reducedMotion = useReducedMotion();
  return (
    <>
      <div className="demo-toolbar">
        <div>
          <span className="demo-label">COMPOSICIÓN Y TRANSICIONES</span>
          <h3>Una galería que cambia de espacio</h3>
          <p>
            Selecciona una tarjeta. La composición se reorganiza y muestra su
            contenido; también funciona con Tab y Enter.
          </p>
        </div>
        <label className="interaction-speed">
          Transición
          <DemoSelect
            disabled={!!reducedMotion}
            value={speed}
            onChange={(event) => setSpeed(event.target.value)}
          >
            <option value="300">Rápida</option>
            <option value="550">Suave</option>
            <option value="900">Lenta</option>
          </DemoSelect>
        </label>
      </div>
      <div
        className="expanding-gallery"
        style={{
          "--gallery-speed": `${speed}ms`,
          gridTemplateColumns: scenes
            .map((_, index) => (index === selected ? "2.4fr" : "1fr"))
            .join(" "),
        }}
        role="group"
        aria-label="Composición interactiva"
      >
        {scenes.map(({ title, description, icon: Icon, color }, index) => (
          <button
            ref={(element) => {
              buttons.current[index] = element;
            }}
            type="button"
            key={title}
            className={`expanding-scene ${selected === index ? "is-selected" : ""}`}
            aria-pressed={selected === index}
            aria-controls="expanding-caption"
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              let next;
              if (event.key === "ArrowRight" || event.key === "ArrowDown")
                next = (index + 1) % scenes.length;
              if (event.key === "ArrowLeft" || event.key === "ArrowUp")
                next = (index + scenes.length - 1) % scenes.length;
              if (event.key === "Home") next = 0;
              if (event.key === "End") next = scenes.length - 1;
              if (next === undefined) return;
              event.preventDefault();
              setSelected(next);
              buttons.current[next]?.focus({ preventScroll: true });
            }}
            style={{ "--scene-color": color }}
          >
            <span className="scene-number">0{index + 1}</span>
            <span className="scene-art" aria-hidden="true">
              <i />
              <i />
              <i />
              <Icon size={36} strokeWidth={1} />
            </span>
            <span className="scene-title">
              {title}
              <ArrowUpRight size={18} />
            </span>
            <span
              className="scene-description"
              aria-hidden={selected !== index}
            >
              {description}
            </span>
          </button>
        ))}
      </div>
      <p className="interaction-status" id="expanding-caption" role="status">
        {scenes[selected].title} · {scenes[selected].description}
        {reducedMotion && " Movimiento reducido activo: cambios sin animación."}
      </p>
      <Explanation>
        CSS Grid redistribuye las columnas a partir de una selección en React.
        Los botones exponen su estado y la transición se desactiva con
        movimiento reducido. En móvil, la composición se organiza en vertical.
      </Explanation>
    </>
  );
}

export function MagneticButton({ active = true }) {
  const [strength, setStrength] = useState(18);
  const [clicks, setClicks] = useState(0);
  const stage = useRef(null);
  const surface = useRef(null);
  const frame = useRef(null);
  const reducedMotion = useReducedMotion();
  function reset() {
    cancelAnimationFrame(frame.current);
    surface.current?.style.setProperty("--magnet-x", "0px");
    surface.current?.style.setProperty("--magnet-y", "0px");
  }
  useEffect(() => {
    reset();
    return () => cancelAnimationFrame(frame.current);
  }, [strength, reducedMotion, active]);
  function move(event) {
    if (
      !active ||
      reducedMotion ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const rect = stage.current.getBoundingClientRect();
    const x = Math.max(
      -1,
      Math.min(
        1,
        (event.clientX - rect.left - rect.width / 2) / (rect.width / 2),
      ),
    );
    const y = Math.max(
      -1,
      Math.min(
        1,
        (event.clientY - rect.top - rect.height / 2) / (rect.height / 2),
      ),
    );
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      surface.current?.style.setProperty("--magnet-x", `${x * strength}px`);
      surface.current?.style.setProperty("--magnet-y", `${y * strength}px`);
    });
  }
  return (
    <>
      <div className="demo-toolbar">
        <div>
          <span className="demo-label">RESPUESTA AL CURSOR</span>
          <h3>Un botón con atracción</h3>
          <p>
            Acerca el ratón y pulsa el botón para ver la respuesta. En móvil o
            con teclado puedes activarlo directamente.
          </p>
        </div>
      </div>
      <div className="demo-motion-layout">
        <div className="magnetic-stage">
          <span className="magnetic-orbit" aria-hidden="true" />
          <div
            ref={stage}
            className="magnetic-hit-area"
            onPointerMove={move}
            onPointerLeave={reset}
            onPointerCancel={reset}
          >
            <div ref={surface} className="magnetic-surface">
              <button
                type="button"
                className="magnetic-button"
                onFocus={(event) => {
                  if (event.currentTarget.matches(":focus-visible")) reset();
                }}
                onClick={() => setClicks((previous) => previous + 1)}
              >
                {clicks > 0 ? <Check size={19} /> : <Sparkles size={19} />}
                <span>{clicks > 0 ? "Una vez más" : "Pruébame"}</span>
                <ArrowUpRight size={17} />
                {clicks > 0 && (
                  <span
                    key={clicks}
                    className="magnetic-ripple"
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
          </div>
          <span className="magnetic-stage-label">
            MICROINTERACCIÓN / POINTER + CSS
          </span>
        </div>
        <div className="demo-motion-controls">
          <h4>Ajustes de la demo</h4>
          <label className="demo-range-label" htmlFor="magnetic-strength">
            Atracción <output htmlFor="magnetic-strength">{strength} px</output>
          </label>
          <input
            id="magnetic-strength"
            type="range"
            min="0"
            max="28"
            value={strength}
            disabled={!!reducedMotion}
            onChange={(event) => setStrength(Number(event.target.value))}
          />
          <p>
            {reducedMotion
              ? "Movimiento reducido activo. El botón responde sin desplazarse ni generar ondas."
              : "El área de detección permanece fija para que el botón no salte al moverse."}
          </p>
          <p className="magnetic-counter" role="status">
            {clicks === 0
              ? "Todavía no has pulsado el botón."
              : `${clicks} ${clicks === 1 ? "activación" : "activaciones"}.`}
          </p>
          <button
            type="button"
            className="demo-reset"
            onClick={() => {
              setClicks(0);
              reset();
            }}
          >
            Reiniciar contador
          </button>
        </div>
      </div>
      <Explanation>
        La posición del cursor se mide en un contenedor fijo y actualiza
        variables CSS con requestAnimationFrame. El botón conserva su
        comportamiento nativo con teclado y táctil; el desplazamiento se limita
        a una distancia pequeña.
      </Explanation>
    </>
  );
}

function InterfacePreview({ improved = false }) {
  return (
    <div
      className={`comparison-ui ${improved ? "is-improved" : ""}`}
      aria-hidden="true"
    >
      <div className="comparison-nav">
        <span>
          studio<span>.</span>
        </span>
        <i />
        <i />
        <i />
      </div>
      <div className="comparison-main">
        <span className="comparison-kicker">DISEÑO / DESARROLLO</span>
        <strong>
          Una idea.
          <br />
          Una interfaz.
        </strong>
        <p>Un espacio para organizar y compartir tu trabajo.</p>
        <span className="comparison-cta">
          Explorar proyectos <ArrowUpRight size={12} />
        </span>
      </div>
      <div className="comparison-shapes">
        <i />
        <i />
        <i />
      </div>
      <div className="comparison-bottom">
        <span>01 / ESTRUCTURA</span>
        <span>02 / DETALLE</span>
        <span>03 / INTERACCIÓN</span>
      </div>
    </div>
  );
}

export function DesignComparison() {
  const [position, setPosition] = useState(50);
  return (
    <>
      <div className="demo-toolbar">
        <div>
          <span className="demo-label">COMPARACIÓN INTERACTIVA</span>
          <h3>Del esquema al diseño</h3>
          <p>
            Desliza el separador para comparar la estructura y su tratamiento
            visual. Con teclado, usa las flechas sobre el comparador.
          </p>
        </div>
      </div>
      <div className="comparison-stage">
        <InterfacePreview />
        <div
          className="comparison-overlay"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <InterfacePreview improved />
        </div>
        <div className="comparison-labels" aria-hidden="true">
          <span style={{ opacity: position > 10 ? 1 : 0 }}>DISEÑO</span>
          <span style={{ opacity: position < 90 ? 1 : 0 }}>ESTRUCTURA</span>
        </div>
        <div
          className="comparison-divider"
          style={{ "--comparison-position": `${position}%` }}
          aria-hidden="true"
        >
          <span>
            <MoveHorizontal size={20} />
          </span>
        </div>
        <label className="sr-only" htmlFor="design-comparison">
          Porcentaje de diseño visible
        </label>
        <input
          id="design-comparison"
          className="comparison-range"
          type="range"
          min="0"
          max="100"
          value={position}
          aria-valuetext={`${position}% diseño, ${100 - position}% estructura`}
          aria-describedby="comparison-description"
          onChange={(event) => setPosition(Number(event.target.value))}
        />
      </div>
      <p id="comparison-description" className="sr-only">
        El lado izquierdo muestra el diseño con color y profundidad. El lado
        derecho muestra su estructura. Ajusta de 0 a 100 con las flechas, o usa
        los botones de vista.
      </p>
      <div
        className="comparison-presets"
        role="group"
        aria-label="Vistas del comparador"
      >
        {[
          { value: 0, label: "Estructura" },
          { value: 50, label: "Mitad y mitad" },
          { value: 100, label: "Diseño" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={position === item.value}
            onClick={() => setPosition(item.value)}
          >
            {item.label}
          </button>
        ))}
        <span>{position}% diseño</span>
      </div>
      <Explanation>
        Dos versiones del mismo componente se superponen y clip-path revela una
        de ellas. Un control range nativo permite arrastrar con ratón, deslizar
        con el dedo o ajustar con teclado. El ejemplo está construido con HTML y
        CSS, sin imágenes externas.
      </Explanation>
    </>
  );
}

function Explanation({ children }) {
  return (
    <AnimatedDetails className="demo-explanation">
      <summary>
        <Code2 size={15} /> Cómo está hecho
      </summary>
      <p>{children}</p>
    </AnimatedDetails>
  );
}
