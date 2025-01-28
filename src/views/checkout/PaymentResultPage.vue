<script lang="ts" setup>
import { useRoute } from "vue-router";

const {
  query: { isSuccess, "tracking-code": trackingCode },
} = useRoute();
</script>
<template>
  <v-container>
    <v-card
      class="pa-4 mx-auto d-flex flex-column justify-center align-center"
      max-width="300"
    >
      <v-icon
        icon="check_circle"
        size="100"
        :color="isSuccess === 'true' ? 'success' : 'error'"
        class="mb-4"
      />

      <h1 class="mb-4 body-lg">
        {{
          isSuccess === "true"
            ? $t("checkout.paymentSuccess")
            : $t("checkout.paymentError")
        }}
      </h1>

      <p class="mb-4 body-md text-outline">
        {{
          isSuccess === "true"
            ? $t("checkout.paymentSuccessMessage")
            : $t("checkout.paymentErrorMessage")
        }}
      </p>

      <p v-if="trackingCode" class="mb-4 label-lg">
        {{ `${$t("checkout.trackingCode")} : ${trackingCode}` }}
      </p>

      <v-btn color="primary" to="/" density="compact" block>{{
        $t("shared.goToHome")
      }}</v-btn>
    </v-card>
  </v-container>
</template>
