<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  modelValue?: string;
  availableDays?: string[];
  availableTimes?: string[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const selectedDay = ref<string | null>(null);
const selectedTime = ref<string | null>(null);

// Generate available days (next 7 days)
const days = computed(() => {
  if (props.availableDays) return props.availableDays;

  const result = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    result.push(date.toISOString().split("T")[0]);
  }

  return result;
});
console.log(props.availableTimes);
// Generate available times (9 AM to 5 PM)
const times = computed(() => {
  if (props.availableTimes) return props.availableTimes;
  const result = [];
  for (let hour = 9; hour <= 17; hour++) {
    result.push(`${hour.toString().padStart(2, "0")}:00`);
  }
  return result;
});

const formatDay = (day: string) => {
  const date = new Date(day);
  return date.toLocaleDateString("fa-IR", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const handleDaySelect = (day: string) => {
  selectedDay.value = day;
  selectedTime.value = null;
  updateValue();
};

const handleTimeSelect = (time: string) => {
  selectedTime.value = time;
  updateValue();
};

const updateValue = () => {
  if (selectedDay.value && selectedTime.value) {
    const value = `${selectedDay.value}T${selectedTime.value}`;
    emit("update:modelValue", value);
  }
};
</script>

<template>
  <div class="time-selector">
    <!-- Step 1: Day Selection -->
    <div class="step day-selection" :class="{ 'step-completed': selectedDay }">
      <h3 class="step-title">{{ $t("checkout.deliveryTime") }}</h3>
      <div class="scroll-container">
        <div class="scroll-content">
          <v-btn
            v-for="day in days"
            :key="day"
            :color="selectedDay === day ? 'primary' : 'grey-lighten-1'"
            :variant="selectedDay === day ? 'flat' : 'outlined'"
            class="day-btn"
            @click="handleDaySelect(day)"
          >
            {{ day }}
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Step 2: Time Selection -->
    <div v-if="selectedDay" class="step time-selection">
      <div class="scroll-container">
        <div class="scroll-content">
          <v-btn
            v-for="time in times"
            :key="time"
            :color="selectedTime === time ? 'primary' : 'grey-lighten-1'"
            :variant="selectedTime === time ? 'flat' : 'outlined'"
            class="time-btn"
            @click="handleTimeSelect(time)"
          >
            {{ time }}
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.time-selector {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow: hidden;
}

.step {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-title {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.scroll-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;

  /* IE and Edge */
  &::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
  }
}

.scroll-content {
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  min-width: min-content;
}

.day-btn,
.time-btn {
  flex: 0 0 auto;
  min-width: 120px;
  text-transform: none;
  font-size: 0.9rem;
  white-space: nowrap;
}

.step-completed {
  .step-title {
    color: var(--v-primary-base);
  }
}
</style>
