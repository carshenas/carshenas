<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { useAddressManagement } from "@/composable/useAddressManager";
import { useAddressStore } from "@/stores/address";
import NewAddressInfo from "@/views/user/addresses/components/NewAddressInfo.vue";
import NewAddressMap from "@/views/user/addresses/components/NewAddressMap.vue";
import { getOrderShipping } from "@/services/carshenas/order";
import type { ShippingResponse } from "@/types/dto/order";
import { useCartStore } from "@/stores/cart";
import TimeSelector from '@/components/TimeSelector.vue'

const props = defineProps<{
  modelValue?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'validation', value: boolean): void;
}>();

const isReceiveInPerson = ref<boolean>(true);
const addressStore = useAddressStore();
const shippingData = ref<ShippingResponse | null>(null);
const selectedDayTab = ref<string | null>(null);
const selectedScheduleId = ref<number | null>(null);
const selectedDateTime = ref<string | undefined>(undefined);
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
    
    // Set shipping cost based on Tehran status
    if (response.data.isTehran === false) {
      console.log('Non-Tehran address detected, setting delivery cost to -1');
      cartStore.deliveryPriceComputed = -1;
    } else {
      console.log('Tehran address or other case, using API cost:', response.data.cost);
      cartStore.deliveryPriceComputed = response.data.cost;
    }

    // Set the first day as selected if available
    if (response.data.days && response.data.days.length > 0) {
      selectedDayTab.value = response.data.days[0].datetime;
    }
  } catch (error) {
    console.error("Failed to fetch shipping:", error);
  }
};

const selectAddress = async (addressId: number) => {
  console.log('selectAddress called with:', addressId);
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

// Watch for changes in store's selectedAddressId to trigger shipping load
watch(
  () => addressStore.selectedAddressId,
  async (newAddressId) => {
    if (newAddressId && newAddressId !== 1) {
      console.log('Address selection changed in store:', newAddressId);
      isReceiveInPerson.value = false;
      await loadShippingOptions(newAddressId);
    }
  }
);
// Watch for changes in store's address list to keep local addressList in sync
watch(
  () => addressStore.addressList,
  (newAddressList) => {
    addressList.value = newAddressList;
  },
  { deep: true }
);

const selectInPersonPickup = async () => {
  console.log('selectInPersonPickup called');
  isReceiveInPerson.value = true;
  addressStore.setSelectedAddressId(1);
  if (!addressList.value.find(addr => addr.id === 1)) {
    addressStore.setAddressList([
      ...addressList.value,
      {
        id: 1,
        name: "دریافت حضوری",
        address: "تهران خیابان امیر کبیر پاساژ کاشانی پلاک 107",
        postalCode: "1234567890",
        latitude: 35.6892,
        longitude: 51.3890,
        isDefault: false,
        receiverName: "دریافت حضوری"
      }
    ]);
  }
  await loadShippingOptions(1);
};


const handleScheduleSelect = (scheduleId: number) => {
  selectSchedule(scheduleId);
};

const handleDateTimeSelect = (value: string) => {
  selectedDateTime.value = value;
  if (!shippingData.value) return;

  // Find the corresponding schedule ID
  const [selectedDay, selectedTimeRange] = value.split('T');
  const [selectedStartTime] = selectedTimeRange.split('-');
  const day = shippingData.value.days.find(d => d.datetime.startsWith(selectedDay));
  if (day) {
    const schedule = day.schedule.find(s => s.startTime === selectedStartTime);
    if (schedule) {
      selectSchedule(schedule.id);
    }
  }
};

// Add computed property for validation
const isValid = computed(() => {
  console.log('Computing isValid:', {
    isReceiveInPerson: isReceiveInPerson.value,
    selectedAddressId: addressStore.selectedAddressId,
    hasVisibleSchedules: shippingData.value?.hasVisibleSchedules,
    isTehran: shippingData.value?.isTehran,
    selectedScheduleId: selectedScheduleId.value,
    hasDays: (shippingData.value?.days?.length ?? 0) > 0
  });

  // Must always have an address selected (either real address or receive in person)
  if (!addressStore.selectedAddressId) {
    return false;
  }

  // If no shipping data available yet, not valid
  if (!shippingData.value) {
    return false;
  }

  // Case 1: No visible schedules and not Tehran - just need address (no schedule selection)
  if (!shippingData.value.hasVisibleSchedules && !shippingData.value.isTehran) {
    console.log('teststst')
    return true; // Only address needed
  }

  // Case 2: All other cases (Tehran, visible schedules, or receive in person) - need schedule
  return !!selectedScheduleId.value;
});


// Watch for validation changes
watch(isValid, (newValue) => {
  console.log('Validation changed to:', newValue);
  emit('validation', newValue);
  emit('update:modelValue', newValue);
});

</script>

<template>
  <v-container>
    <div>
      <div class="d-flex justify-space-between align-center">
        <h2 class="my-2 title-sm">{{ $t("checkout.sendTo") }} :</h2>
        <v-btn class="text-caption" variant="text" color="primary" size="small" prepend-icon="add"
          @click="bottomSheetVisible = true">
          {{ $t("user.newAddress") }}
        </v-btn>
      </div>

      <!-- Delivery address options -->
      <div class="mt-4">
        <div>
          <v-radio-group v-model="addressStore.selectedAddressId" class="mt-2">
            <v-card class="mb-2 pa-4" :class="{ 'border-primary': isReceiveInPerson }" variant="outlined" rounded="lg"
              @click="selectInPersonPickup()">
              <v-radio :value="1" color="primary" hide-details>
                <template #label>
                  <div class="d-flex  flex-column ga-2">
                    <div class="d-flex align-center">
                      <span class="text-body-1 font-weight-medium">دریافت حضوری</span>
                    </div>
                    <span class="text-caption text-grey">
                      تهران خیابان امیر کبیر پاساژ کاشانی پلاک 107
                    </span>
                  </div>
                </template>
              </v-radio>
            </v-card>
            <v-card v-for="address in addressList.filter(addr => addr.id !== 1)" :key="address.id" class="mb-2 pa-4"
              :class="{
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
                    <span class="text-caption text-grey">
                      تحویل گیرنده:
                      {{ address.receiverName || 'نامشخص' }}
                    </span>
                  </div>
                </template>
              </v-radio>
            </v-card>
          </v-radio-group>
        </div>
      </div>

      <div v-if="shippingData && addressStore.selectedAddressId &&
        (shippingData.hasVisibleSchedules || shippingData.isTehran)" class="mt-6">
        <h2 class="my-2 title-sm">{{ $t("checkout.deliveryTime") }} :</h2>
        <v-card class="pa-4 mt-2" variant="flat" rounded="lg">
          <p class="text-body-3 text-red-accent-4">{{ shippingData.description }}</p>

          <div class="mt-4">
            <div class="d-flex gap-2 overflow-scroll ga-4">
              <TimeSelector v-model="selectedDateTime" :shipping-data="shippingData"
                @update:modelValue="handleDateTimeSelect" @schedule-selected="handleScheduleSelect" />
            </div>
          </div>
        </v-card>
      </div>
      <div v-else-if="shippingData && addressStore.selectedAddressId &&
        !shippingData.hasVisibleSchedules &&
        !shippingData.isTehran" class="mt-6">
        <v-card class="pa-4 mt-2" variant="flat" rounded="lg">
          <p class="text-body-3 text-red-accent-4">{{ shippingData.description }}</p>
        </v-card>
      </div>



      <!-- Address management bottom sheet -->
      <v-bottom-sheet v-model="bottomSheetVisible">
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
