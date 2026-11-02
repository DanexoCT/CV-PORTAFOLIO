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
        label: "Experiencia práctica",
        tools: ["React", "JavaScript", "HTML5", "CSS3"],
      },
      {
        label: "Formación académica",
        tools: ["TypeScript", "Vue"],
      },
    ],
  },
  {
    icon: Database,
    title: "Backend y bases de datos",
    label: "BACKEND",
    groups: [
      {
        label: "Experiencia práctica",
        tools: ["PHP", "Laravel", "SQL", "MySQL"],
      },
      {
        label: "Formación académica",
        tools: ["Node.js", "Express", "Python", "MongoDB"],
      },
    ],
  },
  {
    icon: Workflow,
    title: "Flujos e integraciones",
    label: "AUTOMATIZACIÓN",
    groups: [
      {
        label: "Experiencia práctica",
        tools: ["n8n", "APIs", "Integración de sistemas"],
      },
    ],
  },
  {
    icon: Server,
    title: "Entornos y versionado",
    label: "INFRAESTRUCTURA",
    groups: [
      {
        label: "Experiencia práctica",
        tools: ["Linux", "Docker", "Git", "GitHub"],
      },
      {
        label: "Formación académica",
        tools: ["Apache", "VirtualBox"],
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
        label: "Experiencia práctica",
        tools: ["Codex", "Claude", "Gemini", "ChatGPT"],
      },
    ],
  },
  {
    icon: Smartphone,
    title: "Aplicaciones móviles y de escritorio",
    label: "MULTIPLATAFORMA",
    description:
      "Familiaridad académica con Java y NetBeans para aplicaciones de escritorio, y con Java y Kotlin en Android Studio para Android.",
    groups: [
      {
        label: "Formación académica",
        tools: ["Java", "NetBeans", "Kotlin", "Android Studio"],
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
            Mi especialidad es el desarrollo web. Distingo las herramientas que
            uso fuera del aula de aquellas con las que tengo familiaridad por mi
            formación académica.
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
