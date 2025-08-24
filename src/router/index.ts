import { createRouter, createWebHistory } from "vue-router";
import product from "./product";
import checkout from "./checkout";
import user from "./user";
import search from "./search";
import contacts from "./contacts";

import { useUserStore } from "@/stores/user";

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
    contacts,
    {
      path: "/:pathMatch(.*)*",
      name: "NotFoundPage",
      component: () => import("@/views/NotFoundPage.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.isLoggedIn;

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to the login page if the user is not authenticated
    next({ name: "AuthPage", query: { redirect: to.fullPath } });
  } else {
    next(); // Allow navigation
  }
});

export default router;
