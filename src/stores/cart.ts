import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// types
import type { Product } from '@/types/dto/product'

export const useCartStore = defineStore('cart', () => {
  const items = ref<Product[]>([
    {
      id: 1,
      image: 'https://contentinfo.autozone.com/znetcs/product-info/en/US/exi/H5-EFB/image/8/',
      title: 'باتری بیست هشتت سیمی',
      description: 'این توضیحات تکمیلی این محصول است و نهایتا می تواند 70 گارکتر داشته باشد',
      stock: 10,
      quantity: 1,
      price: 2000000
    },
    {
      id: 2,
      image:
        'https://png.pngtree.com/thumb_back/fh260/background/20210727/pngtree-cute-watercolor-fruit-mobile-wallpaper-image_752110.jpg',
      title: 'string',
      description: 'description',
      stock: 12,
      quantity: 1,
      price: 2000000
    },
    {
      id: 3,
      image:
        'https://static.vecteezy.com/system/resources/thumbnails/025/067/762/small_2x/4k-beautiful-colorful-abstract-wallpaper-photo.jpg',
      title: 'string',
      description: 'description',
      stock: 1,
      quantity: 1,
      price: 2000000
    },
    {
      id: 4,
      image: 'string',
      title: 'string',
      description: 'description',
      stock: 2,
      quantity: 1,
      price: 2000000
    }
  ])

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

  return { items, addItem, updateCount, removeItem, wipeItems, payableAmount }
})
