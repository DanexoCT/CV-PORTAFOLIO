import {
  ArrowDown,
  ArrowUpRight,
  Download,
  MapPin,
  Code2,
  Workflow,
  Check,
  Braces,
  Database,
} from "lucide-react";
import { motion as Motion, useReducedMotion } from "motion/react";
import TechBadge from "./TechBadge";
export default function Hero() {
  const reducedMotion = useReducedMotion();
  return (
    <section className="hero-section container" id="inicio">
      <Motion.div
        className="hero-copy"
        initial={reducedMotion ? false : { opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
      >
        <div className="availability">
          <span /> Abierto a oportunidades <i /> <b className="mono">2026</b>
        </div>
        <p className="hero-intro">
          <span className="hero-name">DAN ALEJANDRO VALLE MENDOZA</span>
        </p>
        <h1>
          Desarrollo web
          <br />
          <span>y automatización</span>
        </h1>
        <p className="hero-description">
          Estoy terminando la Ingeniería en Desarrollo y Gestión de Software
          Multiplataforma en la Universidad Tecnológica de Jalisco. Me interesa
          especialmente el <strong>frontend</strong> y he colaborado en
          proyectos web y de <strong>automatización</strong>.
        </p>
        <div className="hero-actions">
          <a
            href="#proyectos"
            className="button button-primary"
            data-magnetic="10"
          >
            Ver proyectos <ArrowUpRight size={18} />
          </a>
          <a
            href={`${import.meta.env.BASE_URL}cv.pdf`}
            download="CV_Dan_Alejandro_Valle_Mendoza.pdf"
            className="button button-secondary"
            data-magnetic="8"
          >
            <Download size={17} /> Descargar CV
          </a>
        </div>
        <div className="hero-specialties" aria-label="Tecnologías principales">
          {["React", "JavaScript", "Laravel", "n8n"].map((name) => (
            <TechBadge key={name} name={name} />
          ))}
        </div>
        <p className="hero-location">
          <MapPin size={14} /> Guadalajara, Jalisco, México <span>·</span> Web &
          automatización
        </p>
        <a className="hero-experience-link" href="#experiencia">
          Experiencia en <strong>Wendy</strong> e{" "}
          <strong>Icono Asesores</strong>
          <ArrowUpRight size={13} />
        </a>
      </Motion.div>
      <div
        className="hero-art"
        aria-label="Ilustración de desarrollo e integración de sistemas"
        role="img"
      >
        <div className="art-grid" />
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <span className="art-label mono">PERFIL TÉCNICO</span>
        <div className="floating-tag tag-code">
          <Code2 size={17} /> frontend
        </div>
        <div className="code-window">
          <div className="window-bar">
            <span className="window-dots">
              <i />
              <i />
              <i />
            </span>
            <span>dan / developer.js</span>
            <Braces size={14} />
          </div>
          <div className="code-body">
            <p>
              <span className="code-muted">01</span>{" "}
              <span className="code-purple">const</span> developer = {"{"}
            </p>
            <p>
              <span className="code-muted">02</span> &nbsp; name:{" "}
              <span className="code-green">"Dan Valle"</span>,
            </p>
            <p>
              <span className="code-muted">03</span> &nbsp; focus: [
            </p>
            <p>
              <span className="code-muted">04</span> &nbsp; &nbsp;{" "}
              <span className="code-green">"web"</span>,
            </p>
            <p>
              <span className="code-muted">05</span> &nbsp; &nbsp;{" "}
              <span className="code-green">"automation"</span>
            </p>
            <p>
              <span className="code-muted">06</span> &nbsp; ],
            </p>
            <p>
              <span className="code-muted">07</span> &nbsp; role:{" "}
              <span className="code-green">"software developer"</span>
            </p>
            <p>
              <span className="code-muted">08</span> {"}"};
            </p>
            <div className="terminal-line">
              <span>❯</span> npm run dev
              <span className="cursor" />
            </div>
          </div>
        </div>
        <div className="floating-tag tag-data">
          <Database size={16} /> APIs y datos
        </div>
        <div className="workflow-preview">
          <div className="workflow-icon">
            <Workflow size={20} />
          </div>
          <div>
            <strong>Seguimiento de pedidos</strong>
            <span>Flujos con n8n</span>
          </div>
          <span className="workflow-check">
            <Check size={15} />
          </span>
        </div>
        <span className="art-caption mono">
          <span /> FRONTEND · BACKEND · AUTOMATIZACIÓN
        </span>
      </div>
      <div className="hero-bottom">
        <a href="#proyectos">
          <ArrowDown size={16} /> Ver proyectos
        </a>
        <span className="mono">DESARROLLO DE SOFTWARE</span>
        <span className="edition mono">CV / 2026</span>
      </div>
    </section>
  );
}
