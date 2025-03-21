<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useAddressManagement } from "@/composable/useAddressManager";
import { useAddressStore } from "@/stores/address";
import NewAddressInfo from "@/views/user/addresses/components/NewAddressInfo.vue";
import NewAddressMap from "@/views/user/addresses/components/NewAddressMap.vue";
import { getOrderShipping } from "@/services/carshenas/order";
import type { ShippingResponse } from "@/types/dto/order";
import { useCartStore } from "@/stores/cart";
const isReceiveInPerson = ref<boolean>(true);
const addressStore = useAddressStore();
const shippingData = ref<ShippingResponse | null>(null);
const selectedDayTab = ref<string | null>(null);
const selectedScheduleId = ref<number | null>(null);
  const cartStore = useCartStore(); 


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
} = useAddressManagement();

onMounted(async () => {
  try {
    const fetchedAddresses = await fetchAddressList();
    addressStore.setAddressList(fetchedAddresses);
    addressStore.initializeDefaultAddress();
    if (addressStore.selectedAddressId) {
      isReceiveInPerson.value = false;
      await loadShippingOptions(addressStore.selectedAddressId);
    }
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
  }
});

const loadShippingOptions = async (addressId: number) => {
  try {
    const response = await getOrderShipping(addressId);
    shippingData.value = response.data;

    console.log(response.data.cost);
    addressStore.resetSelectedShipping();
    cartStore.deliveryPriceComputed = response.data.cost;
    // Set the first day as selected if available
    if (response.data.days && response.data.days.length > 0) {
      selectedDayTab.value = response.data.days[0].datetime;
    }

    console.log("Shipping options loaded:", response);
  } catch (error) {
    console.error("Failed to fetch shipping:", error);
  }
};

const selectAddress = async (addressId: number) => {
  addressStore.setSelectedAddressId(addressId);
  isReceiveInPerson.value = false;
  await loadShippingOptions(addressId);
};

const selectSchedule = (scheduleId: number) => {
  selectedScheduleId.value = scheduleId;
  addressStore.setSelectedShipping(scheduleId);
  console.log("Selected schedule:", scheduleId);
};


watch(
  () => addressList.value,
  (newAddressList) => {
    if (!addressStore.selectedAddressId) {
      addressStore.initializeDefaultAddress();
      if (addressStore.selectedAddressId) {
        isReceiveInPerson.value = false;
      }
    }
  },
  { deep: true }
);

const selectInPersonPickup = async () => {
  isReceiveInPerson.value = true;
  // Set address ID to 1 for in-person pickup
  addressStore.setSelectedAddressId(1);
  await loadShippingOptions(1);
};
</script>

<template>
  <v-container>
    <div>
      <div class="d-flex justify-space-between">
        <h2 class="my-2 title-sm">{{ $t("checkout.sendTo") }} :</h2>
      </div>

      <!-- Delivery address options -->
      <div class="mt-4">
        <div v-if="addressList.length > 0">
          <v-radio-group v-model="addressStore.selectedAddressId" class="mt-2">
            <v-card class="mb-2 pa-4" :class="{ 'border-primary': isReceiveInPerson }" variant="outlined" rounded="lg"
              @click="selectInPersonPickup()">
              <v-radio :value="1" color="primary" hide-details>
                <template #label>
                  <div class="d-flex  flex-column ga-2">
                    <div class="d-flex align-center">
                      <v-icon class="mr-2">mdi-store</v-icon>
                      <span class="text-body-1 font-weight-medium">دریافت حضوری</span>
                    </div>
                    <span class="text-caption text-grey">
                      تهران خیابان امیر کبیر پاساژ کاشانی پلاک 107
                    </span>
                  </div>
                </template>
              </v-radio>
            </v-card>
            <v-card v-for="address in addressList" :key="address.id" class="mb-2 pa-4" :class="{
              'border-primary':
                addressStore.selectedAddressId === address.id &&
                !isReceiveInPerson,
            }" variant="outlined" rounded="lg" @click="selectAddress(address.id)">
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

      <div v-if="shippingData && addressStore.selectedAddressId" class="mt-6">
        <h2 class="my-2 title-sm">{{ $t("checkout.deliveryTime") }} :</h2>
        <v-card class="pa-4 mt-2" variant="flat" rounded="lg">
          <p class="text-body-2">{{ shippingData.description }}</p>

          <div class="mt-4">
            <v-radio-group v-model="selectedScheduleId" mandatory>
              <div class="d-flex gap-2 overflow-scroll ga-4">
                <v-card v-for="day in shippingData.days" :key="day.datetime" min-width="180px" width="100%"
                  class="mb-2 pa-3" variant="tonal" rounded="lg">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-subtitle-1 font-weight-bold">{{
                      day.weekday
                    }}</span>
                    <span class="text-caption">{{ day.datetime }}</span>
                  </div>

                  <v-divider class="mb-2"></v-divider>

                  <v-radio-group v-model="selectedScheduleId">
                    <v-radio class="d-flex" v-for="schedule in day.schedule" :key="schedule.id" :value="schedule.id"
                      color="primary" @click="selectSchedule(schedule.id)">
                      <template #label>
                        <span>{{ schedule.startTime }} تا {{ schedule.endTime }}</span>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-card>
              </div>
            </v-radio-group>
          </div>
        </v-card>
      </div>
      <!-- Address management bottom sheet -->
      <v-bottom-sheet v-model="bottomSheetVisible">
        <template #activator="{ props }">
          <v-btn block v-bind="props" class="justify-space-between" rounded="lg" color="primary" size="x-large"
            append-icon="add">
            {{ $t("user.newAddress") }}
          </v-btn>
        </template>
        <v-card class="d-flex ga-4" :title="$t('user.newAddress')">
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

.overflow-scroll {
  overflow-y: scroll;
}
</style>
