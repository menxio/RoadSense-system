import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path"; // ✅ Import the path module

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ Alias for "src"
      "utils": path.resolve(__dirname, "src/utils"), // ✅ Alias for utils folder
    },
  },
});
