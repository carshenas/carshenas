// In address.ts store
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Address } from "@/types/dto/addresses";

export const useAddressStore = defineStore("address", () => {
  // State
  const addressList = ref<Address[]>([]);
  const selectedAddressId = ref<number | null>(null);
  const loading = ref(false);
  const selectedShipping = ref<number | null>(null);
  // Add shipping data to store to track schedule requirements
  const currentShippingData = ref<any>(null);

  // Getters
  const selectedAddress = computed(() =>
    addressList.value.find((address) => address.id === selectedAddressId.value)
  );

  const defaultAddress = computed(() =>
    addressList.value.find((address) => address.isDefault)
  );

  // Schedule is required when both conditions are true:
  // - has_visible_schedules is true OR is_tehran is true
  const isScheduleRequired = computed(() => {
    if (!currentShippingData.value) return false;
    
    return currentShippingData.value.hasVisibleSchedules || currentShippingData.value.isTehran;
  });

  // Actions
  const setAddressList = (addresses: Address[]) => {
    addressList.value = addresses;
  };

  const setSelectedAddressId = (id: number | null) => {
    selectedAddressId.value = id;
  };

  const addAddress = (address: Address) => {
    addressList.value.push(address);
  };

  const setSelectedShipping = (shipping: number | null) => {
    selectedShipping.value = shipping;
  };

  const resetSelectedShipping = () => {
    selectedShipping.value = null;
  };

  const setScheduleNotRequired = () => {
    selectedShipping.value = -1; // Use -1 to indicate "no schedule needed but valid"
  };

  // Add method to set shipping data
  const setCurrentShippingData = (data: any) => {
    currentShippingData.value = data;
  };

  const updateAddress = (updatedAddress: Address) => {
    const index = addressList.value.findIndex(
      (addr) => addr.id === updatedAddress.id
    );
    if (index !== -1) {
      addressList.value[index] = updatedAddress;
    }
  };

  const deleteAddress = (id: number) => {
    addressList.value = addressList.value.filter((addr) => addr.id !== id);
    if (selectedAddressId.value === id) {
      selectedAddressId.value = null;
    }
  };

  const initializeDefaultAddress = () => {
    const defaultAddr = defaultAddress.value;
    if (defaultAddr && !selectedAddressId.value) {
      selectedAddressId.value = defaultAddr.id;
    }
  };

  return {
    // State
    addressList,
    selectedAddressId,
    loading,
    selectedShipping,
    currentShippingData,

    // Getters
    selectedAddress,
    defaultAddress,
    isScheduleRequired,

    // Actions
    setAddressList,
    setSelectedAddressId,
    addAddress,
    setSelectedShipping,
    updateAddress,
    deleteAddress,
    initializeDefaultAddress,
    resetSelectedShipping,
    setScheduleNotRequired,
    setCurrentShippingData,
  };
});
