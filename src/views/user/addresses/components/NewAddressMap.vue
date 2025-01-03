<script setup lang="ts">
import { ref, onMounted } from 'vue'
import 'leaflet/dist/leaflet.css'
import { getAddressService } from '@/services/carshenas/address/'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import { Icon } from 'leaflet'
import type { IconOptions, LatLng, LeafletMouseEvent } from '@/types/dto/the-map'

const zoom = ref(8)
const center = ref<[number, number]>([35.6, 51.3])
const selectedPosition = ref<[number, number]>()
const mapKey = ref(0)
const latLngString = ref<string>('')
const isLoading = ref(false)
const loadingMessage = ref<string>('')
import type { Map as LeafletMap } from 'leaflet'

const mapRef = ref<LeafletMap | null>(null)

const { showInfo } = defineProps<{
  showInfo: boolean
}>()

const emit = defineEmits<{
  (e: 'update:position', position: LatLng): void
  (e: 'update:showInfo', value: boolean): void
  (e: 'update:latLngString', value: string): void
}>()

const customIconOptions: IconOptions = {
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/9131/9131546.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30], // Adjusted to point to bottom center of icon
  popupAnchor: [-30, -15]
}

const customIcon = new Icon(customIconOptions)

// Function to get precise coordinates
const getPreciseCoordinates = (event: LeafletMouseEvent): LatLng => {
  const map = mapRef.value
  if (!map) return event.latlng

  const point = map.mouseEventToContainerPoint(event.originalEvent)
  return map.containerPointToLatLng(point)
}

const handleMapClick = async (event: LeafletMouseEvent) => {
  // Get coordinates directly from the event
  const lat = event.latlng.lat
  const lng = event.latlng.lng
  
  try {
    isLoading.value = true
    loadingMessage.value = 'در حال دریافت آدرس'
    
    // Round coordinates to 6 decimal places for consistency
    const roundedLat = Number(lat.toFixed(6))
    const roundedLng = Number(lng.toFixed(6))
    
    const response = await getAddressService(roundedLat, roundedLng)

    latLngString.value = response.data.address
    loadingMessage.value = 'Address fetched successfully!'
    selectedPosition.value = [roundedLat, roundedLng]
    
    // Only update center if click is far from current center
    const distance = center.value ? Math.abs(center.value[0] - roundedLat) + Math.abs(center.value[1] - roundedLng) : 0
    if (distance > 0.01) {
      center.value = [roundedLat, roundedLng]
    }

    emit('update:position', { lat: roundedLat, lng: roundedLng })
    emit('update:latLngString', latLngString.value)
  } catch (error) {
    console.error('Error:', error)
    loadingMessage.value = 'مشکلی پیش آمده دوباره تلاش کنید'
  } finally {
    isLoading.value = false
  }
}


const handleShowInfoUpdate = () => {
  if (selectedPosition.value) emit('update:showInfo', true)
  mapKey.value++
}

const handleEdit = () => {
  emit('update:showInfo', false)
  mapKey.value++
}

onMounted(() => {
  // Initialize map with higher precision settings if needed
  if (mapRef.value) {
    mapRef.value.options.tapTolerance = 10
    // mapRef.value.options.clickTolerance = 3
  }
})
</script>

<template>
  <div class="position-relative">
    <l-map 
      ref="mapRef"
      :key="mapKey" 
      v-model:zoom="zoom" 
      v-model:center="center" 
      @click="handleMapClick"
      :useGlobalLeaflet="false" 
      :class="{ 'leaflet-height': !showInfo, 'leaflet-height-disable': showInfo }"
      :style="{ 'pointer-events': showInfo || isLoading ? 'none' : 'auto' }"
      :tap="false"
    >
      <l-tile-layer 
        url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png" 
        layer-type="base"
        name="Stadia Maps Basemap"
      />

      <l-marker 
        v-if="selectedPosition" 
        :lat-lng="selectedPosition" 
        :icon="customIcon"
        :draggable="false"
      />
    </l-map>

    <v-btn 
      v-if="showInfo" 
      icon="edit" 
      size="x-small" 
      class="edit-btn" 
      @click="handleEdit"
    />
  </div>

  <v-container v-if="isLoading" class="loading-container">
    <p class="loading-text">{{ loadingMessage }}</p>
  </v-container>

  <v-container v-if="!isLoading && !showInfo">
    <p>{{ latLngString }}</p>
  </v-container>

  <v-container v-if="!showInfo">
    <v-btn 
      block 
      rounded="pill" 
      color="primary" 
      size="x-large" 
      hide-details 
      :disabled="!selectedPosition || isLoading"
      @click="handleShowInfoUpdate"
    >
      {{ $t('shared.submit') }}
    </v-btn>
  </v-container>
</template>

<style lang="scss">
.leaflet-height {
  height: 350px !important;
}

.leaflet-height-disable {
  height: 150px !important;
}

.edit-btn {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 1000;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #ccc;
  border-radius: 8px;
}

.loading-text {
  font-size: 1.2rem;
  color: #666;
  text-align: center;
}
</style>