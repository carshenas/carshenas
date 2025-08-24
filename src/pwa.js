import { registerSW } from 'virtual:pwa-register'

console.log('🔧 PWA Update System Starting...');

const isDev = import.meta.env.DEV;
let isUpdating = false;
let refreshing = false;

const updateSW = registerSW({
    onNeedRefresh() {
        console.log('🆕 New content available');
        
        if (isDev) {
            // In development, be more careful about updates
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
        
        if (registration && !isDev) {
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

// Only handle controllerchange in production or when we expect an update
if ('serviceWorker' in navigator && !isDev) {
    navigator.serviceWorker.addEventListener('controllerchange', (event) => {
        if (refreshing) return;
        
        // Check if there's actually a new controller
        if (navigator.serviceWorker.controller) {
            refreshing = true;
            console.log('🔄 SW updated, reloading...');
            window.location.reload();
        }
    });
}

console.log('✅ PWA Update System Ready');
