import { registerPlugins } from '@/plugins'
import { createApp } from 'vue'
import { MotionPlugin } from '@vueuse/motion'

import App from './App.vue'
import './pwa' // Import PWA logic

// Custom styles
import '@/assets/styles/main.scss'

const app = createApp(App)
app.use(MotionPlugin)

// Define interfaces for install prompt
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

// Global variables for installation
let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installPromptTimeout: NodeJS.Timeout;

console.log('🔍 PWA Installatio Check Starting');

// Install app function
async function installApp(): Promise<void> {
    if (deferredPrompt) {
        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response: ${outcome}`);
            deferredPrompt = null;

            const installButton = document.getElementById('install-button');
            if (installButton) installButton.style.display = 'none';
        } catch (error) {
            console.log('Install error:', error);
        }
    }
}

// Show install button
function showInstallButton(): void {
    const installButton = document.getElementById('install-button');
    if (installButton) {
        installButton.style.display = 'block';
        installButton.removeEventListener('click', installApp);
        installButton.addEventListener('click', installApp);
    } else {
        console.log('Install button element not found');
    }
}

// Installation logic (separate from updates)
document.addEventListener('DOMContentLoaded', () => {
    installPromptTimeout = setTimeout(() => {
        console.log('⏱️ No install prompt after 10 seconds');

        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('ℹ️ PWA is already installed');
        } else {
            console.log('❌ Install prompt not triggered');
        }
    }, 10000);

    // Install prompt event
    window.addEventListener('beforeinstallprompt', (e: Event) => {
        console.log('🎉 beforeinsallprompt event fired!');
        clearTimeout(installPromptTimeout);
        e.preventDefault();

        deferredPrompt = e as BeforeInstallPromptEvent;
        console.log('Available platforms:', deferredPrompt.platforms);
        showInstallButton();
    });

    // App installed event
    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA was successfully installed');
        deferredPrompt = null;
    });
});

registerPlugins(app)
app.mount('#app')
