import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// types
import type { Product } from '@/types/dto/product'

export const useCartStore = defineStore('cart', () => {
  const items = ref<Product[]>([])
  const address = ref<string>('تهران،تیموری، خ. حبیب الله جنوبی، بعد از خ. تیموری غربی، خ. عزیزی')

  const addItem = (product: Product) => {
    items.value.push(product)
  }

  const updateCount = (id: number, quantity: number) => {
    const index = items.value.findIndex((item) => item.id === id)
    items.value[index].quantity = quantity
  }

  const removeItem = (id: number) => {
    const index = items.value.findIndex((item) => item.id === id)
    items.value.splice(index, 1)
  }

  const wipeItems = () => {
    items.value = []
  }

  const payableAmount = computed(() =>
    items.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  return { items, addItem, updateCount, removeItem, wipeItems, address, payableAmount }
})
