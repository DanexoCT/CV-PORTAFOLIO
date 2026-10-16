import { useEffect, useId, useRef } from "react";
import { ArrowUpRight, Globe, Mail, Monitor, X } from "lucide-react";
import LiquidGlass from "./LiquidGlass";

const email = "danexo@outlook.com";
const subject = "Contacto desde tu CV web";
const providers = [
  {
    name: "Gmail",
    hint: "Redactar en el navegador",
    icon: Mail,
    href: `https://mail.google.com/mail/?${new URLSearchParams({ view: "cm", fs: "1", to: email, su: subject })}`,
    web: true,
    tone: "warm",
  },
  {
    name: "Outlook",
    hint: "Redactar en el navegador",
    icon: Globe,
    href: `https://outlook.live.com/mail/0/deeplink/compose?${new URLSearchParams({ to: email, subject })}`,
    web: true,
    tone: "blue",
  },
  {
    name: "Mi aplicación de correo",
    hint: "Requiere una aplicación configurada",
    icon: Monitor,
    href: `mailto:${email}?${new URLSearchParams({ subject })}`,
    web: false,
    tone: "violet",
  },
];

export default function EmailDialog({ dialogRef }) {
  const titleId = useId();
  const descriptionId = useId();
  const closeTimer = useRef(null);
  const tiltFrame = useRef(null);

  useEffect(
    () => () => {
      clearTimeout(closeTimer.current);
      cancelAnimationFrame(tiltFrame.current);
    },
    [],
  );

  function resetTilt() {
    cancelAnimationFrame(tiltFrame.current);
    dialogRef.current?.style.removeProperty("--email-tilt-x");
    dialogRef.current?.style.removeProperty("--email-tilt-y");
  }

  function moveTilt(event) {
    const dialog = dialogRef.current;
    if (
      !dialog ||
      dialog.dataset.closing ||
      event.pointerType !== "mouse" ||
      !window.matchMedia(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      ).matches
    )
      return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    ) {
      resetTilt();
      return;
    }
    const x = Math.max(
      -0.5,
      Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5),
    );
    const y = Math.max(
      -0.5,
      Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5),
    );
    cancelAnimationFrame(tiltFrame.current);
    tiltFrame.current = requestAnimationFrame(() => {
      dialog.style.setProperty("--email-tilt-x", `${-y * 4}deg`);
      dialog.style.setProperty("--email-tilt-y", `${x * 4}deg`);
    });
  }

  function requestClose() {
    const dialog = dialogRef.current;
    if (!dialog?.open || dialog.dataset.closing) return;
    resetTilt();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.close();
      return;
    }
    dialog.dataset.closing = "true";
    closeTimer.current = window.setTimeout(() => dialog.close(), 180);
  }

  function finishClose() {
    clearTimeout(closeTimer.current);
    resetTilt();
    dialogRef.current?.removeAttribute("data-closing");
  }
  function dismissBackdrop(event) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      requestClose();
  }
  return (
    <dialog
      ref={dialogRef}
      className="email-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClick={dismissBackdrop}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClose={finishClose}
      onPointerMove={moveTilt}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
    >
      <LiquidGlass className="email-liquid-glass" />
      <div className="email-dialog-content">
        <button
          className="email-dialog-close"
          type="button"
          onClick={requestClose}
          aria-label="Cerrar opciones de correo"
        >
          <X size={19} />
        </button>
        <div className="email-dialog-heading">
          <span className="email-dialog-icon" aria-hidden="true">
            <Mail size={27} />
          </span>
          <span className="email-dialog-eyebrow">ESCRIBIR UN CORREO</span>
        </div>
        <h3 id={titleId}>Escríbeme</h3>
        <p id={descriptionId}>
          Elige el servicio que usas para abrir un borrador.
        </p>
        <div className="email-providers">
          {providers.map(
            ({ name, hint, icon: Icon, href, web, tone }, index) => (
              <a
                key={name}
                href={href}
                target={web ? "_blank" : undefined}
                rel={web ? "noopener noreferrer" : undefined}
                onClick={requestClose}
                data-tone={tone}
                style={{ "--option-index": index }}
              >
                <span className="email-provider-icon">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span>
                  <strong>{name}</strong>
                  <small>{hint}</small>
                </span>
                <span className="email-provider-arrow">
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </a>
            ),
          )}
        </div>
        <div className="email-dialog-address">
          <span className="email-recipient-dot" aria-hidden="true" />
          <span>
            <small>DESTINATARIO</small>
            <strong>{email}</strong>
          </span>
          <Mail size={15} aria-hidden="true" />
        </div>
      </div>
    </dialog>
  );
}
