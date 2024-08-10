import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/assets/styles/vuetify.scss'
      }
    }),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.ts',
      registerType: 'autoUpdate',
      injectRegister: false,

      // pwaAssets: {
      //   disabled: false,
      //   config: true
      // },

      manifest: {
        name: 'Carshenas',
        short_name: 'Carshenas',
        description: 'This is a PWA application.',
        theme_color: '#0C0634'
      },

      // injectManifest: {
      //   globPatterns: ['**/*.{js,css,html,svg,png,ico}']
      // },

      devOptions: {
        enabled: true
        // navigateFallback: 'index.html',
        // suppressWarnings: true,
        // type: 'module'
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true
  }
})
