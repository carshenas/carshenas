<script setup lang="ts">
import { ref } from 'vue';
import type addresses from "@/types/dto/addresses";
import newAddressInfo from "./components/NewAddressInfo.vue";
import newAddressMap from "./components/NewAddressMap.vue";

const showInfo = ref(false);
const toggleShowInfo = () => {
  showInfo.value = !showInfo.value;
};
const address = ref<addresses[]>([
  {
    id: 1,
    receiver: "فرزاد جام بر",
    address: "تهران،تیموری، خ. حبیب الله جنوبی، بعد از خ. تیموری غربی، خ. عزیزی",
    phone: "09012529729",
    postalCode: "1458886878"
  },
  {
    id: 1,
    receiver: "فرزاد جام بر",
    address: "تهران،تیموری، خ. حبیب الله جنوبی، بعد از خ. تیموری غربی، خ. عزیزی",
    phone: "09012529729",
    postalCode: "1458886878"
  }
])

</script>
<template>

  <section class="pa-4 d-flex flex-column ga-8 h-100">
    <div class="w-100 d-flex align-center justify-space-between">
      <v-btn icon="arrow_forward_ios" variant="text" @click="$router.go(-1)" />
      <h1>{{ $t('profile.addresses') }}</h1>
      <v-btn icon="" variant="text" />
    </div>
    <div class="d-flex flex-column ga-4">
      <v-bottom-sheet>

        <template v-slot:activator="{ props }">
          <v-btn block v-bind="props" class="justify-space-between" rounded="lg" color="primary" size="x-large"
            append-icon="add">
            {{ $t('profile.newAddress') }}
          </v-btn>
        </template>
        <v-card class="d-flex flex-column ga-4" :title="$t('profile.newAddress')">
          <v-btn v-if="showInfo" icon="arrow_forward_ios" variant="text" @click="toggleShowInfo" size="x-small" />
          <newAddressMap v-if="!showInfo" @showInfo="showInfo = true" />
          <newAddressInfo v-if="showInfo" />
        </v-card>
      </v-bottom-sheet>

      <v-card class="mx-auto w-100 pa-2" v-for="(addr, index) in address" :key="index">
        <div class="d-flex align-center justify-space-between">
          <span>{{ addr.receiver }}</span>
          <v-btn icon="border_color" variant="text" />
        </div>
        <v-card-text>{{ addr.address }}</v-card-text>
        <div class="d-flex w-100 justify-space-between text-grey">
          <div>
            <span>{{ addr.phone }}</span>
            <v-icon icon="call" />
          </div>
          <div>
            <span>{{ addr.postalCode }}</span>
            <v-icon icon="local_post_office" />
          </div>
        </div>
      </v-card>
    </div>
  </section>

</template>