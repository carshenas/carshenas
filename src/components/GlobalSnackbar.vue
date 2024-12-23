<script setup lang="ts">
import { useSnackbar } from '@/stores/snackbar'

const snackbar = useSnackbar()
</script>

<template>
  <v-snackbar
    v-model="snackbar.isVisible"
    :timeout="snackbar.current?.config.timeout"
    :location="snackbar.current?.config.location"
    :color="snackbar.current?.config.color"
    :vertical="snackbar.current?.config.vertical"
    :max-width="snackbar.current?.config.maxWidth"
    :onAfterLeave="snackbar.onAfterLeave"
    @click="snackbar.onClick"
  >
    <template #text v-if="snackbar.current">
      <span :class="['user-select-none', snackbar.current.config.textClass]">
        {{ snackbar.current.text }}
      </span>
    </template>

    <template
      #actions
      v-if="snackbar.current && snackbar.current.config.action"
    >
      <v-btn
        v-bind="{ ...snackbar.current.config.action, onClick: undefined }"
        @click.stop="snackbar.onActionClick"
      />
    </template>
  </v-snackbar>
</template>
