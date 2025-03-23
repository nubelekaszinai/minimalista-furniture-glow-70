
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Add polyfill for process.env
    'process.env': {},
    'process.browser': true,
    'process.version': JSON.stringify(process.version),
    'process': {
      env: {},
      browser: true,
      version: JSON.stringify(process.version),
    },
  }
}));
