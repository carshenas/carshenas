<script setup lang="ts">
import { defineEmits } from 'vue'
import type { Ticket } from '@/types/dto/tickets'
import { useJalaliDate } from '@/composables/use-jalali-date'

const props = defineProps<{
  ticket: Ticket
}>()

const emit = defineEmits(['ticketSelected'])

const handleMoreClick = () => {
  emit('ticketSelected', props.ticket.id)
}

const getStateData = (status: string) => {
  switch (status) {
    case 'Approved':
      return {
        class: 'text-green-darken-4',
        text: 'Approved',
        icon: 'done'
      }
    case 'Pending':
      return {
        class: 'text-orange',
        text: 'Pending',
        icon: 'pending'
      }
    case 'Rejected':
      return {
        class: 'text-red-darken-4',
        text: ' ',
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

const { convertToJalali } = useJalaliDate()
</script>

<template>
  <v-card class="mx-auto w-100 pa-2">
    <div class="d-flex align-center justify-space-between">
      <p :class="getStateData(props.ticket.status).class">
        <span v-if="props.ticket.status === 'Rejected'">
          {{ $t('support.rejected') }}
        </span>
        <span v-if="props.ticket.status === 'Approved'">
          {{ $t('support.approved') }}
        </span>
        <span v-if="props.ticket.status === 'Pending'">
          {{ $t('support.pending') }}
        </span>
        <v-icon :icon="getStateData(props.ticket.status).icon" size="x-small" />
      </p>
      <v-btn @click="handleMoreClick" icon="more_horiz" variant="text" />
    </div>
    <v-card-text v-if="props.ticket.lastMessage">
      {{ props.ticket.lastMessage.message }}
    </v-card-text>
    <div class="d-flex w-100 justify-space-between text-grey">
      <div>
        <v-icon icon="calendar_month" />
        <span>{{ convertToJalali(props.ticket.dateCreated) }}</span>
      </div>
    </div>
  </v-card>
</template>
