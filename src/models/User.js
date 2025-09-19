import db from "../server/db/db.js";

export class User {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // ตรวจสอบว่าฟังก์ชันนี้ทำงานถูกต้องหรือไม่
  static async findByEmailAndPassword(email, password_hash) {
    try {
      const user = await db.get(
        `SELECT * FROM users WHERE email = ? AND password_hash = ?`,
        [email, password_hash]
      );

      console.log("Database lookup result:", user ? "User found" : "User not found");

      return user;
    } catch (error) {
      console.error("Error in findByEmailAndPassword:", error);
      throw error;
    }
  }

  static create(userData) {
    return new Promise((resolve, reject) => {
      const { email, password_hash, first_name, last_name, phone_number, role } = userData;
      db.run(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role) VALUES (?, ?, ?, ?, ?, ?)`,
        [email, password_hash, first_name, last_name, phone_number, role],
        function (err) {
          if (err) reject(err);
          else resolve(this);
        }
      );
    });
  }

  static getBookings(userId) {
    return new Promise((resolve, reject) => {
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
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}