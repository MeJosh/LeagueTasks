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
          primary: '#d0d0d0',      // Silver
          secondary: '#6b6b6b',    // Mid grey
          background: '#121212',   // Near-black
          surface: '#1e1e1e',      // Dark grey
          'surface-variant': '#2c2c2c',
          error: '#cf6679',
          info: '#5b9bd5',
          success: '#4caf7d',
          warning: '#e6a817',
        },
      },
      light: {
        dark: false,
        colors: {
          primary: '#4a4a4a',      // Dark grey
          secondary: '#6b6b6b',
          background: '#f2f2f2',
          surface: '#ffffff',
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
