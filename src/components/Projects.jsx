import { Collapsible, SelectionPill } from "./InterfaceMotion";
import { motion as Motion, useReducedMotion } from "motion/react";
import { lazy, Suspense, useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  Workflow,
  ShoppingBag,
  Expand,
  Check,
  Database,
  Bell,
  CreditCard,
  Utensils,
} from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import TechBadge from "./TechBadge";
import LazyBoundary from "./LazyBoundary";
const ProjectGallery = lazy(() => import("./ProjectGallery"));
const projects = [
  {
    id: "pedidos",
    type: "Automatización",
    title: "Automatización del seguimiento de pedidos",
    subtitle: "Seguimiento de pedidos · Colchones Wendy",
    text: "Análisis de procesos y diseño de flujos para conectar estados de pedidos con notificaciones a clientes.",
    technologies: ["n8n", "Docker", "Linux", "SAP R/3"],
    status: "En desarrollo",
    details:
      "Realizo entrevistas, documento requerimientos y diseño flujos en n8n. Preparé el entorno Linux con Docker e investigo la integración con SAP R/3 mediante APIs y BAPIs. El proyecto incluye evaluar correo, SMS y WhatsApp como canales de notificación.",
  },
  {
    id: "icono",
    type: "Desarrollo web",
    title: "Rediseño web para Icono Asesores",
    subtitle: "Servicios Web Icono · Estadía 2025",
    text: "Rediseño de Servicios Web Icono: navegación clara, interfaz adaptable y corrección de errores visuales.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Diseño responsivo"],
    status: "Estadía · 2025",
    details:
      "Durante mi estadía rediseñé el frontend de Servicios Web Icono, mejorando la presentación, la organización del contenido y la experiencia de navegación en escritorio, móvil y tablet.",
    contributions: [
      "Rediseñé la barra de navegación y adapté la interfaz a distintos tamaños de pantalla con CSS.",
      "Reorganicé Nosotros, Servicios y Contacto, y preparé la estructura para incorporar proyectos al Portafolio.",
      "Corregí enlaces, botones y fallos visuales del carrusel, y ajusté las imágenes para su visualización en móvil.",
      "Simplifiqué el código eliminando elementos innecesarios, plantillas sin usar y fragmentos rotos.",
    ],
  },
  {
    id: "restaurante",
    type: "Desarrollo web",
    title: "Punto de venta para restaurante",
    subtitle: "Proyecto académico en equipo",
    text: "Contribución al frontend de un punto de venta desarrollado como proyecto académico en equipo.",
    technologies: ["React", "JavaScript", "Frontend"],
    status: "Colaborativo",
    details:
      "Mi participación se centró en el frontend. El sistema completo fue un trabajo en equipo; el backend y el monitoreo con sensores formaban parte del alcance general del proyecto. La imagen de esta tarjeta es una representación ilustrativa, no una captura del sistema original.",
  },
].sort((a, b) => Number(b.id === "icono") - Number(a.id === "icono"));
function ProjectVisual({ id, onOpenGallery }) {
  if (id === "icono")
    return (
      <button
        type="button"
        className="project-visual visual-icono project-evidence"
        onClick={onOpenGallery}
        aria-label="Ver capturas del proyecto de Icono Asesores"
      >
        <img
          src={`${import.meta.env.BASE_URL}projects/icono-redesign.jpg`}
          alt="Sección Portafolio de Servicios Web Icono con tarjetas de Desarrollo Web, Aplicaciones y Marketing"
          width="1191"
          height="687"
          loading="lazy"
          decoding="async"
        />
        <span className="icono-evidence-label">
          <Expand size={14} /> VER 3 CAPTURAS · ESTADÍA 2025
        </span>
      </button>
    );
  if (id === "pedidos")
    return (
      <div className="project-visual visual-flow" aria-hidden="true">
        <span className="visual-caption">FLUJO / SEGUIMIENTO DE PEDIDOS</span>
        <div className="flow-nodes">
          <span>
            <Database />
            <small>SAP R/3</small>
          </span>
          <i />
          <span className="flow-main">
            <Workflow />
            <small>n8n</small>
          </span>
          <i />
          <span>
            <Bell />
            <small>Notificación</small>
          </span>
        </div>
        <span className="flow-note">
          <span /> Diseño de integración
        </span>
      </div>
    );
  if (id === "restaurante")
    return (
      <div className="project-visual visual-pos" aria-hidden="true">
        <div className="mini-pos">
          <div className="pos-sidebar">
            <Utensils size={18} />
            <span />
            <span />
            <span />
          </div>
          <div className="pos-content">
            <div className="pos-heading">
              Punto de venta <span>CAJA</span>
            </div>
            <div className="pos-products">
              <span>
                <Utensils />
                <i />
              </span>
              <span>
                <ShoppingBag />
                <i />
              </span>
              <span>
                <CreditCard />
                <i />
              </span>
            </div>
            <div className="pos-order">
              <span>Productos · Órdenes · Clientes</span>
              <Check size={12} />
            </div>
          </div>
        </div>
        <span className="visual-footnote">INTERFAZ CONCEPTUAL</span>
      </div>
    );
  return null;
}
export default function Projects() {
  const reducedMotion = useReducedMotion();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [filter, setFilter] = useState("Todos");
  const [expanded, setExpanded] = useState(null);
  return (
    <>
      <section id="proyectos" className="section container">
        <div className="section-heading" data-scroll-reveal="rise">
          <div>
            <p className="eyebrow">
              <span>02 /</span> DESARROLLO Y PRÁCTICAS
            </p>
            <h2>
              Proyectos en los que
              <br />
              <span>he trabajado</span>
            </h2>
          </div>
          <p>
            Trabajos de prácticas, proyectos académicos
            <br />y colaboraciones. En cada uno explico qué hice.
          </p>
        </div>
        <div className="project-toolbar" data-scroll-reveal="rise">
          <div className="filters" role="group" aria-label="Filtrar proyectos">
            {["Todos", "Desarrollo web", "Automatización"].map((item) => (
              <button
                key={item}
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
              >
                <SelectionPill
                  active={filter === item}
                  group="projects-filter"
                />
                {item}
                {item === "Todos" && (
                  <span>{String(projects.length).padStart(2, "0")}</span>
                )}
              </button>
            ))}
          </div>
          <a
            className="text-link"
            href="https://github.com/DanexoCT"
            data-magnetic="6"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver GitHub <ArrowUpRight size={16} />
          </a>
        </div>
        <Motion.div
          className="project-grid"
          key={filter}
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {projects
            .filter((project) => filter === "Todos" || project.type === filter)
            .map((project, index) => (
              <SpotlightCard
                key={project.id}
                className="project-card"
                tilt
                reveal
                revealOrder={index}
              >
                <ProjectVisual
                  id={project.id}
                  onOpenGallery={() => setGalleryOpen(true)}
                />
                <div className="project-info">
                  <p className="project-type">
                    {project.type}
                    <span>{project.status}</span>
                  </p>
                  <h3>{project.title}</h3>
                  <p className="project-subtitle">{project.subtitle}</p>
                  <p className="project-description">{project.text}</p>
                  <div className="tags">
                    {project.technologies.map((tech) => (
                      <TechBadge key={tech} name={tech} />
                    ))}
                  </div>
                  <button
                    className="project-detail"
                    aria-expanded={expanded === project.id}
                    aria-controls={`detail-${project.id}`}
                    onClick={() =>
                      setExpanded(expanded === project.id ? null : project.id)
                    }
                  >
                    {expanded === project.id
                      ? "Cerrar detalles"
                      : "Mi participación"}
                    <ArrowDown
                      size={16}
                      className={expanded === project.id ? "rotated" : ""}
                    />
                  </button>
                  <Collapsible
                    id={`detail-${project.id}`}
                    open={expanded === project.id}
                  >
                    <div className="project-expanded">
                      {project.details}
                      {project.contributions && (
                        <ul className="project-contributions">
                          {project.contributions.map((contribution) => (
                            <li key={contribution}>{contribution}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Collapsible>
                </div>
              </SpotlightCard>
            ))}
        </Motion.div>
      </section>
      {galleryOpen && (
        <LazyBoundary onDismiss={() => setGalleryOpen(false)}>
          <Suspense
            fallback={
              <p className="gallery-loading" role="status">
                Cargando capturas…
              </p>
            }
          >
            <ProjectGallery onDismiss={() => setGalleryOpen(false)} />
          </Suspense>
        </LazyBoundary>
      )}
    </>
  );
}
