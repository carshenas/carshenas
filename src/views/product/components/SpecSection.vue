<template>
  <div id="spec" class="t-4 px-4 ga-8">
    <div class="d-flex align-center mb-4">
      <h2 role="heading" class="text-no-wrap title-md">
        {{ $t("product.details") }}
      </h2>
      <div class="w-100 border h-0 mx-2"></div>
    </div>
    <table class="w-100 table-striped">
      <tbody>
        <tr
          v-for="(value, key, index) in props.spec"
          :key="index"
          :class="index % 2 === 0 ? 'spec-even-bg' : 'spec-odd-bg'"
        >
          <td class="px-2 py-2">{{ key }}:</td>
          <td class="px-2 py-2">{{ value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  spec: Record<string, any>;
}>();

</script>

<style lang="scss" scoped>
.spec-even-bg {
  background-color: var(--v-theme-surface-variant, var(--v-theme-surface));
}
.spec-odd-bg {
  background-color: var(--v-theme-surface);
}


.table-striped tbody tr:nth-child(even) {
  background-color: var(--v-theme-surface-variant, var(--v-theme-surface));
}
</style>
