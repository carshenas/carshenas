<template>
  <v-app-bar>
    <v-app-bar-nav-icon icon="chevron_right" density="compact" @click="$router.back()" />

    <v-app-bar-title class="font-weight-bold">
      <span class="title-md text-secondary">
        {{ $route.meta.title }}
      </span>
    </v-app-bar-title>
  </v-app-bar>
</template>
