import db from "../server/db/db.js";

export class Rating {
  // สร้าง rating ใหม่
  static async create(ratingData) {
    try {
      const {
        booking_id,
        user_id,
        hotel_id,
        rating
      } = ratingData;

      // ตรวจสอบว่าได้ให้ rating แล้วหรือยัง
      const checkSql = `SELECT rating_id FROM ratings WHERE booking_id = $1`;
      const checkResult = await db.query(checkSql, [booking_id]);
      
      if (checkResult.rows.length > 0) {
        throw new Error('Rating already exists for this booking');
      }

      // สร้าง rating ใหม่
      const insertSql = `
        INSERT INTO ratings (booking_id, user_id, hotel_id, rating)
        VALUES ($1, $2, $3, $4)
        RETURNING rating_id, created_at
      `;

      const result = await db.query(insertSql, [booking_id, user_id, hotel_id, rating]);
      const row = result.rows[0];
      
      return {
        rating_id: row.rating_id,
        booking_id,
        user_id,
        hotel_id,
        rating,
        created_at: row.created_at
      };
    } catch (err) {
      throw err;
    }
  }

  // ดึง rating ตาม booking_id
  static async findByBookingId(bookingId) {
    try {
      const sql = `
        SELECT r.*, u.first_name, u.last_name, h.hotel_name
        FROM ratings r
        JOIN users u ON r.user_id = u.user_id
        JOIN hotels h ON r.hotel_id = h.hotel_id
        WHERE r.booking_id = $1
      `;

      const result = await db.query(sql, [bookingId]);
      return result.rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  // ดึง rating ทั้งหมดของโรงแรม
  static async findByHotelId(hotelId) {
    try {
      const sql = `
        SELECT r.*, u.first_name, u.last_name
        FROM ratings r
        JOIN users u ON r.user_id = u.user_id
        WHERE r.hotel_id = $1
        ORDER BY r.created_at DESC
      `;

      const result = await db.query(sql, [hotelId]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  // คำนวณคะแนนเฉลี่ยของโรงแรม
  static async getAverageRating(hotelId) {
    try {
      const sql = `
        SELECT AVG(rating) as average_rating, COUNT(*) as total_ratings
        FROM ratings
        WHERE hotel_id = $1
      `;

      const result = await db.query(sql, [hotelId]);
      const row = result.rows[0];
      
      return {
        average_rating: row.average_rating ? parseFloat(row.average_rating.toFixed(1)) : 0,
        total_ratings: parseInt(row.total_ratings) || 0
      };
    } catch (err) {
      throw err;
    }
  }

  // ดึง rating ทั้งหมด
  static async getAll() {
    try {
      const sql = `
        SELECT r.*, u.first_name, u.last_name, h.hotel_name
        FROM ratings r
        JOIN users u ON r.user_id = u.user_id
        JOIN hotels h ON r.hotel_id = h.hotel_id
        ORDER BY r.created_at DESC
      `;

      const result = await db.query(sql);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }
}