<script setup lang="ts">
import CategoryList from '@/components/CategoryList.vue'
import popularModels from './components/popularModels.vue';
import blogPost from './components/blogPosts.vue'


</script>

<template>
  <div class="pa-4">
    <header>
      <h1 class="headline-sm">
        {{ $t('home.headline') }}
      </h1>

      <v-btn block rounded="pill" color="outline" size="x-large" variant="outlined" to="/search"
        class="d-flex justify-space-between mt-6 mb-12" hide-details>
        {{ $t('shared.search') }}
        <template v-slot:append>
          <v-icon color="text" icon="search" />
        </template>
      </v-btn>
    </header>

    <section class="my-12">
      <h2 class="title-sm">
        {{ $t('home.popularModels') }}
      </h2>

      <popularModels />
    </section>

    <section class="my-12">
      <div class="d-flex justify-space-between align-center">
        <h2 class="title-sm">
          {{ $t('home.popularCatagories') }}
        </h2>

        <v-btn variant="text">
          {{ $t('shared.viewAll') }}
        </v-btn>
      </div>

      <CategoryList class="mt-4" />
    </section>

    <section class="my-12">
      <div class="d-flex justify-space-between align-center">
        <h2 class="title-sm">
          {{ $t('home.carMagazine') }}
        </h2>

        <v-btn variant="text">
          {{ $t('shared.viewAll') }}
        </v-btn>
      </div>

      <blogPost />
    </section>
  </div>
</template>

