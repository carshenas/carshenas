
<script setup lang="ts">
import { ref } from 'vue'

import type PopularModel from '@/types/dto/popular-model'
const Models = ref<PopularModel[]>([
  { id: 1, title: '206', image: "/PopularModelsIMG/206.png" },
  { id: 2, title: 'samand', image: "/PopularModelsIMG/samand.png" },
  { id: 3, title: '206', image: "/PopularModelsIMG/206.png" },
  { id: 4, title: 'samand', image: "/PopularModelsIMG/samand.png" }
])

</script>

<template>
  <div class="mt-6 d-flex overflow-auto ">
    <a class="ml-4" v-for="model in Models " :key="model.id" href="#">
      <img :src="model.image" :alt="model.title" />
    </a>
  </div>
</template>