<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { updateTicketService, closeTicketService } from '@/services/carshenas/support'
import type { TicketMessages, Message } from '@/types/dto/tickets'
import type { VForm } from 'vuetify/components'

const props = defineProps<{
  ticket: TicketMessages | null
}>()

const emit = defineEmits(['message-sent', 'ticket-closed'])

const formRef = ref<VForm | null>(null)
const isLoading = ref(false)
const loadingMessage = ref('')
const file = ref<File | null>(null)
const message = ref('')
const messages = ref<Message[] | null>(props.ticket ? props.ticket.messages : null)
const isClosing = ref(false)


watch(() => props.ticket, (newTicket) => {
  messages.value = newTicket ? newTicket.messages : null
}, { immediate: true })

const rules = {
  required: (value: string) => !!value || ''
}

// Updated type-safe handleFileChange function
const handleFileChange = (fileInput: File | File[] | null) => {
  if (!fileInput) {
    file.value = null
    return
  }

  // Handle both single file and array cases
  const singleFile = Array.isArray(fileInput) ? fileInput[0] : fileInput

  // If we have a valid file, check its size
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



const containerStyle = computed(() => ({
  maxHeight: props.ticket && props.ticket.status !== 'Closed' ? '50dvh' : '80dvh'
}))

const closeTicket = async () => {
  if (!props.ticket?.id) {
    console.error('No ticket selected or ticket ID is missing')
    return
  }

  try {
    isClosing.value = true
    loadingMessage.value = 'در حال بستن تیکت'

    await closeTicketService(props.ticket.id)
    emit('ticket-closed', props.ticket.id)

  } catch (error) {
    console.error('Failed to close ticket:', error)
    loadingMessage.value = 'خطا در بستن تیکت'
  } finally {
    setTimeout(() => {
      isClosing.value = false
      loadingMessage.value = ''
    }, 2000)
  }
}

const sendMessage = async () => {
  if (!formRef.value) return
  const { valid: isValid } = await formRef.value.validate()

  if (!props.ticket || !props.ticket.id) {
    console.error('No ticket selected or ticket ID is missing')
    return
  }

  if (isValid) {
    const formData = new FormData()
    formData.append('message', message.value)

    if (file.value) {
      formData.append('file', file.value)
    }

    try {
      isLoading.value = true
      loadingMessage.value = 'در حال ثبت درخواست'

      const response = await updateTicketService(props.ticket.id, formData)

      // Optimistically update the local messages
      if (messages.value) {
        messages.value = [...messages.value, {
          message: message.value,
          isAnswer: false,
          file: file.value ? URL.createObjectURL(file.value) : null
        }]
      }

      // Emit event to notify parent component
      emit('message-sent', response)

      // Reset form after submission
      message.value = ''
      file.value = null

      // Force scroll to bottom after message is added
      nextTick(() => {
        const chatContainer = document.querySelector('.chat-container')
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight
        }
      })

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
</script>

<template>
  <div v-if="props.ticket" class="d-flex flex-column h-100 justify-end chat-wrapper">
    <div v-if="props.ticket.status !== 'Closed'" class="close-ticket">
      <v-btn density="compact" color="error" variant="text" block :loading="isClosing" @click="closeTicket">
        {{ isClosing ? $t('shared.loading') : $t('support.closeTicket') }}
      </v-btn>
    </div>
    <div class="chat-container  overflow-y-auto" :style="containerStyle" v-if="messages">
      <div v-for="(message, index) in messages" :key="index" :class="{
        'justify-end': message.isAnswer,
        'justify-start': !message.isAnswer,
      }" class="d-flex">
        <v-card style="width: fit-content" :class="{ 'bg-primary': message.isAnswer }"
          class="flex-shrink-0 pa-2 my-4 text-sm">
          <v-card-text class="pa-2">
            {{ message.message }}
          </v-card-text>

          <v-card-actions class="pa-0 w-100" v-if="message.file">
            <a :href="typeof message.file === 'string' ? message.file : ''" class="w-100 bg-red-lighten-5 rounded"
              target="_blank" download>
              <v-btn class="text-xs" append-icon="download" color="grey-darken-3" size="x-small">
                دانلود فایل
              </v-btn>
            </a>
          </v-card-actions>
        </v-card>
      </div>
    </div>

    <div class="actions-container">


      <v-form v-if="props.ticket.status !== 'Closed'" ref="formRef" class="d-flex flex-column justify-space-between">
        <div>
          <v-textarea v-model="message" :label="$t('support.textLabel')" variant="outlined" rows="1" auto-grow shaped
            :rules="[rules.required]" @keyup.enter="sendMessage"></v-textarea>
        </div>

        <div>
          <v-file-input :model-value="file" :label="$t('support.fileLabel')" placeholder="Upload your document"
            accept="image/*,.pdf,.doc,.docx" @update:model-value="handleFileChange" :multiple="false">
            <template v-slot:selection="{ fileNames }">
              <v-chip v-if="fileNames.length" class="me-2 mt-5" color="primary" size="small" label>
                {{ fileNames[0] }}
              </v-chip>
            </template>
          </v-file-input>
        </div>

        <div>
          <v-btn block rounded="pill" color="primary" size="x-large" class="me-4" :disabled="isLoading"
            @click="sendMessage">
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
    </div>
  </div>
</template>

<style scoped>
.close-ticket {
  position: fixed;
  top: 90px;
  left: 25px;
  width: 60px;
  max-width: 60px;
}

.chat-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  max-height: 55dvh;
}

.actions-container {
  margin-top: auto;
  padding: 1rem;
}

.justify-start {
  justify-content: flex-start;
}

.justify-end {
  justify-content: flex-end;
}

textarea {
  padding-top: 2rem !important;
}

.v-card {
  min-width: 180px;
}
</style>
