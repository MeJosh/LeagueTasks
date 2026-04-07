import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './style.css'
import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#c8aa6e',      // OSRS gold
          secondary: '#4a3728',    // Dark brown
          background: '#1a1a2e',   // Dark navy
          surface: '#16213e',      // Slightly lighter navy
          'surface-variant': '#0f3460',
          error: '#cf6679',
          info: '#5b9bd5',
          success: '#4caf7d',
          warning: '#e6a817',
        },
      },
      light: {
        dark: false,
        colors: {
          primary: '#8b6914',
          secondary: '#4a3728',
          background: '#f5f0e8',
          surface: '#fffdf7',
          error: '#b00020',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#fb8c00',
        },
      },
    },
  },
})

const pinia = createPinia()

createApp(App)
  .use(pinia)
  .use(router)
  .use(vuetify)
  .mount('#app')
