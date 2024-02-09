<script lang="ts" setup>
defineProps<{
  icon: string
  title: string
}>()
</script>

<template>
  <router-link class="category d-flex flex-column justify-center align-center" :to="{}">
    <div class="icon w-100 bg-primary rounded-circle d-flex justify-center align-center">
      <img :src="icon" :alt="title" width="32" />
    </div>

    <span class="title mt-2 text-text">{{ title }}</span>
  </router-link>
</template>

<style lang="scss" scoped>
.category {
  width: 60px;
  text-decoration: none;
  .icon {
    aspect-ratio: 1;
  }
  .title {
    font-size: 0.875rem;
    font-weight: 500;
    text-wrap: wrap;
    text-align: center;
  }
}
</style>
