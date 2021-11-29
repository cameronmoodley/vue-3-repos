import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VeeValidatePlugin from '@/includes/validation';
import { auth } from './includes/firebase';

import './assets/tailwind.css';
import './assets/main.css';

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);
    // Register store as a plugin and injects methods into the app
    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);
    app.mount('#app');
  }
});
