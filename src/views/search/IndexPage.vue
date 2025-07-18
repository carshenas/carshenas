<script setup lang="ts">
import { ref } from 'vue'
import CategoryList from '@/components/CategoryList.vue'
import ProductList from '@/components/ProductList.vue'
import SearchSuggestions from './components/SearchSuggestions.vue'
import { useDatabaseStore } from '@/stores/database'
import { onBeforeRouteLeave } from 'vue-router'
import { generateNumericId } from '@/helpers/general'
import type { Category } from '@/types/dto/category'
import { debounce } from 'lodash'
import type { Product } from '@/types/dto/product'
import { getSearchResultsService } from '@/services/carshenas/search'
const { open: openDatabase, getDb, getStore, add } = useDatabaseStore()
const products = ref<Product[]>()
const categories = ref<Category[]>()
const search = ref<string>()
const isLoading = ref(false)

const fetchSearchResults = async () => {
  if (!search.value || search.value.length < 1) {
    products.value = []
    categories.value = []
    return
  }
  
  isLoading.value = true
  
  try {
    const response = await getSearchResultsService(search.value)
    products.value = response.data.products || []
    categories.value = response.data.categories || []
  } catch (e) {
    console.error('Error fetching search results:', e)
  } finally {
    isLoading.value = false
  }
}

const onInput = debounce(fetchSearchResults, 1000)

const updateSearch = (e: string) => {
  search.value = e
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
  <div class="h-100 d-flex flex-column bar-padding position-relative">
    <div class="fixed-bar pa-4">
      <div class="d-flex align-center">
        <v-app-bar-nav-icon icon="close" density="compact" @click="$router.back()" class="mr-2" />
        
        <v-text-field 
          v-model="search" 
          :placeholder="$t('shared.search')" 
          variant="outlined" 
          rounded 
          hide-details
          append-inner-icon="search" 
          @input="onInput"
          :loading="isLoading"
          class="flex-grow-1"
        />
      </div>
    </div>

    <SearchSuggestions 
      class="px-4" 
      :title="search" 
      @select="updateSearch" 
      style="height: 68px" 
    />

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-container">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <div class="mt-4">{{ $t('shared.loading') }}</div>
    </div>

    <!-- Search results -->
    <template
      v-else-if="search && search.length > 1 && (products?.length || categories?.length)"
    >
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

        <RouterLink :to="{ name: 'ProductsPage', query: { title: search } }">
          {{ $t('search.viewAll') }}
        </RouterLink>
      </div>

      <ProductList
        class="mt-6"
        :limit="4"
        :filter="{ title: search }"
        @update:filter="(newFilter) => search = newFilter.title || ''"
      />
    </template>

    <div
      v-else-if="!search || search.length < 2"
      class="flex-grow-1 d-flex align-center"
    >
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
  background-color: var(--v-theme-surface);
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  max-width: 480px;
  width: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  width: 100%;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
}
</style>
