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
app.post("/api/hotels", HotelController.createHotel);
app.get("/api/hotel/:hotelId/rooms", HotelController.getHotelRooms);
app.get("/api/hotels/admin", HotelController.getAllHotelAdminData);
app.get("/api/hotels/owner/:ownerId", HotelController.getHotelsByOwnerId);
app.get("/api/hotels/:hotelId", HotelController.getHotelById);
app.put("/api/hotels/:hotelId", HotelController.updateHotel);
app.put("/api/hotels/:hotelId/status", HotelController.updateHotelStatus);
app.delete("/api/hotels/:hotelId", HotelController.deleteHotel);

// Booking Routes
app.post("/api/bookings", BookingController.createBooking);
app.get("/api/booking/:bookingId", BookingController.getBookingById);
app.get("/api/hotel/:hotelId/bookings", BookingController.getHotelBookings);
app.put("/api/booking/:bookingId/status", BookingController.updateBookingStatus);
app.post("/api/bookings/cancel-expired", async (req, res) => {
  try {
    const cancelledCount = await Booking.cancelExpiredBookings();
    res.json({ 
      success: true,
      message: `Cancelled ${cancelledCount} expired bookings`,
      cancelled_count: cancelledCount 
    });
  } catch (error) {
    console.error('Error cancelling expired bookings:', error);
    res.status(500).json({ error: 'Failed to cancel expired bookings' });
  }
});

// API สำหรับดูการจองที่กำลังจะหมดอายุ
app.get("/api/bookings/pending-expiry", async (req, res) => {
  try {
    const pendingBookings = await Booking.getPendingBookingsWithExpiry();
    res.json({
      success: true,
      bookings: pendingBookings,
      count: pendingBookings.length
    });
  } catch (error) {
    console.error('Error getting pending bookings:', error);
    res.status(500).json({ error: 'Failed to get pending bookings' });
  }
});

// API สำหรับดูการจองที่ใกล้หมดอายุ (เร่งด่วน)
app.get("/api/bookings/urgent", async (req, res) => {
  try {
    const urgentBookings = await Booking.getUrgentBookings();
    res.json({
      success: true,
      urgent_bookings: urgentBookings,
      count: urgentBookings.length
    });
  } catch (error) {
    console.error('Error getting urgent bookings:', error);
    res.status(500).json({ error: 'Failed to get urgent bookings' });
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

// Auto-cancel expired bookings ทุก 30 วินาที และ auto-complete checkout ทุก 1 นาที
let intervalCount = 0;

setInterval(async () => {
  try {
    intervalCount++;
    
    // ยกเลิกการจองที่หมดอายุการชำระเงิน (ทุก 30 วินาที)
    const cancelledCount = await Booking.cancelExpiredBookings();
    
    // ตรวจสอบการจองที่ใกล้หมดอายุทุก 30 วินาที
    const urgentBookings = await Booking.getUrgentBookings();
    if (urgentBookings.length > 0) {
      console.log(`⚠️  ${urgentBookings.length} bookings expiring soon:`, 
        urgentBookings.map(b => `ID:${b.booking_id} (${b.minutes_remaining}min left)`)
      );
    }
    
    // อัพเดทการจองที่หมดวันที่ checkout เป็น completed (ทุก 2 นาที)
    if (intervalCount % 4 === 0) { // 4 * 30s = 120s = 2min
      await Booking.completeExpiredCheckouts();
    }
    
  } catch (error) {
    console.error('Error in auto-update bookings:', error);
  }
}, 30000); // ตรวจสอบทุก 30 วินาที

// Start server
app.listen(3000, async () => {
  console.log("🚀 Server running at http://localhost:3000");
  console.log("📋 Booking expiry system: 15 minutes timeout");
  console.log("⏰ Auto-check interval: every 30 seconds");
  
  // ตรวจสอบการจองที่หมดอายุและการจองที่ควร completed เมื่อเริ่มเซิร์ฟเวอร์
  try {
    const cancelledCount = await Booking.cancelExpiredBookings();
    const pendingBookings = await Booking.getPendingBookingsWithExpiry();
    const urgentBookings = await Booking.getUrgentBookings();
    
    console.log(`📊 Startup booking status:`);
    console.log(`   - Cancelled expired: ${cancelledCount}`);
    console.log(`   - Currently pending: ${pendingBookings.length}`);
    console.log(`   - Urgent (< 5min): ${urgentBookings.length}`);
    
    if (urgentBookings.length > 0) {
      console.log(`⚠️  Urgent bookings:`, urgentBookings.map(b => 
        `ID:${b.booking_id} (${b.minutes_remaining}min left)`
      ));
    }
    
    await Booking.completeExpiredCheckouts();
  } catch (error) {
    console.error('Error during startup booking check:', error);
  }
});