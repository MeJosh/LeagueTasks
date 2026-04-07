import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/LeagueTasks/',
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    tailwindcss(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    server: {
      deps: {
        // Ensure Vuetify is transformed correctly in tests
        inline: ['vuetify'],
      },
    },
  },
})
