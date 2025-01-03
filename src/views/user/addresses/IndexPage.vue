<script setup lang="ts">
import { onMounted } from 'vue'
import type { SendAddress } from '@/types/dto/addresses'
import NewAddressInfo from './components/NewAddressInfo.vue'
import NewAddressMap from './components/NewAddressMap.vue'
import { useAddressManagement } from '@/composable/useAddressManager'

const {
  showInfo,
  bottomSheetVisible,
  selectedPosition,
  selectedAddress,
  loading,
  addressList,
  fetchAddressList,
  updateMapPosition,
  updateShowInfo,
  updateLatLngString,
  submitAddress,
  deleteAddress
} = useAddressManagement()

onMounted(fetchAddressList)
</script>

<template>
  <section class="pa-4 d-flex flex-column ga-4 h-100">
    <div class="w-100 d-flex align-center justify-space-between">
      <v-btn icon="arrow_forward_ios" variant="text" @click="$router.go(-1)" />
      <h1>{{ $t('user.addresses') }}</h1>
      <v-btn icon="" variant="text" />
    </div>
    <div class="d-flex flex-column ga-4">
      <v-bottom-sheet v-model="bottomSheetVisible">
        <template v-slot:activator="{ props }">
          <v-btn block v-bind="props" class="justify-space-between" rounded="lg" color="primary" size="x-large"
            append-icon="add">
            {{ $t('user.newAddress') }}
          </v-btn>
        </template>
        <v-card class="d-flex flex-column ga-4" :title="$t('user.newAddress')">
          <NewAddressMap :showInfo="showInfo" @update:position="updateMapPosition" @update:showInfo="updateShowInfo"
            @update:latLngString="updateLatLngString" />

          <NewAddressInfo v-if="showInfo" :latLngString="selectedAddress" :loading="loading"
            :position="selectedPosition" @submit="submitAddress" />
        </v-card>
      </v-bottom-sheet>

      <v-card class="mx-auto w-100 pa-2" v-for="(addr, index) in addressList" :key="index">
        <v-card-text>{{ addr.address }}</v-card-text>
        <div class="d-flex w-100 justify-space-between text-grey align-center">
          <v-btn icon="delete" variant="text" @click="() => deleteAddress(addr.id)" />
          <div>
            <span>{{ addr.postal_code }}</span>
            <v-icon icon="local_post_office" />
          </div>
        </div>
      </v-card>
    </div>
  </section>
</template>
