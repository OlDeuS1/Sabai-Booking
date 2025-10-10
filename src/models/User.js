import db from "../server/db/db.js";

export class User {
  static async getAll() {
    try {
      const result = await db.query("SELECT * FROM users");
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  static async getNormalUsers() {
    try {
      const result = await db.query("SELECT * FROM users WHERE role = 'user'");
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  static async findByEmail(email) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      return result.rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  static async findById(userId) {
    try {
      const result = await db.query("SELECT * FROM users WHERE user_id = $1", [userId]);
      return result.rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  static async findByEmailAndPassword(email, password_hash) {
    try {
      const result = await db.query(
        "SELECT * FROM users WHERE email = $1 AND password_hash = $2",
        [email, password_hash]
      );
      const user = result.rows[0] || null;
      console.log(
        "Database lookup result:",
        user ? "User found" : "User not found"
      );
      return user;
    } catch (err) {
      console.error("Error in findByEmailAndPassword:", err);
      throw err;
    }
  }

  static async create(userData) {
    try {
      const {
        email,
        password_hash,
        first_name,
        last_name,
        phone_number,
        role,
      } = userData;
      const sql = `INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role) 
                   VALUES ($1, $2, $3, $4, $5, $6) 
                   RETURNING user_id, created_at`;
      const result = await db.query(
        sql,
        [email, password_hash, first_name, last_name, phone_number, role]
      );
      const row = result.rows[0];
      return {
        user_id: row.user_id,
        email,
        first_name,
        last_name,
        phone_number,
        role,
        created_at: row.created_at
      };
    } catch (err) {
      throw err;
    }
  }

  static async getBookings(userId) {
    try {
      const sql = `
        SELECT b.booking_id, b.check_in_date, b.check_out_date, b.num_guests, b.total_price, b.booking_status,
               b.created_at, b.expires_at, h.hotel_id, h.hotel_name, r.room_id, r.room_type,
               (SELECT image_url FROM hotel_images WHERE hotel_id = h.hotel_id LIMIT 1) AS hotel_image
        FROM bookings b
        JOIN hotels h ON b.hotel_id = h.hotel_id
        JOIN rooms r ON b.room_id = r.room_id
        WHERE b.user_id = $1 AND b.booking_status != 'cancelled'
        ORDER BY b.created_at DESC
      `;
      const result = await db.query(sql, [userId]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }
}