import db from "../server/db/db.js";

export class Payment {
  static async create(paymentData) {
    try {
      const {
        booking_id,
        amount,
        payment_method = 'PromptPay',
        payment_status = 'completed'
      } = paymentData;

      const sql = `
        INSERT INTO payments (booking_id, amount, payment_method, payment_status)
        VALUES ($1, $2, $3, $4)
        RETURNING payment_id, payment_date
      `;

      const result = await db.query(
        sql,
        [booking_id, amount, payment_method, payment_status]
      );
      
      const row = result.rows[0];
      return {
        payment_id: row.payment_id,
        booking_id,
        amount,
        payment_method,
        payment_status,
        payment_date: row.payment_date
      };
    } catch (err) {
      throw err;
    }
  }

  static async findByBookingId(bookingId) {
    try {
      const sql = `
        SELECT * FROM payments WHERE booking_id = $1
      `;
      
      const result = await db.query(sql, [bookingId]);
      return result.rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  static async updateStatus(paymentId, status) {
    try {
      const sql = `
        UPDATE payments 
        SET payment_status = $1, payment_date = CURRENT_TIMESTAMP 
        WHERE payment_id = $2
      `;
      
      const result = await db.query(sql, [status, paymentId]);
      return { payment_id: paymentId, payment_status: status };
    } catch (err) {
      throw err;
    }
  }

  static async getAll() {
    try {
      const sql = `
        SELECT p.*, b.user_id, h.hotel_name, u.first_name, u.last_name
        FROM payments p
        JOIN bookings b ON p.booking_id = b.booking_id
        JOIN hotels h ON b.hotel_id = h.hotel_id
        JOIN users u ON b.user_id = u.user_id
        ORDER BY p.payment_date DESC
      `;
      
      const result = await db.query(sql);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }
}