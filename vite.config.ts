import { defineConfig } from 'vite'
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
})
