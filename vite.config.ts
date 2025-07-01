import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
  plugins: [tailwindcss(), glsl()],
  server: {
    port: 3000,   
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})