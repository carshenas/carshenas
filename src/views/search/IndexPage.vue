<script setup lang="ts">
import { computed, ref } from 'vue'
import CategoryList from '@/components/CategoryList.vue'
import { RouterLink, useRouter } from 'vue-router'
import ProductList from '@/components/ProductList.vue'
import SearchSuggestions from './components/SearchSuggestions.vue'
import { useDatabaseStore } from '@/stores/database'
import { onBeforeRouteLeave } from 'vue-router'
import { generateNumericId } from '@/helpers/general'
import type { Category } from '@/types/dto/category'
import { debounce } from 'lodash'
import type { Product } from '@/types/dto/product'
import { useCategoryStore } from '@/stores/category'
import { getProductListService } from '@/services/carshenas/product'

const router = useRouter()
const { open: openDatabase, getDb, getStore, add } = useDatabaseStore()
const categoryStore = useCategoryStore()
const search = ref<string>()

const products = ref<Product[]>()

const categories = computed((): Category[] => {
  return search.value
    ? categoryStore.filteredCategories(categoryStore.categories, search.value)
    : []
})

const getProducts = async () => {
  try {
    const params = { title: search.value }

    const response = await getProductListService(params)
    products.value = response.data.result
  } catch (e) {
    console.error(e)
  }
}

const onInput = debounce(() => {
  if (!search.value || search.value.length < 2) return
  getProducts()
}, 1000)

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

    <template v-if="search && search.length > 2 && (products?.length || categories.length)">
      <div v-if="categories?.length">
        <h2 class="title-sm mt-6 px-4">
          {{
            $t('search.searchInCategory', {
              item: search
            })
          }}
        </h2>

        <CategoryList :items="categories" class="mt-6 px-4" manual />
      </div>

      <div v-if="products?.length" class="mt-6 w-100 d-flex px-4">
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

      <ProductList v-if="products?.length" :items="products" class="mt-6" manual />
    </template>

    <div v-else-if="!search || search.length < 2" class="flex-grow-1 d-flex align-center">
      <span class="w-100 text-center"> {{ $t('search.whatProductAreYouLookingFor') }} </span>
    </div>

    <div v-else class="flex-grow-1 d-flex align-center">
      <span class="w-100 text-center"> {{ $t('shared.nothingFound') }} </span>
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
