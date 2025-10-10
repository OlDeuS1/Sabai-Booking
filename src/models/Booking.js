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

      // กำหนดเวลาหมดอายุ (15 นาทีจากตอนสร้าง booking)
      const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      const sql = `
        INSERT INTO bookings (user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, expires_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING booking_id
      `;

      db.get(
        sql,
        [user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, expires_at],
        function (err, row) {
          if (err) {
            reject(err);
          } else {
            resolve({
              booking_id: row.booking_id,
              user_id,
              room_id,
              hotel_id,
              check_in_date,
              check_out_date,
              num_guests,
              total_price,
              booking_status,
              expires_at
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

  static findByHotelId(hotelId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT b.*, h.hotel_name, r.room_type, r.price_per_night,
               u.first_name, u.last_name, u.email as user_email, u.phone_number as user_phone
        FROM bookings b
        JOIN hotels h ON b.hotel_id = h.hotel_id
        JOIN rooms r ON b.room_id = r.room_id
        JOIN users u ON b.user_id = u.user_id
        WHERE b.hotel_id = ?
        ORDER BY b.created_at DESC
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

  // ฟังก์ชันยกเลิกการจองที่หมดอายุ
  static cancelExpiredBookings() {
    return new Promise((resolve, reject) => {
      const currentTime = new Date().toISOString();
      
      // ดึงรายการที่จะถูกยกเลิกก่อน (สำหรับ logging)
      const selectSql = `
        SELECT booking_id, user_id, hotel_id, total_price, expires_at,
               EXTRACT(EPOCH FROM (? - expires_at)) / 60 as minutes_expired
        FROM bookings 
        WHERE booking_status = 'pending' 
        AND expires_at < ? 
        AND expires_at IS NOT NULL
      `;
      
      db.all(selectSql, [currentTime, currentTime], (err, expiredBookings) => {
        if (err) {
          console.error('Error fetching expired bookings:', err);
          reject(err);
          return;
        }
        
        if (expiredBookings.length > 0) {
          console.log(`Found ${expiredBookings.length} expired bookings to cancel:`, 
            expiredBookings.map(b => ({
              booking_id: b.booking_id,
              expired_minutes_ago: Math.round(b.minutes_expired),
              total_price: b.total_price
            }))
          );
        }
        
        // ทำการยกเลิกการจอง
        const updateSql = `
          UPDATE bookings 
          SET booking_status = 'cancelled' 
          WHERE booking_status = 'pending' 
          AND expires_at < ? 
          AND expires_at IS NOT NULL
        `;

        db.run(updateSql, [currentTime], function (err) {
          if (err) {
            console.error('Error cancelling expired bookings:', err);
            reject(err);
          } else {
            if (this.changes > 0) {
              console.log(`✅ Auto-cancelled ${this.changes} expired bookings at ${new Date().toLocaleString()}`);
            }
            resolve(this.changes);
          }
        });
      });
    });
  }

  // ฟังก์ชันดึงข้อมูล booking ที่กำลังจะหมดอายุ
  static getPendingBookingsWithExpiry() {
    return new Promise((resolve, reject) => {
      const currentTime = new Date().toISOString();
      const sql = `
        SELECT booking_id, user_id, hotel_id, total_price, expires_at, booking_status,
               EXTRACT(EPOCH FROM (expires_at - ?)) / 60 as minutes_remaining
        FROM bookings 
        WHERE booking_status = 'pending' 
        AND expires_at IS NOT NULL
        AND expires_at > ?
        ORDER BY expires_at ASC
      `;

      db.all(sql, [currentTime, currentTime], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // เพิ่มข้อมูลเวลาที่เหลือในรูปแบบที่อ่านง่าย
          const bookingsWithTime = rows.map(booking => ({
            ...booking,
            minutes_remaining: Math.max(0, Math.round(booking.minutes_remaining)),
            expires_at_local: new Date(booking.expires_at).toLocaleString(),
            is_urgent: booking.minutes_remaining < 5 // น้อยกว่า 5 นาที
          }));
          
          resolve(bookingsWithTime);
        }
      });
    });
  }

  // ฟังก์ชันตรวจสอบการจองที่ใกล้หมดอายุ (น้อยกว่า 5 นาที)
  static getUrgentBookings() {
    return new Promise((resolve, reject) => {
      const currentTime = new Date().toISOString();
      const fiveMinutesLater = new Date(Date.now() + 5 * 60 * 1000).toISOString();
      
      const sql = `
        SELECT booking_id, user_id, hotel_id, total_price, expires_at,
               EXTRACT(EPOCH FROM (expires_at - ?)) / 60 as minutes_remaining
        FROM bookings 
        WHERE booking_status = 'pending' 
        AND expires_at IS NOT NULL
        AND expires_at > ?
        AND expires_at < ?
        ORDER BY expires_at ASC
      `;

      db.all(sql, [currentTime, currentTime, fiveMinutesLater], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(booking => ({
            ...booking,
            minutes_remaining: Math.max(0, Math.round(booking.minutes_remaining))
          })));
        }
      });
    });
  }

  // ฟังก์ชันอัพเดท booking ที่หมดวันที่ checkout เป็น completed
  static completeExpiredCheckouts() {
    return new Promise((resolve, reject) => {
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const sql = `
        UPDATE bookings 
        SET booking_status = 'completed' 
        WHERE booking_status = 'confirmed' 
        AND check_out_date < ?
      `;

      db.run(sql, [currentDate], function (err) {
        if (err) {
          reject(err);
        } else {
          // แสดงข้อความเฉพาะเมื่อมีการอัพเดทจริงๆ
          if (this.changes > 0) {
            console.log(`Auto-completed ${this.changes} bookings after checkout date`);
          }
          resolve(this.changes);
        }
      });
    });
  }

  // ฟังก์ชันดึงข้อมูล booking ที่ควรจะ completed
  static getExpiredCheckouts() {
    return new Promise((resolve, reject) => {
      const currentDate = new Date().toISOString().split('T')[0];
      const sql = `
        SELECT booking_id, check_out_date, booking_status
        FROM bookings 
        WHERE booking_status = 'confirmed' 
        AND check_out_date < ?
        ORDER BY check_out_date ASC
      `;

      db.all(sql, [currentDate], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}