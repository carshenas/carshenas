import type { RouteRecordRaw } from "vue-router";

export default {
  name: "SearchPage",
  path: "/search",
  component: () => import("../views/search/IndexPage.vue"),
  meta: {
    layout: false,
  },
} as RouteRecordRaw;
