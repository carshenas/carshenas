<script setup lang="ts">
import type { Ticket } from '@/types/dto/tickets'

// const props = defineProps<{
//   selectedTicket: Ticket | null
// }>()

// const sendMessage = async () => {
//   console.log('test')
// }
</script>
<template>
  <div>
    <!-- <div>
      <v-card
        class="w-auto pa-2 my-4 text-sm"
        :class="{
          'bg-primary ml-5': lastMessage.message === 'user',
          'bg-white mr-5': lastMessage.message !== 'user'
        }"
        v-for="(lastMessage, index) in selectedTicket.lastMessage"
        :key="index"
      >
        <div class="d-flex align-center justify-space-between">
          <span>{{
            lastMessage.message === 'user' ? selectedTicket.user : selectedTicket.supportEmployee
          }}</span>
        </div>
        <v-card-text class="pa-2">
          <div>
            <p>{{ lastMessage.message }}</p>
            <span>{{ lastMessage.message }}</span>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <div>
      <v-text-field
        append-inner-icon="arrow_left"
        label="پیام خود را بنویسد"
        type="text"
        variant="filled"
        clearable
        @click:append-inner="sendMessage"
      ></v-text-field>
    </div> -->
  </div>
</template>
