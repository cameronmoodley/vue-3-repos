import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

const Home = () => import("@/views/Home");
const About = () => import("@/views/About");
const Manage = () => import("@/views/Manage");
const Song = () => import("@/views/Song");

const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "about",
    path: "/about",
    component: About,
  },
  {
    name: "manage",
    // If you have an old page where you changed the url you can
    // add an alias it will take the page to the new path
    // Dont have to redirect
    alias: "/manage",
    path: "/manage-music",
    meta: { requiresAuth: true },
    component: Manage,
    beforeEnter: (to, from, next) => {
      console.log("Gaurd works");
      next();
    },
  },
  {
    name: "song",
    path: "/song/:id",
    component: Song,
  },
  {
    path: "/:catchAll(.*)*",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // Changes active class for a link
  linkExactActiveClass: "text-yellow-500",
});

router.beforeEach((to, from, next) => {
  // console.log(to.matched);
  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
    return;
  }

  if (store.state.auth.userLoggedIn) {
    next();
  } else {
    next({ name: "home" });
  }
});

export default router;
