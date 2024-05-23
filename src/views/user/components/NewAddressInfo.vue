<script setup lang="ts">
import newAddressMap from './NewAddressMap.vue'
</script>
<template>
  <V-container>
    <v-form class="flex-grow-1 d-flex flex-column justify-space-between">
      <newAddressMap />

      <div>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              class="pa-1"
              :label="$t('profile.address')"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="3">
            <v-text-field
              class="pa-1"
              :label="$t('profile.plaque')"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-text-field
              class="pa-1"
              :label="$t('profile.unit')"
              variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col>
            <v-text-field
              class="pa-1"
              :label="$t('profile.postalCode')"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>

      <div>
        <v-btn block rounded="pill" color="primary" size="x-large" hide-details>
          {{ $t('shared.submit') }}
        </v-btn>
      </div>
    </v-form>
  </V-container>
</template>
