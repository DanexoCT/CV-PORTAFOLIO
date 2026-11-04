import { Code2, Database, Workflow, Server, Cpu, Smartphone } from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import TechBadge from "./TechBadge";
import "./TechStack.css";

const stack = [
  {
    icon: Code2,
    title: "Interfaces web",
    label: "FRONTEND",
    groups: [
      {
        label: "Experiencia sólida",
        tools: ["React", "JavaScript", "HTML5", "CSS3", "Tailwind CSS"],
      },
    ],
  },
  {
    icon: Database,
    title: "Backend y bases de datos",
    label: "BACKEND",
    groups: [
      {
        label: "Experiencia sólida",
        tools: ["PHP", "Laravel", "MySQL"],
      },
      {
        label: "Experiencia previa",
        tools: ["Node.js", "Express", "MongoDB", "Python"],
      },
    ],
  },
  {
    icon: Server,
    title: "Entornos y versionado",
    label: "INFRAESTRUCTURA",
    groups: [
      {
        label: "Uso frecuente",
        tools: ["Git", "GitHub", "VirtualBox"],
      },
      {
        label: "Experiencia previa",
        tools: ["Linux", "Docker"],
      },
    ],
  },
  {
    icon: Workflow,
    title: "Flujos e integraciones",
    label: "AUTOMATIZACIÓN",
    groups: [
      {
        label: "Experiencia complementaria",
        tools: ["APIs", "Integración de sistemas"],
      },
      {
        label: "Experiencia previa",
        tools: ["n8n"],
      },
    ],
  },
  {
    icon: Cpu,
    title: "Desarrollo asistido por IA",
    label: "HERRAMIENTAS DE IA",
    description:
      "Apoyo para desarrollar, depurar y revisar código, elaborar consultas a bases de datos, organizar tareas y documentar proyectos. Reviso y valido los resultados antes de integrarlos.",
    groups: [
      {
        label: "Uso frecuente",
        tools: ["Codex", "Claude", "Gemini", "ChatGPT"],
      },
    ],
  },
  {
    icon: Smartphone,
    title: "Aplicaciones Android",
    label: "DESARROLLO MÓVIL",
    description:
      "Experiencia en desarrollo Android con Kotlin en Android Studio, como complemento a mi especialidad en desarrollo web.",
    groups: [
      {
        label: "Experiencia previa",
        tools: ["Kotlin", "Android Studio", "Java"],
      },
    ],
  },
];

export default function TechStack() {
  return (
    <section className="section stack-section" id="tecnologias">
      <div className="container">
        <div className="section-heading" data-scroll-reveal="rise">
          <div>
            <p className="eyebrow">
              <span>05 /</span> HERRAMIENTAS
            </p>
            <h2>Tecnologías que utilizo</h2>
          </div>
          <p>
            Mi fuerte es el desarrollo web con React, JavaScript, PHP, Laravel y
            MySQL. Las herramientas se agrupan según mi experiencia y frecuencia
            de uso.
          </p>
        </div>
        <div className="stack-grid">
          {stack.map(({ icon: Icon, title, label, description, groups }, index) => (
            <SpotlightCard
              key={label}
              className="stack-item"
              tilt
              reveal
              revealOrder={index}
            >
              <div className="stack-card-top">
                <div className="stack-icon">
                  <Icon size={23} aria-hidden="true" />
                </div>
                <span className="stack-number mono">0{index + 1}</span>
              </div>
              <span className="mono">{label}</span>
              <h3>{title}</h3>
              {description && <p className="stack-description">{description}</p>}
              {groups.map((group) => (
                <div className="stack-group" key={group.label}>
                  <h4 className="stack-group-label">{group.label}</h4>
                  <div className="stack-tools">
                    {group.tools.map((tool) => (
                      <TechBadge key={tool} name={tool} variant="tile" />
                    ))}
                  </div>
                </div>
              ))}
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
