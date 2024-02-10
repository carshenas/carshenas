<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
body {
  display: grid;
  place-items: center;
}

#app {
  width: 100%;
  max-width: 480px;
}

#app>div {
  max-width: 100vw;
}

</style>
