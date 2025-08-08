<script setup lang="ts">
import { ref, computed, watch } from "vue";

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
  hasVisibleSchedules: boolean;
  isTehran: boolean;
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
  console.log('TimeSelector - Computing days:', {
    hasShippingData: !!props.shippingData,
    daysLength: props.shippingData?.days?.length,
    days: props.shippingData?.days
  });

  if (!props.shippingData?.days) return [];
  return props.shippingData.days;
});

// Get available times from shipping data
const times = computed(() => {
  console.log('TimeSelector - Computing times:', {
    selectedDay: selectedDay.value,
    hasShippingData: !!props.shippingData?.days,
    shouldAutoSelectTime: shouldAutoSelectTime.value
  });

  if (!props.shippingData?.days || !selectedDay.value) return [];

  const day = props.shippingData.days.find(d => d.datetime === selectedDay.value);
  if (!day) return [];

  const timesData = day.schedule.map(schedule => ({
    id: schedule.id,
    timeRange: `${schedule.startTime}-${schedule.endTime}`,
    startTime: schedule.startTime,
    endTime: schedule.endTime
  }));

  console.log('TimeSelector - Times computed:', {
    daySchedule: day.schedule,
    timesData
  });

  return timesData;
});

// Check if time selection should be automatic
const shouldAutoSelectTime = computed(() => {
  const shouldAuto = props.shippingData?.isTehran && !props.shippingData?.hasVisibleSchedules;
  console.log('TimeSelector - shouldAutoSelectTime:', {
    isTehran: props.shippingData?.isTehran,
    hasVisibleSchedules: props.shippingData?.hasVisibleSchedules,
    shouldAuto
  });
  return shouldAuto;
});

const handleDaySelect = (dayData: ShippingDay) => {
  console.log('TimeSelector - Day selected:', {
    dayData,
    shouldAutoSelectTime: shouldAutoSelectTime.value,
    scheduleLength: dayData.schedule.length
  });

  selectedDay.value = dayData.datetime;
  selectedTime.value = null;

  // Only auto-select if it's Tehran with no visible schedules AND user manually selected a day
  if (shouldAutoSelectTime.value && dayData.schedule.length > 0) {
    const firstSchedule = dayData.schedule[0];
    console.log('TimeSelector - Auto-selecting time:', {
      firstSchedule,
      timeRange: `${firstSchedule.startTime}-${firstSchedule.endTime}`
    });

    selectedTime.value = `${firstSchedule.startTime}-${firstSchedule.endTime}`;

    // Emit the schedule selection immediately
    console.log('TimeSelector - Emitting scheduleSelected:', firstSchedule.id);
    emit("scheduleSelected", firstSchedule.id);

    // Also emit the combined value
    const value = `${dayData.datetime}T${firstSchedule.startTime}-${firstSchedule.endTime}`;
    console.log('TimeSelector - Emitting modelValue:', value);
    emit("update:modelValue", value);
  }
};

const handleTimeSelect = (timeData: any) => {
  console.log('TimeSelector - Time selected manually:', timeData);
  selectedTime.value = timeData.timeRange;
  updateValue(timeData.id);
};

const updateValue = (scheduleId: number) => {
  console.log('TimeSelector - updateValue called:', {
    selectedDay: selectedDay.value,
    selectedTime: selectedTime.value,
    scheduleId
  });

  if (selectedDay.value && selectedTime.value) {
    const value = `${selectedDay.value}T${selectedTime.value}`;
    console.log('TimeSelector - Emitting from updateValue:', { value, scheduleId });
    emit("update:modelValue", value);
    emit("scheduleSelected", scheduleId);
  }
};

// Watch for changes in shipping data to reset selections
watch(() => props.shippingData, () => {


  selectedDay.value = null;
  selectedTime.value = null;
});

// Watch for changes in selections
watch([selectedDay, selectedTime], ([newDay, newTime], [oldDay, oldTime]) => {
  console.log('TimeSelector - Selection changed:', {
    day: { old: oldDay, new: newDay },
    time: { old: oldTime, new: newTime }
  });
});
</script>

<template>
  <div class="time-selector">
    <!-- Step 1: Day Selection -->
    <div class="step day-selection" :class="{ 'step-completed': selectedDay }">
      <h3 class="step-title">انتخاب روز </h3>
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

    <!-- Step 2: Time Selection - Only show if not auto-selecting -->
    <div v-if="selectedDay && !shouldAutoSelectTime" class="step time-selection">
      <h3 class="step-title">انتخاب زمان </h3>
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

    <!-- Show selected time for Tehran auto-selection -->
    <div v-if="selectedDay && shouldAutoSelectTime && selectedTime" class="step auto-selected-time">
      <v-chip color="primary" variant="text" size="large">
        {{ selectedTime }}
      </v-chip>
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

  .auto-selected-time {
    .step-title {
      color: var(--v-primary-base);
      margin-bottom: 0.5rem;
    }
  }
}
</style>
