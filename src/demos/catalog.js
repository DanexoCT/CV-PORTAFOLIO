export const products = [
  {
    id: "americano",
    name: "Café americano",
    category: "Bebidas",
    price: 4500,
    icon: "coffee",
    color: "#c5a88c",
    description: "Café de la casa, recién preparado.",
  },
  {
    id: "latte",
    name: "Latte",
    category: "Bebidas",
    price: 5800,
    icon: "coffee",
    color: "#cfb9a2",
    description: "Espresso con leche y espuma.",
  },
  {
    id: "te",
    name: "Té helado",
    category: "Bebidas",
    price: 3200,
    icon: "drink",
    color: "#9ebda9",
    description: "Té negro con limón y hielo.",
  },
  {
    id: "croissant",
    name: "Croissant",
    category: "Panadería",
    price: 3800,
    icon: "bread",
    color: "#d4b587",
    description: "Hojaldre de mantequilla.",
  },
  {
    id: "sandwich",
    name: "Sándwich",
    category: "Comida",
    price: 7200,
    icon: "sandwich",
    color: "#aebd8e",
    description: "Pan artesanal y vegetales frescos.",
  },
  {
    id: "panque",
    name: "Panqué de limón",
    category: "Panadería",
    price: 3500,
    icon: "bread",
    color: "#c9bb83",
    description: "Una rebanada con glaseado de limón.",
  },
];

const normalize = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
export function filterProducts(
  query = "",
  category = "Todos",
  sort = "recommended",
) {
  const search = normalize(query);
  const result = products.filter(
    (product) =>
      (category === "Todos" || product.category === category) &&
      normalize(product.name).includes(search),
  );
  if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
  return result;
}

export function changeQuantity(selection, id, delta) {
  if (
    !products.some((product) => product.id === id) ||
    !Number.isInteger(delta)
  )
    return selection;
  const quantity = Math.max(0, Math.min(9, (selection[id] ?? 0) + delta));
  const next = { ...selection };
  if (quantity) next[id] = quantity;
  else delete next[id];
  return next;
}

export function summarizeSelection(selection) {
  const items = products
    .filter((product) => selection[product.id] > 0)
    .map((product) => ({ ...product, quantity: selection[product.id] }));
  return {
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
}

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});
export const formatPrice = (cents) => currency.format(cents / 100);
