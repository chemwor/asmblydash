// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ["react-apexcharts", "apexcharts"],
  },
  build: {
    cssMinify: false,
    // Ensure consistent builds
    sourcemap: false,
    // Optimize chunk sizes for better loading
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['apexcharts', 'react-apexcharts'],
        }
      }
    }
  },
  // Ensure proper base path for deployment
  base: './',
});
