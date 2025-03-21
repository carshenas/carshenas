// src/stores/address.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface Address {
  id: number;
  address: string;
  postalCode: string;
  isDefault: boolean;
}

export const useAddressStore = defineStore("address", () => {
  // State
  const addressList = ref<Address[]>([]);
  const selectedAddressId = ref<number | null>(null);
  const loading = ref(false);
  const selectedShipping = ref<number | null>(null);

  // Getters
  const selectedAddress = computed(() =>
    addressList.value.find((address) => address.id === selectedAddressId.value)
  );
  const setSelectedShipping = (shipping: number | null) => {
    selectedShipping.value = shipping;
  };
  const resetSelectedShipping = () => {
    selectedShipping.value = null;
  };
  const defaultAddress = computed(() =>
    addressList.value.find((address) => address.isDefault)
  );

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

    // Getters
    selectedAddress,
    defaultAddress,

    // Actions
    setAddressList,
    setSelectedAddressId,
    addAddress,
    setSelectedShipping,
    updateAddress,
    deleteAddress,
    initializeDefaultAddress,
    resetSelectedShipping,

  };
});
