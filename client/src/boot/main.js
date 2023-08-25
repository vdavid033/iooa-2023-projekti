import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import { useSessionStore } from '../stores/store';
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'

const app = createApp(App).use(Quasar, quasarUserOptions);

// Add Axios as a global object to use it throughout the application
app.config.globalProperties.$axios = axios;

// Initialize Pinia store
const pinia = createPinia();
app.use(pinia);

// Check if the user is logged in when the app starts
const sessionStore = useSessionStore();
const loggedIn = localStorage.getItem('prijavljen');
const user = JSON.parse(localStorage.getItem('korisnik'));
if (loggedIn && user) {
  sessionStore.login(user);
}

app.use(router);
app.mount('#app');
