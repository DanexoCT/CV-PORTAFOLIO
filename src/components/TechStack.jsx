import { Code2, Database, Workflow, Server } from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import TechBadge from "./TechBadge";

const stack = [
  {
    icon: Code2,
    title: "Interfaces web",
    label: "FRONTEND",
    tools: ["React", "JavaScript", "HTML5", "CSS3"],
  },
  {
    icon: Database,
    title: "Backend y bases de datos",
    label: "BACKEND",
    tools: ["Node.js", "Express", "PHP", "Laravel", "MySQL", "MongoDB"],
  },
  {
    icon: Workflow,
    title: "Flujos e integraciones",
    label: "AUTOMATIZACIÓN",
    tools: ["n8n", "APIs", "Integración de sistemas", "IA aplicada"],
  },
  {
    icon: Server,
    title: "Entornos y versionado",
    label: "INFRAESTRUCTURA",
    tools: ["Linux", "Docker", "Git", "GitHub", "VirtualBox"],
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
            Herramientas que he utilizado en prácticas,
            <br />
            proyectos académicos y desarrollo web.
          </p>
        </div>
        <div className="stack-grid">
          {stack.map(({ icon: Icon, title, label, tools }, index) => (
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
              <div className="stack-tools">
                {tools.map((tool) => (
                  <TechBadge key={tool} name={tool} variant="tile" />
                ))}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
