<script setup lang="ts">
import { ref } from 'vue'
import type users from "@/types/dto/users"

const user = ref<users[]>([
  {
    id: 1,
    firstName: "فرزاد",
    lastName: "جام‌بر",
    phone: "09012529729",
  }
])

</script>

<template>
  <section class="pa-4 d-flex flex-column ga-8">
    <div class="d-flex justify-space-between w-100">
      <div class="d-flex">
        <span>
          {{ user[0].firstName }} {{ user[0].lastName }}
        </span>
        <v-btn variant="text" class="pa-0" size="x-small" color="primary" to="/profile/info">
          <v-icon icon="edit" />
        </v-btn>
      </div>
      <span class="title-sm">
        {{ user[0].phone }}
      </span>
    </div>

    <div class="w-100 bg-primary divider"></div>

    <div class="d-flex w-100 justify-space-between">
      <div class="d-flex ga-2">
        <v-icon icon="location_on" color="primary" />
        <span>
          {{ $t('profile.addresses') }}
        </span>
      </div>
      <v-icon icon="arrow_back_ios" color="primary" />
    </div>

    <div class="d-flex w-100 justify-space-between">
      <div class="d-flex ga-2">
        <v-icon icon="outbox" color="primary" />
        <span>
          {{ $t('profile.orders') }}
        </span>
      </div>
      <v-icon icon="arrow_back_ios" color="primary" />
    </div>

    <div class="d-flex w-100 justify-space-between">
      <div class="d-flex ga-2">
        <v-icon icon="chat" color="primary" />
        <span>
          {{ $t('profile.support') }}
        </span>
      </div>
      <v-icon icon="arrow_back_ios" color="primary" />
    </div>

    <div class="d-flex w-100 justify-space-between">
      <div class="d-flex ga-2">
        <v-icon icon="notifications" color="primary" />
        <span>
          {{ $t('profile.notification') }}
        </span>
      </div>
      <v-icon icon="arrow_back_ios" color="primary" />
    </div>

    <div class="w-100 bg-primary divider"></div>

    <div class="d-flex w-100 justify-space-between">
      <div class="d-flex ga-2">
        <v-icon icon="logout" color="primary" />
        <span>
          {{ $t('profile.logout') }}
        </span>
      </div>
      <v-icon icon="arrow_back_ios" color="primary" />
    </div>

  </section>
</template>

<style lang="scss" scoped>
.divider {
  height: 1px;
  opacity: 50%;
}
</style>
