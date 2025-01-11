<script setup lang="ts">
import ImageLoader from "@/components/ImageLoader.vue";
import MenuDrawer from "./components/menu/MenuDrawer.vue";
import { onMounted, ref, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { useCartStore } from "@/stores/cart";
import { useRoute } from "vue-router";
import { getUser } from "@/services/carshenas/user";
const route = useRoute();
const cartStore = useCartStore();
const userStore = useUserStore();
const isMenuOpen = ref<boolean>(false);
const isBasketOpen = ref<boolean>(false);

onMounted(async () => {
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
    <v-app-bar class="app-bar">
      <v-app-bar-nav-icon :icon="isMenuOpen ? 'close' : 'menu'" @click="openMenu" />

      <v-app-bar-title class="font-weight-bold">
        <router-link class="d-flex align-center" to="/">
          <ImageLoader src="@/assets/images/app/logo.svg" width="32" alt="carshenas logo" :types="['webp']" />

          <span class="title-md text-secondary">
            {{ $t("app.name") }}
          </span>
        </router-link>
      </v-app-bar-title>

      <template #append>
        <v-btn v-if="cartStore.items.length" icon="local_mall" density="comfortable" :to="{ name: 'CheckoutPage' }" />

        <v-btn v-if="!userStore.isLoggedIn" :to="{ name: 'AuthPage' }" :text="$t('auth.login')" variant="text"
          density="compact" class="text-primary title-md" />

        <v-btn v-else :to="{ name: 'UserProfilePage' }" density="comfortable" icon="account_circle" />
      </template>
    </v-app-bar>

    <MenuDrawer v-model="isMenuOpen" />
  </div>
</template>

<style lang="scss" scoped>
.app-bar {
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.1) !important;
}
</style>
