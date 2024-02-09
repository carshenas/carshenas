import { md3 } from 'vuetify/blueprints'
import { createVuetify } from 'vuetify'

// Icons
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { aliases, md } from 'vuetify/iconsets/md'

// Styles
import 'vuetify/styles'

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
      color: 'primary',
      flat: true
    }
  }
})