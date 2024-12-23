<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import type { Ticket, TicketMessages } from "@/types/dto/tickets";
import TicketCards from "./components/TicketCard.vue";
import TicketDetails from "./components/TicketDetails.vue";
import TicketForm from "./components/TicketForm.vue";
import {
  getTicketListService,
  getTicketService,
} from "@/services/carshenas/support";
import type { Nullable } from "@/types/utilities";

const router = useRouter();
const tickets = ref<Ticket[]>([]);
const selectedTicketId = ref<number | null>(null);
const isFormVisible = ref<boolean>(false);
const selectedTicket = ref<Nullable<TicketMessages>>(null);
const currentPage = ref<number>(1);
const totalPages = ref<number>(1);
const itemsPerPage = ref<number>(10);

onMounted(async () => {
  await refreshTicketList();
});

const refreshTicketList = async () => {
  try {
    const offset = (currentPage.value - 1) * itemsPerPage.value;
    const response = await getTicketListService(itemsPerPage.value, offset);
    tickets.value = response.data.result;  // Update the tickets list
    totalPages.value = Math.ceil(response.data.count / itemsPerPage.value);  // Update total pages
  } catch (error) {
    console.error("Error fetching ticket list:", error);
  }
};

watch(currentPage, async () => {
  await refreshTicketList();
});

const handleTicketSelected = async (ticket: number) => {
  selectedTicketId.value = ticket;

  try {
    if (selectedTicketId.value !== null) {
      const response = await getTicketService(selectedTicketId.value);
      selectedTicket.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching ticket details:", error);
  }
};

// Toggle form visibility and refresh ticket list if needed
const toggleFormVisibility = async (refreshList = false) => {
  isFormVisible.value = !isFormVisible.value;

  if (refreshList) {
    await refreshTicketList();
  }
};

// Handle navigation back
const goBack = () => {
  if (selectedTicket.value) {
    selectedTicket.value = null;
  } else if (isFormVisible.value) {
    isFormVisible.value = !isFormVisible.value;
  } else {
    router.go(-1);
  }
};
</script>

<template>
  <section class="pa-4 d-flex flex-column ga-8 h-100">
    <div class="w-100 d-flex align-center justify-space-between">
      <v-btn icon="arrow_forward_ios" variant="text" @click="goBack" />
      <h1>{{ $t("user.support") }}</h1>
      <v-btn icon="" variant="text" />
    </div>

    <div class="d-flex flex-column ga-4 flex-grow-1">
      <!-- Button to create a new ticket -->
      <div v-if="!selectedTicket && !isFormVisible">
        <v-btn block class="justify-space-between" rounded="lg" color="primary" size="x-large" append-icon="add"
          @click="toggleFormVisibility">
          {{ $t("user.newTicket") }}
        </v-btn>
      </div>

      <!-- List of tickets -->
      <div class="d-flex flex-column-reverse ga-4" v-if="!selectedTicket && !isFormVisible">
        <TicketCards v-for="(ticket, index) in tickets" :key="index" :ticket="ticket"
          @ticketSelected="handleTicketSelected" />
      </div>

      <!-- Ticket details -->
      <TicketDetails v-if="selectedTicket" :ticket="selectedTicket" />

      <!-- Ticket form -->
      <TicketForm v-bind:isFormVisible="isFormVisible" v-on:update:isFormVisible="isFormVisible = $event"
        v-on:ticketCreated="refreshTicketList" />
    </div>

    <v-pagination v-if="totalPages > 1" v-model="currentPage" :length="totalPages" :total-visible="5"
      @input="refreshTicketList" />
  </section>
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
</style>
