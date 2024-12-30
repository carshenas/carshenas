<script lang="ts" setup>
import { updateUserService } from '@/services/carshenas/user'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types/dto/user'
import { computed, ref } from 'vue'
import validator from '@/helpers/validator'

const userStore = useUserStore()
const model = ref<Pick<User, 'firstName' | 'lastName' | 'nationalCode'>>({
  firstName: userStore.user.firstName,
  lastName: userStore.user.lastName,
  nationalCode: userStore.user.nationalCode
})
const isOpen = ref<boolean>(false)
const loading = ref<boolean>(false)
const isValid = ref<boolean>(false)

const onSubmit = async () => {
  loading.value = true
  try {
    await updateUserService(model.value)
    userStore.user.firstName = model.value.firstName
    userStore.user.lastName = model.value.lastName
    userStore.user.nationalCode = model.value.nationalCode
    userStore.updateStoredData()
    close()
  } catch (e) {
    console.warn(e)
  } finally {
    loading.value = false
  }
}

const close = () => {
  model.value = {
    firstName: userStore.user.firstName,
    lastName: userStore.user.lastName,
    nationalCode: userStore.user.nationalCode
  }
  isOpen.value = false
}

const isModified = computed(() =>
  model.value.firstName === userStore.user.firstName &&
  model.value.lastName === userStore.user.lastName &&
  model.value.nationalCode === userStore.user.nationalCode
    ? false
    : true
)
</script>

<template>
  <v-bottom-sheet v-model="isOpen" persistent>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon="edit" variant="plain" density="compact" />
    </template>

    <v-card>
      <v-card-title>
        <div class="mt-2 title-md d-flex justify-space-between">
          {{ $t('user.editPersonalInfo') }}

          <v-btn
            variant="plain"
            icon="close"
            density="comfortable"
            @click="close()"
          />
        </div>
      </v-card-title>

      <v-card-text>
        <v-form v-model="isValid" @submit.prevent="onSubmit">
          <v-text-field
            v-model="model.firstName"
            :label="$t('user.firstName')"
            class="mb-4"
          />

          <v-text-field
            v-model="model.lastName"
            :label="$t('user.lastName')"
            class="mb-4"
          />

          <v-text-field
            v-model="model.nationalCode"
            :label="$t('user.nationalCode')"
            :rules="[
              (v: any) => validator(v, 'nationalId', $t('user.nationalCode'))
            ]"
            maxLength="10"
            class="mb-4"
          />

          <v-btn
            :text="$t('shared.submit')"
            :loading
            :disabled="!isModified || !isValid"
            type="submit"
            block
          />
        </v-form>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>
