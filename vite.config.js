import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    {
      name: "open-from-disk",
      apply: "build",
      transformIndexHtml(html) {
        return html
          .replaceAll(/\s+crossorigin(?:="[^"]*")?/g, "")
          .replaceAll("<script type=\"module\"", "<script defer");
      },
    },
  ],
  build: {
    outDir: "docs",
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      output: {
        format: "iife",
        inlineDynamicImports: true,
      },
    },
  },
});
