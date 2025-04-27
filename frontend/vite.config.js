import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath


const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
  	host: true,
  	port: 5173
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Alias "@" for "src"
      utils: path.resolve(__dirname, "src/utils"), // Alias "utils"
    },
  },
});
