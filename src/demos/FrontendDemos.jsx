import {
  AnimatedDetails,
  SelectionPill,
  SmoothHeight,
} from "../components/InterfaceMotion";
import DemoSelect from "./DemoSelect";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  AlertCircle,
  ArrowDown,
  Check,
  Code2,
  Coffee,
  Croissant,
  CupSoda,
  Minus,
  MousePointer2,
  PackageOpen,
  Plus,
  RotateCcw,
  Sandwich,
  Search,
  ShoppingBag,
} from "lucide-react";
import SpotlightCard from "../components/SpotlightCard";
const TaskDemo = lazy(() => import("./TaskDemo"));
const FormDemo = lazy(() => import("./FormDemo"));
const ExpandingGallery = lazy(() =>
  import("./InteractionExtras").then((module) => ({
    default: module.ExpandingGallery,
  })),
);
const MagneticButton = lazy(() =>
  import("./InteractionExtras").then((module) => ({
    default: module.MagneticButton,
  })),
);
const DesignComparison = lazy(() =>
  import("./InteractionExtras").then((module) => ({
    default: module.DesignComparison,
  })),
);
function DeferredDemo({ children }) {
  return (
    <Suspense
      fallback={
        <p className="demo-chunk-loading" role="status">
          Cargando demo...
        </p>
      }
    >
      {children}
    </Suspense>
  );
}
import {
  changeQuantity,
  filterProducts,
  formatPrice,
  summarizeSelection,
} from "./catalog";

const icons = {
  coffee: Coffee,
  bread: Croissant,
  drink: CupSoda,
  sandwich: Sandwich,
};

function CatalogDemo() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState("recommended");
  const [selection, setSelection] = useState({});
  const [loadState, setLoadState] = useState("ready");
  const [announcement, setAnnouncement] = useState("");
  const timer = useRef(null);
  const cartHeading = useRef(null);
  const search = useRef(null);
  const productsRegion = useRef(null);
  const resultStatus = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const visible = filterProducts(query, category, sort);
  const summary = summarizeSelection(selection);

  function update(product, delta) {
    if (delta > 0 && selection[product.id] >= 9) {
      setAnnouncement(`${product.name}: el máximo es de 9 unidades.`);
      return;
    }
    setSelection((previous) => changeQuantity(previous, product.id, delta));
    setAnnouncement(
      `${product.name}: ${Math.max(0, Math.min(9, (selection[product.id] ?? 0) + delta))} en la selección.`,
    );
    if (delta < 0 && selection[product.id] === 1)
      cartHeading.current?.focus({ preventScroll: true });
  }
  function simulate(fail = false) {
    if (loadState === "loading") return;
    clearTimeout(timer.current);
    if (productsRegion.current?.contains(document.activeElement))
      resultStatus.current?.focus({ preventScroll: true });
    setLoadState("loading");
    timer.current = setTimeout(
      () => setLoadState(fail ? "error" : "ready"),
      650,
    );
  }
  function reset() {
    clearTimeout(timer.current);
    setQuery("");
    setCategory("Todos");
    setSort("recommended");
    setSelection({});
    setLoadState("ready");
    setAnnouncement("Demo restablecida.");
  }
  function clearFilters() {
    setQuery("");
    setCategory("Todos");
    search.current?.focus({ preventScroll: true });
  }

  return (
    <>
      <div className="demo-toolbar">
        <div>
          <span className="demo-label">CATÁLOGO INTERACTIVO</span>
          <h3>Una pequeña cafetería</h3>
          <p>
            Productos y precios de ejemplo. La selección se guarda solo mientras
            visitas esta página.
          </p>
        </div>
        <button type="button" className="demo-reset" onClick={reset}>
          <RotateCcw size={14} /> Restablecer
        </button>
      </div>
      <div className="demo-catalog-layout">
        <div className="demo-catalog">
          <div className="demo-search-row">
            <label className="demo-search">
              <Search size={16} aria-hidden="true" />
              <span className="sr-only">Buscar productos</span>
              <input
                ref={search}
                type="search"
                value={query}
                placeholder="Busca un café, pan…"
                onChange={(event) => setQuery(event.target.value)}
                aria-controls="demo-products"
              />
            </label>
            <label className="demo-sort">
              <span className="sr-only">Ordenar productos</span>
              <DemoSelect
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="recommended">Orden original</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
              </DemoSelect>
            </label>
          </div>
          <div
            className="demo-filters"
            role="group"
            aria-label="Categorías de productos"
          >
            {["Todos", "Bebidas", "Panadería", "Comida"].map((item) => (
              <button
                type="button"
                key={item}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                <SelectionPill
                  active={category === item}
                  group="catalog-category"
                />
                {item}
              </button>
            ))}
          </div>
          <div className="demo-results-bar">
            <p
              ref={resultStatus}
              tabIndex={-1}
              className="demo-result-count"
              role="status"
            >
              {loadState === "loading"
                ? "Cargando catálogo de ejemplo…"
                : loadState === "error"
                  ? "La carga simulada ha fallado."
                  : `${visible.length} ${visible.length === 1 ? "producto" : "productos"}`}
            </p>
            <button
              type="button"
              className="demo-selection-shortcut"
              onClick={() => {
                cartHeading.current?.focus({ preventScroll: true });
                cartHeading.current?.scrollIntoView({
                  block: "nearest",
                  behavior: "instant",
                });
              }}
            >
              Tu selección · {summary.count}
              <ArrowDown size={13} />
            </button>
          </div>
          <div
            ref={productsRegion}
            id="demo-products"
            aria-busy={loadState === "loading"}
          >
            {loadState === "loading" ? (
              <div className="demo-product-grid" aria-hidden="true">
                {[0, 1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="demo-skeleton" />
                ))}
              </div>
            ) : loadState === "error" ? (
              <div className="demo-empty">
                <AlertCircle size={28} />
                <h4>No se pudo cargar el catálogo</h4>
                <p>
                  Es un error de ejemplo para mostrar el estado de recuperación.
                </p>
                <button type="button" onClick={() => simulate(false)}>
                  Reintentar
                </button>
              </div>
            ) : visible.length === 0 ? (
              <div className="demo-empty">
                <Search size={28} />
                <h4>Sin resultados</h4>
                <p>Prueba otro nombre o cambia la categoría.</p>
                <button type="button" onClick={clearFilters}>
                  Quitar filtros
                </button>
              </div>
            ) : (
              <div className="demo-product-grid">
                {visible.map((product) => {
                  const Icon = icons[product.icon];
                  const quantity = selection[product.id] ?? 0;
                  return (
                    <article
                      key={product.id}
                      className="demo-product"
                      style={{ "--product-color": product.color }}
                    >
                      <div className="demo-product-visual" aria-hidden="true">
                        <Icon size={35} strokeWidth={1.2} />
                        {quantity > 0 && (
                          <span className="demo-product-badge">
                            <Check size={11} /> {quantity}
                          </span>
                        )}
                      </div>
                      <div className="demo-product-info">
                        <span>{product.category}</span>
                        <h4>{product.name}</h4>
                        <p>{product.description}</p>
                        <div className="demo-product-bottom">
                          <strong>{formatPrice(product.price)}</strong>
                          <button
                            type="button"
                            onClick={() => update(product, 1)}
                            aria-disabled={quantity >= 9}
                            aria-label={`Añadir ${product.name}${quantity >= 9 ? ", máximo 9 unidades" : ""}`}
                          >
                            <Plus size={17} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
          <div className="demo-simulation">
            <span>Probar estados:</span>
            <button
              type="button"
              aria-disabled={loadState === "loading"}
              onClick={() => simulate(false)}
            >
              Carga
            </button>
            <button
              type="button"
              aria-disabled={loadState === "loading"}
              onClick={() => simulate(true)}
            >
              Error
            </button>
          </div>
        </div>
        <aside className="demo-selection" aria-label="Productos seleccionados">
          <div className="demo-selection-heading">
            <h4 tabIndex={-1} ref={cartHeading}>
              <ShoppingBag size={16} /> Tu selección
            </h4>
            <span>{summary.count}</span>
          </div>
          {summary.items.length === 0 ? (
            <div className="demo-cart-empty">
              <PackageOpen size={32} strokeWidth={1.2} />
              <p>Añade un producto para probar la selección.</p>
            </div>
          ) : (
            <ul className="demo-cart-items">
              {summary.items.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                  <div className="demo-quantity">
                    <button
                      type="button"
                      onClick={() => update(item, -1)}
                      aria-label={`Quitar una unidad de ${item.name}`}
                    >
                      <Minus size={13} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      aria-disabled={item.quantity >= 9}
                      onClick={() => update(item, 1)}
                      aria-label={`Añadir una unidad de ${item.name}`}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="demo-selection-total">
            <span>Total de ejemplo</span>
            <strong>{formatPrice(summary.total)}</strong>
          </div>
          <span className="demo-currency">Precios en MXN</span>
          {summary.items.length > 0 && (
            <button
              type="button"
              className="demo-clear"
              onClick={() => {
                cartHeading.current?.focus({ preventScroll: true });
                setSelection({});
                setAnnouncement("Selección vacía.");
              }}
            >
              Vaciar selección
            </button>
          )}
        </aside>
      </div>
      <span className="sr-only" role="status">
        {announcement}
      </span>
      <AnimatedDetails className="demo-explanation">
        <summary>
          <Code2 size={15} /> Cómo está hecho
        </summary>
        <p>
          El buscador ignora mayúsculas y acentos. Los filtros y el orden se
          combinan, las cantidades van de 0 a 9 y el total se calcula en
          centavos. Los estados de carga y error son simulaciones locales. La
          interfaz usa React y CSS; no hay un servidor ni se guardan datos
          personales.
        </p>
      </AnimatedDetails>
    </>
  );
}

function MotionDemo() {
  const [intensity, setIntensity] = useState(3);
  const [enabled, setEnabled] = useState(true);
  const [compact, setCompact] = useState(false);
  const reducedMotion = useReducedMotion();
  return (
    <>
      <div className="demo-toolbar">
        <div>
          <span className="demo-label">INTERACCIÓN Y DISEÑO ADAPTABLE</span>
          <h3>Una tarjeta, varios estados</h3>
          <p>
            Ajusta la intensidad y el ancho. Con un ratón, mueve el cursor sobre
            la tarjeta.
          </p>
        </div>
      </div>
      <div className="demo-motion-layout">
        <div className="demo-motion-stage">
          <div className={`demo-motion-preview ${compact ? "is-compact" : ""}`}>
            <SpotlightCard
              className="demo-interactive-card"
              tilt={enabled && !reducedMotion}
              tiltIntensity={intensity * 2}
            >
              <span className="demo-preview-icon">
                <MousePointer2 size={25} />
              </span>
              <span className="demo-label">COMPONENTE DE EJEMPLO</span>
              <h4>Interacción con CSS y React</h4>
              <p>
                La tarjeta se adapta al ancho disponible y responde al
                movimiento del cursor.
              </p>
              <div className="demo-preview-tags">
                <span>Responsive</span>
                <span>Accesible</span>
              </div>
            </SpotlightCard>
          </div>
        </div>
        <div className="demo-motion-controls">
          <h4>Ajustes de la demo</h4>
          <label className="demo-range-label" htmlFor="demo-tilt">
            Inclinación <output htmlFor="demo-tilt">{intensity}°</output>
          </label>
          <input
            id="demo-tilt"
            type="range"
            min="0"
            max="5"
            step="1"
            value={intensity}
            disabled={!enabled || !!reducedMotion}
            onChange={(event) => setIntensity(Number(event.target.value))}
          />
          <label className="demo-checkbox">
            <input
              type="checkbox"
              checked={enabled}
              disabled={!!reducedMotion}
              onChange={(event) => setEnabled(event.target.checked)}
            />{" "}
            Activar inclinación
          </label>
          <span className="demo-control-label">Ancho de la tarjeta</span>
          <div
            className="demo-width-switch"
            role="group"
            aria-label="Ancho de la tarjeta"
          >
            {[false, true].map((value) => (
              <button
                key={String(value)}
                type="button"
                aria-pressed={compact === value}
                onClick={() => setCompact(value)}
              >
                <SelectionPill
                  active={compact === value}
                  group="demo-card-width"
                />
                {value ? "Compacto" : "Amplio"}
              </button>
            ))}
          </div>
          <p>
            {reducedMotion
              ? "Tu preferencia de movimiento reducido está activa: la inclinación está deshabilitada."
              : "La inclinación se activa con ratón. En pantallas táctiles, la tarjeta mantiene su posición."}
          </p>
        </div>
      </div>
      <AnimatedDetails className="demo-explanation">
        <summary>
          <Code2 size={15} /> Cómo está hecho
        </summary>
        <p>
          Se reutiliza el componente de las tarjetas del portafolio. Las
          coordenadas del cursor actualizan variables CSS con
          requestAnimationFrame, sin renderizar React por cada movimiento. El
          efecto se desactiva con movimiento reducido y el diseño se ajusta al
          ancho de su contenedor.
        </p>
      </AnimatedDetails>
    </>
  );
}

export default function FrontendDemos() {
  const [active, setActive] = useState("catalogo");
  const [interaction, setInteraction] = useState("tilt");
  const [visited, setVisited] = useState(() => new Set(["catalogo", "tilt"]));
  function visit(id) {
    setVisited((previous) =>
      previous.has(id) ? previous : new Set([...previous, id]),
    );
  }
  function selectTab(id) {
    visit(id);
    setActive(id);
  }
  function selectInteraction(id) {
    visit(id);
    setInteraction(id);
  }
  const tabRefs = useRef([]);
  const tabs = [
    { id: "catalogo", label: "Catálogo", icon: ShoppingBag },
    { id: "interaccion", label: "Interacción", icon: MousePointer2 },
    { id: "tareas", label: "Tablero", icon: Check },
    { id: "formulario", label: "Formulario", icon: Code2 },
  ];
  function navigateTabs(event, index) {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft")
      next = (index + tabs.length - 1) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectTab(tabs[next].id);
    tabRefs.current[next]?.focus();
  }
  return (
    <div className="frontend-demos">
      <div
        className="demo-tabs"
        role="tablist"
        aria-label="Ejemplos de frontend"
      >
        {tabs.map(({ id, label, icon: Icon }, index) => (
          <button
            key={id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`demo-tab-${id}`}
            aria-selected={active === id}
            aria-controls={`demo-panel-${id}`}
            tabIndex={active === id ? 0 : -1}
            onKeyDown={(event) => navigateTabs(event, index)}
            onClick={() => selectTab(id)}
          >
            <SelectionPill active={active === id} group="demo-main-tabs" />
            <Icon size={16} />
            {label}
          </button>
        ))}
        <span className="demo-local-badge">DEMOS LOCALES</span>
      </div>
      <SmoothHeight>
        <div
          className="demo-panel"
          role="tabpanel"
          id="demo-panel-catalogo"
          aria-labelledby="demo-tab-catalogo"
          hidden={active !== "catalogo"}
        >
          <CatalogDemo />
        </div>
        <div
          className="demo-panel"
          role="tabpanel"
          id="demo-panel-interaccion"
          aria-labelledby="demo-tab-interaccion"
          hidden={active !== "interaccion"}
        >
          <div
            className="interaction-picker"
            role="group"
            aria-label="Seleccionar demo de interacción"
          >
            {[
              { id: "tilt", label: "Inclinación" },
              { id: "gallery", label: "Galería expandible" },
              { id: "magnet", label: "Botón magnético" },
              { id: "compare", label: "Comparador" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={interaction === item.id}
                aria-controls={`interaction-${item.id}`}
                onClick={() => selectInteraction(item.id)}
              >
                <SelectionPill
                  active={interaction === item.id}
                  group="demo-interaction-tabs"
                />
                {item.label}
              </button>
            ))}
          </div>
          <div id="interaction-tilt" hidden={interaction !== "tilt"}>
            {visited.has("interaccion") && <MotionDemo />}
          </div>
          <div id="interaction-gallery" hidden={interaction !== "gallery"}>
            {visited.has("gallery") && (
              <DeferredDemo>
                <ExpandingGallery />
              </DeferredDemo>
            )}
          </div>
          <div id="interaction-magnet" hidden={interaction !== "magnet"}>
            {visited.has("magnet") && (
              <DeferredDemo>
                <MagneticButton
                  active={active === "interaccion" && interaction === "magnet"}
                />
              </DeferredDemo>
            )}
          </div>
          <div id="interaction-compare" hidden={interaction !== "compare"}>
            {visited.has("compare") && (
              <DeferredDemo>
                <DesignComparison />
              </DeferredDemo>
            )}
          </div>
        </div>
        <div
          className="demo-panel"
          role="tabpanel"
          id="demo-panel-tareas"
          aria-labelledby="demo-tab-tareas"
          hidden={active !== "tareas"}
        >
          {visited.has("tareas") && (
            <DeferredDemo>
              <TaskDemo />
            </DeferredDemo>
          )}
        </div>
        <div
          className="demo-panel"
          role="tabpanel"
          id="demo-panel-formulario"
          aria-labelledby="demo-tab-formulario"
          hidden={active !== "formulario"}
        >
          {visited.has("formulario") && (
            <DeferredDemo>
              <FormDemo />
            </DeferredDemo>
          )}
        </div>
      </SmoothHeight>
    </div>
  );
}
