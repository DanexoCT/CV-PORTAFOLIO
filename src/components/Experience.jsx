import { ArrowUpRight, BriefcaseBusiness, Code2, Workflow } from "lucide-react";
import { useRef } from "react";
import {
  motion as Motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import TechBadge from "./TechBadge";
import SpotlightCard from "./SpotlightCard";
import "./Experience.css";
const experiences = [
  {
    date: "SEP 2026 — ACTUALIDAD",
    company: "Colchones Wendy",
    context: "Automatización e integración de sistemas",
    icon: Workflow,
    role: "Practicante de Automatización de Procesos y Desarrollo de Software",
    location: "Guadalajara · Presencial",
    current: true,
    points: [
      "Analizo y documento el seguimiento de pedidos mediante entrevistas y levantamiento de requerimientos.",
      "Diseño flujos con n8n y preparé el entorno de ejecución en Linux con Docker.",
      "Investigo la integración con SAP R/3 y evalúo canales para notificar a los clientes.",
    ],
    tags: ["n8n", "Docker", "Linux", "APIs", "SAP R/3"],
  },
  {
    date: "ENE 2025 — ABR 2025",
    company: "Icono Asesores",
    legalName: "Icono Soluciones en Informática S.A. de C.V.",
    context: "Distribuidor Autorizado CONTPAQi",
    icon: Code2,
    role: "Practicante de Desarrollo de Software y Web",
    location: "Guadalajara · Híbrido",
    points: [
      "Trabajé en el desarrollo y mantenimiento del frontend de Servicios Web Icono durante mi estadía profesional.",
      "Atendí ajustes de navegación, contenido y diseño adaptable, y documenté recomendaciones para dar continuidad al sitio.",
    ],
    tags: ["HTML5", "CSS3", "JavaScript", "Diseño responsivo"],
  },
  {
    date: "COLABORACIÓN FREELANCE",
    company: "Vlock Constructora",
    context: "Desarrollo web por proyecto",
    icon: Code2,
    role: "Colaboración en frontend",
    location: "Guadalajara",
    points: [
      "Colaboré en el frontend de proyectos web para la constructora.",
      "Participé en el levantamiento de requerimientos, la comunicación con el cliente y la documentación de funcionalidades.",
    ],
    tags: ["Frontend", "Requerimientos", "Documentación"],
  },
];
export default function Experience() {
  const reducedMotion = useReducedMotion();
  const list = useRef(null);
  const { scrollYProgress } = useScroll({
    target: list,
    offset: ["start 85%", "end 65%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28 });
  const entrance = {
    hidden: { opacity: 0, y: 32 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.08,
        staggerChildren: 0.08,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };
  const detail = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, staggerChildren: 0.07 },
    },
  };
  return (
    <section id="experiencia" className="section container">
      <div className="section-heading" data-scroll-reveal="rise">
        <div>
          <p className="eyebrow">
            <span>01 /</span> TRAYECTORIA
          </p>
          <h2>Experiencia profesional</h2>
        </div>
        <a
          className="text-link"
          data-magnetic="6"
          href={`${import.meta.env.BASE_URL}cv.pdf`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver CV completo <ArrowUpRight size={16} />
        </a>
      </div>
      <div ref={list} className="experience-list experience-timeline">
        <span className="experience-rail" aria-hidden="true">
          <Motion.span style={{ scaleY: reducedMotion ? 1 : progress }} />
        </span>
        {experiences.map((item, index) => (
          <Motion.article
            key={item.company}
            className="experience-entry"
            custom={index}
            variants={entrance}
            initial={reducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <SpotlightCard className="experience-row" tilt tiltIntensity={3}>
              <Motion.div className="experience-date" variants={detail}>
                <span className="experience-emblem" aria-hidden="true">
                  <item.icon size={25} />
                </span>
                <span className="mono">{item.date}</span>
                {item.current && (
                  <span className="current-badge">
                    <i /> Actualmente
                  </span>
                )}
              </Motion.div>
              <Motion.div className="experience-body" variants={detail}>
                <p className="experience-location">{item.location}</p>
                <h3>{item.company}</h3>
                {item.legalName && (
                  <p className="experience-legal-name">{item.legalName}</p>
                )}
                <p className="experience-context">
                  <BriefcaseBusiness size={13} aria-hidden="true" />
                  {item.context}
                </p>
                <h4>{item.role}</h4>
                <ul>
                  {item.points.map((point) => (
                    <Motion.li key={point} variants={detail}>
                      {point}
                    </Motion.li>
                  ))}
                </ul>
                <div className="tags">
                  {item.tags.map((tag) => (
                    <TechBadge key={tag} name={tag} />
                  ))}
                </div>
              </Motion.div>
              <Motion.span className="experience-index mono" variants={detail}>
                0{index + 1}
              </Motion.span>
            </SpotlightCard>
          </Motion.article>
        ))}
      </div>
    </section>
  );
}
