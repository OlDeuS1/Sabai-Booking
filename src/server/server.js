import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserController from "../controllers/userController.js";
import HotelController from "../controllers/hotelController.js";
import BookingController from "../controllers/bookingController.js";
import { checkLogin } from "../middleware/auth.js";

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

// Start server
app.listen(3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);