<script setup lang="ts">
import { ref } from 'vue'
import CategoryList from '@/components/CategoryList.vue'
import { useRouter } from 'vue-router'
import ProductList from '@/components/ProductList.vue'
import SearchSuggestions from './components/SearchSuggestions.vue'
import { useDatabaseStore } from '@/stores/database'
import { onBeforeRouteLeave } from 'vue-router'
import { generateNumericId } from '@/helpers/general'
import type { Category } from '@/types/dto/category'
import { debounce } from 'lodash'
import type { Product } from '@/types/dto/product'
import { getSearchResultsService } from '@/services/carshenas/search'

const router = useRouter()
const { open: openDatabase, getDb, getStore, add } = useDatabaseStore()
const products = ref<Product[]>()
const categories = ref<Category[]>()
const search = ref<string>();

const fetchSearchResults = async () => {
  try {
    if (!search.value || search.value.length < 1) {
      products.value = []
      categories.value = []
      return
    }

    const response = await getSearchResultsService(search.value)
    console.log(response.data)
    products.value = response.data.products || []
    categories.value = response.data.categories || []
  } catch (e) {
    console.error('Error fetching search results:', e)
  }
}

const onInput = debounce(fetchSearchResults, 1000)

const updateSearch = (e: string) => {
  search.value = e
  // getProducts()
}

openDatabase('search', undefined, (db: IDBDatabase) => {
  db.createObjectStore('suggestions', { keyPath: 'id' })
})

onBeforeRouteLeave(async (to, from, next) => {
  if (
    (to.name === 'ProductsPage' || to.name === 'ProductDetail') &&
    search.value
  ) {
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
      <v-text-field v-model="search" :placeholder="$t('shared.search')" variant="outlined" rounded hide-details
        prepend-inner-icon="arrow_forward_ios" append-inner-icon="search" @input="onInput"
        @click:prepend-inner="router.back()" />
    </div>

    <SearchSuggestions class="px-4" :title="search" @select="updateSearch" style="height: 68px" />

    <template v-if="search && search.length > 1 && (products?.length || categories?.length)">
      <div v-if="categories?.length">
        <h2 class="title-sm mt-6 px-4">
          {{
            $t('search.searchInCategory', {
              item: search
            })
          }}
        </h2>

        <CategoryList :rows="1" :items="categories" class="mt-6 px-4" manual />
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

        <!-- <RouterLink :to="{ name: 'ProductsPage', query: { search } }">
          {{ $t('search.viewAll') }}
        </RouterLink> -->
      </div>

      <ProductList v-if="products?.length" :items="products" class="mt-6" manual />
    </template>

    <div v-else-if="!search || search.length < 2" class="flex-grow-1 d-flex align-center">
      <span class="w-100 text-center">
        {{ $t('search.whatProductAreYouLookingFor') }}
      </span>
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
