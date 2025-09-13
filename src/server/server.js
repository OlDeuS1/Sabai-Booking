import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./db/db.js"; // import SQLite

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// API ดึง user ทั้งหมด
app.get("/api/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Register API

import crypto from "crypto";

app.post("/api/register", (req, res) => {
  const { first_name, last_name, email, password, phone_number, role } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (user) return res.status(409).json({ error: "Email already registered" });
    // Hash password
    const password_hash = crypto.createHash("sha256").update(password).digest("hex");
    db.run(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role) VALUES (?, ?, ?, ?, ?, ?)`,
      [email, password_hash, first_name, last_name, phone_number || null, role || "user"],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ user_id: this.lastID, first_name, last_name, email, role: role || "user" });
      }
    );
  });
});

// Login API

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }
  const password_hash = crypto.createHash("sha256").update(password).digest("hex");
  db.get(
    "SELECT user_id, first_name, last_name, email, role FROM users WHERE email = ? AND password_hash = ?",
    [email, password_hash],
    (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });
      // ถ้า login สำเร็จ set cookie userId
      res.cookie("userId", user.user_id, { httpOnly: true });
      res.json(user);
    }
  );
});

// Middleware ตรวจสอบการ login ด้วย cookie
function checkLogin(req, res, next) {
  if (req.cookies && req.cookies.userId) {
    next();
  } else {
    res.status(401).json({ message: "กรุณา login ก่อนใช้งาน" });
  }
}

// ตัวอย่าง route ที่ต้อง login
app.get("/api/profile", checkLogin, (req, res) => {
  res.json({ message: "คุณ login แล้ว", userId: req.cookies.userId });
});


// API ดึงข้อมูลโรงแรมทั้งหมด
// API ดึงข้อมูลโรงแรมทั้งหมด พร้อมรูปภาพหลักและค่าเฉลี่ย rating
app.get("/api/hotels", (req, res) => {
  const sql = `
    SELECT h.hotel_id, h.hotel_name, h.description, h.address, h.city, h.country, h.star_rating, h.contact_phone, h.contact_email,
           h.status, h.amenities,
           AVG(r.rating) AS avg_rating,
           COUNT(r.rating_id) AS review_count
    FROM hotels h
    LEFT JOIN ratings r ON r.hotel_id = h.hotel_id
    WHERE h.status = 'approved'
    GROUP BY h.hotel_id
    ORDER BY h.hotel_id DESC
  `;
  db.all(sql, [], (err, hotels) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    // ดึงรูปภาพทั้งหมดของแต่ละโรงแรม
    const hotelIds = hotels.map(h => h.hotel_id);
    if (hotelIds.length === 0) return res.json([]);
    const imgSql = `SELECT hotel_id, image_url FROM hotel_images WHERE hotel_id IN (${hotelIds.map(() => '?').join(',')})`;
    db.all(imgSql, hotelIds, (imgErr, images) => {
      if (imgErr) {
        console.error(imgErr);
        return res.status(500).json({ error: imgErr.message });
      }
      // รวมรูปภาพเข้าแต่ละโรงแรม
      const imagesByHotel = {};
      images.forEach(img => {
        if (!imagesByHotel[img.hotel_id]) imagesByHotel[img.hotel_id] = [];
        imagesByHotel[img.hotel_id].push(img.image_url);
      });
      const hotelsWithImages = hotels.map(hotel => ({
        ...hotel,
        image_urls: imagesByHotel[hotel.hotel_id] || []
      }));
      res.json(hotelsWithImages);
    });
  });
});


// API ดึงข้อมูลห้องของแต่ละโรงแรม
app.get("/api/hotel/:hotelId/rooms", (req, res) => {
  const hotelId = req.params.hotelId;
  const sql = `
    SELECT r.room_id, r.room_type, r.price_per_night, r.max_guests, r.beds, r.quantity
    FROM rooms r
    WHERE r.hotel_id = ?
    ORDER BY r.room_id ASC
  `;
  db.all(sql, [hotelId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);

// API ดึงข้อมูลประวัติการจองของผู้ใช้
app.get("/api/user/:userId/bookings", (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT b.booking_id, b.check_in_date, b.check_out_date, b.num_guests, b.total_price, b.booking_status,
           b.created_at, h.hotel_id, h.hotel_name, r.room_id, r.room_type
    FROM bookings b
    JOIN hotels h ON b.hotel_id = h.hotel_id
    JOIN rooms r ON b.room_id = r.room_id
    WHERE b.user_id = ?
    ORDER BY b.created_at DESC
  `;
  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});