<script setup lang="ts">
const props = defineProps<{
  comments: { id: number; author: string; rating: number; date: number; text: string }[]
}>()
</script>

<template>
  <div id="comments" class="d-flex flex-column pa-4 ga-8">
    <div class="d-flex align-center">
      <h4 role="heading" class="text-no-wrap">{{ $t('productDetail.comments') }}</h4>
      <div class="w-100 border h-0 mx-2"></div>
    </div>
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

<style scoped lang="scss"></style>
