import { registerSW } from 'virtual:pwa-register'

console.log('🔧 PWA Update System Starting...');

// Register SW with completely silent updates
const updateSW = registerSW({
    onNeedRefresh() {
        console.log('🆕 New content available - updating silently...');
        // Just update immediately, no user interaction
        updateSW(true);
    },

    onOfflineReady() {
        console.log('✅ App ready to work offline');
    },

    onRegistered(registration) {
        console.log('✅ SW registered');
        
        if (registration) {
            // Check for updates when user returns to tab
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    registration.update().catch(() => {});
                }
            });
        }
    },

    onRegisterError(error) {
        console.error('❌ SW registration failed:', error);
    }
});

// Handle silent reload when SW updates
let refreshing = false;
navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    
    console.log('🔄 SW updated, reloading silently...');
    window.location.reload();
});

console.log('✅ PWA Update System Ready - Silent Mode');
