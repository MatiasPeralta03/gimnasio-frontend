import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// En desarrollo, las llamadas a /api se redirigen al backend Spring.
// BACKEND_URL (archivo .env) permite apuntar a un servidor en otro equipo sin tocar el codigo.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: { "/api": env.BACKEND_URL || "http://localhost:8080" },
    },
  };
});
