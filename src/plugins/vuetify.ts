import { md3 } from "vuetify/blueprints";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Styles
import "vuetify/styles";

// Icons
import "material-design-icons-iconfont/dist/material-design-icons.css";
import { aliases, md } from "vuetify/iconsets/md";

// I18n
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import { useI18n } from "vue-i18n";
import i18n from "./i18n";

export default createVuetify({
  blueprint: md3,
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  icons: {
    defaultSet: "md",
    aliases,
    sets: {
      md,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        variables: {
          "btn-height": "50px",
          // Gradient variables
          "gradient-primary": "linear-gradient(135deg, #FB4847 0%, #FF6B6B 100%)",
          "gradient-secondary": "linear-gradient(135deg, #0C0634 0%, #1a1054 100%)",
          "gradient-success": "linear-gradient(135deg, #4bb543 0%, #6bc563 100%)",
          "gradient-error": "linear-gradient(135deg, #A80710 0%, #d91a24 100%)",
          "gradient-surface": "linear-gradient(135deg, #f7efefff 0%, #f8f9fa 100%)",
          "gradient-background": "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
        },
        colors: {
          primary: "#FB4847",
          "on-primary": "#FFFFFF",
          secondary: "#0C0634",
          "on-secondary": "#FFFFFF",
          background: "#ffffff",
          "on-background": "#262626",
          text: "#262626",
          "on-text": "#ffffff",
          surface: "#f9f9f9",

          "on-surface": "#242424",
          success: "#4bb543",
          "on-success": "#FFFFFF",
          warn: "#A80710",
          "on-warn": "#FFFFFF",
          error: "#A80710",
          "on-error": "#FFFFFF",
          info: "#A80710",
          "on-info": "#FFFFFF",
          outline: "#89938F",
          divider: "#F9F6EE",
        },
      },
      dark: {
        dark: true,
        variables: {
          "btn-height": "50px",
          // Gradient variables for dark theme
          "gradient-primary": "linear-gradient(135deg, #FB4847 0%, #FF7B7B 100%)",
          "gradient-secondary": "linear-gradient(135deg, #24acf2 0%, #4ebcf5 100%)",
          "gradient-success": "linear-gradient(135deg, #4bb543 0%, #6bc563 100%)",
          "gradient-error": "linear-gradient(135deg, #eb5656 0%, #ff7070 100%)",
          "gradient-surface": "linear-gradient(135deg, #232323 0%, #2a2a2a 100%)",
          "gradient-background": "linear-gradient(180deg, #181818 0%, #1f1f1f 100%)",
        },
        colors: {
          primary: "#FB4847",
          "on-primary": "#FFFFFF",
          secondary: "#24acf2",
          "on-secondary": "#FFFFFF",
          background: "#181818",
          "on-background": "#FFFFFF",
          text: "#FFFFFF",
          "on-text": "#262626",
          surface: "#232323",
          "on-surface": "#FFFFFF",
          success: "#4bb543",
          "on-success": "#FFFFFF",
          warn: "#eb5656",
          "on-warn": "#FFFFFF",
          error: "#eb5656",
          "on-error": "#FFFFFF",
          info: "#eb5656",
          "on-info": "#FFFFFF",
          outline: "#89938F",
          divider: "#333333",
        },
      },
    },
  },
  components,
  directives,
  defaults: {
    VBtn: {
      color: "primary",
      flat: true,
    },
    VTextField: {
      hideDetails: 'auto',
      variant: 'outlined'
    }
  }
})
