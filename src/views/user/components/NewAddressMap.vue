<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import { Icon } from '@/types/dto/the-map' // Adjust the import path accordingly
import type { IconOptions, LatLng } from '@/types/dto/the-map'

const zoom = ref(8)
const center = ref<LatLng>({ lat: 35.6, lng: 51.3 })
const selectedPosition = ref<LatLng | null>(null)

// Define the emit function with the appropriate event type
const emit = defineEmits<{
  (e: 'update:position', position: LatLng): void
}>()

const customIconOptions: IconOptions = {
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/9131/9131546.png',
  iconSize: [30, 30],
  iconAnchor: [15,15]  ,
  popupAnchor: [-30, -15],
}

// Create the custom icon
const customIcon = new Icon(customIconOptions)

// Emit selected position when the map is clicked
const handleMapClick = (event: any) => {
  selectedPosition.value = { lat: event.latlng.lat, lng: event.latlng.lng }
  center.value = { lat: event.latlng.lat, lng: event.latlng.lng }
  emit('update:position', selectedPosition.value)
}
</script>

<template>
  <l-map
    ref="map"
    v-model:zoom="zoom"
    v-model:center="center"
    @click="handleMapClick"
    :useGlobalLeaflet="false"
  >
    <l-tile-layer
      url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
      layer-type="base"
      name="Stadia Maps Basemap"
    ></l-tile-layer>
    <l-marker v-if="selectedPosition" :lat-lng="selectedPosition" :icon="customIcon"></l-marker>
  </l-map>
</template>

<style lang="scss">
.leaflet-container {
  height: 250px !important;
}
</style>
