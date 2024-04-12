<script setup lang="ts">
import { ref } from 'vue';
import type Ticket from "@/types/dto/tickets"
import { useRouter } from 'vue-router';
import TicketList from './components/TicketList.vue';
import TicketDetails from './components/TicketDetails.vue';
import TicketForm from "./components/TicketForm.vue";

const router = useRouter();

const tickets = ref<Ticket[]>([
  {
    id: 12345,
    user: 'فرزاد جام بر',
    supportEmployee: 'فرهاد زواره',
    state: 'approved',
    messages: [
      {
        text: 'سلام خیلی سایت شتی دارید چه وضعشه.سلام خیلی سایت شتی دارید چه وضعشه. سلام خیلی سایت شتی دارید چه وضعشه. سلام خیلی سایت شتی دارید چه وضعشه.',
        sender: 'user',
        date: "1402.02.1",
        time: '13:12'
      },
      {
        text: 'فرانتمون خیلی بده درسته',
        sender: 'employee',
        date: "1402.02.1",
        time: '13:14'
      },
      {
        text: "بله بنظر میرسه ریدید",
        sender: 'user',
        date: "1402.02.1",
        time: '13:18'
      },
      {
        text: 'درسته',
        sender: 'employee',
        date: "1402.02.1",
        time: '13:20'
      }
    ],
  }
]);

const handleTicketSelected = (ticket: Ticket) => {
  selectedTicket.value = ticket;
};

const showForm = ref(false);

const toggleFormVisibility = () => {
  showForm.value = !showForm.value;
};

const selectedTicket = ref<Ticket | null>(null);

const goBack = () => {
  if (selectedTicket.value) {
    selectedTicket.value = null
  }
  if (showForm.value) {
    showForm.value = !showForm.value;
  }
  else {
    router.go(-1);
  }
}


</script>
<template>

  <section class="pa-4 d-flex flex-column ga-8 h-screen">
    <div class="w-100 d-flex align-center justify-space-between">
      <v-btn icon="arrow_forward_ios" variant="text" @click="goBack" />
      <h1>{{ $t('profile.addresses') }}</h1>
      <v-btn icon="" variant="text" />
    </div>
    <div class="d-flex flex-column ga-4 flex-grow-1">
      <div v-if="!selectedTicket && !showForm">
        <v-btn block class="justify-space-between" rounded="lg" color="primary" size="x-large" append-icon="add"
          @click="toggleFormVisibility">
          {{ $t('profile.newTicket') }}
        </v-btn>
      </div>
      <div v-if="!selectedTicket && !showForm">
        <TicketList v-for="(ticket, index) in tickets" :key="index" :ticket="ticket"
          @ticketSelected="handleTicketSelected" />
      </div>
      <TicketDetails :selectedTicket="selectedTicket" />
      <TicketForm :showForm="showForm" />
    </div>
  </section>

</template>