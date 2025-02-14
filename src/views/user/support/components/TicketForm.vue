<script setup lang="ts">
import type { VForm } from 'vuetify/components'
import { ref, watch } from 'vue'
import { createTicketService } from '@/services/carshenas/support'

const formRef = ref<VForm | null>(null)
const isLoading = ref(false)
const loadingMessage = ref('')
const rules = {
  required: (value: string) => !!value || ''
}
const file = ref<File | null>(null) // Store a single file
const message = ref('')

const emit = defineEmits<{
  (event: 'update:isFormVisible', value: boolean): void
  (event: 'ticketCreated'): void
}>()

const handleSubmit = async () => {
  if (!formRef.value) return
  const { valid: isValid } = await formRef.value.validate()

  if (isValid) {
    const formData = new FormData()
    formData.append('message', message.value)

    if (file.value) {
      formData.append('file', file.value)
    }

    try {
      isLoading.value = true
      loadingMessage.value = 'در حال ثبت درخواست'

      // Send the formData
      await createTicketService(formData)

      emit('ticketCreated')
      emit('update:isFormVisible', false)

    } catch (error) {
      console.error('Form submission failed:', error)
      loadingMessage.value = 'مشکلی پیش آمد'
    } finally {
      isLoading.value = false
      loadingMessage.value = ''
    }
  }
}

const resetForm = () => {
  message.value = ''
  file.value = null
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const props = defineProps<{
  isFormVisible: boolean
}>()



watch(() => props.isFormVisible, (newValue) => {
  if (newValue) {
    resetForm()
  }
})

// Updated type-safe handleFileChange function
const handleFileChange = (fileInput: File | File[] | null) => {
  // Handle the case when input is null or undefined
  if (!fileInput) {
    file.value = null
    return
  }

  const singleFile = Array.isArray(fileInput) ? fileInput[0] : fileInput

  if (singleFile) {
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    if (singleFile.size > MAX_FILE_SIZE) {
      alert('File size should not exceed 5MB')
      file.value = null
      return
    }
    file.value = singleFile
  } else {
    file.value = null
  }
}

</script>


<template>
  <v-form ref="formRef" v-if="props.isFormVisible" class="d-flex flex-column gap-4">
    <!-- Message input -->
    <v-textarea v-model="message" :label="$t('support.textLabel')" row-height="30" rows="4" variant="filled" auto-grow
      shaped :rules="[rules.required]" class="support-input"></v-textarea>

    <!-- File input -->
    <v-file-input v-model="file" :label="$t('support.fileLabel')" placeholder="Upload your document"
      accept="image/*,.pdf,.doc,.docx" @update:model-value="handleFileChange">
      <template v-slot:selection="{ fileNames }">
        <v-chip v-if="fileNames.length" class="me-2 mt-2" color="primary" size="small" label>
          {{ fileNames[0] }}
        </v-chip>
      </template>
    </v-file-input>


    <!-- Submit button -->
    <v-btn block rounded="pill" color="primary" size="x-large" :loading="isLoading" :disabled="isLoading"
      @click="handleSubmit">
      {{ isLoading ? $t('shared.loading') : $t('shared.submit') }}
    </v-btn>
  </v-form>
</template>

<style>
.support-input {
  padding-top: 2rem !important;
}

.v-form {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.gap-4 {
  gap: 1rem;
}

textarea {
  padding-top: 2rem !important;
}
</style>
