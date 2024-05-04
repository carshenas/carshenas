<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{ items: { id: number; code: string; title: string }[] }>()

const selectedColorId = defineModel<number>()

const selectedColorTitle = computed(
  () => props.items.find((item) => item.id === selectedColorId.value)!.title
)
</script>

<template>
  <div>
    <div class="title" role="heading">{{ $t('shared.color') }} : {{ selectedColorTitle }}</div>

    <v-radio-group
      v-for="color in  props.items"
      :key="color.id"
      v-model="selectedColorId"
      :value="color.id"
    >
      <v-radio label="color.title" />
    </v-radio-group>
  </div>
</template>
