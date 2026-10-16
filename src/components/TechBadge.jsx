import {
  Braces,
  Workflow,
  Cpu,
  Cable,
  Boxes,
  Database,
  Code2,
  FileText,
  ListChecks,
  CircuitBoard,
} from "lucide-react";

const technologies = {
  React: { asset: "react", color: "#61dafb" },
  JavaScript: { asset: "javascript", color: "#f7df1e" },
  HTML5: { asset: "html5", color: "#e56a43" },
  CSS3: { asset: "css3", color: "#549eed" },
  "Node.js": { asset: "nodejs", color: "#82bd6a" },
  Express: { asset: "express", color: "#d8d8e2", monochrome: true },
  PHP: { asset: "php", color: "#a3a5e1" },
  Laravel: { asset: "laravel", color: "#ff625c" },
  MySQL: { asset: "mysql", color: "#73abc4" },
  MongoDB: { asset: "mongodb", color: "#78bc60" },
  Linux: { asset: "linux", color: "#efca66" },
  Docker: { asset: "docker", color: "#55b1ef" },
  Git: { asset: "git", color: "#f07159" },
  GitHub: { asset: "github", color: "#dedbe8", monochrome: true },
  n8n: { icon: Workflow, color: "#ef829f" },
  APIs: { icon: Braces, color: "#85c9d2" },
  "Integración de sistemas": { icon: Cable, color: "#a6d2bf" },
  "IA aplicada": { icon: Cpu, color: "#c2a2fa" },
  VirtualBox: { icon: Boxes, color: "#8ba9e6" },
  "SAP R/3": { icon: Database, color: "#8bc7ee" },
  IoT: { icon: CircuitBoard, color: "#9fd0a7" },
  Requerimientos: { icon: ListChecks, color: "#c6afd8" },
  Documentación: { icon: FileText, color: "#b3b1d8" },
};

export default function TechBadge({ name, variant = "badge" }) {
  const {
    asset,
    icon: Icon = Code2,
    color = "#b49af6",
    monochrome,
  } = technologies[name] ?? {};
  return (
    <span
      className={`tech-badge tech-${variant}`}
      style={{ "--tech-color": color }}
    >
      <span className="tech-symbol" aria-hidden="true">
        {asset ? (
          <img
            src={`${import.meta.env.BASE_URL}tech/${asset}.svg`}
            alt=""
            width="24"
            height="24"
            loading="lazy"
            decoding="async"
            className={monochrome ? "tech-monochrome" : undefined}
          />
        ) : (
          <Icon size={22} strokeWidth={1.6} />
        )}
      </span>
      <span className="tech-name">{name}</span>
    </span>
  );
}
