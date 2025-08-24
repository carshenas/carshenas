import { registerSW } from 'virtual:pwa-register'
import { requestPermission } from './composable/notification'

console.log('🔧 PWA Update System Starting...');

const isDev = import.meta.env.DEV;
let isUpdating = false;
let refreshing = false;

// Add reload prevention mechanism
const RELOAD_KEY = 'pwa_last_reload';
const RELOAD_THRESHOLD = 5000; // 5 seconds

function safeReload() {
  const lastReload = localStorage.getItem(RELOAD_KEY);
  const now = Date.now();
  
  if (!lastReload || now - parseInt(lastReload) > RELOAD_THRESHOLD) {
    localStorage.setItem(RELOAD_KEY, now.toString());
    window.location.reload();
  } else {
    console.warn('Reload prevented - too frequent reload attempts');
  }
}

const updateSW = registerSW({
    onNeedRefresh() {
        console.log('🆕 New content available');
        
        if (isDev) {
            console.log('🔧 Dev mode - skipping automatic update');
            return;
        }
        
        if (!isUpdating) {
            console.log('🔄 Updating silently...');
            isUpdating = true;
            updateSW(true);
        }
    },

    onOfflineReady() {
        console.log('✅ App ready to work offline');
    },

    onRegistered(registration) {
        console.log('✅ SW registered');
        
        // Request Firebase permission after SW is ready
        setTimeout(() => {
            requestPermission();
        }, 1000);
        
        if (registration && !isDev) {
            // Only check for updates on visibility change, not periodically
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible' && !isUpdating) {
                    registration.update().catch(() => {});
                }
            });
        }
    },

    onRegisterError(error) {
        console.error('❌ SW registration failed:', error);
    }
});

// Handle controller changes with safe reload
if ('serviceWorker' in navigator && !isDev) {
    let reloadPrevented = false;
    
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing || reloadPrevented) return;
        
        if (navigator.serviceWorker.controller) {
            refreshing = true;
            console.log('🔄 SW updated, reloading...');
            
            // Prevent multiple reloads
            reloadPrevented = true;
            safeReload();
        }
    });
}

console.log('✅ PWA Update System Ready');
