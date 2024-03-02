<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type SearchSuggestion from '@/types/dto/popular-search'
import { useDatabaseStore } from '@/stores/database'

const { getDb, getStore, getAll } = useDatabaseStore()

const suggestions = ref<SearchSuggestion[]>([])
const loading = ref<boolean>(false)

const getSuggestions = async () => {
  loading.value = true
  try {
    const db = await getDb('search')
    const suggestionsStore = getStore(db, 'suggestions')
    const result = await getAll<SearchSuggestion>(suggestionsStore)
    suggestions.value = result
  } catch (e) {
    throw new Error(e as string)
  }
}

onMounted(() => getSuggestions())
</script>

<template>
  <v-chip-group column class="mt-4">
    <v-chip v-for="suggestion in suggestions" :key="suggestion.id" variant="outlined" rounded>
      {{ suggestion.title }}
    </v-chip>
  </v-chip-group>
</template>
