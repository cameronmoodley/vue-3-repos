import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VeeValidatePlugin from "@/includes/validation";
import { auth } from "./includes/firebase";
import Icon from "./directives/icon";
import GlobalComponents from "./includes/_globals";
// import ProgressBar from "./includes/progress-bar";
import "nprogress/nprogress.css";

import "./assets/tailwind.css";
import "./assets/main.css";

// ProgressBar(router);

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    // Register store as a plugin and injects methods into the app
    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);
    app.use(GlobalComponents);
    app.directive("icon", Icon);
    app.mount("#app");
  }
});
