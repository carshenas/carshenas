// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@/assets/styles/main.scss'

import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'

export default createVuetify({
  blueprint: md3,
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#FB4847',
          'on-primary': '#FFFFFF',
          secondary: '#0C0634',
          'on-secondary': '#FFFFFF',
          background: '#FFFFFF',
          'on-background': '#262626',
          surface: '#262626',
          'on-surface': '#FFFFFF',
          success: '#A80710',
          'on-success': '#FFFFFF',
          warn: '#A80710',
          'on-warn': '#FFFFFF',
          error: '#A80710',
          'on-error': '#FFFFFF',
          info: '#A80710',
          'on-info': '#FFFFFF',
          outline: '#89938F'
        }
      }
    }
  },
  defaults: {
    VBtn: {
      color: 'primary'
    },
    VTextField: {
      variant: 'outlined',
      clearable: true,
      clearIcon: 'mdi-close'
    },
    VAutocomplete: {
      variant: 'outlined',
      clearIcon: 'mdi-close',
      itemValue: 'id'
    },
    VSelect: {
      variant: 'outlined',
      clearIcon: 'mdi-close',
      itemValue: 'id'
    }
  }
})
