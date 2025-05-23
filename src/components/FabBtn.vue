<script setup lang="ts">
defineProps<{
  icon: string
  text: string
  delay: number
  top?: boolean
  right?: boolean
  bottom?: boolean
  left?: boolean
}>()
</script>

<template>
  <button class="c-btn bg-primary" :class="{ top, left, bottom, right }" :style="`--c-fab-delay: ${delay || 2}`">
    <div class="text">
      <span class="mr-4">
        {{ text }}
      </span>
    </div>

    <div class="icon">
      <v-icon :icon />
    </div>
  </button>
</template>

<style scoped lang="scss">
.c-btn {
  position: fixed;
  overflow: hidden;

  display: flex;
  align-items: center;

  border-radius: 100rem;

  .text {
    white-space: nowrap;
    animation: extend 2s forwards ease-in-out calc(var(--c-fab-delay, 2) * 1s);
  }

  .icon {
    background-color: inherit;
    height: 100%;
    padding: 0.75rem;
  }

  &.left {
    left: 1rem;
  }

  &.right {
    right: 1rem;
  }

  &.bottom {
    bottom: 1rem;
  }

  &.top {
    top: 1rem;
  }
}

@keyframes extend {
  from {
    max-width: 500px;
  }

  to {
    max-width: 0;
  }
}
</style>
