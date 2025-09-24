import db from "../server/db/db.js";

export class Booking {
  static create(bookingData) {
    return new Promise((resolve, reject) => {
      const {
        user_id,
        room_id,
        hotel_id,
        check_in_date,
        check_out_date,
        num_guests,
        total_price,
        booking_status = 'pending'
      } = bookingData;

      const sql = `
        INSERT INTO bookings (user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(
        sql,
        [user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              booking_id: this.lastID,
              user_id,
              room_id,
              hotel_id,
              check_in_date,
              check_out_date,
              num_guests,
              total_price,
              booking_status
            });
          }
        }
      );
    });
  }

  static findById(bookingId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT b.*, h.hotel_name, h.contact_phone, r.room_type, r.price_per_night,
               u.phone_number as owner_phone,
               (SELECT image_url FROM hotel_images WHERE hotel_id = b.hotel_id LIMIT 1) AS hotel_image
        FROM bookings b
        JOIN hotels h ON b.hotel_id = h.hotel_id
        JOIN rooms r ON b.room_id = r.room_id
        JOIN users u ON h.owner_id = u.user_id
        WHERE b.booking_id = ?
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

  static updateStatus(bookingId, status) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE bookings SET booking_status = ? WHERE booking_id = ?`;
      
      db.run(sql, [status, bookingId], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ booking_id: bookingId, booking_status: status });
        }
      });
    });
  }

  static calculateTotalPrice(pricePerNight, checkInDate, checkOutDate, numRooms) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return pricePerNight * nights * numRooms;
  }
}