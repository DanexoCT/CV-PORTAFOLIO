import { AnimatedDetails } from "../components/InterfaceMotion";
import DemoSelect from "./DemoSelect";
import { useLayoutEffect, useRef, useState } from "react";
import {
  Check,
  Code2,
  GripVertical,
  ListTodo,
  Plus,
  RotateCcw,
  Search,
  Undo2,
} from "lucide-react";
import {
  addTask,
  columns,
  filterTasks,
  initialTasks,
  moveTask,
} from "./workflow";

export default function TaskDemo() {
  const [tasks, setTasks] = useState(initialTasks);
  const [previous, setPrevious] = useState(null);
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("Todas");
  const [title, setTitle] = useState("");
  const [newPriority, setNewPriority] = useState("Media");
  const [announcement, setAnnouncement] = useState("");
  const [dropTarget, setDropTarget] = useState(null);
  const counter = useRef(5);
  const taskControls = useRef(new Map());
  const pendingFocus = useRef(null);
  const newTaskInput = useRef(null);
  const taskSearch = useRef(null);
  const boardHeading = useRef(null);
  const draggedTask = useRef(null);
  useLayoutEffect(() => {
    if (!pendingFocus.current) return;
    taskControls.current
      .get(pendingFocus.current)
      ?.focus({ preventScroll: true });
    pendingFocus.current = null;
  }, [tasks]);
  const visible = filterTasks(tasks, query, priority);
  const done = tasks.filter((task) => task.status === "done").length;
  function commit(next, message) {
    if (next === tasks) return;
    setPrevious(tasks);
    setTasks(next);
    setAnnouncement(message);
  }
  function move(id, status, restoreFocus = false) {
    const task = tasks.find((item) => item.id === id);
    if (task) {
      if (restoreFocus) pendingFocus.current = id;
      commit(
        moveTask(tasks, id, status),
        `${task.title}: ${columns.find((column) => column.id === status)?.label}.`,
      );
    }
  }
  function create(event) {
    event.preventDefault();
    const next = addTask(tasks, title, newPriority, `task-${counter.current}`);
    if (next === tasks) {
      setAnnouncement(
        "Escribe una tarea de hasta 80 caracteres. El límite es de 18 tareas.",
      );
      return;
    }
    commit(next, `Tarea añadida: ${title.trim()}.`);
    counter.current += 1;
    setTitle("");
    newTaskInput.current?.focus({ preventScroll: true });
  }
  function reset() {
    setTasks(initialTasks);
    setPrevious(null);
    setQuery("");
    setPriority("Todas");
    setTitle("");
    setNewPriority("Media");
    setDropTarget(null);
    draggedTask.current = null;
    pendingFocus.current = null;
    setAnnouncement("Tablero restablecido.");
  }
  return (
    <>
      <div className="demo-toolbar">
        <div>
          <span className="demo-label">ESTADO Y ORGANIZACIÓN</span>
          <h3 ref={boardHeading} tabIndex={-1}>
            Un tablero de trabajo
          </h3>
          <p>
            Añade tareas, filtra por prioridad y cambia su estado. Puedes
            arrastrarlas con ratón o usar el selector de cada tarjeta.
          </p>
        </div>
        <button type="button" className="demo-reset" onClick={reset}>
          <RotateCcw size={14} /> Restablecer
        </button>
      </div>
      <div className="board-summary">
        <span>
          <ListTodo size={17} /> {tasks.length} tareas
        </span>
        <span>
          <Check size={17} /> {done} completadas
        </span>
        <div
          className="board-progress"
          role="progressbar"
          aria-label="Tareas completadas"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={tasks.length}
        >
          <span style={{ width: `${(done / tasks.length) * 100}%` }} />
        </div>
        <button
          type="button"
          disabled={!previous}
          onClick={() => {
            boardHeading.current?.focus({ preventScroll: true });
            setTasks(previous);
            setPrevious(null);
            setAnnouncement("Último cambio deshecho.");
          }}
        >
          <Undo2 size={14} /> Deshacer
        </button>
      </div>
      <form className="board-create" onSubmit={create}>
        <label>
          <span className="sr-only">Nueva tarea</span>
          <input
            ref={newTaskInput}
            value={title}
            maxLength={80}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Una nueva tarea…"
            required
          />
        </label>
        <label>
          <span className="sr-only">Prioridad de la nueva tarea</span>
          <DemoSelect
            value={newPriority}
            onChange={(event) => setNewPriority(event.target.value)}
          >
            {["Alta", "Media", "Baja"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </DemoSelect>
        </label>
        <button type="submit" disabled={tasks.length >= 18}>
          <Plus size={16} /> Añadir
        </button>
      </form>
      {tasks.length >= 18 && (
        <p className="board-limit" role="status">
          Llegaste al límite de 18 tareas de esta demo. Puedes restablecer el
          tablero para empezar de nuevo.
        </p>
      )}
      <div className="board-filters">
        <label className="demo-search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Buscar tareas</span>
          <input
            ref={taskSearch}
            value={query}
            type="search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar en el tablero"
          />
        </label>
        <label className="board-priority-filter">
          <span>Prioridad</span>
          <DemoSelect
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            {["Todas", "Alta", "Media", "Baja"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </DemoSelect>
        </label>
      </div>
      <div className="demo-results-bar">
        <p className="demo-result-count" role="status">
          {visible.length} de {tasks.length} tareas · Los cambios duran mientras
          visitas esta página.
        </p>
        {(query || priority !== "Todas") && (
          <button
            type="button"
            className="demo-reset"
            onClick={() => {
              setQuery("");
              setPriority("Todas");
              taskSearch.current?.focus({ preventScroll: true });
            }}
          >
            Quitar filtros
          </button>
        )}
      </div>
      <div className="demo-board">
        {columns.map((column, index) => {
          const items = visible.filter((task) => task.status === column.id);
          return (
            <section
              key={column.id}
              className={`board-column ${dropTarget === column.id ? "is-drop-target" : ""}`}
              aria-labelledby={`board-heading-${column.id}`}
              onDragOver={(event) => {
                if (draggedTask.current) {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  setDropTarget(column.id);
                }
              }}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  setDropTarget(null);
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (draggedTask.current) move(draggedTask.current, column.id);
                draggedTask.current = null;
                setDropTarget(null);
              }}
            >
              <h4 id={`board-heading-${column.id}`}>
                <i className={`board-status-${column.id}`} />
                {column.label}
                <span>{items.length}</span>
              </h4>
              <div className="board-task-list">
                {items.length === 0 && (
                  <p className="board-empty">
                    {query || priority !== "Todas"
                      ? "Sin tareas con estos filtros."
                      : "Mueve una tarea aquí."}
                  </p>
                )}
                {items.map((task) => (
                  <article
                    key={task.id}
                    className="board-task"
                    draggable
                    onDragStart={(event) => {
                      draggedTask.current = task.id;
                      event.dataTransfer.setData("text/plain", task.id);
                      event.dataTransfer.effectAllowed = "move";
                    }}
                    onDragEnd={() => {
                      draggedTask.current = null;
                      setDropTarget(null);
                    }}
                  >
                    <div className="board-task-top">
                      <span data-priority={task.priority}>{task.priority}</span>
                      <GripVertical size={14} aria-hidden="true" />
                    </div>
                    <h5>{task.title}</h5>
                    <label className="board-task-state">
                      <span className="sr-only">Estado de {task.title}</span>
                      <DemoSelect
                        ref={(element) => {
                          if (element)
                            taskControls.current.set(task.id, element);
                          else taskControls.current.delete(task.id);
                        }}
                        value={task.status}
                        onChange={(event) =>
                          move(task.id, event.target.value, true)
                        }
                      >
                        {columns.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </DemoSelect>
                    </label>
                    {index === 2 && (
                      <span className="board-completed">
                        <Check size={12} /> Completada
                      </span>
                    )}
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <p className="board-announcement" role="status">
        {announcement ||
          "Tablero de ejemplo. No está conectado a un equipo real."}
      </p>
      <AnimatedDetails className="demo-explanation">
        <summary>
          <Code2 size={15} /> Cómo está hecho
        </summary>
        <p>
          Actualizaciones inmutables de estado, filtros combinados y una acción
          para deshacer. El arrastre usa la API nativa del navegador; los
          selectores permiten mover tareas con teclado y en pantallas táctiles.
          Los cambios se anuncian a lectores de pantalla.
        </p>
      </AnimatedDetails>
    </>
  );
}
