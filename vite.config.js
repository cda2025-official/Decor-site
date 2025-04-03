import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import imagePresets from "vite-plugin-image-presets";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    imagePresets({
      optimized: {
        width: 800, // Required for optimization
        format: "webp",
      },
    }),
    mode === "development" ? componentTagger() : undefined, // Proper conditional loading
  ].filter(Boolean), // Removes `undefined` plugins
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
