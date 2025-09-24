import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserController from "../controllers/userController.js";
import HotelController from "../controllers/hotelController.js";
import BookingController from "../controllers/bookingController.js";
import PaymentController from "../controllers/paymentController.js";
import { checkLogin } from "../middleware/auth.js";
import { Booking } from "../models/Booking.js";

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5050',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// User Routes
app.get("/api/users", UserController.getAllUsers);
app.post("/api/register", UserController.register);
app.post("/api/login", UserController.login);
app.get("/api/profile", checkLogin, UserController.getProfile);
app.get("/api/current-user", UserController.getCurrentUser);
app.get("/api/user/:userId/bookings", UserController.getUserBookings);
app.post('/api/users/logout', UserController.logout); // ใช้ POST แทน
app.get("/api/user/normal", UserController.getNormalUsers);

// Hotel Routes
app.get("/api/hotels", HotelController.getAllHotels);
app.get("/api/hotel/:hotelId/rooms", HotelController.getHotelRooms);
app.get("/api/hotels/admin", HotelController.getAllHotelAdminData); // เพิ่มเส้นทางนี้

// Booking Routes
app.post("/api/bookings", BookingController.createBooking);
app.get("/api/booking/:bookingId", BookingController.getBookingById);
app.put("/api/booking/:bookingId/status", BookingController.updateBookingStatus);
app.post("/api/bookings/cancel-expired", async (req, res) => {
  try {
    const cancelledCount = await Booking.cancelExpiredBookings();
    res.json({ message: `Cancelled ${cancelledCount} expired bookings` });
  } catch (error) {
    console.error('Error cancelling expired bookings:', error);
    res.status(500).json({ error: 'Failed to cancel expired bookings' });
  }
});

// Payment Routes
app.post("/api/payments", PaymentController.createPayment);
app.get("/api/payment/booking/:bookingId", PaymentController.getPaymentByBookingId);
app.get("/api/payments", PaymentController.getAllPayments);
app.put("/api/payment/:paymentId/status", PaymentController.updatePaymentStatus);

// Auto-cancel expired bookings every minute
setInterval(async () => {
  try {
    await Booking.cancelExpiredBookings();
  } catch (error) {
    console.error('Error auto-cancelling expired bookings:', error);
  }
}, 60000); // ตรวจสอบทุก 1 นาที

// Start server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
  // ตรวจสอบการจองที่หมดอายุเมื่อเริ่มเซิร์ฟเวอร์
  Booking.cancelExpiredBookings().catch(console.error);
});