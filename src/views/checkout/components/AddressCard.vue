<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useAddressManagement } from '@/composable/useAddressManager'
import { useAddressStore } from '@/stores/address'
import NewAddressInfo from '@/views/user/addresses/components/NewAddressInfo.vue'
import NewAddressMap from '@/views/user/addresses/components//NewAddressMap.vue'

const isReceiveInPerson = ref<boolean>(true)
const addressStore = useAddressStore()

const {
  addressList,
  showInfo,
  bottomSheetVisible,
  selectedPosition,
  selectedAddress,
  loading,
  fetchAddressList,
  updateMapPosition,
  updateShowInfo,
  updateLatLngString,
  submitAddress,
} = useAddressManagement()


onMounted(async () => {
  try {
    const fetchedAddresses = await fetchAddressList()
    addressStore.setAddressList(fetchedAddresses)
    addressStore.initializeDefaultAddress()
    if (addressStore.selectedAddressId) {
      isReceiveInPerson.value = false
    }
  } catch (error) {
    console.error('Failed to fetch addresses:', error)
  }
})

const selectAddress = (addressId: number) => {
  addressStore.setSelectedAddressId(addressId)
  isReceiveInPerson.value = false
}
watch(() => addressList, (newAddressList) => {
  if (!addressStore.selectedAddressId) {
    addressStore.initializeDefaultAddress()
    if (addressStore.selectedAddressId) {
      isReceiveInPerson.value = false
    }
  }
}, { deep: true })
</script>
<template>
  <v-container>
    <div>
      <div class="d-flex justify-space-between">
        <h2 class="my-2 title-sm">{{ $t('checkout.sendTo') }} :</h2>
      </div>

      <!-- Delivery address options -->
      <div class="mt-4">
        <div v-if="addressList.length > 0">
          <div v-if="addressList.length > 0">
            <v-radio-group v-model="addressStore.selectedAddressId" class="mt-2">
              <v-card v-for="address in addressList" :key="address.id" class="mb-2 pa-4"
                :class="{ 'border-primary': addressStore.selectedAddressId === address.id && !isReceiveInPerson }"
                variant="outlined" rounded="lg" @click="selectAddress(address.id)">
                <v-radio :value="address.id" color="primary" hide-details>
                  <template #label>
                    <div class="d-flex flex-column ga-2">
                      <span class="text-body-1">{{ address.address }}</span>
                      <span class="text-caption text-grey">
                        {{ address.postalCode }}
                      </span>
                    </div>
                  </template>
                </v-radio>
              </v-card>
            </v-radio-group>
          </div>

        </div>
      </div>

      <!-- Address management bottom sheet -->
      <v-bottom-sheet v-model="bottomSheetVisible">
        <template #activator="{ props }">
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
    </div>
  </v-container>
</template>

<style scoped>
.border-primary {
  border: 2px solid rgb(var(--v-theme-primary));
}

.ga-2 {
  gap: 0.5rem;
}

.ga-4 {
  gap: 1rem;
}
</style>
