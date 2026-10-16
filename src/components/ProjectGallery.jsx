import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "./ProjectGallery.css";

const screenshots = [
  {
    file: "icono-redesign.jpg",
    title: "Portafolio",
    text: "Organización visual de las áreas de desarrollo web, aplicaciones y marketing.",
  },
  {
    file: "icono-services.png",
    title: "Servicios",
    text: "Presentación de los servicios mediante tarjetas y una jerarquía de contenido clara.",
  },
  {
    file: "icono-about.jpg",
    title: "Nosotros",
    text: "Distribución del contenido y las imágenes en la sección de presentación.",
  },
];

export default function ProjectGallery({ onDismiss }) {
  const dialog = useRef(null);
  const [index, setIndex] = useState(0);
  const current = screenshots[index];
  const move = (delta) =>
    setIndex(
      (previous) =>
        (previous + delta + screenshots.length) % screenshots.length,
    );
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!element.open) element.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="project-gallery"
      aria-labelledby="gallery-title"
      onClose={onDismiss}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          dialog.current.close();
      }}
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <header className="gallery-header">
        <div>
          <span className="eyebrow">CAPTURAS DEL REPORTE · 2025</span>
          <h2 id="gallery-title">Servicios Web Icono</h2>
        </div>
        <button
          autoFocus
          type="button"
          className="gallery-close"
          onClick={() => dialog.current.close()}
          aria-label="Cerrar galería"
        >
          <X size={20} />
        </button>
      </header>
      <figure className="gallery-figure">
        <div className="gallery-image">
          <img
            key={current.file}
            src={`${import.meta.env.BASE_URL}projects/${current.file}`}
            alt={`Interfaz de la sección ${current.title} de Servicios Web Icono`}
          />
        </div>
        <figcaption aria-live="polite">
          <strong>
            {index + 1} / {screenshots.length} · {current.title}
          </strong>
          <p>{current.text}</p>
        </figcaption>
      </figure>
      <div className="gallery-controls">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Captura anterior"
        >
          <ChevronLeft size={18} />
        </button>
        <div role="group" aria-label="Seleccionar captura">
          {screenshots.map((item, position) => (
            <button
              key={item.file}
              type="button"
              aria-pressed={index === position}
              onClick={() => setIndex(position)}
            >
              {item.title}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Captura siguiente"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <p className="gallery-note">
        Evidencia del rediseño del frontend durante mi estadía. Puedes navegar
        con las flechas del teclado y cerrar con Escape.
      </p>
    </dialog>
  );
}
