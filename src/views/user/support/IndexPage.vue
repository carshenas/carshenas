<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Ticket, TicketMessages } from '@/types/dto/tickets'
import TicketCards from './components/TicketCard.vue'
import TicketDetails from './components/TicketDetails.vue'
import TicketForm from './components/TicketForm.vue'
import { getTicketListService, getTicketService } from '@/services/carshenas/support'

const router = useRouter()

const tickets = ref<Ticket[]>([])
const selectedTicketId = ref<number | null>(null)
const showForm = ref(false)
const selectedTicket = ref<TicketMessages | null>(null) // Initialize selectedTicket ref

onMounted(async () => {
  try {
    const response = await getTicketListService()
    tickets.value = response.data.result
  } catch (error) {
    console.error('Error fetching ticket list:', error)
  }
})

// Handle ticket selection
const handleTicketSelected = async (ticket: number) => {
  selectedTicketId.value = ticket

  try {
    if (selectedTicketId.value !== null) {
      const response = await getTicketService(selectedTicketId.value)
      selectedTicket.value = response.data
      console.log(response.data)
    }
  } catch (error) {
    console.error('Error fetching ticket details:', error)
  }
}

// Toggle form visibility
const toggleFormVisibility = () => {
  showForm.value = !showForm.value
}

// Handle navigation back
const goBack = () => {
  if (selectedTicket.value) {
    selectedTicket.value = null
  } else if (showForm.value) {
    showForm.value = !showForm.value
  } else {
    router.go(-1)
  }
}
</script>

<template>
  <section class="pa-4 d-flex flex-column ga-8 h-screen">
    <div class="w-100 d-flex align-center justify-space-between">
      <v-btn icon="arrow_forward_ios" variant="text" @click="goBack" />
      <h1>{{ $t('user.support') }}</h1>
      <v-btn icon="" variant="text" />
    </div>

    <div class="d-flex flex-column ga-4 flex-grow-1">
      <!-- Button to create a new ticket -->
      <div v-if="!selectedTicket && !showForm">
        <v-btn
          block
          class="justify-space-between"
          rounded="lg"
          color="primary"
          size="x-large"
          append-icon="add"
          @click="toggleFormVisibility"
        >
          {{ $t('user.newTicket') }}
        </v-btn>
      </div>

      <!-- List of tickets -->
      <div class="d-flex flex-column ga-4" v-if="!selectedTicket && !showForm">
        <TicketCards
          v-for="(ticket, index) in tickets"
          :key="index"
          :ticket="ticket"
          @ticketSelected="handleTicketSelected"
        />
      </div>

      <!-- Ticket details -->
      <TicketDetails v-if="selectedTicket" :ticket="selectedTicket" />

      <!-- Ticket form -->
      <TicketForm :showForm="showForm" />
    </div>
  </section>
</template>
