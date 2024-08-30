import type { RouteRecordRaw } from "vue-router";

export default {
  name: "AuthPage",
  path: "/authentication",
  component: () => import("@/views/user/auth/IndexPage.vue"),
} as RouteRecordRaw;
