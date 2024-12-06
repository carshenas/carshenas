<script setup lang="ts">
import { ref, watch } from 'vue'
import { updateTicketService } from '@/services/carshenas/support'
import type { TicketMessages, Message } from '@/types/dto/tickets'

const props = defineProps<{
  ticket: TicketMessages | null
}>()

const messageInput = ref<string>('')
const messages = ref<Message[] | null>(props.ticket ? props.ticket.messages : null)

// Watch for changes in the ticket prop
watch(() => props.ticket, (newTicket) => {
  messages.value = newTicket ? newTicket.messages : null
}, { immediate: true })

const sendMessage = async () => {
  if (!props.ticket || !props.ticket.id) {
    console.error('No ticket selected or ticket ID is missing')
    return
  }

  try {
    const payload = {
      message: messageInput.value
    }

    const response = await updateTicketService(props.ticket.id, payload)

    if (response && response.data && response.data.messages) {
      messages.value = response.data.messages
      // Optionally emit an event if the parent needs to know about the update
      // emit('update-ticket', response.data.messages)
    }

    messageInput.value = ''
  } catch (error) {
    console.error('Failed to update ticket:', error)
  }
}
</script>

<template>
  <div class="d-flex flex-column h-100 justify-end" v-if="messages">
    <div v-for="(message, index) in messages" :key="index" :class="{
      'justify-end': message.is_answer,
      'justify-start': !message.is_answer,
      'bg-answer': message.is_answer
    }" class="d-flex">
      <v-card style="width: fit-content" class="flex-shrink-0 pa-2 my-4 text-sm">
        <v-card-text class="pa-2">
          {{ message.message }}
        </v-card-text>
      </v-card>
    </div>
    <div>
      <v-textarea rows="1" v-model="messageInput" append-inner-icon="arrow_left" label="پیام خود را بنویسید" type="text"
        variant="filled" clearable @click:append-inner="sendMessage">
      </v-textarea>
    </div>
  </div>
</template>

<style>
.justify-start {
  justify-content: flex-start;
}

.justify-end {
  justify-content: flex-end;
}

.bg-answer {
  background-color: #e0f7fa;
}

textarea {
  padding-top: 2rem !important;
}
</style>