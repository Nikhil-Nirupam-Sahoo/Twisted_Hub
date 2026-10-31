import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // The Firebase SDK is the bulk of the bundle; one ~270 kB gzipped chunk is
    // expected here, so raise the default 500 kB warning threshold.
    chunkSizeWarningLimit: 1000,
  },
})
