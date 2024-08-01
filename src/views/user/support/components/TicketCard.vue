<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Ticket } from '@/types/dto/tickets'

// Define props and emits
const props = defineProps<{
  ticket: Ticket
}>()

const emit = defineEmits(['ticketSelected'])

const handleMoreClick = () => {
  emit('ticketSelected', props.ticket.id)
}

// Get state data for displaying ticket status
const getStateData = (status: string) => {
  switch (status) {
    case 'approved':
      return {
        class: 'text-green-darken-4',
        text: 'پاسخ داده شد',
        icon: 'done'
      }
    case 'Pending':
      return {
        class: 'text-orange',
        text: 'درجریان',
        icon: 'pending'
      }
    case 'rejected':
      return {
        class: 'text-red-darken-4',
        text: 'رد شده',
        icon: 'close'
      }
    default:
      return {
        class: '',
        text: '',
        icon: ''
      }
  }
}
</script>

<template>
  <v-card class="mx-auto w-100 pa-2">
    <div class="d-flex align-center justify-space-between">
      <span :class="getStateData(props.ticket.status).class">
        {{ getStateData(props.ticket.status).text }}
        <v-icon :icon="getStateData(props.ticket.status).icon" size="x-small" />
      </span>
      <v-btn @click="handleMoreClick" icon="more_horiz" variant="text" />
    </div>
    <v-card-text v-if="props.ticket.lastMessage">
      {{ props.ticket.lastMessage.message }}
    </v-card-text>
    <div class="d-flex w-100 justify-space-between text-grey">
      <div>
        <v-icon icon="calendar_month" />
        <span>{{ props.ticket.dateCreated }}</span>
      </div>
    </div>
  </v-card>
</template>
