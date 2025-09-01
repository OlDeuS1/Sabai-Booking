import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue'
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import User from '../components/User.vue';

const routes = [
  { path: '', component: Home},
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/users', component: User },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
