
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import 'flatpickr/dist/flatpickr.css';
import VueCookies from 'vue-cookies'

createApp(App).use(router).use(VueCookies).mount('#app');

