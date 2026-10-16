import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { prepareSite } from "./utils/prepareSite.js";

async function startSite() {
  await prepareSite(
    ["react", "javascript", "laravel"].map(
      (name) => `${import.meta.env.BASE_URL}tech/${name}.svg`,
    ),
  );

  const loader = document.getElementById("site-loader");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  // Cached visits never wait just to display a loading animation.
  if (loader && performance.now() > 220 && !reducedMotion) {
    loader.classList.add("is-ready");
    await new Promise((resolve) => setTimeout(resolve, 180));
  }
  loader?.remove();
  document.getElementById("site-loader-styles")?.remove();

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

startSite();
