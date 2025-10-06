import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserController from "../controllers/userController.js";
import HotelController from "../controllers/hotelController.js";
import BookingController from "../controllers/bookingController.js";
import PaymentController from "../controllers/paymentController.js";
import RatingController from "../controllers/ratingController.js";
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
app.get("/api/hotels/admin", HotelController.getAllHotelAdminData);
app.get("/api/hotels/owner/:ownerId", HotelController.getHotelsByOwnerId);
app.put("/api/hotels/:hotelId/status", HotelController.updateHotelStatus);
app.delete("/api/hotels/:hotelId", HotelController.deleteHotel);

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
app.post("/api/bookings/complete-checkouts", async (req, res) => {
  try {
    const completedCount = await Booking.completeExpiredCheckouts();
    res.json({ message: `Completed ${completedCount} bookings after checkout` });
  } catch (error) {
    console.error('Error completing expired checkouts:', error);
    res.status(500).json({ error: 'Failed to complete expired checkouts' });
  }
});

// Payment Routes
app.post("/api/payments", PaymentController.createPayment);
app.get("/api/payment/booking/:bookingId", PaymentController.getPaymentByBookingId);
app.get("/api/payments", PaymentController.getAllPayments);
app.put("/api/payment/:paymentId/status", PaymentController.updatePaymentStatus);

// Rating Routes
app.post("/api/ratings", RatingController.createRating);
app.get("/api/rating/booking/:bookingId", RatingController.getRatingByBookingId);
app.get("/api/ratings/hotel/:hotelId", RatingController.getRatingsByHotelId);
app.get("/api/hotel/:hotelId/average-rating", RatingController.getHotelAverageRating);
app.get("/api/ratings", RatingController.getAllRatings);

// Auto-cancel expired bookings และ auto-complete checkout ทุกนาที
setInterval(async () => {
  try {
    // ยกเลิกการจองที่หมดอายุการชำระเงิน
    await Booking.cancelExpiredBookings();
    
    // อัพเดทการจองที่หมดวันที่ checkout เป็น completed
    await Booking.completeExpiredCheckouts();
  } catch (error) {
    console.error('Error in auto-update bookings:', error);
  }
}, 60000); // ตรวจสอบทุก 1 นาที

// Start server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
  // ตรวจสอบการจองที่หมดอายุและการจองที่ควร completed เมื่อเริ่มเซิร์ฟเวอร์
  Booking.cancelExpiredBookings().catch(console.error);
  Booking.completeExpiredCheckouts().catch(console.error);
});