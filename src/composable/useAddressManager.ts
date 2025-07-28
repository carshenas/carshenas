import { ref } from "vue";
import type { Address, SendAddress } from "@/types/dto/addresses";
import type { LatLng } from "@/types/dto/the-map";
import {
  sendAddressService,
  getAddressList,
  delAddress,
} from "@/services/carshenas/address";
import { useAddressStore } from "@/stores/address";

export function useAddressManagement() {
  const showInfo = ref(false);
  const bottomSheetVisible = ref(false);
  const selectedPosition = ref<LatLng>({ lat: 0, lng: 0 });
  const selectedAddress = ref<string | null>(null);
  const loading = ref(false);
  const addressList = ref<Address[]>([]);
  const addressStore = useAddressStore();

const fetchAddressList = async (): Promise<Address[]> => {
  try {
    const response = await getAddressList();
    addressList.value = response.data as unknown as Address[];
    addressStore.setAddressList(addressList.value); 
    return addressList.value;
  } catch (error) {
    console.error("Error fetching address list:", error);
    throw error;
  }
};
  const updateMapPosition = (newPosition: LatLng) => {
    selectedPosition.value = newPosition;
  };

  const updateShowInfo = (value: boolean) => {
    showInfo.value = value;
  };

  const updateLatLngString = (latLngString: string) => {
    selectedAddress.value = latLngString;
  };

  const submitAddress = async (newAddress: SendAddress) => {
    console.log("Submitting new address:", newAddress);
    loading.value = true;
    try {
      await sendAddressService(newAddress);
      showInfo.value = false;
      bottomSheetVisible.value = false;
      const addresses = await fetchAddressList();
      // Try to find the most recently added address (by max id)
      const latest =
        addresses.length > 0
          ? addresses.reduce((a, b) => (a.id > b.id ? a : b))
          : null;
      if (latest) {
        addressStore.setSelectedAddressId(latest.id);
        console.log("Auto-selected new address with id:", latest.id);
        // Log addressList in store and in composable
        console.log(
          "addressStore.addressList after auto-select:",
          addressStore.addressList
        );
        console.log(
          "addressList in composable after auto-select:",
          addressList.value
        );
        // Log selectedAddressId and selectedAddress in store
        console.log(
          "addressStore.selectedAddressId after auto-select:",
          addressStore.selectedAddressId
        );
        console.log(
          "addressStore.selectedAddress after auto-select:",
          addressStore.selectedAddress
        );
      }
    } catch (error) {
      console.error("Error submitting address:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const deleteAddress = async (id: number) => {
    loading.value = true;
    try {
      await delAddress(id);
      await fetchAddressList();
    } catch (error) {
      console.error("Error deleting address:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    showInfo,
    bottomSheetVisible,
    selectedPosition,
    selectedAddress,
    loading,
    addressList,

    // Methods
    fetchAddressList,
    updateMapPosition,
    updateShowInfo,
    updateLatLngString,
    submitAddress,
    deleteAddress,
  };
}
