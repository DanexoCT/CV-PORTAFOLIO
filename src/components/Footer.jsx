import {
  ArrowUp,
  ArrowUpRight,
  Download,
  MapPin,
  Code2,
  Check,
} from "lucide-react";

const links = [
  ["proyectos", "Proyectos"],
  ["demos", "Demos"],
  ["experiencia", "Experiencia"],
  ["tecnologias", "Tecnologías"],
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-top" data-scroll-reveal="rise">
          <div className="footer-intro">
            <p className="eyebrow">
              <span>07 /</span> ENLACES Y CONTACTO
            </p>
            <p className="footer-note">
              Dan Valle
              <br />
              <span>Desarrollo de software</span>
            </p>
          </div>
          <nav
            className="footer-navigation"
            aria-label="Navegación del pie de página"
          >
            {links.map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            ))}
          </nav>
          <div className="footer-profile">
            <a className="footer-availability" href="mailto:danexo@outlook.com">
              <span aria-hidden="true" />
              Abierto a oportunidades
            </a>
            <p>
              <MapPin size={12} aria-hidden="true" />
              Guadalajara, México
            </p>
            <a
              className="footer-download"
              data-magnetic="6"
              href={`${import.meta.env.BASE_URL}cv.pdf`}
              download="CV_Dan_Alejandro_Valle_Mendoza.pdf"
            >
              Descargar CV
              <Download size={14} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="footer-signature" data-scroll-reveal="zoom">
          <div className="footer-craft">
            <div className="footer-craft-bar">
              <span>
                <Code2 size={15} aria-hidden="true" /> portfolio.jsx
              </span>
              <span>FRONTEND / REACT</span>
            </div>
            <div className="footer-craft-body">
              <div className="footer-code">
                <p className="footer-code-comment">// Sobre esta página</p>
                <code>
                  <span className="footer-code-punctuation">&lt;</span>
                  <span className="footer-code-component">Portafolio</span>
                  <br />
                  <span className="footer-code-line">
                    <span className="footer-code-property">interfaz</span>=
                    <span className="footer-code-string">"React"</span>
                  </span>
                  <br />
                  <span className="footer-code-line">
                    <span className="footer-code-property">estilos</span>=
                    <span className="footer-code-string">"CSS"</span>
                  </span>
                  <br />
                  <span className="footer-code-punctuation">/&gt;</span>
                </code>
                <p className="footer-code-caption">
                  Esta página está desarrollada con React, JavaScript y CSS.
                </p>
              </div>
              <div className="footer-render" aria-hidden="true">
                <div className="footer-render-bar">
                  <span />
                  <span />
                  <span />
                  <i />
                </div>
                <p>
                  Dan Valle
                  <br />
                  <span>Desarrollo web</span>
                </p>
                <div className="footer-render-cards">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="footer-render-details">
                  <span className="footer-palette">
                    <i />
                    <i />
                    <i />
                  </span>
                  <img
                    className="footer-render-logo"
                    src={`${import.meta.env.BASE_URL}tech/react.svg`}
                    alt=""
                    width="19"
                    height="19"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            <div className="footer-craft-status">
              <span>
                <Check size={12} aria-hidden="true" /> React · JavaScript · CSS
              </span>
              <span className="footer-code-caret" aria-hidden="true">
                _
              </span>
            </div>
          </div>
          <a className="footer-back-top" href="#inicio" data-magnetic="10">
            <span className="mono">
              VOLVER
              <br />
              AL INICIO
            </span>
            <span className="footer-back-icon">
              <ArrowUp size={24} aria-hidden="true" />
            </span>
          </a>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Dan Alejandro Valle Mendoza</p>
          <p className="footer-built">
            <img
              src={`${import.meta.env.BASE_URL}tech/react.svg`}
              width="14"
              height="14"
              alt=""
              loading="lazy"
            />
            Diseñado y desarrollado con React
          </p>
          <span className="footer-end mono" aria-hidden="true">
            &lt;/portfolio&gt;
          </span>
        </div>
      </div>
    </footer>
  );
}
