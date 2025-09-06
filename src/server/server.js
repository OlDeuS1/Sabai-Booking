import express from "express";
import cors from "cors";
import db from "./db/db.js"; // import SQLite

const app = express();
app.use(cors());
app.use(express.json());

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
      res.json(user);
    }
  );
});

app.listen(3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);

// // API ดึงข้อมูลโรงแรมและค่าเฉลี่ย rating
// app.get("/api/hotels/:id", (req, res) => {
//   const hotelId = req.params.id;
//   db.get("SELECT * FROM hotels WHERE hotel_id = ?", [hotelId], (err, hotel) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: err.message });
//     }
//     if (!hotel) {
//       return res.status(404).json({ error: "Hotel not found" });
//     }
//     db.get(
//       "SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE hotel_id = ?",
//       [hotelId],
//       (err2, ratingResult) => {
//         if (err2) {
//           console.error(err2);
//           return res.status(500).json({ error: err2.message });
//         }
//         hotel.avg_rating = ratingResult?.avg_rating || null;
//         hotel.review_count = ratingResult?.review_count || 0;
//         res.json(hotel);
//       }
//     );
//   });
// });
