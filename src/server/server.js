import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserController from "../controllers/userController.js";
import HotelController from "../controllers/hotelController.js";
import { checkLogin } from "../middleware/auth.js";

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// User Routes
app.get("/api/users", UserController.getAllUsers);
app.post("/api/register", UserController.register);
app.post("/api/login", UserController.login);
app.get("/api/profile", checkLogin, UserController.getProfile);
app.get("/api/user/:userId/bookings", UserController.getUserBookings);

// Hotel Routes
app.get("/api/hotels", HotelController.getAllHotels);
app.get("/api/hotel/:hotelId/rooms", HotelController.getHotelRooms);

// Start server
app.listen(3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);