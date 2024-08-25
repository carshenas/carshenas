<script setup lang="ts">
import ImageLoader from "@/components/ImageLoader.vue";
import type { Category } from "@/types/dto/category";

defineProps<{ items: Category[] }>();
const emit = defineEmits<{
  (e: "select", payload: "back"): void;
  (e: "close"): void;
}>();

const onClick = () => {
  emit("select", "back");
  emit("close");
};
</script>

<template>
  <v-list>
    <!-- Back Button -->
    <v-list-item id="back" @click="onClick">
      <v-list-item-icon>
        <v-icon>arrow_forward_ios</v-icon>
      </v-list-item-icon>
    </v-list-item>

    <!-- Category List -->
    <template v-for="category in items" :key="category.id">
      <v-list-group
        v-if="category.children?.length != 0"
        :value="category.name"
      >
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :title="category.name">
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
        </template>
        <router-link
          :to="{ name: 'ProductsPage', query: { category: category.id } }"
          @click="emit('close')"
        >
          <v-list-item
            v-for="subCategory in category.children"
            :key="subCategory.id"
            :title="subCategory.name"
          />
        </router-link>
      </v-list-group>

      <v-list-item v-else :title="category.name">
        <template v-slot:prepend>
          <router-link
            :to="{ name: 'ProductsPage', query: { category: category.id } }"
            @click="emit('close')"
          >
            <ImageLoader
              :src="category.image"
              :alt="category.name"
              width="24"
              aspect-ratio="1"
              class="ml-2"
            />
          </router-link>
        </template>
      </v-list-item>
    </template>
  </v-list>
</template>

<style scoped>
:deep(.v-list-item__prepend) {
  width: 32px;
}
</style>
