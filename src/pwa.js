import { registerSW } from 'virtual:pwa-register'

console.log('🔧 PWA Update System Starting...');

// Create better update notification
function showUpdateNotification(updateSW) {
    // Remove any existing notifications
    const existing = document.getElementById('pwa-update-notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.id = 'pwa-update-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #0C0634 0%, #1a0b4d 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
            max-width: 320px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            animation: slideIn 0.3s ease-out;
        ">
            <style>
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .update-btn {
                    transition: all 0.2s ease;
                }
                .update-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
            </style>
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <div style="font-size: 24px; margin-left: 8px;">🔄</div>
                <div>
                    <div style="font-weight: 600; font-size: 16px;">به‌روزرسانی جدید</div>
                    <div style="font-size: 12px; opacity: 0.8;">نسخه جدید آماده است</div>
                </div>
            </div>
            <div style="margin-bottom: 16px; font-size: 14px; line-height: 1.4; opacity: 0.9;">
                برای دریافت آخرین ویژگی‌ها و بهبودها، اپلیکیشن را به‌روزرسانی کنید.
            </div>
            <div style="display: flex; gap: 10px;">
                <button id="update-accept" class="update-btn" style="
                    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    flex: 1;
                    font-size: 14px;
                ">به‌روزرسانی</button>
                <button id="update-dismiss" class="update-btn" style="
                    background: rgba(255,255,255,0.1);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.2);
                    padding: 10px 15px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                ">بعداً</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Handle user interactions
    document.getElementById('update-accept')?.addEventListener('click', () => {
        console.log('👤 User accepted update');
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
        updateSW(true); // Force update
    });
    
    document.getElementById('update-dismiss')?.addEventListener('click', () => {
        console.log('👤 User dismissed update');
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-dismiss after 30 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            console.log('⏰ Update notification auto-dismissed');
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 30000);
}

// Register service worker with enhanced callbacks
const updateSW = registerSW({
    onNeedRefresh() {
        console.log('🆕 New content available, showing update notification');
        showUpdateNotification(updateSW);
    },

    onOfflineReady() {
        console.log('✅ App ready to work offline');
        
        // Optional: Show offline ready notification
        const offlineNotice = document.createElement('div');
        offlineNotice.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: #2196F3;
                color: white;
                padding: 12px 16px;
                border-radius: 6px;
                font-size: 14px;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            ">
                📱 اپلیکیشن آماده کار آفلاین است
            </div>
        `;
        document.body.appendChild(offlineNotice);
        
        setTimeout(() => {
            if (document.body.contains(offlineNotice)) {
                offlineNotice.remove();
            }
        }, 4000);
    },

    onRegisterError(error) {
        console.error('❌ SW registration error:', error);
    },

    onRegistered(registration) {
        console.log('✅ SW registered:', registration);
        
        // Set up periodic update checks
        if (registration) {
            console.log('⚙️ Setting up periodic update checks');
            
            // Check for updates every 30 seconds when page is visible
            setInterval(() => {
                if (document.visibilityState === 'visible') {
                    console.log('🔍 Checking for updates...');
                    registration.update().catch(err => {
                        console.warn('Update check failed:', err);
                    });
                }
            }, 30000);
            
            // Check for updates when page becomes visible
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    console.log('👁️ Page visible, checking for updates...');
                    registration.update().catch(err => {
                        console.warn('Visibility update check failed:', err);
                    });
                }
            });
            
            // Initial update check
            setTimeout(() => {
                console.log('🚀 Initial update check');
                registration.update().catch(err => {
                    console.warn('Initial update check failed:', err);
                });
            }, 2000);
        }
    },

    onRegisterError(error) {
        console.error('❌ Service worker registration failed:', error);
    }
});

// Handle browser refresh during update
let refreshing = false;
navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('🔄 Service Worker controller changed');
    if (refreshing) return;
    refreshing = true;
    
    // Show loading indicator
    const loader = document.createElement('div');
    loader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(12, 6, 52, 0.9);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            font-family: system-ui, -apple-system, sans-serif;
        ">
            <div style="text-align: center;">
                <div style="font-size: 48px; margin-bottom: 16px;">🔄</div>
                <div style="font-size: 18px; margin-bottom: 8px;">در حال به‌روزرسانی...</div>
                <div style="font-size: 14px; opacity: 0.8;">لطفاً صبر کنید</div>
            </div>
        </div>
    `;
    document.body.appendChild(loader);
    
    // Reload after a short delay
    setTimeout(() => {
        window.location.reload();
    }, 1000);
});

console.log('✅ PWA Update System Ready');
