<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import MenuFirstLevel from "./MenuFirstLevel.vue";
import MenuSecondLevel from "./MenuSecondLevel.vue";
import { useCategoryStore } from "@/stores/category";
import type { Category } from "@/types/dto/category";
import type { Nullable } from "@/types/utilities";
import SearchResults from "./MenuSearchResult.vue";

const categoryStore = useCategoryStore();

const isOpen = defineModel<boolean>();
const selectedFirstLevel = ref<Nullable<number>>(null);
const search = ref<Nullable<string>>(null);

// Add a new ref to track if we're in search mode
const showSearchResults = computed(() => search.value && search.value.length >= 2);

// Add a new handler for when a search result is selected
const onSearchResultSelect = ({ id, level }: { id: number, level: number }) => {
  if (level === 1) {
    // For first level, navigate to second level within the menu
    selectedFirstLevel.value = id;
    search.value = null; // Clear search to show the normal menu
  } else if (level === 2) {
    // For second level, navigate to parent category first, then show the selected category
    const parentCategory = categoryStore.categories.find(
      cat => cat.children?.some(child => child.id === id)
    );

    if (parentCategory) {
      selectedFirstLevel.value = parentCategory.id;
      search.value = null; // Clear search to show the normal menu
    }
  }
  // Third level is handled directly in the SearchResults component
};

const component = computed(() =>
  selectedFirstLevel.value ? MenuSecondLevel : MenuFirstLevel
);

const items = computed((): Category[] => {
  if (!selectedFirstLevel.value) {
    if (search.value && search.value.length >= 2)
      return categoryStore.filterByTitle(
        categoryStore.categories,
        search.value
      );
    return categoryStore.categories;
  } else {
    const target = categoryStore.categories.find(
      (category) => category.id === selectedFirstLevel.value
    )!;
    if (search.value && search.value.length > 2) {
      return categoryStore.filterByTitle(
        target.children ? target.children : [],
        search.value
      );
    }
    return target.children ? target.children : [];
  }
});

const onClick = (id: number | "back"): void => {
  if (id === "back") {
    selectedFirstLevel.value = null;
  } else {
    selectedFirstLevel.value = id;
  }
};

watch(isOpen, () => {
  selectedFirstLevel.value = null;
});

onMounted(() => {
  categoryStore.getCategories();
});
const closeSearchResults = () => {
  search.value = null;
};
</script>

<template>
  <v-navigation-drawer v-model="isOpen" :width="340" location="start" name="menu" mobile-breakpoint="xxl"
    disable-resize-watcher disable-route-watcher absolute touchless>
    <div class="fixed-bar pa-4">
      <v-text-field v-model="search" :placeholder="$t('shared.search')" variant="outlined" rounded hide-details
        append-inner-icon="search" />
    </div>

    <!-- Show search results if search is active -->
    <template v-if="showSearchResults">
      <SearchResults class="custom-margin" :search-term="search || ''" @select-category="onSearchResultSelect"
        @close="closeSearchResults" />
    </template>
    <template v-else>
      <component class="custom-margin" :is="component" :items="items" @select="onClick" />
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.fixed-bar {
  position: fixed;
  background-color: var(--v-theme-surface);
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
}

.custom-margin {
  margin-top: 80px;
}
</style>
