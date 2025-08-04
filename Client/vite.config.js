import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:9005',
      '/bluebook': 'http://localhost:9005',
      '/electric-bluebook': 'http://localhost:9005',
      '/news': 'http://localhost:9005',
      '/marquee': 'http://localhost:9005',
      '/admin': 'http://localhost:9005',
      '/payment': 'http://localhost:9005',
    },
  },
})
