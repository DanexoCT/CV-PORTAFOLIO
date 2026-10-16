function preloadImage(source) {
  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (typeof image.decode === "function") {
        image
          .decode()
          .catch(() => {})
          .finally(resolve);
      } else {
        resolve();
      }
    };
    image.onerror = resolve;
    image.src = source;
  });
}

export async function prepareSite(assets, timeoutMs = 2500) {
  let timeout;
  const resources = Promise.allSettled([
    document.fonts?.ready ?? Promise.resolve(),
    ...assets.map(preloadImage),
  ]).then(() => "ready");

  try {
    return await Promise.race([
      resources,
      new Promise((resolve) => {
        timeout = setTimeout(() => resolve("timeout"), timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timeout);
  }
}
