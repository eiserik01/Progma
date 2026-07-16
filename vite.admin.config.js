import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Samostatný build konfigurák pro admin.progma.cz.
// Spouští se přes `npm run build:admin` — bere jen admin.html (ne index.html
// hlavního webu), výstup dává do dist-admin/ a jako veřejnou složku používá
// public-admin/ (vlastní robots.txt, aby se admin.progma.cz nedostal do
// vyhledávačů — hlavní web má svůj vlastní permisivní robots.txt).
export default defineConfig({
  plugins: [react()],
  publicDir: "public-admin",
  build: {
    outDir: "dist-admin",
    rollupOptions: {
      input: "admin.html",
    },
  },
});
