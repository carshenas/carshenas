export default interface Order {
  OrderId: number
  state: 'canceled' | 'successful' | 'doing'
  date: string
  price: string
  postalCode: string
  orderDetail: OrderItems[]
}

interface OrderItems {
  itemId: number
  itemAmount: number
  itemName: string
  itemPrice: string
}
