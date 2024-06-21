<template>
  <div id="spec" class="d-flex flex-column t-4 px-4 ga-8">
    <div class="d-flex align-center">
      <h2 role="heading" class="text-no-wrap">{{ $t('productDetail.details') }}</h2>
      <div class="w-100 border h-0 mx-2"></div>
    </div>
    <div class="d-flex flex-column">
      <div
        v-for="(value, key, index) in props.spec"
        :key="index"
        :class="[
          'd-flex',
          'justify-space-between',
          'rounded',
          'px-2',
          'py-4',
          index % 2 === 0 ? 'spec-even-bg' : ''
        ]"
      >
        <span>{{ key }}:</span>
        <span>{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  spec: Record<string, any>
}>()
</script>

<style lang="scss" scoped>
.spec-even-bg {
  background-color: rgba(38, 38, 38, 0.1);
}
</style>
