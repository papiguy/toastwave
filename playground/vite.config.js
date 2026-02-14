import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      toastywave: path.resolve(__dirname, "../dist/index.esm.js"),
    },
  },
  server: {
    watch: {
      // Watch the parent dist folder for changes
      ignored: ["!**/dist/**"],
    },
  },
  optimizeDeps: {
    // Force re-optimization when dist changes
    exclude: ["toastywave"],
  },
});
