<script setup lang="ts">
import { ref, computed } from "vue";

// Define the type for shipping data
interface ShippingDay {
  weekday: string;
  datetime: string;
  schedule: Array<{
    id: number;
    startTime: string;
    endTime: string;
  }>;
}

interface ShippingData {
  cost: number;
  description: string;
  days: ShippingDay[];
}

const props = defineProps<{
  modelValue?: string;
  shippingData?: ShippingData | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "scheduleSelected", scheduleId: number): void;
}>();

const selectedDay = ref<string | null>(null);
const selectedTime = ref<string | null>(null);

// Get days from shipping data
const days = computed(() => {
  if (!props.shippingData?.days) return [];
  return props.shippingData.days;
});

// Get available times from shipping data
const times = computed(() => {
  if (!props.shippingData?.days || !selectedDay.value) return [];

  const day = props.shippingData.days.find(d => d.datetime === selectedDay.value);
  if (!day) return [];

  return day.schedule.map(schedule => ({
    id: schedule.id,
    timeRange: `${schedule.startTime}-${schedule.endTime}`,
    startTime: schedule.startTime,
    endTime: schedule.endTime
  }));
});

const handleDaySelect = (dayData: ShippingDay) => {
  selectedDay.value = dayData.datetime;
  selectedTime.value = null;
  // Don't emit yet, wait for time selection
};

const handleTimeSelect = (timeData: any) => {
  selectedTime.value = timeData.timeRange;
  updateValue(timeData.id);
};

const updateValue = (scheduleId: number) => {
  if (selectedDay.value && selectedTime.value) {
    const value = `${selectedDay.value}T${selectedTime.value}`;
    emit("update:modelValue", value);
    // Also emit the schedule ID for the parent to use
    emit("scheduleSelected", scheduleId);
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
          <v-btn v-for="day in days" :key="day.datetime"
            :color="selectedDay === day.datetime ? 'primary' : 'grey-lighten-1'"
            :variant="selectedDay === day.datetime ? 'flat' : 'outlined'" class="day-btn" @click="handleDaySelect(day)">
            <div class="d-flex flex-column align-center">
              <span class="text-caption">{{ day.weekday }}</span>
              <span class="text-body-2">{{ day.datetime }}</span>
            </div>
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Step 2: Time Selection -->
    <div v-if="selectedDay" class="step time-selection">
      <div class="scroll-container">
        <div class="scroll-content">
          <v-btn v-for="time in times" :key="time.id"
            :color="selectedTime === time.timeRange ? 'primary' : 'grey-lighten-1'"
            :variant="selectedTime === time.timeRange ? 'flat' : 'outlined'" class="time-btn"
            @click="handleTimeSelect(time)">
            {{ time.timeRange }}
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

.day-btn {
  flex: 0 0 auto;
  min-width: 140px; // Increased width for weekday + date
  text-transform: none;
  font-size: 0.9rem;
  white-space: nowrap;
  height: 60px; // Increased height for two lines
}

.time-btn {
  flex: 0 0 auto;
  min-width: 120px;
  text-transform: none;
  font-size: 0.9rem;
  white-space: nowrap;
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
