<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import 'leaflet/dist/leaflet.css'
import { getAddressService } from '@/services/carshenas/address'

import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import { Icon } from '@/types/dto/the-map' // Adjust the import path accordingly
import type { IconOptions, LatLng, LeafletMouseEvent, LatLngString } from '@/types/dto/the-map'

const zoom = ref(8)
const center = ref<LatLng>({ lat: 35.6, lng: 51.3 } as LatLng)
const selectedPosition = ref<LatLng | null>(null)
const mapKey = ref(0)

const { showInfo } = defineProps<{
  showInfo: boolean
}>()
const emit = defineEmits<{
  (e: 'update:position', position: LatLng): void
  (e: 'update:showInfo', value: boolean): void
}>()

const customIconOptions: IconOptions = {
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/9131/9131546.png',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [-30, -15]
}

const customIcon = new Icon(customIconOptions)

const handleMapClick = async (event: LeafletMouseEvent) => {
  const { lat, lng } = event.latlng
  try {
    const response = await getAddressService(lat, lng)
    const latLngString: LatLngString = response.data
    console.log('Received LatLngString:', latLngString)
  } catch (error) {
    console.error('Error:', error)
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
</script>

<template>
  <div class="position-relative">
    <l-map
      ref="map"
      :key="mapKey"
      v-model:zoom="zoom"
      v-model:center="center"
      @click="handleMapClick"
      :useGlobalLeaflet="false"
      :class="{ 'leaflet-height': !showInfo, 'leaflet-height-disable': showInfo }"
      :style="{ 'pointer-events': showInfo ? 'none' : 'auto' }"
    >
      <l-tile-layer
        url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
        layer-type="base"
        name="Stadia Maps Basemap"
      ></l-tile-layer>

      <l-marker v-if="selectedPosition" :lat-lng="selectedPosition" :icon="customIcon"></l-marker>
    </l-map>
    <v-btn v-if="showInfo" icon="edit" size="x-small" class="edit-btn" @click="handleEdit"> </v-btn>
  </div>
  <v-container v-if="!showInfo">
    <v-btn
      block
      rounded="pill"
      color="primary"
      size="x-large"
      hide-details
      :disabled="!selectedPosition"
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
</style>
