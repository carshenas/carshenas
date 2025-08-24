<script setup lang="ts">
import ImageLoader from "@/components/ImageLoader.vue";
import MenuDrawer from "./components/menu/MenuDrawer.vue";
import AuthBottomSheet from "@/components/login/LoginModal.vue"; // Import the bottom sheet
import { onMounted, ref, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { useCartStore } from "@/stores/cart";
import { useRoute, useRouter } from "vue-router";
import { getUser } from "@/services/carshenas/user";
import { useTheme } from 'vuetify'

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();
const isMenuOpen = ref<boolean>(false);
const isBasketOpen = ref<boolean>(false);
const theme = useTheme()
const isTransitioning = ref(false)
const showAuthBottomSheet = ref(false)

// Watch for auth query parameter
watch(() => route.query.auth, (authParam) => {
  if (authParam === 'true' && !userStore.isLoggedIn) {
    showAuthBottomSheet.value = true
  }
}, { immediate: true })


// Open auth bottom sheet programmatically
const openAuthBottomSheet = () => {
  showAuthBottomSheet.value = true
}

// Clean up query param when bottom sheet closes
watch(showAuthBottomSheet, (isOpen) => {
  if (!isOpen && route.query.auth) {
    // Remove auth query parameter
    const query = { ...route.query }
    delete query.auth
    router.replace({ query })
  }
})

const toggleTheme = () => {
  isTransitioning.value = true
  const newTheme = theme.global.current.value.dark ? 'light' : 'dark'

  // Add transition class to body
  document.documentElement.classList.add('theme-transitioning')

  setTimeout(() => {
    theme.global.name.value = newTheme
    localStorage.setItem('theme', newTheme)

    // Remove transition class after theme change
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
      isTransitioning.value = false
    }, 50)
  }, 50)
}

onMounted(async () => {
  // Load saved theme first
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.global.name.value = savedTheme
  }

  // Only fetch user data if user is logged in
  if (userStore.isLoggedIn) {
    try {
      console.log('🔄 Fetching user data...')
      const response = await getUser();

      // Update user store with fetched data
      userStore.user.firstName = response.data.firstName
      userStore.user.lastName = response.data.lastName
      userStore.user.phoneNumber = response.data.phoneNumber
      userStore.user.nationalCode = response.data.nationalCode

      console.log('✅ User data loaded successfully')
    } catch (error) {
      console.error('❌ Failed to fetch user data:', error)
    }
  } else {
    console.log('👤 User not logged in, skipping user data fetch')
  }
});

const openMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;

  if (isMenuOpen.value && isBasketOpen.value) isBasketOpen.value = false;
};

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false;
  }
);

// Optional: Watch for login status changes and fetch user data when user logs in
watch(
  () => userStore.isLoggedIn,
  async (newValue, oldValue) => {
    // If user just logged in
    if (newValue && !oldValue) {
      try {
        console.log('🔄 User logged in, fetching user data...')
        const response = await getUser();

        userStore.user.firstName = response.data.firstName
        userStore.user.lastName = response.data.lastName
        userStore.user.phoneNumber = response.data.phoneNumber
        userStore.user.nationalCode = response.data.nationalCode

        console.log('✅ User data loaded after login')
      } catch (error) {
        console.error('❌ Failed to fetch user data after login:', error)
      }
    }

    // If user logged out, clear user data
    if (!newValue && oldValue) {
      console.log('👋 User logged out, clearing user data')
      userStore.user.firstName = ''
      userStore.user.lastName = ''
      userStore.user.phoneNumber = ''
      userStore.user.nationalCode = ''
    }
  }
);
</script>

<template>
  <div>
    <v-app-bar class="app-bar" elevation="0">
      <v-app-bar-nav-icon :icon="isMenuOpen ? 'close' : 'menu'" @click="openMenu" size="large" class="touch-target" />

      <v-app-bar-title class="font-weight-bold">
        <router-link class="d-flex align-center" to="/">
          <ImageLoader src="@/assets/images/app/logo.svg" width="32" alt="carshenas logo" :types="['webp']" />

          <span class="title-md text-secondary">
            {{ $t("app.name") }}
          </span>
        </router-link>
      </v-app-bar-title>

      <template #append>
        <v-btn icon @click="toggleTheme" class="theme-toggle touch-target" size="large"
          :aria-label="theme.global.current.value.dark ? 'Switch to light mode' : 'Switch to dark mode'"
          :disabled="isTransitioning">
          <v-icon :class="{ 'theme-icon-transitioning': isTransitioning }">
            {{ theme.global.current.value.dark ? 'light_mode' : 'dark_mode' }}
          </v-icon>
        </v-btn>
        <v-btn v-if="cartStore.items.length" icon="local_mall" :to="{ name: 'CheckoutPage' }"
          class="cart-btn touch-target" size="large" :aria-label="`Cart with ${cartStore.items.length} items`">
          <v-badge :content="cartStore.items.length" color="primary" location="top end" offset-x="1" offset-y="1"
            size="small">
            <v-icon>local_mall</v-icon>
          </v-badge>
        </v-btn>

        <div v-if="!userStore.isLoggedIn" v-motion :initial="{ scale: 0.9 }" :enter="{
          scale: 1,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 250,
            damping: 25,
            delay: 100
          }
        }" :hover="{ scale: 1.05 }" :tap="{ scale: 0.95 }">
          <v-btn @click="openAuthBottomSheet" :text="$t('auth.login')" variant="flat" density="comfortable" height="36"
            class="login-btn touch-target" :aria-label="$t('auth.login')" />
        </div>

        <v-btn v-else :to="{ name: 'UserProfilePage' }" icon="account_circle" class="profile-btn touch-target"
          size="large" :aria-label="'User profile'" />
      </template>
    </v-app-bar>

    <MenuDrawer v-model="isMenuOpen" />

    <!-- Auth Bottom Sheet -->
    <AuthBottomSheet v-model="showAuthBottomSheet" />
  </div>
</template>


<style lang="scss" scoped>
.app-bar {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid var(--v-theme-divider);
  transition: background-color 0.3s ease, border-color 0.3s ease;

  // Subtle gradient overlay
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%);
    pointer-events: none;
    opacity: 0.8;
    transition: background 0.3s ease, opacity 0.3s ease;
  }

  :deep(.v-toolbar__content) {
    position: relative;
    z-index: 1;
  }
}

// Touch-friendly target sizes (minimum 44x44px)
.touch-target {
  min-width: 32px;
  min-height: 32px;
  position: relative;

  // Ripple effect on tap
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: currentColor;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.4s ease, opacity 0.4s ease;
  }

  &:active::after {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.1;
  }
}

// Theme toggle button - mobile optimized
.theme-toggle {
  transition: transform 0.3s ease;

  // Icon transition animation
  .theme-icon-transitioning {
    animation: themeIconRotate 0.6s ease-in-out;
  }

  // Active state for mobile tap
  &:active {
    transform: scale(0.95);
  }

  // Focus state for accessibility
  &:focus-visible {
    outline: 2px solid var(--v-theme-primary);
    outline-offset: 2px;
  }

  // Desktop hover (progressive enhancement)
  @media (hover: hover) {
    &:hover {
      transform: rotate(180deg);
    }
  }
}

@keyframes themeIconRotate {
  0% {
    transform: rotate(0deg) scale(1);
  }

  50% {
    transform: rotate(180deg) scale(0.8);
  }

  100% {
    transform: rotate(360deg) scale(1);
  }
}

// Cart button - mobile optimized
.cart-btn {

  // Active state animation
  &:active {
    transform: scale(0.95);
  }

  // Focus state
  &:focus-visible {
    outline: 2px solid var(--v-theme-primary);
    outline-offset: 2px;
  }

  // Desktop hover (progressive enhancement)
  @media (hover: hover) {
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: var(--v-theme-gradient-primary, linear-gradient(135deg, #FB4847 0%, #FF6B6B 100%));
      transform: translate(-50%, -50%);
      transition: width 0.3s ease, height 0.3s ease;
      opacity: 0.1;
    }

    &:hover::before {
      width: 100%;
      height: 100%;
    }
  }
}

// Login button - mobile optimized with visible gradient
.login-btn {
  background: linear-gradient(135deg, #FB4847 0%, #FF6B6B 100%);
  color: white;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(251, 72, 71, 0.25);
  transition: all 0.3s ease;

  // Subtle glow effect
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg,
        transparent 30%,
        rgba(255, 255, 255, 0.1) 50%,
        transparent 70%);
    transform: rotate(45deg) translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover::before {
    transform: rotate(45deg) translateX(100%);
  }

  // Focus state
  &:focus-visible {
    outline: 2px solid var(--v-theme-primary);
    outline-offset: 2px;
    box-shadow: 0 0 0 3px rgba(251, 72, 71, 0.2);
  }

  :deep(.v-btn__content) {
    color: white;
    position: relative;
    z-index: 1;
  }

  // Passive floating animation
  animation: floatingButton 4s ease-in-out infinite;
}

@keyframes floatingButton {

  0%,
  100% {
    transform: translateY(0px);
    box-shadow: 0 2px 8px rgba(251, 72, 71, 0.25);
  }

  50% {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(251, 72, 71, 0.35);
  }
}

// Dark theme adjustments - more subtle gradient
:deep(.v-theme--dark) {
  .login-btn {
    // Darker, less bright gradient for dark mode
    background: linear-gradient(135deg, #D73937 0%, #E85553 100%);
    box-shadow: 0 2px 8px rgba(215, 57, 55, 0.15);

    // Reduce the glow intensity in dark mode
    &::before {
      background: linear-gradient(45deg,
          transparent 30%,
          rgba(255, 255, 255, 0.05) 50%,
          transparent 70%);
    }

    &:hover {
      box-shadow: 0 4px 12px rgba(215, 57, 55, 0.25);
    }

    &:focus-visible {
      box-shadow: 0 0 0 3px rgba(215, 57, 55, 0.15);
    }
  }

  @keyframes floatingButton {

    0%,
    100% {
      transform: translateY(0px);
      box-shadow: 0 2px 8px rgba(215, 57, 55, 0.15);
    }

    50% {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(215, 57, 55, 0.25);
    }
  }
}


// Ensure good tap targets on mobile
@media (max-width: 600px) {
  .touch-target {
    min-width: 36px;
    min-height: 36px;
  }
}
</style>

<style>
/* Global theme transition styles */
.theme-transitioning,
.theme-transitioning * {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, fill 0.3s ease !important;
}

/* Smooth transition for Vuetify components */
.theme-transitioning .v-application,
.theme-transitioning .v-navigation-drawer,
.theme-transitioning .v-card,
.theme-transitioning .v-btn,
.theme-transitioning .v-list,
.theme-transitioning .v-list-item {
  transition: background-color 0.3s ease, color 0.3s ease !important;
}
</style>
