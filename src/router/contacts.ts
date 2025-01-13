import type { RouteRecordRaw } from "vue-router";

export default {
  name: "ContactUs",
  path: "/contacts",
  component: () => import("@/views/contacts/IndexPage.vue"),
} as RouteRecordRaw;
