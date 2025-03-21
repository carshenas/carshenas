// export default interface Order {
//   OrderId: number;
//   state: "canceled" | "successful" | "doing";
//   date: string;
//   price: string;
//   postalCode: string;
//   orderDetail: OrderItems[];
// }

// export interface OrderItems {
//   itemId: number;
//   itemAmount: number;
//   itemName: string;
//   itemPrice: string;
//   itemImage: string;
// }

export interface OrderRequest {
  variants: OrderItem[];
  location: number;
  shipping: number
}
export interface OrderItem {
  quantity: number;
  variant: Variant | number;
  productId?: number;
  price?: number;
}

export interface OrderResponse {
  url: string;
}
export interface OrderListResponse {
  id: number;
  items: OrderItem[];
  status: string;
  price: number;
  finalPrice: number;
  location: string;
  transactions: Transaction[];
  dateCreated: string;
}

export interface Variant {
  id: number;
  name: string;
  price: number;
  warranty: string;
  color: string | null;
  image: string;
}

export interface Transaction {
  id: number;
  amount: number;
  isSuccessful: boolean;
  dateCreated: string;
}
interface Schedule {
  id: number;
  startTime: string;
  endTime: string;
}

interface ShippingDay {
  weekday: string;
  datetime: string;
  schedule: Schedule[];
}

export interface ShippingResponse {
  cost: number;
  description: string;
  days: ShippingDay[];
}
