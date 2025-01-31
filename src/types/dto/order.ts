export default interface Order {
  OrderId: number;
  state: "canceled" | "successful" | "doing";
  date: string;
  price: string;
  postalCode: string;
  orderDetail: OrderItems[];
}

export interface OrderItems {
  itemId: number;
  itemAmount: number;
  itemName: string;
  itemPrice: string;
  itemImage: string;
}

export interface OrderRequest {
  variants: OrderItem[];
  location: number;
}
export interface OrderItem {
  quantity: number;
  variant: number;
}
