<script lang="ts" setup></script>

<template>
    <v-container class=" align-right text-right">
        <h1 class="title-lg mb-4">{{ $t("contactUs.title") }}</h1>
        <p class="body-md mb-6">{{ $t("contactUs.subtitle") }}</p>

        <div class="text-right">
            <p class="body-md mt-4">
                <strong>{{ $t("contactUs.emailLabel") }}:</strong>
                <a href="mailto:carshenas.shop@gmail.com">carshenas.shop@gmail.com</a>
            </p>
            <p class="body-md">
                <strong>{{ $t("contactUs.phoneLabel") }}:</strong>
                <a href="tel:09981519031">09981519031</a>
            </p>
            <p class="body-md">
                <strong>{{ $t("contactUs.phoneLabel") }}:</strong>
                <a href="tel:02166027625">66027625-021</a>
            </p>
            <p class="body-md">
                <strong>{{ $t("contactUs.addressLabel") }}:</strong>
                <span>خیابان آزادی - خیابان حبیب الهی -کوچه درودی - پلاک ۱۹</span>
            </p>
            <p class="body-md">
                <strong>تلگرام:</strong>
                <a href="https://t.me/CarshenasShopBot">@CarshenasShopBot</a>
            </p>
        </div>
    </v-container>
</template>

<style scoped>
p {
    margin-top: 16px;
}
</style>
