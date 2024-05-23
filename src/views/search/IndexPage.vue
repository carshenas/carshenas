<script setup lang="ts">
import { ref } from 'vue'
import CategoryList from '@/components/CategoryList.vue'
import { RouterLink } from 'vue-router'
import ProductList from '@/components/ProductList.vue'
import SearchSuggestions from './components/SearchSuggestions.vue'
import { useDatabaseStore } from '@/stores/database'
import { onBeforeRouteLeave } from 'vue-router'
import { generateNumericId } from '@/helpers/general'
import type { Category } from '@/types/dto/category'
import { getCategoryListService } from '@/services/carshenas/category'
import { debounce } from 'lodash'
import type { Product } from '@/types/dto/product'

const { open: openDatabase, getDb, getStore, add } = useDatabaseStore()
const search = ref<string>()

const categories = ref<Category[]>()
const products = ref<Product[]>([
  {
    id: 1,
    image: 'https://contentinfo.autozone.com/znetcs/product-info/en/US/exi/H5-EFB/image/8/',
    title: 'باتری بیست هشتت سیمی',
    description: 'این توضیحات تکمیلی این محصول است و نهایتا می تواند 70 گارکتر داشته باشد',
    quantity: 1,
    stock: 10,
    price: 2000000
  },
  {
    id: 2,
    image:
      'https://png.pngtree.com/thumb_back/fh260/background/20210727/pngtree-cute-watercolor-fruit-mobile-wallpaper-image_752110.jpg',
    title: 'string',
    description: 'description',
    quantity: 1,
    stock: 12,
    price: 2000000
  },
  {
    id: 3,
    image:
      'https://static.vecteezy.com/system/resources/thumbnails/025/067/762/small_2x/4k-beautiful-colorful-abstract-wallpaper-photo.jpg',
    title: 'string',
    description: 'description',
    quantity: 1,
    stock: 1,
    price: 2000000
  },
  {
    id: 4,
    image: 'string',
    title: 'string',
    description: 'description',
    quantity: 1,
    stock: 2,
    price: 2000000
  }
])
const getCategories = async () => {
  const filters = new URLSearchParams({ title: search.value || '' })
  try {
    const response = await getCategoryListService(filters)
    categories.value = response.data
  } catch (e) {
    console.error(e)
  }
}
const getProducts = async () => {
  try {
    // const response = await getProductListService({ title: search.value || '' })
    // products.value = response
  } catch (e) {
    console.error(e)
  }
}

const onInput = debounce(() => {
  if (!search.value || search.value.length < 2) return

  getCategories()
  getProducts()
}, 500)

openDatabase('search', undefined, (db: IDBDatabase) => {
  db.createObjectStore('suggestions', { keyPath: 'id' })
})

onBeforeRouteLeave(async (to, from, next) => {
  if ((to.name === 'ProductsPage' || to.name === 'ProductDetail') && search.value) {
    const searchDb = await getDb('search')
    const suggestions = getStore(searchDb, 'suggestions')
    add(suggestions, { title: search.value, id: generateNumericId() })
  }
  next()
})
</script>

<template>
  <v-container>
    <v-text-field
      v-model="search"
      :placeholder="$t('shared.search')"
      variant="outlined"
      rounded
      hide-details
      @input="onInput"
    >
      <template v-slot:prepend-inner>
        <v-btn variant="text" class="pa-0" size="x-small" color="text">
          <v-icon icon="arrow_forward_ios" />
        </v-btn>
      </template>

      <template v-slot:append-inner>
        <v-btn variant="text" class="pa-0" size="x-small" color="text">
          <v-icon icon="search" />
        </v-btn>
      </template>
    </v-text-field>

    <SearchSuggestions :title="search" @select="search = $event" />

    <h2 v-if="search" class="title-sm mt-6">
      {{
        $t('search.searchInCategory', {
          item: search
        })
      }}
    </h2>

    <CategoryList :items="categories" class="mt-4" />

    <div v-if="search" class="mt-6 w-100 d-flex">
      <h2 class="title-sm">
        {{
          $t('search.searchInProducts', {
            item: search
          })
        }}
      </h2>

      <v-spacer />

      <RouterLink :to="{ name: 'ProductsPage', query: { search } }">
        {{ $t('search.viewAll') }}
      </RouterLink>
    </div>

    <ProductList :items="products" class="mt-4" />
  </v-container>
</template>
