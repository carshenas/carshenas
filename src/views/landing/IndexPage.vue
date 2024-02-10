<script setup lang="ts">
import { ref } from 'vue'
import type PopularModel from '@/types/dto/popular-model'
import type BlogPost from '@/types/dto/blog'
import CategoryList from '@/components/CategoryList.vue'

const popularModels = ref<PopularModel[]>([
  { id: 1, title: '206', image: "/PopularModelsIMG/206.png" },
  { id: 2, title: 'samand', image: "/PopularModelsIMG/samand.png" },
  { id: 3, title: '206', image: "/PopularModelsIMG/206.png" },
  { id: 4, title: 'samand', image: "/PopularModelsIMG/samand.png" }
])

const blogPost = ref<BlogPost[]>([
  {
    id: 1,
    title: 'بررسی اجمالی خودرو کلاسیک بر بی ام و e30',
    image: ' /blog-images/test1.jpg',
    date: '۲۲ خرداد 1402',
    tag: 'کلاسیک باز'
  },
  {
    id: 2,
    title: 'بررسی اجمالی خودرو کلاسیک بر بی ام و e30',
    image: ' /blog-images/test1.jpg',
    date: '۲۲ خرداد 1402',
    tag: 'کلاسیک باز'
  },
  {
    id: 3,
    title: 'بررسی اجمالی خودرو کلاسیک بر بی ام و e30',
    image: ' /blog-images/test1.jpg',
    date: '۲۲ خرداد 1402',
    tag: 'کلاسیک باز'
  },
  {
    id: 4,
    title: 'بررسی اجمالی خودرو کلاسیک بر بی ام و e30',
    image: ' /blog-images/test1.jpg',
    date: '۲۲ خرداد 1402',
    tag: 'کلاسیک باز'
  }
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
      <div class="d-flex justify-space-between align-center">
        <h2 class="title-sm">
          {{ $t('landing.popularCatagories') }}
        </h2>
        <v-btn variant="text">
          {{ $t('shared.more') }}
        </v-btn>
      </div>
      <CategoryList class="mt-4" />
    </section>

    <section class="my-12">
      <div class="d-flex justify-space-between align-center">
        <h2 class="title-sm">
          {{ $t('landing.blog') }}
        </h2>
        <v-btn variant="text">
          {{ $t('shared.more') }}
        </v-btn>
      </div>

      <div class="mt-4  d-flex overflow-auto over">
        <v-card class="ml-4" v-for="blog in blogPost" :key="blog.id" width="258" min-width="258" height="145">
          <v-img class="px-3 py-2" :src="blog.image" cover gradient=" rgba(12,6,52,.6), rgba(12,6,52,.6)">
            <div class="d-flex justify-end">
              <v-btn density="compact" icon="more_vert" variant="text">
              </v-btn>
            </div>
            <h3 class="mt-7 title-sm ">
              {{ blog.title }}
            </h3>
            <div class="d-flex justify-space-between mt-2">
              <span class="subtitle">
                {{ blog.tag }}
              </span>
              <span class="subtitle">
                {{ blog.date }}
              </span>
            </div>
          </v-img>
        </v-card>
      </div>
    </section>

  </div>
</template>

