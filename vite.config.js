import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

const page = (p) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      // Two pages: the film (/) and the cart (/cart/)
      input: { main: page('./index.html'), cart: page('./cart/index.html') },
      output: {
        manualChunks(id) {
          if (/node_modules[/](react|react-dom|scheduler)[/]/.test(id)) return 'react'
          if (/node_modules[/](three|@react-three)[/]/.test(id)) return 'three'
          if (id.includes('gsap') || id.includes('lenis') || id.includes('split-type')) return 'motion'
        },
      },
    },
  },
})
