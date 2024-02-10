<script setup lang="ts">
import { ref } from 'vue'
import type PopularModel from '@/types/dto/popular-model'
import CategoryList from '@/components/CategoryList.vue'

const popularModels = ref<PopularModel[]>([
  { id: 1, title: '206', image: "../../../public/PopularModelsIMG/206.png" },
  { id: 2, title: 'samand', image: "../../../public/PopularModelsIMG/samand.png" },
  { id: 3, title: '206', image: "../../../public/PopularModelsIMG/206.png" },
  { id: 4, title: 'samand', image: "../../../public/PopularModelsIMG/samand.png" }
])

</script>
<template>
  <div class="pa-4">
    <h1 class="headline-sm">
      {{ $t('landing.headline') }}
    </h1>

    <section class="mt-6 mb-12">
      <v-btn block rounded="pill" color="outline" size="x-large" variant="outlined" class="d-flex justify-space-between"
        hide-details>
        {{ $t('shared.search') }}
        <template v-slot:append>
          <v-icon color="text" icon="search" />
        </template>
      </v-btn>
    </section>

    <section class="my-12">
      <h2 class="title-sm">
        {{ $t('landing.popularModels') }}
      </h2>
      <div class="mt-6 d-flex overflow-auto ">
        <a class="ml-4" v-for="model in popularModels" :key="model.id" href="#">
          <img :src="model.image" :alt="model.title" />
        </a>
      </div>
    </section>
    <section class="my-12">
      <div>
        <h2 class="title-sm">
          {{ $t('landing.popularCatagories') }}
        </h2>
      </div>
      <CategoryList class="mt-4" />
    </section>
  </div>
</template>

