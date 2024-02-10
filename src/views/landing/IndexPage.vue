<script setup lang="ts">

</script>
<template>
  <section>
    <v-btn block rounded="pill" color="text" size="x-large" variant="outlined" class="d-flex justify-space-between mt-8">
      {{
        $t('shared.search')
      }}
      <template v-slot:append>
        <v-icon icon="search" />
      </template>
    </v-btn>
  </section>
</template>

