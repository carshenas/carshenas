export default interface Order {
  OrderId: number
  state: 'canceled' | 'successful' | 'doing'
  date: string
  price: string
  postal_code: string
  orderDetail: OrderItems[]
}

export interface OrderItems {
  itemId: number
  itemAmount: number
  itemName: string
  itemPrice: string
  itemImage: string
}
