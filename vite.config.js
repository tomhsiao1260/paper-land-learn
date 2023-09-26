import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        'camera': 'client/camera/entry.jsx'
      },
      output: {
        dir: 'www/dist',
        format: 'es',
        entryFileNames: `[name].js`
      },
    },
  },
})
