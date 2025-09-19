import crypto from "crypto";
import { User } from "../models/User.js";

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async register(req, res) {
    try {
      const { first_name, last_name, email, password, phone_number, role } = req.body;
      
      if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const password_hash = crypto.createHash("sha256").update(password).digest("hex");
      const userData = {
        email,
        password_hash,
        first_name,
        last_name,
        phone_number: phone_number || null,
        role: role || "user"
      };

      const newUser = await User.create(userData);
      res.status(201).json({
        user_id: newUser.lastID,
        first_name,
        last_name,
        email,
        role: role || "user"
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      console.log('Login attempt:', { email }); // ไม่ควร log password
      
      if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
      }

      const password_hash = crypto.createHash("sha256").update(password).digest("hex");
      console.log('Looking for user with email and hashed password');
      
      const user = await User.findByEmailAndPassword(email, password_hash);
      
      if (!user) {
        console.log('User not found or password incorrect');
        return res.status(401).json({ error: "Invalid credentials" });
      }

      console.log('User found:', { user_id: user.user_id, role: user.role });
      
      // ตั้งค่า cookie ให้ถูกต้อง
      res.cookie("userId", user.user_id, { 
        httpOnly: true,
        sameSite: 'Lax', // ปรับตามความเหมาะสม
        // secure: true, // เปิดใช้เมื่อใช้ HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 1 วัน
      });
      
      res.json(user);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async logout(req, res) {
    try {
      res.clearCookie("userId");
      res.json({ message: "ออกจากระบบเรียบร้อยแล้ว" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getProfile(req, res) {
    try {
      res.json({ message: "คุณ login แล้ว", userId: req.cookies.userId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserBookings(req, res) {
    try {
      const userId = req.params.userId;
      const bookings = await User.getBookings(userId);
      res.json(bookings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default UserController;