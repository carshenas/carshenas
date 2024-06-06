<script setup lang="ts">
import ImageLoader from '@/components/ImageLoader.vue'
import { getVehicleService } from '@/services/carshenas/vehicle'
import type { Brand } from '@/types/dto/brands'
import { onMounted, ref } from 'vue'

const brands = ref<Brand[]>()
const loading = ref<boolean>(false)

const getVehicles = async () => {
  loading.value = true

  try {
    const response = await getVehicleService()
    brands.value = response.data
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

onMounted(getVehicles)
</script>

<template>
  <v-card>
    <v-card-title class="header">
      <div class="d-flex justify-space-between">
        {{ $t('shared.brands') }}

        <v-btn variant="icon" icon="close" density="comfortable" />
      </div>

      <v-text-field
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
          v-for="brand in brands"
          :key="brand.id"
          :title="brand.name"
          append-icon="chevron_left"
          class="my-2"
        >
          <template #prepend>
            <ImageLoader :src="brand.image" width="24" aspect-ratio="1" :alt="brand.name" />
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.header {
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>
