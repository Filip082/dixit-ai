import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://server:3000', // Adres Twojego backendu
        changeOrigin: true,
        secure: false
      },
      
      '/socket.io': {
        target: 'http://server:3000',
        ws: true,
        changeOrigin: true
      }
    }
  }
})
