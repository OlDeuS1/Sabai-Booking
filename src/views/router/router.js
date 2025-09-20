import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue'
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Search from '../views/Search.vue';
import HotelDetail from '../views/HotelDetail.vue';
import History from '../views/History.vue';
import admin from '../views/AdminManagement.vue';
import HistoryBooking_Admin from '../views/HistoryBooking_Admin.vue';

const routes = [
  { path: '', component: Home},
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/search', component: Search, name: 'search'},
  { path: '/hotel/:id', component: HotelDetail, name: 'hotel-detail' },
  { path: '/historyBooking', component: History },
  { path: '/admin', component: admin },
  { path: '/admin/history-booking/:userId', component: HistoryBooking_Admin, name: 'HistoryBooking_Admin' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
