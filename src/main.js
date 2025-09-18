
import { createApp } from 'vue';
import App from './views/App.vue';
import router from './views/router/router';
import 'flatpickr/dist/flatpickr.css';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App).use(router).use(ElementPlus).mount('#app');

