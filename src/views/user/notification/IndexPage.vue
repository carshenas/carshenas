<script setup lang="ts">
import { ref } from 'vue';
import type Notification from "@/types/dto/notification";

const Notif = ref<Notification[]>([
    {
        id: 1,
        title: "آپدیت",
        desc: "به سادگی و بدون نیاز به طی کردن مراحل پیچیده، می‌توانید در چند دقیقه پول موجود در حساب بانکینوی خود را به صندوق سرمایه‌گذاری منتقل کرده و تا 25 درصد (سالیانه) سود دریافت کنید.",
        date: "اسفند ۱۳۰۲"
    }
])

</script>
<template>
    <section class="pa-4 d-flex flex-column ga-8 h-screen">
        <div class="w-100 d-flex align-center justify-space-between">
            <v-btn icon="arrow_forward_ios" variant="text" @click="$router.go(-1)" />
            <h1>{{ $t('profile.notification') }}</h1>
            <v-btn icon="" variant="text" />
        </div>

        <div v-for="(notification, index) in Notif" :key="index">
            <v-card class="mx-auto w-100 pa-2">
                <div class="d-flex align-center justify-space-between">
                    <span>{{ notification.title }}</span>
                    <span>{{ notification.date }}</span>
                </div>
                <v-card-text class="title-md">{{ notification.desc }}</v-card-text>
            </v-card>
        </div>
    </section>

</template>