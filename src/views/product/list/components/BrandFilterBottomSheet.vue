<script lang="ts" setup>
import FabBtn from '@/components/FabBtn.vue'
</script>

<template>
  <v-bottom-sheet>
    <template v-slot:activator="{ props }">
      <FabBtn
        v-bind="props"
        icon="directions_car"
        :text="$t('product.vehicleFilter')"
        :delay="5"
        left
        bottom
      />
    </template>

    <v-card
      title="Bottom Sheet"
      text="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut, eos? Nulla aspernatur odio rem, culpa voluptatibus eius debitis dolorem perspiciatis asperiores sed consectetur praesentium! Delectus et iure maxime eaque exercitationem!"
    ></v-card>
  </v-bottom-sheet>
</template>
