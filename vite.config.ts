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
      workbox: {
        // ✅ CRITICAL: Enable these for proper updates
        skipWaiting: true,
        clientsClaim: true,

        // ✅ Add Firebase imports to the generated SW
        importScripts: [
          'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
          'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js',
          '/firebase-messaging-sw-import.js' // Your Firebase config and messaging logic
        ],

        // ✅ Don't precache the Firebase SW file
        globIgnores: [
          '**/node_modules/**/*',
          '**/sw.js',
          '**/workbox-*.js',
          '**/*.map',
          '**/manifest*.js',
          '**/firebase-messaging-sw.js', // Add this
          '**/firebase-messaging-sw-import.js' // Add this
        ],

        // ✅ Add to navigation fallback denylist
        navigateFallbackDenylist: [
          /^\/_/,
          /\/[^/?]+\.[^/]+$/,
          /^\/api\//,
          /^\/firebase-messaging-sw\.js$/, // Add this
          /^\/firebase-messaging-sw-import\.js$/ // Add this
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.carshenas\.shop\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 2 * 60 * 60 // 2 hours
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
              }
            }
          },
          {
            urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          }
        ],

        // ✅ Navigation settings
        navigateFallback: '/index.html',


        // ✅ Important cleanup and optimization options
        cleanupOutdatedCaches: true,
        sourcemap: false
      },

      manifestFilename: 'manifest.json',
      includeAssets: [
        'pwa-192x192.png',
        'pwa-512x512.png',
        'logo.svg',
        'carshenas.ico'
      ],

      injectRegister: 'auto',
      manifest: {
        name: 'Carshenas',
        short_name: 'Carshenas',
        description: 'Carshenas PWA Application',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#0C0634',
        theme_color: '#0C0634',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },

      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'
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
    strictPort: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  }
})
