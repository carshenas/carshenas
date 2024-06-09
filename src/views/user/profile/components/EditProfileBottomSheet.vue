<script lang="ts" setup>
import type { User } from '@/types/dto/user'
import { ref } from 'vue'

const model = ref<Pick<User, 'firstName' | 'lastName' | 'nationalCode'>>({
  firstName: null,
  lastName: null,
  nationalCode: null
})
</script>

<template>
  <v-bottom-sheet>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon="edit" variant="icon" />
    </template>

    <v-card>
      <v-card-title> </v-card-title>

      <v-card-text>
        <v-text-field v-model="model.firstName" :label="$t('user.firstName')" />
        <v-text-field v-model="model.lastName" :label="$t('user.lastName')" />
        <v-text-field v-model="model.nationalCode" :label="$t('user.nationalCode')" />

        <v-btn :text="$t('shared.submit')" block />
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>
