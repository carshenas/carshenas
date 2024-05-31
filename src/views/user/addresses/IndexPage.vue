<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Address, SendAddress } from '@/types/dto/addresses'
import type { LatLng } from '@/types/dto/the-map'
import NewAddressInfo from './components/NewAddressInfo.vue'
import NewAddressMap from './components/NewAddressMap.vue'
import { sendAddressService, getAddressList, delAddress } from '@/services/carshenas/address'

const showInfo = ref(false)
const bottomSheetVisible = ref(false)
const selectedPosition = ref<LatLng>({ lat: 0, lng: 0 })
const selectedAddress = ref<string | null>(null)

const addressList = ref<Address[]>([])

onMounted(async () => {
  try {
    const response = await getAddressList()
    addressList.value = response.data
  } catch (error) {
    console.error('Error fetching address list:', error)
  }
})
const handleMapPositionUpdate = (newPosition: LatLng) => {
  selectedPosition.value = newPosition
}
const handleShowInfoUpdate = (value: boolean) => {
  showInfo.value = value
}

const handleAddressSubmit = async (newAddress: Address) => {
  try {
    await sendAddressService(newAddress as SendAddress)
    showInfo.value = false
    bottomSheetVisible.value = false
    const updatedList = await getAddressList()
    addressList.value = updatedList.data
  } catch (error) {
    console.error('Error submitting address:', error)
  }
}
const handleDeleteAddress = async (id: number) => {
  try {
    await delAddress(id)
  } catch (error) {
    console.error('Error deleting address:', error)
  } finally {
    const updatedList = await getAddressList()
    addressList.value = updatedList.data
  }
}
const handleLatLngStringUpdate = (latLngString: string) => {
  selectedAddress.value = latLngString
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
            @update:latLngString="handleLatLngStringUpdate"
          />
          <NewAddressInfo
            v-if="showInfo"
            :latLngString="selectedAddress"
            :position="selectedPosition"
            @submit="handleAddressSubmit"
          />
        </v-card>
      </v-bottom-sheet>

      <v-card class="mx-auto w-100 pa-2" v-for="(addr, index) in addressList" :key="index">
        <v-card-text>{{ addr.address }}</v-card-text>
        <div class="d-flex w-100 justify-space-between text-grey align-center">
          <v-btn icon="delete" variant="text" @click="() => handleDeleteAddress(addr.id)" />
          <div>
            <span>{{ addr.postal_code }}</span>
            <v-icon icon="local_post_office" />
          </div>
        </div>
      </v-card>
    </div>
  </section>
</template>
