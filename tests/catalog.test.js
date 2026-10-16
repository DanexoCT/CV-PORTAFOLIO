import test from "node:test";
import assert from "node:assert/strict";
import {
  changeQuantity,
  filterProducts,
  products,
  summarizeSelection,
} from "../src/demos/catalog.js";

test("combina búsqueda sin acentos y categoría", () => {
  assert.deepEqual(
    filterProducts("  CAFE ", "Bebidas").map((item) => item.id),
    ["americano"],
  );
  assert.deepEqual(filterProducts("cafe", "Comida"), []);
  assert.deepEqual(filterProducts("inexistente"), []);
});

test("ordena por precio sin modificar el catálogo original", () => {
  const originalOrder = products.map((item) => item.id);
  const ascending = filterProducts("", "Todos", "price-asc");
  assert.deepEqual(
    ascending.map((item) => item.price),
    [3200, 3500, 3800, 4500, 5800, 7200],
  );
  assert.equal(filterProducts("", "Todos", "price-desc")[0].id, "sandwich");
  assert.deepEqual(
    products.map((item) => item.id),
    originalOrder,
  );
});

test("actualiza cantidades sin mutar la selección y aplica límites", () => {
  const original = { americano: 1 };
  assert.deepEqual(changeQuantity(original, "americano", 1), { americano: 2 });
  assert.deepEqual(original, { americano: 1 });
  assert.deepEqual(changeQuantity(original, "americano", 20), { americano: 9 });
  assert.deepEqual(changeQuantity(original, "americano", -1), {});
  assert.deepEqual(changeQuantity({}, "americano", -1), {});
});

test("ignora productos desconocidos e incrementos inválidos", () => {
  const selection = { latte: 2 };
  assert.equal(changeQuantity(selection, "unknown", 1), selection);
  assert.equal(changeQuantity(selection, "latte", 0.5), selection);
});

test("calcula unidades y totales en centavos", () => {
  const result = summarizeSelection({ americano: 2, croissant: 1 });
  assert.equal(result.count, 3);
  assert.equal(result.total, 12800);
  assert.equal(result.items.length, 2);
  assert.deepEqual(summarizeSelection({}), { items: [], count: 0, total: 0 });
});
