import { useState } from "react";
import {
  ArrowUpRight,
  Copy,
  Check,
  Code2,
  BriefcaseBusiness,
  Mail,
} from "lucide-react";
import { useRef } from "react";
import EmailDialog from "./EmailDialog";
import { useEffect } from "react";
import {
  AnimatePresence,
  motion as Motion,
  useReducedMotion,
} from "motion/react";
import "./ProfileContact.css";
export default function Contact() {
  const emailDialog = useRef(null);
  const copyTimer = useRef(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  const [copyState, setCopyState] = useState("idle");
  async function copyEmail() {
    if (copyState === "pending") return;
    clearTimeout(copyTimer.current);
    setCopyState("pending");
    try {
      await navigator.clipboard.writeText("danexo@outlook.com");
      setCopyState("copied");
      copyTimer.current = setTimeout(() => setCopyState("idle"), 2600);
    } catch {
      setCopyState("failed");
    }
  }
  return (
    <section id="contacto" className="section contact-section">
      <div className="container">
        <p className="eyebrow" data-scroll-reveal="rise">
          <span>06 /</span> CORREO Y REDES
        </p>
        <div className="contact-heading" data-scroll-reveal="zoom">
          <h2>Contacto</h2>
          <button
            type="button"
            className="contact-arrow"
            data-magnetic="12"
            onClick={() => emailDialog.current?.showModal()}
            aria-label="Elegir cómo escribir un correo a Dan"
            aria-haspopup="dialog"
          >
            <ArrowUpRight />
          </button>
        </div>
        <div
          className="contact-bottom"
          data-scroll-reveal="rise"
          data-reveal-order="1"
        >
          <div>
            <p>
              Puedes escribirme sobre una oportunidad de trabajo,
              <br />
              un proyecto o alguna pregunta sobre mi experiencia.
            </p>
            <div className="email-row" data-copy-state={copyState}>
              <a href="mailto:danexo@outlook.com">danexo@outlook.com</a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label={
                  copyState === "copied"
                    ? "Correo copiado. Copiar de nuevo"
                    : "Copiar correo electrónico"
                }
                aria-busy={copyState === "pending"}
                disabled={copyState === "pending"}
                data-magnetic="5"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <Motion.span
                    key={copyState === "copied" ? "check" : "copy"}
                    className="copy-button-icon"
                    initial={
                      reducedMotion
                        ? false
                        : { opacity: 0, scale: 0.65, rotate: -20 }
                    }
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={
                      reducedMotion
                        ? undefined
                        : { opacity: 0, scale: 0.7, rotate: 20 }
                    }
                    transition={{ duration: 0.18 }}
                  >
                    {copyState === "copied" ? (
                      <Check size={17} />
                    ) : (
                      <Copy size={17} />
                    )}
                  </Motion.span>
                </AnimatePresence>
              </button>
            </div>
            <span className="copy-status" role="status">
              {copyState === "pending"
                ? "Copiando correo…"
                : copyState === "copied"
                  ? "Correo copiado"
                  : copyState === "failed"
                    ? "Puedes seleccionar el correo para copiarlo."
                    : ""}
            </span>
          </div>
          <div className="contact-socials">
            <Motion.a
              href="https://github.com/DanexoCT"
              data-magnetic="5"
              initial={reducedMotion ? false : { opacity: 0, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Code2 size={17} /> GitHub <ArrowUpRight size={15} />
            </Motion.a>
            <Motion.a
              href="https://www.linkedin.com/in/dan-valle-mendoza-205086443/"
              data-magnetic="5"
              initial={reducedMotion ? false : { opacity: 0, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BriefcaseBusiness size={17} /> LinkedIn{" "}
              <ArrowUpRight size={15} />
            </Motion.a>
            <Motion.button
              initial={reducedMotion ? false : { opacity: 0, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              type="button"
              onClick={() => emailDialog.current?.showModal()}
              data-magnetic="5"
              aria-haspopup="dialog"
            >
              <Mail size={17} /> Enviar correo <ArrowUpRight size={15} />
            </Motion.button>
          </div>
        </div>
      </div>
      <EmailDialog dialogRef={emailDialog} />
    </section>
  );
}
