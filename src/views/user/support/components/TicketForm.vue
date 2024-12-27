<script setup lang="ts">
import type { VForm } from 'vuetify/components'
import { ref } from 'vue'
import { createTicketService } from '@/services/carshenas/support'

const formRef = ref<VForm | null>(null)
const isLoading = ref(false)
const loadingMessage = ref('') // Loading message state
const rules = {
  required: (value: string) => !!value || ''
}
const files = ref<File[]>([])
const message = ref('')

const emit = defineEmits<{
  (event: 'update:isFormVisible', value: boolean): void
  (event: 'ticketCreated'): void
}>()

const handleSubmit = async () => {
  const { valid: isValid } = await formRef.value!.validate()
  if (isValid) {
    const formData = new FormData()
    formData.append('message', message.value)
    if (files.value.length > 0) {
      for (const file of files.value) {
        formData.append('files[]', file)
      }
    }
    try {
      isLoading.value = true
      loadingMessage.value = 'در حال ثبت درخواست'
      await createTicketService(formData)
      emit('update:isFormVisible', false)
      emit('ticketCreated')
    } catch (error) {
      console.error('Form submission failed:', error)
      loadingMessage.value = 'مشکلی پیش آمد'
    } finally {
      setTimeout(() => {
        isLoading.value = false
        loadingMessage.value = ''
      }, 2000)
    }
  }
}

const props = defineProps<{
  isFormVisible: boolean
}>()
</script>

<template>
  <v-form ref="formRef" v-if="props.isFormVisible" class="d-flex flex-column justify-space-between">
    <!-- Message input -->
    <div>
      <v-textarea v-model="message" :label="$t('support.textLabel')" row-height="30" rows="4" variant="filled" auto-grow
        shaped :rules="[rules.required]" class="support-input"></v-textarea>
    </div>

    <!-- File input -->
    <div>
      <v-file-input v-model="files" :label="$t('support.fileLabel')" placeholder="Upload your documents" multiple>
        <template v-slot:selection="{ fileNames }">
          <template v-for="fileName in fileNames" :key="fileName">
            <v-chip class="me-2" color="primary" size="small" label>
              {{ fileName }}
            </v-chip>
          </template>
        </template>
      </v-file-input>
    </div>

    <!-- Submit button -->
    <div>
      <v-btn block rounded="pill" color="primary" size="x-large" class="me-4" :disabled="isLoading"
        @click="handleSubmit">
        <!-- Show loading spinner when isLoading is true -->
        <template v-if="isLoading">
          <v-progress-circular indeterminate color="white" size="20" class="me-2"></v-progress-circular>
          {{ $t('shared.loading') }}
        </template>
        <template v-else>
          {{ $t('shared.submit') }}
        </template>
      </v-btn>
    </div>
  </v-form>
</template>


<style scoped>
.justify-start {
  justify-content: flex-start;
}

.justify-end {
  justify-content: flex-end;
}

textarea {
  padding-top: 2rem !important;
}

.loading-overlay {
  z-index: 1000;
}

.v-overlay__content {
  background-color: rgba(255, 255, 255, 0.9);
}
</style>
