import { createRouter, createWebHistory } from 'vue-router';
import { usePreviousRoute } from '../composables/usePrevRoute';
import Home from '../views/Home.vue'
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Search from '../views/Search.vue';
import HotelDetail from '../views/HotelDetail.vue';
import Payment from '../views/Payment.vue';
import History from '../views/History.vue';
import Admin from '../views/AdminManagement.vue';
import HistoryBooking_Admin from '../views/HistoryBooking_Admin.vue';
import axios from 'axios';
import AdminHotel from '../views/AdminHotel.vue';
import hotelcreate from '../views/CreateHotel_AdminHotel.vue';
import EditHotel from '../views/EditHotel_AdminHotel.vue';
import HotelBookings from '../views/HotelBookingAction.vue';

const routes = [
  { path: "", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/search", component: Search, name: "search" },
  { path: "/hotels/:id", component: HotelDetail, name: "hotel-detail" },
  { path: "/payment/:booking_id", component: Payment, name: "payment" },
  { path: "/historyBooking", component: History },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: { requiresAuth: true, roles: ["admin"] }, // ต้องล็อกอิน + role=admin
  },
  {
    path: "/admin/history-booking/:userId",
    component: HistoryBooking_Admin,
    name: "HistoryBooking_Admin",
    meta: { requiresAuth: true, roles: ["admin"] }, // เพิ่ม meta สำหรับป้องกัน
  },
  {
    path: "/hotel-management",
    component: AdminHotel,
    name: "AdminHotel",
    meta: { requiresAuth: true, roles: ["admin", "hotel"] }, // ต้องล็อกอิน + role=admin
  },
  {
    path: "/hotel-management/create",
    component: hotelcreate,
    name: "CreateHotel",
    meta: { requiresAuth: true, roles: ["admin", "hotel"] },
  },
  {
    path: "/hotel-management/:hotelId/edit",
    component: EditHotel,
    name: "EditHotel",
    meta: { requiresAuth: true, roles: ["admin", "hotel"] },
  },
  {
    path: "/hotel-management/:hotelId/bookings",
    component: HotelBookings,
    name: "HotelBookings",
    meta: { requiresAuth: true, roles: ["admin", "hotel"] },
  },
  {
    path: "/hotel-management/:hotelId/delete",
    component: hotelcreate,
    name: "DeleteHotel",
    meta: { requiresAuth: true, roles: ["admin", "hotel"] },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const { setPreviousRoute } = usePreviousRoute()

// Navigation Guard สำหรับตรวจสอบสิทธิ์การเข้าถึง
router.beforeEach(async (to, from, next) => {
  setPreviousRoute(from.fullPath)
  // ตรวจสอบว่าเส้นทางต้องการการยืนยันตัวตนหรือไม่
  if (to.matched.some(record => record.meta.requiresAuth)) {
    try {
      // เรียก API เพื่อตรวจสอบผู้ใช้ปัจจุบัน
      const response = await axios.get('http://localhost:3000/api/current-user', {
        withCredentials: true
      });
      
      const user = response.data;
      
      // ตรวจสอบว่าผู้ใช้มีสิทธิ์เข้าถึงหรือไม่
      if (to.meta.roles && !to.meta.roles.includes(user.role)) {
        // ถ้าไม่มีสิทธิ์ ให้กลับไปหน้าแรก
        alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
        next('/');
        return;
      }
      
      // ถ้าผ่านการตรวจสอบทั้งหมด ให้ไปต่อ
      next();
    } catch (error) {
      // ถ้าไม่ได้ล็อกอินหรือมีข้อผิดพลาด ให้ไปหน้า login
      console.log('Authentication failed:', error.response?.data?.error || error.message);
      alert('กรุณาเข้าสู่ระบบก่อนเข้าใช้งาน');
      next('/login');
    }
  } else {
    // ถ้าไม่ต้องการการยืนยันตัวตน ให้ไปต่อได้เลย
    next();
  }
});

export default router;
