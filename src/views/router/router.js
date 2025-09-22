import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue'
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Search from '../views/Search.vue';
import HotelDetail from '../views/HotelDetail.vue';
import Payment from '../views/Payment.vue';
import History from '../views/History.vue';
import admin from '../views/AdminManagement.vue';
import HistoryBooking_Admin from '../views/HistoryBooking_Admin.vue';
import AdminHotel from '../views/AdminHotel.vue';

const routes = [
  { path: '', component: Home},
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/search', component: Search, name: 'search'},
  { path: '/hotels/:id', component: HotelDetail, name: 'hotel-detail' },
  { path: '/payment/:booking_id', component: Payment, name: 'payment' },
  { path: '/historyBooking', component: History },
  { path: '/admin', component: admin },
  { path: '/admin/history-booking/:userId', component: HistoryBooking_Admin, name: 'HistoryBooking_Admin' },
  { path: '/hotel-management', component: AdminHotel},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
