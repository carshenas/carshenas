<script setup lang="ts">
import type { TicketMessages } from '@/types/dto/tickets'

const props = defineProps<{
  ticket: TicketMessages | null
}>()

const sendMessage = async () => {
  console.log(props.ticket)
}

const isEven = (index: number): boolean => index % 2 === 0
</script>

<template>
  <div class="d-flex flex-column h-100 justify-end" v-if="props.ticket">
    <div
      v-for="(message, index) in props.ticket.messages"
      :key="index"
      :class="{ 'justify-end': !isEven(index), 'justify-start': isEven(index) }"
      class="d-flex"
    >
      <v-card style="width: fit-content" class="flex-shrink-0 pa-2 my-4 text-sm">
        <div class="d-flex align-center justify-space-between"></div>

        <v-card-text class="pa-2">
          {{ message.message }}
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
    </div>
  </div>
</template>

<style scoped>
.justify-start {
  justify-content: flex-start;
}

.justify-end {
  justify-content: flex-end;
}
</style>
