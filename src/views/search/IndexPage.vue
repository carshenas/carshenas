<script setup lang="ts">
import { ref } from 'vue'
import CategoryList from '@/components/CategoryList.vue'
import { RouterLink, useRouter } from 'vue-router'
import ProductList from '@/components/ProductList.vue'
import SearchSuggestions from './components/SearchSuggestions.vue'
import { useDatabaseStore } from '@/stores/database'
import { onBeforeRouteLeave } from 'vue-router'
import { generateNumericId } from '@/helpers/general'
import type { Category } from '@/types/dto/category'
import { getCategoryListService } from '@/services/carshenas/category'
import { debounce } from 'lodash'
import type { Product } from '@/types/dto/product'

const router = useRouter()
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
  <div class="h-100 d-flex flex-column bar-padding">
    <div class="fixed-bar pa-4">
      <v-text-field
        v-model="search"
        :placeholder="$t('shared.search')"
        variant="outlined"
        rounded
        hide-details
        prepend-inner-icon="arrow_forward_ios"
        append-inner-icon="search"
        @input="onInput"
        @click:prepend-inner="router.back()"
      />
    </div>

    <SearchSuggestions class="px-4" :title="search" @select="search = $event" />

    <template v-if="search">
      <h2 class="title-sm mt-6 px-4">
        {{
          $t('search.searchInCategory', {
            item: search
          })
        }}
      </h2>

      <CategoryList :items="categories" class="mt-6 px-4" />

      <div class="mt-6 w-100 d-flex px-4">
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

      <ProductList :items="products" class="mt-6" />
    </template>

    <div v-else class="flex-grow-1 d-flex align-center">
      <span class="w-100 text-center"> {{ $t('search.whatProductAreYouLookingFor') }} </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bar-padding {
  padding-top: 80px - 16px;
}

.fixed-bar {
  position: fixed;
  background-color: white;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
}
</style>
