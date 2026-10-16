import "../demos/demos.css";
import "../demos/workflow.css";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Code2 } from "lucide-react";
import LazyBoundary from "./LazyBoundary";

const FrontendDemos = lazy(() => import("../demos/FrontendDemos"));
function Placeholder({ onLoad }) {
  return (
    <div className="demo-placeholder">
      <Code2 size={32} />
      <p>Ejemplos interactivos de frontend</p>
      {onLoad ? (
        <button
          type="button"
          className="button button-secondary"
          onClick={onLoad}
        >
          Cargar demos
        </button>
      ) : (
        <p role="status">Cargando demos…</p>
      )}
    </div>
  );
}
export default function DemosSection() {
  const [active, setActive] = useState(false);
  const section = useRef(null);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      ref={section}
      id="demos"
      className="section container demos-section"
    >
      <div className="section-heading" data-scroll-reveal="rise">
        <div>
          <p className="eyebrow">
            <span>03 /</span> EJEMPLOS INTERACTIVOS
          </p>
          <h2>Demos de interfaz</h2>
        </div>
        <p>
          Prueba interfaces, efectos de interacción, un tablero de tareas y un
          formulario por pasos. Con datos de muestra.
        </p>
      </div>
      {active ? (
        <LazyBoundary>
          <Suspense fallback={<Placeholder />}>
            <FrontendDemos />
          </Suspense>
        </LazyBoundary>
      ) : (
        <Placeholder onLoad={() => setActive(true)} />
      )}
    </section>
  );
}
