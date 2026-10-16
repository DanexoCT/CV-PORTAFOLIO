import test from "node:test";
import assert from "node:assert/strict";
import {
  addTask,
  filterTasks,
  initialTasks,
  moveTask,
  validateBrief,
} from "../src/demos/workflow.js";

test("mueve tareas sin modificar el estado anterior y rechaza estados desconocidos", () => {
  const moved = moveTask(initialTasks, "task-1", "done");
  assert.equal(moved[0].status, "done");
  assert.equal(initialTasks[0].status, "pending");
  assert.equal(moveTask(initialTasks, "missing", "done"), initialTasks);
  assert.equal(moveTask(initialTasks, "task-1", "invalid"), initialTasks);
  assert.equal(moveTask(initialTasks, "task-1", "pending"), initialTasks);
});
test("añade tareas válidas y evita títulos vacíos, identificadores duplicados y exceso de tareas", () => {
  const added = addTask(initialTasks, "  Revisar imágenes  ", "Baja", "new");
  assert.deepEqual(added.at(-1), {
    id: "new",
    title: "Revisar imágenes",
    priority: "Baja",
    status: "pending",
  });
  assert.equal(initialTasks.length, 4);
  assert.equal(addTask(initialTasks, " ", "Media", "new"), initialTasks);
  assert.equal(
    addTask(initialTasks, "a".repeat(81), "Media", "new"),
    initialTasks,
  );
  assert.equal(addTask(initialTasks, "Nueva", "Media", "task-1"), initialTasks);
  assert.equal(addTask(initialTasks, "Nueva", "Unknown", "new"), initialTasks);
  const full = Array.from({ length: 18 }, (_, index) => ({
    ...initialTasks[0],
    id: String(index),
  }));
  assert.equal(addTask(full, "Nueva", "Alta", "new"), full);
});
test("combina búsqueda normalizada y prioridad", () => {
  assert.deepEqual(
    filterTasks(initialTasks, " NAVEGACION ", "Alta").map((task) => task.id),
    ["task-1"],
  );
  assert.equal(filterTasks(initialTasks, "navegacion", "Media").length, 0);
  assert.equal(filterTasks(initialTasks, "", "Todas").length, 4);
});
test("valida las opciones del primer paso", () => {
  assert.deepEqual(Object.keys(validateBrief({ project: "", scope: "" }, 0)), [
    "project",
    "scope",
  ]);
  assert.deepEqual(
    validateBrief({ project: "Landing page", scope: "Desarrollo frontend" }, 0),
    {},
  );
  assert.ok(
    validateBrief({ project: "Unknown", scope: "Diseño e interfaz" }, 0)
      .project,
  );
});
test("valida contacto y detalle; acepta espacios exteriores sin exigir nombres de dos palabras", () => {
  assert.deepEqual(
    Object.keys(
      validateBrief({ name: " ", email: "alex@", message: "corto" }, 1),
    ),
    ["name", "email", "message"],
  );
  const valid = {
    name: "  Alex  ",
    email: " alex@ejemplo.com ",
    message: "Una web para mostrar los servicios de mi negocio.",
  };
  assert.deepEqual(validateBrief(valid, 1), {});
  assert.ok(validateBrief({ ...valid, email: "a b@ejemplo.com" }, 1).email);
  assert.ok(validateBrief({ ...valid, message: "a".repeat(401) }, 1).message);
});
