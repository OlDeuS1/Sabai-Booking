import db from "../server/db/db.js";

export class Rating {
  // สร้าง rating ใหม่
  static create(ratingData) {
    return new Promise((resolve, reject) => {
      const {
        booking_id,
        user_id,
        hotel_id,
        rating
      } = ratingData;

      // ตรวจสอบว่าได้ให้ rating แล้วหรือยัง
      const checkSql = `SELECT rating_id FROM ratings WHERE booking_id = ?`;
      
      db.get(checkSql, [booking_id], (err, existingRating) => {
        if (err) {
          reject(err);
          return;
        }

        if (existingRating) {
          reject(new Error('Rating already exists for this booking'));
          return;
        }

        // สร้าง rating ใหม่
        const insertSql = `
          INSERT INTO ratings (booking_id, user_id, hotel_id, rating)
          VALUES (?, ?, ?, ?)
        `;

        db.run(insertSql, [booking_id, user_id, hotel_id, rating], function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              rating_id: this.lastID,
              booking_id,
              user_id,
              hotel_id,
              rating,
              created_at: new Date().toISOString()
            });
          }
        });
      });
    });
  }

  // ดึง rating ตาม booking_id
  static findByBookingId(bookingId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.*, u.first_name, u.last_name, h.hotel_name
        FROM ratings r
        JOIN users u ON r.user_id = u.user_id
        JOIN hotels h ON r.hotel_id = h.hotel_id
        WHERE r.booking_id = ?
      `;

      db.get(sql, [bookingId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // ดึง rating ทั้งหมดของโรงแรม
  static findByHotelId(hotelId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.*, u.first_name, u.last_name
        FROM ratings r
        JOIN users u ON r.user_id = u.user_id
        WHERE r.hotel_id = ?
        ORDER BY r.created_at DESC
      `;

      db.all(sql, [hotelId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // คำนวณคะแนนเฉลี่ยของโรงแรม
  static getAverageRating(hotelId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT AVG(rating) as average_rating, COUNT(*) as total_ratings
        FROM ratings
        WHERE hotel_id = ?
      `;

      db.get(sql, [hotelId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            average_rating: row.average_rating ? parseFloat(row.average_rating.toFixed(1)) : 0,
            total_ratings: row.total_ratings || 0
          });
        }
      });
    });
  }

  // ดึง rating ทั้งหมด
  static getAll() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.*, u.first_name, u.last_name, h.hotel_name
        FROM ratings r
        JOIN users u ON r.user_id = u.user_id
        JOIN hotels h ON r.hotel_id = h.hotel_id
        ORDER BY r.created_at DESC
      `;

      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}