<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  comments: { id: number; author: string; rating: number; date: string; text: string }[]
}>()
const rating = ref(0)
const showForm = ref(false)
const toggleForm = () => {
  showForm.value = !showForm.value
}
</script>

<template>
  <div id="comments" class="d-flex flex-column pa-4 ga-8">
    <div class="d-flex align-center">
      <h4 role="heading" class="text-no-wrap">{{ $t('productDetail.comments') }}</h4>
      <div class="w-100 border h-0 mx-2"></div>
      <v-btn variant="text" @click="toggleForm">{{ $t('productDetail.newComment') }}</v-btn>
    </div>

    <v-form v-if="showForm">
      <v-textarea color="primary" rows="2" variant="outlined" auto-grow></v-textarea>
      <div class="d-flex  justify-space-between">
        <v-rating
          v-model="rating"
          density="compact"
          color="orange-lighten-1"
          size="small"
        ></v-rating>

        <v-btn color="primary"> ثبت </v-btn>
      </div>
    </v-form>

    <div
      class="d-flex flex-column border rounded-lg pa-2 ga-4"
      v-for="(comment, id) in props.comments"
      :key="id"
    >
      <div class="d-flex align-center">
        <v-avatar size="54">
          <v-icon icon="account_circle" size="48"></v-icon>
        </v-avatar>
        <div class="d-flex flex-column w-100">
          <div class="d-flex justify-space-between">
            <span>{{ comment.author }}</span>

            <span>{{ comment.date }}</span>
          </div>
          <v-rating color="orange-lighten-1" density="compact" v-model="comment.rating"></v-rating>
        </div>
      </div>
      <p>{{ comment.text }}</p>
    </div>
  </div>
</template>
