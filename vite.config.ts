import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'

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
      strategies: 'generateSW',
      srcDir: 'src',
      registerType: 'autoUpdate',
      manifest: {
        name: 'Carshenas',
        short_name: 'Carshenas',
        description: 'This is a PWA application.',
        theme_color: '#0C0634'
      },
      devOptions: {
        enabled: true, // Enable in development
        type: 'module' // Use module format for service worker in dev
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
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  }
})
