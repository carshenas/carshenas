import { createRouter, createWebHistory } from "vue-router";
import product from "./product";
import checkout from "./checkout";
import user from "./user";
import search from "./search";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "HomePage",
      path: "/",
      component: () => import("@/views/home/IndexPage.vue"),
    },
    search,
    product,
    checkout,
    user,
    {
      path: "/:pathMatch(.*)*",
      name: "NotFoundPage",
      component: () => import("@/views/NotFoundPage.vue"),
    },
  ],
});

export default router;
