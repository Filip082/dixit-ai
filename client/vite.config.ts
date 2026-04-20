import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://server:3000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://server:3000',
        ws: true,
        changeOrigin: true,
      }
    }
  }
});