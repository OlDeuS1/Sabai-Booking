import db from "../server/db/db.js";

export class Payment {
  static create(paymentData) {
    return new Promise((resolve, reject) => {
      const {
        booking_id,
        amount,
        payment_method = 'PromptPay',
        payment_status = 'completed'
      } = paymentData;

      const sql = `
        INSERT INTO payments (booking_id, amount, payment_method, payment_status)
        VALUES (?, ?, ?, ?)
        RETURNING payment_id, payment_date
      `;

      db.get(
        sql,
        [booking_id, amount, payment_method, payment_status],
        function (err, row) {
          if (err) {
            reject(err);
          } else {
            resolve({
              payment_id: row.payment_id,
              booking_id,
              amount,
              payment_method,
              payment_status,
              payment_date: row.payment_date
            });
          }
        }
      );
    });
  }

  static findByBookingId(bookingId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM payments WHERE booking_id = ?
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

  static updateStatus(paymentId, status) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE payments 
        SET payment_status = ?, payment_date = CURRENT_TIMESTAMP 
        WHERE payment_id = ?
      `;
      
      db.run(sql, [status, paymentId], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ payment_id: paymentId, payment_status: status });
        }
      });
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.*, b.user_id, h.hotel_name, u.first_name, u.last_name
        FROM payments p
        JOIN bookings b ON p.booking_id = b.booking_id
        JOIN hotels h ON b.hotel_id = h.hotel_id
        JOIN users u ON b.user_id = u.user_id
        ORDER BY p.payment_date DESC
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