export const columns = [
  { id: "pending", label: "Por hacer" },
  { id: "progress", label: "En proceso" },
  { id: "done", label: "Listo" },
];
export const initialTasks = [
  {
    id: "task-1",
    title: "Adaptar la navegación a móvil",
    status: "pending",
    priority: "Alta",
  },
  {
    id: "task-2",
    title: "Validar el formulario de contacto",
    status: "progress",
    priority: "Alta",
  },
  {
    id: "task-3",
    title: "Revisar contraste y foco visible",
    status: "pending",
    priority: "Media",
  },
  {
    id: "task-4",
    title: "Crear los componentes base",
    status: "done",
    priority: "Media",
  },
];
export function moveTask(tasks, id, status) {
  if (!columns.some((column) => column.id === status)) return tasks;
  if (!tasks.some((task) => task.id === id && task.status !== status))
    return tasks;
  return tasks.map((task) => (task.id === id ? { ...task, status } : task));
}
export function addTask(tasks, title, priority, id) {
  const cleanTitle = title.trim();
  if (
    !cleanTitle ||
    cleanTitle.length > 80 ||
    tasks.length >= 18 ||
    tasks.some((task) => task.id === id) ||
    !["Alta", "Media", "Baja"].includes(priority)
  )
    return tasks;
  return [...tasks, { id, title: cleanTitle, priority, status: "pending" }];
}
export function filterTasks(tasks, query, priority) {
  const normalize = (text) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  return tasks.filter(
    (task) =>
      normalize(task.title).includes(normalize(query)) &&
      (priority === "Todas" || task.priority === priority),
  );
}
export const projectTypes = [
  "Landing page",
  "Sitio corporativo",
  "Aplicación web",
];
export const scopes = [
  "Diseño e interfaz",
  "Desarrollo frontend",
  "Mejoras de una web",
];
export function validateBrief(values, step) {
  const errors = {};
  if (step === 0) {
    if (!projectTypes.includes(values.project))
      errors.project = "Selecciona un tipo de proyecto.";
    if (!scopes.includes(values.scope))
      errors.scope = "Selecciona el trabajo que necesitas.";
  }
  if (step === 1) {
    if (values.name.trim().length < 2 || values.name.trim().length > 60)
      errors.name = "Escribe un nombre de entre 2 y 60 caracteres.";
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) ||
      values.email.length > 120
    )
      errors.email = "Escribe un correo con formato válido.";
    if (values.message.trim().length < 15 || values.message.trim().length > 400)
      errors.message = "Cuéntame la idea en entre 15 y 400 caracteres.";
  }
  return errors;
}
