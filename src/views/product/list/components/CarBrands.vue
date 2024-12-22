<script setup lang="ts">
import ImageLoader from '@/components/ImageLoader.vue'
import { getVehicleService } from '@/services/carshenas/vehicle'
import type { Brand, Vehicle } from '@/types/dto/brands'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const brands = ref<Brand[]>()
const models = ref<Vehicle[]>()
const loading = ref<boolean>(false)
const search = ref<string>()
const emit = defineEmits<{
  (e: 'select', payload: number): void
  (e: 'close'): void
}>()

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

const filteredItems = computed((): Brand[] | Vehicle[] => {
  const items = models.value?.length ? models.value : brands.value
  if (search.value)
    return items?.filter((brand) => brand.name.includes(search.value!)) || []
  else return items || []
})

const handleClick = (item: any) => {
  if (item.vehicles) return (models.value = item.vehicles)

  useRouter().push({ query: { ...useRoute().query, vehicle_id: item.id } })
  emit('close')
}

onMounted(getVehicles)
</script>

<template>
  <v-card-title class="header">
    <div class="mt-2 mb-4 d-flex justify-space-between">
      {{ $t('shared.brands') }}

      <v-btn
        variant="plain"
        icon="close"
        density="comfortable"
        @click="emit('close')"
      />
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
    <v-list :lines="false">
      <v-list-item
        v-for="item in filteredItems"
        :key="item.id"
        :title="item.name"
        append-icon="chevron_left"
        class="py-4"
        @click="handleClick(item)"
      >
        <template #prepend>
          <ImageLoader
            class="ml-4"
            :src="item.image"
            width="24"
            aspect-ratio="1"
            :alt="item.name"
          />
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
