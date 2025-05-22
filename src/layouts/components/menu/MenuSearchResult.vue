<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import ImageLoader from '@/components/ImageLoader.vue';
import type { Category } from '@/types/dto/category';
import { useCategoryStore } from "@/stores/category";

const props = defineProps<{ 
  searchTerm: string 
}>();

const emit = defineEmits<{
  (e: 'selectCategory', payload: { id: number, level: number }): void
  (e: 'close'): void
}>();

const router = useRouter();
const categoryStore = useCategoryStore();

// Filter first level categories
const firstLevelResults = computed(() => {
  if (!props.searchTerm || props.searchTerm.length < 2) return [];
  return categoryStore.filterByTitle(categoryStore.categories, props.searchTerm);
});

// Get all second level categories that match search term
const secondLevelResults = computed(() => {
  if (!props.searchTerm || props.searchTerm.length < 2) return [];
  
  const results: Category[] = [];
  categoryStore.categories.forEach(category => {
    if (category.children) {
      const matches = categoryStore.filterByTitle(category.children, props.searchTerm);
      matches.forEach(match => {
        // Add parent info to the result
        results.push({
          ...match,
          parentName: category.name,
          parentId: category.id
        });
      });
    }
  });
  return results;
});

// Get all third level categories that match search term
const thirdLevelResults = computed(() => {
  if (!props.searchTerm || props.searchTerm.length < 2) return [];
  
  const results: Category[] = [];
  categoryStore.categories.forEach(firstLevel => {
    if (firstLevel.children) {
      firstLevel.children.forEach(secondLevel => {
        if (secondLevel.children) {
          const matches = categoryStore.filterByTitle(secondLevel.children, props.searchTerm);
          matches.forEach(match => {
            // Add parent and grandparent info
            results.push({
              ...match,
              parentName: secondLevel.name,
              parentId: secondLevel.id,
              grandparentName: firstLevel.name,
              grandparentId: firstLevel.id
            });
          });
        }
      });
    }
  });
  return results;
});

// Handle first level category click - navigate to second level
const handleFirstLevelClick = (category: Category) => {
  emit('selectCategory', { id: category.id, level: 1 });
};

// Handle second level category click
const handleSecondLevelClick = (category: Category) => {
  emit('selectCategory', { id: category.id, level: 2 });
};

// Handle third level category click - go directly to PLP
const handleThirdLevelClick = (category: Category) => {
  // Close the menu
  emit('close');
  
  // Navigate to PLP with the category id
  router.push({
    name: 'ProductsPage',
    query: { category: category.id.toString() }
  });
};

const closeResults = () => {
  emit('close');
};
</script>

<template>
  <div class="search-results-container">
    <!-- First Level Results -->
    <div v-if="firstLevelResults.length > 0" class="result-section">
      <h3 class="section-title">{{ $t('search.mainCategories') }}</h3>
      <v-list density="compact">
        <v-list-item
          v-for="category in firstLevelResults"
          :key="`first-${category.id}`"
          :title="category.name"
          @click="handleFirstLevelClick(category)"
        >
          <template v-slot:prepend>
            <ImageLoader
              :src="category.image"
              :alt="category.name"
              width="24"
              aspect-ratio="1"
              class="ml-2"
            />
          </template>
        </v-list-item>
      </v-list>
    </div>

    <!-- Second Level Results -->
    <div v-if="secondLevelResults.length > 0" class="result-section">
      <h3 class="section-title">{{ $t('search.subCategories') }}</h3>
      <v-list density="compact">
        <v-list-item
          v-for="category in secondLevelResults"
          :key="`second-${category.id}`"
          :title="category.name"
          :subtitle="category.parentName"
          @click="handleSecondLevelClick(category)"
        >
          <template v-slot:prepend>
            <ImageLoader
              :src="category.image"
              :alt="category.name"
              width="24"
              aspect-ratio="1"
              class="ml-2"
            />
          </template>
        </v-list-item>
      </v-list>
    </div>

    <!-- Third Level Results -->
    <div v-if="thirdLevelResults.length > 0" class="result-section">
      <h3 class="section-title">{{ $t('search.deepCategories') }}</h3>
      <v-list density="compact">
        <v-list-item
          v-for="category in thirdLevelResults"
          :key="`third-${category.id}`"
          :title="category.name"
          :subtitle="`${category.parentName} > ${category.grandparentName}`"
          @click="handleThirdLevelClick(category)"
          class="clickable-item"
        >
          <template v-slot:prepend>
            <ImageLoader
              :src="category.image"
              :alt="category.name"
              width="24"
              aspect-ratio="1"
              class="ml-2"
            />
          </template>
        </v-list-item>
      </v-list>
    </div>

    <!-- No Results Message -->
    <div v-if="!firstLevelResults.length && !secondLevelResults.length && !thirdLevelResults.length && props.searchTerm.length >= 2" class="no-results">
      {{ $t('search.noResults') }}
    </div>

    <!-- Close Button -->
    <div class="text-center mt-4">
      <v-btn variant="text" @click="closeResults">
        {{ $t('shared.close') }}
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.search-results-container {
  padding: 12px;
  max-height: 70vh;
  overflow-y: auto;
}

.result-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 8px;
  padding-left: 8px;
  color: rgba(0, 0, 0, 0.6);
}

.no-results {
  text-align: center;
  padding: 24px;
  color: rgba(0, 0, 0, 0.6);
}

.clickable-item {
  cursor: pointer;
}

.clickable-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
