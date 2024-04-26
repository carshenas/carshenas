<script setup lang="ts">
import type Ticket from "@/types/dto/tickets"
import { defineEmits } from 'vue';

const props = defineProps<{
  ticket: Ticket;
}>()

const emit = defineEmits(['ticketSelected']);

const handleMoreClick = () => {
  emit('ticketSelected', props.ticket);
}

const getStateData = (state: string) => {
  switch (state) {
    case 'approved':
      return {
        class: 'text-green-darken-4',
        text: 'پاسخ داده شد',
        icon: 'done'
      };
    case 'doing':
      return {
        class: 'text-orange',
        text: 'درجریان',
        icon: 'pending'
      };
    case 'rejected':
      return {
        class: 'text-red-darken-4',
        text: 'رد شده',
        icon: 'close'
      };
    default:
      return {
        class: '',
        text: '',
        icon: ''
      };
  }
}
</script>
<template>
  <v-card class="mx-auto w-100 pa-2">
    <div class="d-flex align-center justify-space-between">
      <span :class="getStateData(ticket.state).class">{{ getStateData(ticket.state).text }}
        <v-icon :icon="getStateData(ticket.state).icon" size="x-small" />
      </span>
      <v-btn @click="handleMoreClick" icon="more_horiz" variant="text" />
    </div>
    <v-card-text>{{ ticket.messages[0].text }}</v-card-text>
    <div class="d-flex w-100 justify-space-between text-grey">
      <div>
        <v-icon icon="calendar_month" />
        <span>{{ ticket.messages[0].date }}</span>
      </div>
    </div>
  </v-card>
</template>