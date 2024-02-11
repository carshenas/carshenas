<script setup lang="ts">
import { ref } from 'vue'
import type PopularSearch from '@/types/dto/popular-search'
import CategoryList from '@/components/CategoryList.vue'
import { RouterLink } from 'vue-router'
import ProductList from '@/components/ProductList.vue'

const suggestions = ref<PopularSearch[]>([
  { id: 1, title: 'ساینا' },
  { id: 2, title: 'لنت ترمز' },
  { id: 3, title: '207' },
  { id: 4, title: 'آینه پراید' },
  { id: 5, title: 'لوازم دنا' },
  { id: 6, title: 'سوپرا' }
])

const search = ref<string>()
</script>

<template>
  <div class="pa-4">
    <v-text-field
      v-model="search"
      :placeholder="$t('shared.search')"
      variant="outlined"
      rounded
      hide-details
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

    <v-chip-group column class="mt-4">
      <v-chip v-for="suggestion in suggestions" :key="suggestion.id" variant="outlined" rounded>
        {{ suggestion.title }}
      </v-chip>
    </v-chip-group>

    <h2 class="title-sm mt-6">
      {{
        $t('search.searchInCategory', {
          item: search
        })
      }}
    </h2>

    <CategoryList class="mt-4" />

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

    <ProductList class="mt-4" />
  </div>
</template>
