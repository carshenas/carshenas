<script setup lang="ts">

import { ref } from 'vue'
import type Posts from '@/types/dto/blog'

const isLoading = ref(false);
const Post = ref<Posts[]>([
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
  <div v-if="!isLoading" class="mt-4  d-flex overflow-auto over">
    <v-card class="ml-4" v-for="blog in Post" :key="blog.id" width="258" min-width="258" height="145">
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
  <div v-if="isLoading" class="mt-4  d-flex overflow-hidden over">
    <v-skeleton-loader min-width="258" height="145" color="background" class="ml-4 border"
      type="ossein"></v-skeleton-loader>
    <v-skeleton-loader ty min-width="258" height="145" color="background" class="ml-4 border" type="ossein">
    </v-skeleton-loader>
  </div>
</template>