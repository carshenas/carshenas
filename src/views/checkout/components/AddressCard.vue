<script setup lang="ts">
import { ref } from 'vue'
const isReceiveInPerson = ref<boolean>(true)
</script>

<template>
  <v-container>
    <div class="d-flex justify-space-between">
      <h2 class="my-2 title-sm">{{ $t('checkout.sendTo') }} :</h2>

      <v-btn variant="text" text="ویرایش آدرس" prepend-icon="edit" density="compact" slim />
    </div>


    <v-btn variant="outlined" class="mt-2 py-3 px-2 d-flex w-100" rounded="lg" stacked
      :color="isReceiveInPerson ? 'outline' : 'primary'" @click="isReceiveInPerson = !isReceiveInPerson">
      <span class="label-md w-100 text-start text-black"
        :class="isReceiveInPerson ? 'text-black' : 'text-primary'">دریافت حضوری</span>
      <span class="label-sm w-100 text-start">با انتخاب این گزینه مرسوله خود را با کمترین زمان و هزینه دریافت
        نمایید</span>
    </v-btn>
  </v-container>
</template>
