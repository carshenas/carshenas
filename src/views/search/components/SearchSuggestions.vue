<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import type SearchSuggestion from '@/types/dto/popular-search'
import { useDatabaseStore } from '@/stores/database'

const props = withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: ''
  }
)
const emits = defineEmits<{
  (event: 'select', payload: string): void
}>()

const { getDb, getStore, getAll } = useDatabaseStore()

const suggestions = ref<string[]>([])
const loading = ref<boolean>(false)

const getSuggestions = async () => {
  loading.value = true
  try {
    const db = await getDb('search')
    const suggestionsStore = getStore(db, 'suggestions')
    const result = await getAll<SearchSuggestion>(suggestionsStore)
    suggestions.value = Array.from(new Set(result.map((item) => item.title)))
  } catch (e) {
    throw new Error(e as string)
  }
}

const filteredSuggestions = computed((): string[] => {
  return suggestions.value.filter(
    (suggest) => suggest.indexOf(props.title) > -1
  )
})

onMounted(() => getSuggestions())
</script>

<template>
  <v-chip-group column class="mt-4 pa-0">
    <v-chip
      v-for="(suggestion, index) in filteredSuggestions"
      :key="index"
      variant="outlined"
      rounded
      @click="emits('select', suggestion)"
    >
      {{ suggestion }}
    </v-chip>
  </v-chip-group>
</template>
