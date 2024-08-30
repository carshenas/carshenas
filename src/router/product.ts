import type { RouteRecordRaw } from "vue-router";

export default {
  name: "ProductsPage",
  path: "/product",
  component: () => import("@/views/product/list/IndexPage.vue"),
  children: [
    {
      name: "ProductDetailPage",
      path: ":id(\\d+)",
      component: () => import("@/views/product/indexPage.vue"),
    },
  ],
} as RouteRecordRaw;
