import { AnimatedDetails } from "../components/InterfaceMotion";
import DemoSelect from "./DemoSelect";
import "./workflow.css";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Code2,
  RotateCcw,
} from "lucide-react";
import { projectTypes, scopes, validateBrief } from "./workflow";

const emptyValues = {
  project: "",
  scope: "",
  name: "",
  email: "",
  message: "",
};
const steps = ["Proyecto", "Detalles", "Revisión"];
export default function FormDemo() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [complete, setComplete] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const heading = useRef(null);
  const form = useRef(null);
  function focusHeading() {
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({
        block: "nearest",
        behavior: "instant",
      });
    });
  }
  function reset() {
    setStep(0);
    setValues(emptyValues);
    setErrors({});
    setComplete(false);
    setAnnouncement("Formulario restablecido.");
    focusHeading();
  }
  function update(key, value) {
    const nextValues = { ...values, [key]: value };
    setValues(nextValues);
    if (errors[key])
      setErrors((previous) => ({
        ...previous,
        [key]: validateBrief(nextValues, step)[key],
      }));
  }
  function blur(key) {
    const error = validateBrief(values, step)[key];
    setErrors((previous) => ({ ...previous, [key]: error }));
  }
  function next(event) {
    event.preventDefault();
    const nextErrors =
      step === 2
        ? { ...validateBrief(values, 0), ...validateBrief(values, 1) }
        : validateBrief(values, step);
    if (Object.keys(nextErrors).length) {
      if (step === 2) setStep(nextErrors.project || nextErrors.scope ? 0 : 1);
      setErrors(nextErrors);
      setAnnouncement("Revisa los campos indicados antes de continuar.");
      requestAnimationFrame(() => {
        const field = form.current?.querySelector('[aria-invalid="true"]');
        field?.focus({ preventScroll: true });
        field?.scrollIntoView({ block: "nearest", behavior: "instant" });
      });
      return;
    }
    setErrors({});
    setAnnouncement("");
    if (step === 2) setComplete(true);
    else setStep(step + 1);
    focusHeading();
  }
  function errorProps(key) {
    return {
      "aria-invalid": !!errors[key],
      "aria-describedby": errors[key] ? `brief-error-${key}` : undefined,
    };
  }
  const error = (key) =>
    errors[key] && (
      <span className="brief-error" id={`brief-error-${key}`}>
        {errors[key]}
      </span>
    );
  return (
    <>
      <div className="demo-toolbar">
        <div>
          <span className="demo-label">FORMULARIOS Y VALIDACIÓN</span>
          <h3>De una idea a un resumen</h3>
          <p>
            Prueba un formulario por pasos con validación y revisión. Usa datos
            ficticios: no se envía información ni se guarda al salir.
          </p>
        </div>
        <button type="button" className="demo-reset" onClick={reset}>
          <RotateCcw size={14} /> Restablecer
        </button>
      </div>
      <div className="brief-layout">
        <aside className="brief-sidebar">
          <span className="demo-label">NUEVO PROYECTO / DEMO</span>
          <h4>Una solicitud, paso a paso.</h4>
          <ol>
            {steps.map((label, index) => (
              <li
                key={label}
                aria-current={!complete && index === step ? "step" : undefined}
                className={index < step || complete ? "is-complete" : ""}
              >
                <span>
                  {index < step || complete ? (
                    <Check size={14} />
                  ) : (
                    `0${index + 1}`
                  )}
                </span>
                <div>
                  <strong>{label}</strong>
                  <small>
                    {
                      [
                        "Tipo y alcance",
                        "Contexto y contacto",
                        "Antes de terminar",
                      ][index]
                    }
                  </small>
                </div>
              </li>
            ))}
          </ol>
          <p>
            Campos con etiqueta, errores específicos y navegación por teclado.
          </p>
        </aside>
        <div className="brief-content">
          {complete ? (
            <div className="brief-success">
              <CheckCircle2 size={46} strokeWidth={1.2} />
              <h4 ref={heading} tabIndex={-1}>
                Resumen preparado
              </h4>
              <p>
                El flujo terminó correctamente. Esta es una demostración: no se
                ha enviado ningún correo ni solicitud.
              </p>
              <button
                type="button"
                className="workflow-primary"
                onClick={reset}
              >
                Probar otra vez <RotateCcw size={15} />
              </button>
            </div>
          ) : (
            <form ref={form} noValidate onSubmit={next}>
              <div className="brief-step-heading">
                <span>PASO {step + 1} DE 3</span>
                <h4 ref={heading} tabIndex={-1}>
                  {
                    [
                      "¿Qué quieres construir?",
                      "Cuéntame un poco más",
                      "Revisa el resumen",
                    ][step]
                  }
                </h4>
              </div>
              {step === 0 && (
                <div className="brief-fields">
                  <label htmlFor="brief-project">
                    Tipo de proyecto
                    <DemoSelect
                      id="brief-project"
                      required
                      value={values.project}
                      onChange={(event) =>
                        update("project", event.target.value)
                      }
                      onBlur={() => blur("project")}
                      {...errorProps("project")}
                    >
                      <option value="">Selecciona una opción</option>
                      {projectTypes.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </DemoSelect>
                    {error("project")}
                  </label>
                  <label htmlFor="brief-scope">
                    ¿En qué necesitas ayuda?
                    <DemoSelect
                      id="brief-scope"
                      required
                      value={values.scope}
                      onChange={(event) => update("scope", event.target.value)}
                      onBlur={() => blur("scope")}
                      {...errorProps("scope")}
                    >
                      <option value="">Selecciona una opción</option>
                      {scopes.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </DemoSelect>
                    {error("scope")}
                  </label>
                  <p className="brief-hint">
                    Deja un campo vacío e intenta continuar para probar la
                    validación.
                  </p>
                </div>
              )}
              {step === 1 && (
                <div className="brief-fields">
                  <div className="brief-field-row">
                    <label htmlFor="brief-name">
                      Nombre de ejemplo
                      <input
                        id="brief-name"
                        autoComplete="off"
                        required
                        maxLength={60}
                        value={values.name}
                        onChange={(event) => update("name", event.target.value)}
                        onBlur={() => blur("name")}
                        placeholder="Alex García"
                        {...errorProps("name")}
                      />
                      {error("name")}
                    </label>
                    <label htmlFor="brief-email">
                      Correo de ejemplo
                      <input
                        id="brief-email"
                        type="email"
                        autoComplete="off"
                        required
                        maxLength={120}
                        value={values.email}
                        onChange={(event) =>
                          update("email", event.target.value)
                        }
                        onBlur={() => blur("email")}
                        placeholder="alex@ejemplo.com"
                        {...errorProps("email")}
                      />
                      {error("email")}
                    </label>
                  </div>
                  <label htmlFor="brief-message">
                    La idea
                    <textarea
                      id="brief-message"
                      required
                      minLength={15}
                      maxLength={400}
                      rows={4}
                      value={values.message}
                      onChange={(event) =>
                        update("message", event.target.value)
                      }
                      onBlur={() => blur("message")}
                      placeholder="Necesito una web para mostrar los servicios de una cafetería…"
                      {...errorProps("message")}
                    />
                    {error("message")}
                    <span className="brief-character-count">
                      {values.message.length} / 400
                    </span>
                  </label>
                </div>
              )}
              {step === 2 && (
                <div className="brief-review">
                  <dl>
                    {[
                      ["Proyecto", values.project],
                      ["Alcance", values.scope],
                      ["Nombre", values.name.trim()],
                      ["Correo", values.email.trim()],
                      ["Idea", values.message.trim()],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p>
                    <CheckCircle2 size={15} /> Puedes volver y editar sin perder
                    lo que escribiste.
                  </p>
                </div>
              )}
              <div className="brief-actions">
                {step > 0 && (
                  <button
                    type="button"
                    className="workflow-secondary"
                    onClick={() => {
                      setStep(step - 1);
                      setErrors({});
                      setAnnouncement("");
                      focusHeading();
                    }}
                  >
                    <ArrowLeft size={15} /> Atrás
                  </button>
                )}
                <button type="submit" className="workflow-primary">
                  {step === 2 ? "Terminar demo" : "Continuar"}
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <span className="sr-only" role="status">
        {announcement}
      </span>
      <AnimatedDetails className="demo-explanation">
        <summary>
          <Code2 size={15} /> Cómo está hecho
        </summary>
        <p>
          Validación por paso y al salir de cada campo, conservación de los
          datos al volver y revisión antes de terminar. Los errores están
          vinculados a sus campos y el foco se mueve al primer error o al título
          del paso siguiente. Todo sucede en el navegador.
        </p>
      </AnimatedDetails>
    </>
  );
}
