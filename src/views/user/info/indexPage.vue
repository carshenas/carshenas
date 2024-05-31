<script setup lang="ts">
</script>
<template>
    <section class="pa-4 d-flex flex-column ga-8 h-100">
        <div class="w-100 d-flex align-center justify-space-between">
            <v-btn icon="arrow_forward_ios" variant="text" @click="$router.go(-1)" />
            <h1>{{ $t('profile.userInfo') }}</h1>
            <v-btn icon="" variant="text" />
        </div>
        <v-form class="flex-grow-1 d-flex flex-column justify-space-between">

            <div>
                <v-text-field :label="$t('profile.name')" variant="outlined"></v-text-field>
                <v-text-field :label="$t('profile.lastName')" variant="outlined"></v-text-field>
                <v-text-field :label="$t('profile.phoneNumber')" variant="outlined"></v-text-field>
                <v-text-field :label="$t('profile.nationalCode')" variant="outlined"></v-text-field>
            </div>

            <div>
                <v-btn block rounded="pill" color="primary" size="x-large" hide-details>
                    {{ $t('shared.submit') }}
                </v-btn>
            </div>
        </v-form>
    </section>

</template>