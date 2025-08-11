import carshenasService from "@/services";
import type { LatLngString } from "@/types/dto/the-map";
import type { SendAddress, Address } from "@/types/dto/addresses";

export const getAddressService = (lat: number, lng: number) =>
  carshenasService.get<LatLngString>(`user/location/${lat}/${lng}/`);

export const sendAddressService = (body: SendAddress) => {
  const formData = new FormData();
  
  // Only append if value exists and is not empty
  if (body.name) {
    formData.append("name", body.name);
  }
  
  if (body.address) {
    formData.append("address", body.address);
  }
  
  if (body.postalCode) {
    formData.append("postal_code", body.postalCode);
  }
  
  if (body.latitude !== undefined && body.latitude !== null) {
    formData.append("latitude", body.latitude.toString());
  }
  
  if (body.longitude !== undefined && body.longitude !== null) {
    formData.append("longitude", body.longitude.toString());
  }
  
  if (body.isDefault !== undefined && body.isDefault !== null) {
    formData.append("is_default", body.isDefault.toString());
  }
  
  if (body.receiverName) {
    formData.append("receiver_name", body.receiverName);
  }

  return carshenasService.post<{
    id: number;
    name: string;
    address: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    isDefault: boolean;
    receiverName: string;
  }>("/user/location/", {
    body: formData,
  });
};

export const getAddressList = () =>
  carshenasService.get<Address>(`user/location/`);

export const delAddress = (id: number) =>
  carshenasService.delete(`user/location/${id}/`);
