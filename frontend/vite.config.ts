import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Allows access from the local network
    port: 5173,      // Change port if needed
    strictPort: true // Ensures Vite runs on the specified port
  }
})
