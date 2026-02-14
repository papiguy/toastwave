import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Alias "toastwave" to the local build so examples work without publishing
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      toastwave: path.resolve(__dirname, "../../dist/index.esm.js"),
    },
  },
});
