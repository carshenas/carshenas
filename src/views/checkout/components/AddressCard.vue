<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useAddressManagement } from '@/composable/useAddressManager'
import NewAddressInfo from '@/views/user/addresses/components/NewAddressInfo.vue'
import NewAddressMap from '@/views/user/addresses/components//NewAddressMap.vue'

const isReceiveInPerson = ref<boolean>(true)

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
} = useAddressManagement()

onMounted(async () => {
  await fetchAddressList()
  // Find and select default address if it exists
  const defaultAddress = addressList.value.find(address => address.isDefault)
  if (defaultAddress) {
    selectedAddressId.value = defaultAddress.id
    isReceiveInPerson.value = false
  }
})

const selectedAddressId = ref<number | null>(null)

const selectAddress = (addressId: number) => {
  selectedAddressId.value = addressId
  isReceiveInPerson.value = false
}

// Watch for changes in addressList to handle async loading
watch(addressList, (newAddressList) => {
  if (selectedAddressId.value === null) {
    const defaultAddress = newAddressList.find(address => address.isDefault)
    if (defaultAddress) {
      selectedAddressId.value = defaultAddress.id
      isReceiveInPerson.value = false
    }
  }
})
</script>

<template>
  <v-container>
    <div>
      <div class="d-flex justify-space-between">
        <h2 class="my-2 title-sm">{{ $t('checkout.sendTo') }} :</h2>
      </div>

      <!-- In-person pickup option -->
      <v-btn variant="outlined" class="mt-2 py-3 px-2 d-flex w-100" rounded="lg" stacked
        :color="isReceiveInPerson ? 'primary' : 'outline'" @click="isReceiveInPerson = true">
        <span class="label-md w-100 text-start" :class="isReceiveInPerson ? 'text-primary' : 'text-black'">
          {{ $t('checkout.inPersonPickup') }}
        </span>
        <span class="label-sm w-100 text-start">
          {{ $t('checkout.inPersonPickupDescription') }}
        </span>
      </v-btn>

      <!-- Delivery address options -->
      <div class="mt-4">
        <div v-if="addressList.length > 0">
          <v-radio-group v-model="selectedAddressId" class="mt-2">
            <v-card v-for="address in addressList" :key="address.id" class="mb-2 pa-4"
              :class="{ 'border-primary': selectedAddressId === address.id && !isReceiveInPerson }" variant="outlined"
              rounded="lg" @click="selectAddress(address.id)">
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
