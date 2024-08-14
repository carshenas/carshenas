<script lang="ts" setup>
import { updateUserService } from '@/services/carshenas/user'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types/dto/user'
import { ref } from 'vue'

const userStore = useUserStore()
const model = ref<Pick<User, 'firstName' | 'lastName' | 'nationalCode'>>({
  firstName: userStore.user.firstName,
  lastName: userStore.user.lastName,
  nationalCode: userStore.user.nationalCode
})
const isOpen = ref<boolean>(false)
const loading = ref<boolean>(false)

const onSubmit = async () => {
  loading.value = true
  try {
    await updateUserService(model.value)
    userStore.user.firstName = model.value.firstName
    userStore.user.lastName = model.value.lastName
    userStore.user.nationalCode = model.value.nationalCode
    userStore.updateStoredData()
    isOpen.value = false
  } catch (e) {
    console.warn(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-bottom-sheet v-model="isOpen">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon="edit" />
    </template>

    <v-card>
      <v-card-title>
        <div class="mt-2 title-md d-flex justify-space-between">
          {{ $t('user.editPersonalInfo') }}

          <v-btn  icon="close" density="comfortable" @click="isOpen = false" />
        </div>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <v-text-field v-model="model.firstName" :label="$t('user.firstName')" />
          <v-text-field v-model="model.lastName" :label="$t('user.lastName')" />
          <v-text-field v-model="model.nationalCode" :label="$t('user.nationalCode')" />

          <v-btn :text="$t('shared.submit')" type="submit" :loading block />
        </v-form>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>
