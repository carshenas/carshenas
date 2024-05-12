<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
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

const { open: openDatabase, getDb, getStore, add } = useDatabaseStore()
const search = ref<string>()

const categories = ref<Category[]>()
const products = ref<Category[]>()
const getCategories = async () => {
  try {
    const response = await getCategoryListService({ title: search.value || '' })
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

    <h2 class="title-sm mt-6">
      {{
        $t('search.searchInCategory', {
          item: search
        })
      }}
    </h2>

    <CategoryList :items="categories" class="mt-4" />

    <div class="mt-6 w-100 d-flex">
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
