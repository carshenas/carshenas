<script setup lang="ts">
import { ref } from 'vue'
import type PopularSearch from '@/types/dto/popular-search'
import CategoryList from '@/components/CategoryList.vue'

const popularSearches = ref<PopularSearch[]>([
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

    <v-chip
      v-for="popularSearch in popularSearches"
      :key="popularSearch.id"
      variant="outlined"
      class="ml-4 mt-4"
      rounded
    >
      {{ popularSearch.title }}
    </v-chip>

    <h2 class="title-sm mt-6">
      {{
        $t('search.searchInCategory', {
          item: search
        })
      }}
    </h2>

    <CategoryList class="mt-4" />
  </div>
</template>
