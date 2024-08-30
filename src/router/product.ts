import type { RouteRecordRaw } from "vue-router";

export default {
  path: "/product",
  children: [
    {
      name: "ProductsPage",
      path: "",
      component: () => import("@/views/product/list/IndexPage.vue"),
    },
    {
      name: "ProductDetailPage",
      path: ":id(\\d+)",
      component: () => import("@/views/product/indexPage.vue"),
    },
  ],
} as RouteRecordRaw;
