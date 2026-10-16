import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Include the portal dependency before lazy demos are requested. Discovering
  // it later can invalidate optimized imports in an already open browser tab.
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "motion/react",
      "lucide-react",
    ],
  },
});
