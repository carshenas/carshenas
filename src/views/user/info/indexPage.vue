<script setup lang="ts">
import { ref } from 'vue'
import type { VForm } from 'vuetify/components'
import { updateUser } from '@/services/carshenas/user'
import { useUserStore } from '@/stores/user'

const formRef = ref<VForm | null>(null)
const name = ref('')
const lastName = ref('')
const phoneNumber = ref('')
const nationalCode = ref()
const userStore = useUserStore()
const rules = {
  required: (value: string) => !!value || '',
  nationalCode: (value: string) =>
    !value || /^[0-9]{10}$/.test(value) || 'لطفا کد ملی درست وارد کنید'
}

const isLoading = ref(false)
const successMessage = ref(false)

const handleSubmit = async () => {
  const { valid: isValid } = await formRef.value!.validate()

  if (isValid) {
    const formData = {
      firstName: name.value,
      lastName: lastName.value,
      phoneNumber: phoneNumber.value,
      nationalCode: nationalCode.value
    }
    try {
      isLoading.value = true
      console.log('Form data to be submitted:', formData)
      await updateUser(formData)
      userStore.user.firstName = formData.firstName
      userStore.user.lastName = formData.lastName
      userStore.user.nationalCode = formData.nationalCode
      userStore.updateStoredData()
      successMessage.value = true
    } catch (error) {
      console.error('Form submission failed:', error)
    } finally {
      isLoading.value = false
    }
  } else {
    console.log('Form validation failed')
  }
}
</script>

<template>
  <section class="pa-4 d-flex flex-column ga-8 h-100">
    <div class="w-100 d-flex align-center justify-space-between">
      <v-btn icon="arrow_forward_ios" variant="text" @click="$router.go(-1)" />
      <h1>{{ $t('profile.userInfo') }}</h1>
      <v-btn icon="" variant="text" />
    </div>
    <v-form ref="formRef" class="flex-grow-1 d-flex flex-column justify-space-between">
      <div>
        <v-text-field
          v-model="name"
          :label="$t('profile.name')"
          variant="outlined"
          :rules="[rules.required]"
        />
        <v-text-field
          v-model="lastName"
          :label="$t('profile.lastName')"
          variant="outlined"
          :rules="[rules.required]"
        />
        <v-text-field
          type="tel"
          maxlength="10"
          v-model="nationalCode"
          :label="$t('profile.nationalCode')"
          variant="outlined"
          :rules="[rules.nationalCode]"
        />
      </div>

      <div>
        <v-btn
          block
          rounded="pill"
          color="primary"
          size="x-large"
          hide-details
          @click="handleSubmit"
          :loading="isLoading"
        >
          {{ $t('shared.submit') }}
        </v-btn>
      </div>
      <v-snackbar v-model="successMessage" color="green-darken-4" :timeout="2000" variant="tonal">
        {{ $t('shared.successMessage') }}
      </v-snackbar>
    </v-form>
  </section>
</template>
