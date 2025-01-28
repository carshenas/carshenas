import type { RouteRecordRaw } from "vue-router";
import i18n from "@/plugins/i18n";

const { t } = i18n.global;

export default {
  path: "/checkout",
  children: [
    {
      name: "CheckoutPage",
      path: "",
      component: () => import("@/views/checkout/IndexPage.vue"),
    },
    {
      name: "PaymentResultPage",
      path: "payment-result",
      component: () => import("@/views/checkout/PaymentResultPage.vue"),
    },
  ],
} as RouteRecordRaw;
