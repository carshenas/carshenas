<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
</script>

<template>
  <section class="pa-4 d-flex flex-column ga-8">
    <div class="d-flex justify-space-between w-100">
      <div class="d-flex">
        <span> {{ user.firstName }} </span>
        <v-btn variant="text" class="pa-0" size="x-small" color="primary" to="/user/info">
          <v-icon icon="edit" />
        </v-btn>
      </div>
      <span class="title-sm">
        {{ user.phoneNumber }}
      </span>
    </div>

    <div class="w-100 bg-primary divider"></div>
    <v-list class="d-flex flex-column ga-6">
      <v-list-item class="pa-0" to="/user/addresses">
        <div class="d-flex w-100 justify-space-between">
          <div class="d-flex ga-2">
            <v-icon icon="location_on" color="primary" />
            <span>
              {{ $t('profile.addresses') }}
            </span>
          </div>
          <v-icon icon="arrow_back_ios" color="primary" />
        </div>
      </v-list-item>
      <v-list-item class="pa-0" to="/user/orders">
        <div class="d-flex w-100 justify-space-between">
          <div class="d-flex ga-2">
            <v-icon icon="outbox" color="primary" />
            <span>
              {{ $t('profile.orders') }}
            </span>
          </div>
          <v-icon icon="arrow_back_ios" color="primary" />
        </div>
      </v-list-item>

      <v-list-item class="pa-0" to="/user/car-support">
        <div class="d-flex w-100 justify-space-between">
          <div class="d-flex ga-2">
            <v-icon icon="chat" color="primary" />
            <span>
              {{ $t('profile.support') }}
            </span>
          </div>
          <v-icon icon="arrow_back_ios" color="primary" />
        </div>
      </v-list-item>
      <v-list-item class="pa-0" to="/user/notifications">
        <div class="d-flex w-100 justify-space-between">
          <div class="d-flex ga-2">
            <v-icon icon="notifications" color="primary" />
            <span>
              {{ $t('profile.notification') }}
            </span>
          </div>
          <v-icon icon="arrow_back_ios" color="primary" />
        </div>
      </v-list-item>
    </v-list>
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
