import { registerPlugins } from '@/plugins'
import { createApp } from 'vue'
import './pwa.js'

import App from './App.vue'

// Custom styles
import '@/assets/styles/main.scss'

const app = createApp(App)

// Define the BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

// Global variables
let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installPromptTimeout: NodeJS.Timeout;

console.log('🔍 PA Installability Check');

// Check all PWA requirements
function checkPWARequirements() {
    const requirements = {
        'HTTPS/localhost': location.protocol === 'https:' || location.hostname === 'localhost',
        'Manifest linked': !!document.querySelector('link[rel="manifest"]'),
        'Service Worker': 'serviceWorker' in navigator,
        'Not already installed': !window.matchMedia('(display-mode: standalone)').matches
    };

    console.log('PWA Requirements:', requirements);

    // Check if manifest is accessible
    fetch('/manifest.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        })
        .then(manifest => {
            console.log('✅ Manifest loaded:', manifest);

            // Validate required manifest fields
            const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
            const missingFields = requiredFields.filter(field => !manifest[field]);

            if (missingFields.length > 0) {
                console.log('❌ Missing manifest fields:', missingFields);
            } else {
                console.log('✅ Manifest has all required fields');
            }
        })
        .catch(error => {
            console.log('❌ Manifest loading error:', error);
        });
}

// Install app function
async function installApp(): Promise<void> {
    if (deferredPrompt) {
        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response: ${outcome}`);
            deferredPrompt = null;
            
            // Hide install button
            const installButton = document.getElementById('install-button');
            if (installButton) {
                installButton.style.display = 'none';
            }
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
        // Remove existing listeners to avoid duplicates
        installButton.removeEventListener('click', installApp);
        installButton.addEventListener('click', installApp);
    } else {
        console.log('Install button element not found');
    }
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    checkPWARequirements();

    // Set timeout to check for install prompt
    installPromptTimeout = setTimeout(() => {
        console.log('⏱️ No install prompt after 10 seconds - checking why...');

        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('ℹ️ PWA is already installed');
        } else {
            console.log('❌ Install prompt not triggered - possible reasons:');
            console.log('   - Not enough user engagement');
            console.log('   - Missing manifest requirements');
            console.log('   - External resource loading issues');
            console.log('   - Browser doesn\'t support PWA install');
            console.log('   - Try opening Chrome DevTools → Application → Manifest → Add to homescreen');
        }
    }, 10000);

    // Single beforeinstallprompt event listener
    window.addEventListener('beforeinstallprompt', (e: Event) => {
        console.log('🎉 beforeinstalprompt event fired!');
        
        clearTimeout(installPromptTimeout);
        e.preventDefault();
        
        deferredPrompt = e as BeforeInstallPromptEvent;
        console.log('Available platforms:', deferredPrompt.platforms);
        
        // Show install button
        showInstallButton();
        
        // Store globally for debugging
        (window as any).deferredPrompt = deferredPrompt;
    });

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA was successfully installed');
        deferredPrompt = null;
    });
});

registerPlugins(app)
app.mount('#app')
