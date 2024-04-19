<template>
  <v-container>
    <h1 class="title-md">{{ $t('auth.login') }}</h1>

    <p class="body-lg mt-4">{{ $t('auth.enterPhone') }}</p>

    <v-text-field :label="$t('shared.phone')" class="mt-4" />

    <v-btn block>{{ $t('auth.login') }}</v-btn>
  </v-container>
</template>
