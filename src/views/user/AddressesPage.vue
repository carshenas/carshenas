<script setup lang="ts">
import { ref } from 'vue'
import type Address from '@/types/dto/addresses'
import type { LatLng } from '@/types/dto/the-map'
import NewAddressInfo from './components/NewAddressInfo.vue'
import NewAddressMap from './components/NewAddressMap.vue'
const showInfo = ref(false)
const bottomSheetVisible = ref(false)
const selectedPosition = ref<LatLng | null>(null)

const addressList = ref<Address[]>([
  {
    id: 1,
    address: 'تهران،تیموری، خ. حبیب الله جنوبی، بعد از خ. تیموری غربی، خ. عزیزی',
    postalCode: '1458886878',
    plaque: 41,
    unit: 12,
    position: { lat: 35.6, lng: 51.3 }
  },
  {
    id: 2,
    address: 'تهران،تیموری، خ. حبیب الله جنوبی، بعد از خ. تیموری غربی، خ. عزیزی',
    postalCode: '1458886878',
    plaque: 1,
    unit: 2,
    position: { lat: 35.7, lng: 51.4 }
  }
])

const handleMapPositionUpdate = (newPosition: LatLng) => {
  selectedPosition.value = newPosition
}
const handleShowInfoUpdate = (value: boolean) => {
  showInfo.value = value
}
const handleAddressSubmit = (newAddress: Address) => {
  console.log(newAddress)
  addressList.value.push(newAddress)
  showInfo.value = false
  bottomSheetVisible.value = false
}
</script>

<template>
  <section class="pa-4 d-flex flex-column ga-4 h-100">
    <div class="w-100 d-flex align-center justify-space-between">
      <v-btn icon="arrow_forward_ios" variant="text" @click="$router.go(-1)" />
      <h1>{{ $t('profile.addresses') }}</h1>
      <v-btn icon="" variant="text" />
    </div>
    <div class="d-flex flex-column ga-4">
      <v-bottom-sheet v-model="bottomSheetVisible">
        <template v-slot:activator="{ props }">
          <v-btn
            block
            v-bind="props"
            class="justify-space-between"
            rounded="lg"
            color="primary"
            size="x-large"
            append-icon="add"
          >
            {{ $t('profile.newAddress') }}
          </v-btn>
        </template>
        <v-card class="d-flex flex-column ga-4" :title="$t('profile.newAddress')">
          <NewAddressMap
            :showInfo="showInfo"
            @update:position="handleMapPositionUpdate"
            @update:showInfo="handleShowInfoUpdate"
          />
          <NewAddressInfo
            v-if="showInfo"
            :position="selectedPosition"
            @submit="handleAddressSubmit"
          />
        </v-card>
      </v-bottom-sheet>

      <v-card class="mx-auto w-100 pa-2" v-for="(addr, index) in addressList" :key="index">
        <v-card-text>{{ addr.address }}</v-card-text>
        <div class="d-flex w-100 justify-space-between text-grey align-center">
          <v-btn icon="border_color" variant="text" />
          <div>
            <span>{{ addr.postalCode }}</span>
            <v-icon icon="local_post_office" />
          </div>
        </div>
      </v-card>
    </div>
  </section>
</template>
