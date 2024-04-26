import { md3 } from 'vuetify/blueprints'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Styles
import 'vuetify/styles'

// Icons
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { aliases, md } from 'vuetify/iconsets/md'

// I18n
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { useI18n } from 'vue-i18n'
import i18n from './i18n'

export default createVuetify({
  blueprint: md3,
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n })
  },
  icons: {
    defaultSet: 'md',
    aliases,
    sets: {
      md
    }
  },
  theme: {
    themes: {
      light: {
        variables: {
          'btn-height': '50px'
        },
        colors: {
          primary: '#FB4847',
          'on-primary': '#FFFFFF',
          secondary: '#0C0634',
          'on-secondary': '#FFFFFF',
          background: '#FFFFFF',
          'on-background': '#262626',
          text: '#262626',
          'on-text': '#ffffff',
          surface: '#ffffff',
          'on-surface': '#242424',
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
  components,
  directives,
  defaults: {
    VBtn: {
      color: 'primary',
      flat: true
    },
    VTextField: {
      variant: 'outlined'
    }
  }
})
