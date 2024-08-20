import type { RouteRecordRaw } from "vue-router";

export default {
  path: "/checkout",
  name: "CheckoutPage",
  component: () => import("@/views/checkout/IndexPage.vue"),
} as RouteRecordRaw;
