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
