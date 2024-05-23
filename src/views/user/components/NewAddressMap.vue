<script setup lang="ts">
import { ref } from 'vue'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
let zoom = ref(6)
let center = ref([32.4, 53.69])
</script>

<template>
  <l-map ref="map" v-model:zoom="zoom" v-model:center="center" :useGlobalLeaflet="false">
    <l-tile-layer
      url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
      layer-type="base"
      name="Stadia Maps Basemap"
    ></l-tile-layer>
  </l-map>
</template>

<style lang="scss">
.leaflet-container {
  height: 250px !important;
}
</style>
