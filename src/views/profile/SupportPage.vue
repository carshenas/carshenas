<script setup lang="ts">
import { ref } from 'vue';
import type Ticket from "@/types/dto/tickets"
import { useRouter } from 'vue-router';
import test from 'node:test';

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

const selectedTicket = ref<Ticket | null>(null);

const goBack = () => {
  if (selectedTicket.value) {
    selectedTicket.value = null
  }
  else {
    router.go(-1);
  }
}

</script>
<template>

  <section class="pa-4 d-flex flex-column ga-8 h-100">
    <div class="w-100 d-flex align-center justify-space-between">
      <v-btn icon="arrow_forward_ios" variant="text" @click="goBack" />
      <h1>{{ $t('profile.addresses') }}</h1>
      <v-btn icon="" variant="text" />
    </div>
    <div class="d-flex flex-column ga-4">
      <div v-if="!selectedTicket">
        <v-btn block class="justify-space-between" rounded="lg" color="primary" size="x-large" append-icon="add">
          {{ $t('profile.newTicket') }}
        </v-btn>
      </div>
      <div v-if="!selectedTicket">
        <v-card class="mx-auto w-100 pa-2" v-for="(ticket, id) in tickets" :key="id">
          <div class="d-flex align-center justify-space-between">
            <span :class="getStateData(ticket.state).class">{{ getStateData(ticket.state).text }}
              <v-icon :icon="getStateData(ticket.state).icon" size="x-small" />
            </span>
            <v-btn @click="selectedTicket = ticket" icon="more_horiz" variant="text" />
          </div>
          <v-card-text>{{ ticket.messages[0].text }}</v-card-text>
          <div class="d-flex w-100 justify-space-between text-grey">
            <div>
              <v-icon icon="calendar_month" />
              <span>{{ ticket.messages[0].date }}</span>
            </div>
          </div>
        </v-card>
      </div>
      <div v-if="selectedTicket">
        <v-card class="w-auto pa-2 my-4 text-sm"
          :class="{ 'bg-primary ml-5': message.sender === 'user', 'bg-white mr-5': message.sender !== 'user' }"
          v-for="(message, index) in selectedTicket.messages" :key="index">
          <div class="d-flex align-center justify-space-between">
            <span>{{ message.sender === 'user' ? selectedTicket.user : selectedTicket.supportEmployee }}</span>
          </div>
          <v-card-text class="pa-2">
            <div>
              <p>{{ message.text }}</p>
              <span>{{ message.time }}</span>
            </div>
          </v-card-text>
        </v-card>
      </div>

    </div>
  </section>

</template>