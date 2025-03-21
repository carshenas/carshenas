import type { RouteRecordRaw } from "vue-router";
import i18n from "@/plugins/i18n";

const { t } = i18n.global;

export default {
  path: "/user",
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      name: "UserProfilePage",
      path: "",
      component: () => import("@/views/user/profile/IndexPage.vue"),
      meta: {
        title: t("user.title"),
        layout: "SimpleHeader",
      },
    },
    {
      name: "UserAddressPage",
      path: "addresses",
      component: () => import("@/views/user/addresses/IndexPage.vue"),
    },
    {
      name: "UserOrderPage",
      path: "orders",
      component: () => import("@/views/user/orders/IndexPage.vue"),
    },
    {
      name: "UserSupportPage",
      path: "support",
      component: () => import("@/views/user/support/IndexPage.vue"),
    },
    // {
    //   name: "UserNotificationPage",
    //   path: "notifications",
    //   component: () => import("@/views/user/notification/IndexPage.vue"),
    // },
  ],
} as RouteRecordRaw;
