<script setup lang="ts">
import CategoryList from '@/components/CategoryList.vue'
import PopularModels from './components/PopularModels.vue'
import PostList from './components/PostsList.vue'
</script>

<template>
  <div class="pa-4">
    <header>
      <h1 class="title-lg">
        {{ $t('home.headline') }}
      </h1>

      <p class="body-md mt-4">
        {{ $t('home.description') }}
      </p>

      <v-btn
        block
        rounded="pill"
        color="outline"
        size="x-large"
        variant="outlined"
        to="/search"
        class="d-flex justify-space-between mt-6"
        hide-details
      >
        {{ $t('shared.search') }}
        <template v-slot:append>
          <v-icon color="text" icon="search" />
        </template>
      </v-btn>
    </header>

    <section class="mt-8">
      <h2 class="title-md">
        {{ $t('home.popularModels') }}
      </h2>

      <PopularModels />
    </section>

    <section class="mt-8">
      <h2 class="title-md">
        {{ $t('home.popularCatagories') }}
      </h2>

      <CategoryList class="mt-4" />
    </section>

    <section class="mt-8">
      <div class="d-flex justify-space-between align-center">
        <h2 class="title-md">
          {{ $t('home.carMagazine') }}
        </h2>

        <v-btn variant="text" class="label-lg">
          {{ $t('shared.viewAll') }}
        </v-btn>
      </div>

      <PostList />
    </section>
  </div>
</template>
