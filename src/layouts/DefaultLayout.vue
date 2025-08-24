<script setup lang="ts">
import ImageLoader from "@/components/ImageLoader.vue";
import MenuDrawer from "./components/menu/MenuDrawer.vue";
import { onMounted, ref, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { useCartStore } from "@/stores/cart";
import { useRoute } from "vue-router";
import { getUser } from "@/services/carshenas/user";
import { useTheme } from 'vuetify'

const route = useRoute();
const cartStore = useCartStore();
const userStore = useUserStore();
const isMenuOpen = ref<boolean>(false);
const isBasketOpen = ref<boolean>(false);
const theme = useTheme()
const isTransitioning = ref(false)

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
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.global.name.value = savedTheme
  }
  try {
    const response = await getUser();
    userStore.user.firstName = response.data.firstName
    userStore.user.lastName = response.data.lastName
    userStore.user.phoneNumber = response.data.phoneNumber
    userStore.user.nationalCode = response.data.nationalCode
  } catch (error) {
    console.log(error)
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
</script>

<template>
  <div>
    <v-app-bar class="app-bar" elevation="0">
      <v-app-bar-nav-icon 
        :icon="isMenuOpen ? 'close' : 'menu'" 
        @click="openMenu"
        size="large"
        class="touch-target"
      />

      <v-app-bar-title class="font-weight-bold">
        <router-link class="d-flex align-center" to="/">
          <ImageLoader src="@/assets/images/app/logo.svg" width="32" alt="carshenas logo" :types="['webp']" />

          <span class="title-md text-secondary">
            {{ $t("app.name") }}
          </span>
        </router-link>
      </v-app-bar-title>

      <template #append>
        <v-btn 
          icon 
          @click="toggleTheme" 
          class="theme-toggle touch-target"
          size="large"
          :aria-label="theme.global.current.value.dark ? 'Switch to light mode' : 'Switch to dark mode'"
          :disabled="isTransitioning"
        >
          <v-icon :class="{ 'theme-icon-transitioning': isTransitioning }">
            {{ theme.global.current.value.dark ? 'light_mode' : 'dark_mode' }}
          </v-icon>
        </v-btn>
        
        <v-btn 
          v-if="cartStore.items.length" 
          icon="local_mall" 
          :to="{ name: 'CheckoutPage' }"
          class="cart-btn touch-target"
          size="large"
          :aria-label="`Cart with ${cartStore.items.length} items`"
        >
          <v-badge
            :content="cartStore.items.length"
            color="primary"
            location="top end"
            offset-x="1"
            offset-y="1"
            size="small"
          >
            <v-icon>local_mall</v-icon>
          </v-badge>
        </v-btn>
        
        <v-btn 
          v-if="!userStore.isLoggedIn" 
          :to="{ name: 'AuthPage' }" 
          :text="$t('auth.login')" 
          variant="tonal"
          density="comfortable" 
          class="login-btn touch-target" 
          :aria-label="$t('auth.login')"
        />

        <v-btn 
          v-else 
          :to="{ name: 'UserProfilePage' }" 
          icon="account_circle"
          class="profile-btn touch-target"
          size="large"
          :aria-label="'User profile'"
        />
      </template>
    </v-app-bar>

    <MenuDrawer v-model="isMenuOpen" />
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
  min-width: 44px;
  min-height: 44px;
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
  background: var(--v-theme-gradient-primary, linear-gradient(135deg, #FB4847 0%, #FF6B6B 100%));
  color: white;
  font-weight: 500;
  transition: background 0.3s ease, transform 0.2s ease;
  
  // Active state
  &:active {
    transform: scale(0.95);
  }
  
  // Focus state
  &:focus-visible {
    outline: 2px solid var(--v-theme-primary);
    outline-offset: 2px;
  }
  
  :deep(.v-btn__content) {
    color: white;
  }
}

// Profile button - mobile optimized
.profile-btn {
  transition: all 0.3s ease;
  
  // Active state
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
    &:hover {
      transform: scale(1.05);
    }
  }
}

// Dark theme adjustments
:deep(.v-theme--dark) {
  .app-bar {
    &::after {
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%);
    }
  }
  
  .login-btn {
    background: var(--v-theme-gradient-primary-dark, linear-gradient(135deg, #FF6B6B 0%, #FFA0A0 100%));
  }
}

// Ensure good tap targets on mobile
@media (max-width: 600px) {
  .touch-target {
    min-width: 48px;
    min-height: 48px;
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
