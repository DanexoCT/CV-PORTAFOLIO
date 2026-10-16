import { Code2, Database, Workflow } from "lucide-react";
import { motion as Motion, useReducedMotion } from "motion/react";
import SpotlightCard from "./SpotlightCard";
import "./ProfileContact.css";
import { ArrowUpRight, GraduationCap, MapPin } from "lucide-react";
export default function About() {
  const reducedMotion = useReducedMotion();
  return (
    <section id="sobre-mi" className="section about-section">
      <div className="container about-grid">
        <div className="about-lead" data-scroll-reveal="left">
          <p className="eyebrow">
            <span>04 /</span> PERFIL
          </p>
          <h2>Sobre mí</h2>
          <div className="about-signature">
            <span className="avatar-monogram">
              D V<span></span>
            </span>
            <div>
              <strong>Dan Alejandro Valle Mendoza</strong>
              <span>
                <MapPin size={13} /> Guadalajara, México
              </span>
            </div>
          </div>
          <div
            className="about-process"
            role="list"
            aria-label="Áreas de interés"
          >
            {[
              { label: "Frontend", icon: Code2 },
              { label: "Backend", icon: Database },
              { label: "Integración", icon: Workflow },
            ].map(({ label, icon: Icon }, index) => (
              <Motion.div
                role="listitem"
                className="about-process-node"
                key={label}
                initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
              >
                <Icon size={21} strokeWidth={1.4} aria-hidden="true" />
                <span>{label}</span>
                <small aria-hidden="true">0{index + 1}</small>
              </Motion.div>
            ))}
          </div>
        </div>
        <div
          className="about-copy"
          data-scroll-reveal="right"
          data-reveal-order="1"
        >
          <Motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            Me gusta trabajar en la parte visual de una web y entender cómo
            funciona lo que hay detrás. He participado tanto en el diseño de
            interfaces como en tareas de backend e integración.
          </Motion.p>
          <Motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Suelo aprender investigando y probando. También utilizo herramientas
            de IA como apoyo para programar y depurar, revisando los resultados
            antes de incorporarlos a un proyecto.
          </Motion.p>
          <SpotlightCard
            className="education about-education"
            tilt
            tiltIntensity={2.5}
          >
            <GraduationCap size={22} />
            <div>
              <span className="eyebrow">
                UNIVERSIDAD TECNOLÓGICA DE JALISCO
              </span>
              <h3>
                Ingeniería en Desarrollo y Gestión de Software Multiplataforma
              </h3>
              <p>Mayo 2023 — Diciembre 2026 · En curso</p>
              <p className="education-tsu">
                TSU completado · Mayo 2023 — Abril 2025
              </p>
            </div>
          </SpotlightCard>
          <a
            href="https://www.linkedin.com/in/dan-valle-mendoza-205086443/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
            data-magnetic="6"
          >
            Ver perfil en LinkedIn <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
