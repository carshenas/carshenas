<script setup lang="ts">
import { ref } from 'vue'
const tab = ref('one')

const selectedTime = ref(null)
</script>

<template>
  <v-container>
    <h2 class="my-2 title-sm">{{ $t('checkout.deliveryTime') }} :</h2>

    <v-tabs v-model="tab" align-tabs="start" stacked>
      <v-tab value="one">
        <span class="label-md">پنجشنبه</span>

        <span class="mt-1 title-md">25</span>
      </v-tab>

      <v-tab value="two">
        <span class="label-md">جمعه</span>

        <span class="mt-1 title-md">26</span>
      </v-tab>

      <v-tab value="three">
        <span class="label-md">شنبه</span>

        <span class="mt-1 title-md">27</span>
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-radio-group v-model="selectedTime" color="primary" class="mt-4">
        <v-row>
          <v-col cols="6">
            <v-radio :value="1" class="border rounded-lg">
              <template v-slot:label> از ساعت 7 تا 11 </template>
            </v-radio>
          </v-col>

          <v-col cols="6">
            <v-radio :value="2" class="border rounded">
              <template v-slot:label> از ساعت 12 تا 15 </template>
            </v-radio>
          </v-col>
        </v-row>
      </v-radio-group>
    </v-tabs-window>
  </v-container>
</template>
