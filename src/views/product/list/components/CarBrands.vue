<script setup lang="ts">
import ImageLoader from '@/components/ImageLoader.vue'
import { getVehicleService } from '@/services/carshenas/vehicle'
import type { Brand } from '@/types/dto/brands'
import { computed, onMounted, ref } from 'vue'

const brands = ref<Brand[]>()
const loading = ref<boolean>(false)
const search = ref<string>()
const emit = defineEmits<{ (e: 'select', payload: number): void; (e: 'close'): void }>()

const getVehicles = async () => {
  loading.value = true

  try {
    const response = await getVehicleService()
    brands.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const filteredBrands = computed((): Brand[] => {
  if (search.value) return brands.value?.filter((brand) => brand.name.includes(search.value!)) || []
  else return brands.value || []
})

onMounted(getVehicles)
</script>

<template>
  <v-card-title class="header">
    <div class="mt-2 mb-4 d-flex justify-space-between">
      {{ $t('shared.brands') }}

      <v-btn variant="icon" icon="close" density="comfortable" @click="emit('close')" />
    </div>

    <v-text-field
      v-model="search"
      :placeholder="$t('shared.search')"
      variant="outlined"
      rounded
      hide-details
      prepend-inner-icon="arrow_forward_ios"
      append-inner-icon="search"
    />
  </v-card-title>

  <v-card-text class="pa-0">
    <v-list lines="false">
      <v-list-item
        v-for="brand in filteredBrands"
        :key="brand.id"
        :title="brand.name"
        append-icon="chevron_left"
        class="py-4"
        @click="emit('select', brand.id)"
      >
        <template #prepend>
          <ImageLoader :src="brand.image" width="24" aspect-ratio="1" :alt="brand.name" />
        </template>
      </v-list-item>
    </v-list>
  </v-card-text>
</template>

<style lang="scss" scoped>
.header {
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>
