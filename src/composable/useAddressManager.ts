import { ref } from "vue";
import type { Address, SendAddress } from "@/types/dto/addresses";
import type { LatLng } from "@/types/dto/the-map";
import {
  sendAddressService,
  getAddressList,
  delAddress,
} from "@/services/carshenas/address";

export function useAddressManagement() {
  const showInfo = ref(false);
  const bottomSheetVisible = ref(false);
  const selectedPosition = ref<LatLng>({ lat: 0, lng: 0 });
  const selectedAddress = ref<string | null>(null);
  const loading = ref(false);
  const addressList = ref<Address[]>([]);

  const fetchAddressList = async () => {
    try {
      const response = await getAddressList();
      addressList.value = response.data as unknown as Address[];
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
    loading.value = true;
    try {
      await sendAddressService(newAddress);
      showInfo.value = false;
      bottomSheetVisible.value = false;
      await fetchAddressList();
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
