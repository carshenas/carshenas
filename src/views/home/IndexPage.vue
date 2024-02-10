<script setup lang="ts">
import CategoryList from '@/components/CategoryList.vue'
import popularModels from './components/popularModels.vue';
import blogPost from './components/blogPosts.vue'
import sectionTitle from './components/sectionTitle.vue';
</script>

<template>
  <div class="pa-4">
    <header>


      <h1 class="headline-sm">
        {{ $t('home.headline') }}
      </h1>

      <v-btn block rounded="pill" color="outline" size="x-large" variant="outlined"
        class="d-flex justify-space-between mt-6 mb-12" hide-details>
        {{ $t('shared.search') }}
        <template v-slot:append>
          <v-icon color="text" icon="search" />
        </template>
      </v-btn>

    </header>

    <section class="my-12">
      <sectionTitle :title="$t('home.popularCatagories')" />

      <popularModels />
    </section>

    <section class="my-12">
      <sectionTitle :title="$t('home.popularCatagories')" :buttonContent="$t('shared.more')" />

      <CategoryList class="mt-4" />
    </section>

    <section class="my-12">

      <sectionTitle :title="$t('home.blog')" :buttonContent="$t('shared.more')" />

      <blogPost />
    </section>

  </div>
</template>

