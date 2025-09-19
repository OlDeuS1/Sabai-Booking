import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue'
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Search from '../views/Search.vue';
import History from '../views/History.vue';

const routes = [
  { path: '', component: Home},
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/search', component: Search, name: 'search'},
  { path: '/historyBooking', component: History },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
