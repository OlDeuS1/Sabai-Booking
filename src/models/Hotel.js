import db, { pool } from "../server/db/db.js";

export class Hotel {
  static getAllWithImages() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT h.hotel_id, h.hotel_name, h.description, h.address, h.city, h.country, h.contact_phone, h.contact_email,
               h.status, h.amenities,
               ROUND(AVG(r.rating), 2) AS avg_rating, -- เปลี่ยนตรงนี้
               COUNT(r.rating_id) AS review_count
        FROM hotels h
        LEFT JOIN ratings r ON r.hotel_id = h.hotel_id
        WHERE h.status = 'approved'
        GROUP BY h.hotel_id
        ORDER BY h.hotel_id DESC
      `;

      db.all(sql, [], (err, hotels) => {
        if (err) {
          reject(err);
          return;
        }

        // ดึงรูปภาพทั้งหมดของแต่ละโรงแรม
        const hotelIds = hotels.map((h) => h.hotel_id);
        if (hotelIds.length === 0) {
          resolve([]);
          return;
        }

        const imgSql = `SELECT hotel_id, image_url FROM hotel_images WHERE hotel_id IN (${hotelIds
          .map(() => "?")
          .join(",")})`;
        db.all(imgSql, hotelIds, (imgErr, images) => {
          if (imgErr) {
            reject(imgErr);
            return;
          }

          // รวมรูปภาพเข้าแต่ละโรงแรม
          const imagesByHotel = {};
          images.forEach((img) => {
            if (!imagesByHotel[img.hotel_id]) imagesByHotel[img.hotel_id] = [];
            imagesByHotel[img.hotel_id].push(img.image_url);
          });

          const hotelsWithImages = hotels.map((hotel) => ({
            ...hotel,
            image_urls: imagesByHotel[hotel.hotel_id] || [],
          }));

          resolve(hotelsWithImages);
        });
      });
    });
  }

  static getAllAdminData() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT h.hotel_id, h.hotel_name, h.description, h.address, h.city, h.country, 
               h.contact_phone, h.contact_email, h.status, h.amenities, h.created_at,
               u.user_id as owner_id, u.first_name as owner_first_name, u.last_name as owner_last_name, 
               u.email as owner_email, u.phone_number as owner_phone
        FROM hotels h
        JOIN users u ON h.owner_id = u.user_id
        WHERE h.status != 'deleted'
        ORDER BY h.hotel_id DESC
      `;

      db.all(sql, [], (err, hotels) => {
        if (err) {
          reject(err);
          return;
        }

        // ดึงรูปภาพทั้งหมดของแต่ละโรงแรม
        const hotelIds = hotels.map((h) => h.hotel_id);
        if (hotelIds.length === 0) {
          resolve([]);
          return;
        }

        const imgSql = `SELECT hotel_id, image_url FROM hotel_images WHERE hotel_id IN (${hotelIds
          .map(() => "?")
          .join(",")})`;
        db.all(imgSql, hotelIds, (imgErr, images) => {
          if (imgErr) {
            reject(imgErr);
            return;
          }

          // รวมรูปภาพเข้าแต่ละโรงแรม
          const imagesByHotel = {};
          images.forEach((img) => {
            if (!imagesByHotel[img.hotel_id]) imagesByHotel[img.hotel_id] = [];
            imagesByHotel[img.hotel_id].push(img.image_url);
          });

          const hotelsWithImages = hotels.map((hotel) => ({
            ...hotel,
            image_urls: imagesByHotel[hotel.hotel_id] || [],
          }));

          resolve(hotelsWithImages);
        });
      });
    });
  }

  static getRooms(hotelId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.room_id, r.room_type, r.price_per_night, r.max_guests, r.beds, r.quantity
        FROM rooms r
        WHERE r.hotel_id = ?
        ORDER BY r.room_id ASC
      `;
      db.all(sql, [hotelId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // อัพเดทสถานะโรงแรม
  static updateStatus(hotelId, status) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE hotels SET status = $1 WHERE hotel_id = $2`;
      db.query(sql, [status, hotelId])
        .then(result => {
          resolve(result.rowCount > 0);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // ดึงโรงแรมตาม owner ID
  static getByOwnerId(ownerId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT h.hotel_id, h.hotel_name, h.description, h.address, h.city, h.country, 
               h.contact_phone, h.contact_email, h.status, h.amenities, h.owner_id,
               ROUND(AVG(r.rating), 2) AS avg_rating, -- เปลี่ยนตรงนี้
               COUNT(r.rating_id) AS review_count
        FROM hotels h
        LEFT JOIN ratings r ON r.hotel_id = h.hotel_id
        WHERE h.owner_id = ? AND h.status != 'deleted'
        GROUP BY h.hotel_id
        ORDER BY h.hotel_id DESC
      `;

      db.all(sql, [ownerId], (err, hotels) => {
        if (err) {
          reject(err);
          return;
        }

        // ดึงรูปภาพทั้งหมดของแต่ละโรงแรม
        const hotelIds = hotels.map((h) => h.hotel_id);
        if (hotelIds.length === 0) {
          resolve([]);
          return;
        }

        const imgSql = `SELECT hotel_id, image_url FROM hotel_images WHERE hotel_id IN (${hotelIds
          .map(() => "?")
          .join(",")})`;
        db.all(imgSql, hotelIds, (imgErr, images) => {
          if (imgErr) {
            reject(imgErr);
            return;
          }

          // รวมรูปภาพเข้าแต่ละโรงแรม
          const imagesByHotel = {};
          images.forEach((img) => {
            if (!imagesByHotel[img.hotel_id]) imagesByHotel[img.hotel_id] = [];
            imagesByHotel[img.hotel_id].push(img.image_url);
          });

          const hotelsWithImages = hotels.map((hotel) => ({
            ...hotel,
            image_urls: imagesByHotel[hotel.hotel_id] || [],
          }));

          resolve(hotelsWithImages);
        });
      });
    });
  }

  // สร้างโรงแรมใหม่
  static async create(hotelData) {
    try {
      const {
        owner_id,
        hotel_name,
        description,
        address,
        city,
        country,
        contact_phone,
        contact_email,
        amenities,
        image_urls,
        rooms
      } = hotelData;

      // สร้างโรงแรมก่อน
      const hotelSQL = `
        INSERT INTO hotels (owner_id, hotel_name, description, address, city, country, contact_phone, contact_email, amenities, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
        RETURNING hotel_id
      `;

      const hotelResult = await db.query(
        hotelSQL,
        [owner_id, hotel_name, description, address, city, country, contact_phone, contact_email, amenities]
      );

      const hotelId = hotelResult.rows[0].hotel_id;

      // เพิ่มรูปภาพ
      if (image_urls && image_urls.length > 0) {
        const imagePromises = image_urls.map(async (imageUrl) => {
          const imgSQL = `INSERT INTO hotel_images (hotel_id, image_url) VALUES ($1, $2)`;
          await db.query(imgSQL, [hotelId, imageUrl]);
        });
        await Promise.all(imagePromises);
      }

      // เพิ่มห้องพัก
      if (rooms && rooms.length > 0) {
        const roomPromises = rooms.map(async (room) => {
          const roomSQL = `
            INSERT INTO rooms (hotel_id, room_type, price_per_night, max_guests, beds, quantity)
            VALUES ($1, $2, $3, $4, $5, $6)
          `;
          await db.query(roomSQL, [hotelId, room.room_type, room.price_per_night, room.max_guests, room.beds, room.quantity]);
        });
        await Promise.all(roomPromises);
      }

      return { hotel_id: hotelId, hotel_name };
    } catch (err) {
      throw err;
    }
  }

  // ลบโรงแรม (Soft Delete - เปลี่ยน status เป็น deleted)
  static delete(hotelId) {
    return new Promise((resolve, reject) => {
      // เปลี่ยน status เป็น 'deleted' แทนการลบจริง
      const updateStatusSQL = `UPDATE hotels SET status = 'deleted' WHERE hotel_id = $1`;
      db.query(updateStatusSQL, [hotelId])
        .then(result => {
          resolve(result.rowCount > 0);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // ดึงข้อมูลโรงแรมตาม ID
  static getById(hotelId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT h.hotel_id, h.hotel_name, h.description, h.address, h.city, h.country, 
               h.contact_phone, h.contact_email, h.status, h.amenities, h.owner_id,
               ROUND(AVG(r.rating), 2) AS avg_rating, -- เปลี่ยนตรงนี้
               COUNT(r.rating_id) AS review_count
        FROM hotels h
        LEFT JOIN ratings r ON r.hotel_id = h.hotel_id
        WHERE h.hotel_id = ? AND h.status != 'deleted'
        GROUP BY h.hotel_id
      `;

      db.get(sql, [hotelId], (err, hotel) => {
        if (err) {
          reject(err);
          return;
        }

        if (!hotel) {
          resolve(null);
          return;
        }

        // ดึงรูปภาพของโรงแรม
        const imgSql = `SELECT image_url FROM hotel_images WHERE hotel_id = ?`;
        db.all(imgSql, [hotelId], (imgErr, images) => {
          if (imgErr) {
            reject(imgErr);
            return;
          }

          // ดึงข้อมูลห้องพัก
          const roomSql = `SELECT * FROM rooms WHERE hotel_id = ?`;
          db.all(roomSql, [hotelId], (roomErr, rooms) => {
            if (roomErr) {
              reject(roomErr);
              return;
            }

            const hotelWithDetails = {
              ...hotel,
              image_urls: images.map(img => img.image_url),
              rooms: rooms
            };

            resolve(hotelWithDetails);
          });
        });
      });
    });
  }

  // อัพเดทข้อมูลโรงแรม
  static async update(hotelId, hotelData) {
    try {
      const { 
        hotel_name, 
        description, 
        address, 
        city, 
        country, 
        contact_phone, 
        contact_email, 
        amenities,
        image_urls,
        rooms
      } = hotelData;

      // ใช้ Transaction เพื่อความถูกต้องของข้อมูลทั้งหมด
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // อัพเดทข้อมูลหลักของโรงแรม
        const updateHotelSQL = `
          UPDATE hotels 
          SET hotel_name = $1, description = $2, address = $3, city = $4, country = $5, 
              contact_phone = $6, contact_email = $7, amenities = $8
          WHERE hotel_id = $9 AND status != 'deleted'
        `;

        const amenitiesString = Array.isArray(amenities) ? amenities.join(', ') : (amenities || '');

        const hotelResult = await client.query(updateHotelSQL, [
          hotel_name, description, address, city, country, 
          contact_phone, contact_email, amenitiesString, hotelId
        ]);

        if (hotelResult.rowCount === 0) {
          throw new Error('Hotel not found or no changes made');
        }

        // จัดการรูปภาพ: ลบทั้งหมดแล้วเพิ่มใหม่ (ง่ายและปลอดภัยเพราะไม่ติด FK อื่น)
        await client.query(`DELETE FROM hotel_images WHERE hotel_id = $1`, [hotelId]);
        if (image_urls && image_urls.length > 0) {
          const insertImageSQL = `INSERT INTO hotel_images (hotel_id, image_url) VALUES ($1, $2)`;
          for (const imageUrl of image_urls) {
            await client.query(insertImageSQL, [hotelId, imageUrl]);
          }
        }

        // จัดการห้องพักแบบ upsert โดยใช้ room_id ถ้ามี และหลีกเลี่ยงการลบห้องที่มีการจองอยู่
        // 1) ดึงรายการห้องเดิมทั้งหมดของโรงแรม
        const existingRoomsRes = await client.query(
          `SELECT room_id FROM rooms WHERE hotel_id = $1`,
          [hotelId]
        );
        const existingRoomIds = new Set(existingRoomsRes.rows.map(r => r.room_id));

        // 2) เตรียมชุด room_id ที่ยังคงอยู่หลังอัพเดท
        const keepRoomIds = new Set();

        if (rooms && rooms.length > 0) {
          for (const room of rooms) {
            const { room_id, room_type, price_per_night, max_guests, beds, quantity } = room;

            if (room_id && existingRoomIds.has(room_id)) {
              // อัพเดทห้องเดิม
              await client.query(
                `UPDATE rooms SET room_type = $1, price_per_night = $2, max_guests = $3, beds = $4, quantity = $5 WHERE room_id = $6 AND hotel_id = $7`,
                [room_type, price_per_night, max_guests, beds, quantity, room_id, hotelId]
              );
              keepRoomIds.add(room_id);
            } else {
              // เพิ่มห้องใหม่
              const insertRes = await client.query(
                `INSERT INTO rooms (hotel_id, room_type, price_per_night, max_guests, beds, quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING room_id`,
                [hotelId, room_type, price_per_night, max_guests, beds, quantity]
              );
              keepRoomIds.add(insertRes.rows[0].room_id);
            }
          }
        }

        // 3) ลบห้องที่ไม่มีในรายการใหม่ โดยลบเฉพาะห้องที่ไม่มีการจองที่ยังไม่จบ
        for (const oldRoomId of existingRoomIds) {
          if (!keepRoomIds.has(oldRoomId)) {
            // ตรวจสอบการอ้างอิงจาก bookings ที่ยัง active (pending/confirmed)
            const refRes = await client.query(
              `SELECT COUNT(*)::int AS cnt FROM bookings WHERE room_id = $1 AND booking_status IN ('pending','confirmed')`,
              [oldRoomId]
            );
            if (refRes.rows[0].cnt === 0) {
              await client.query(`DELETE FROM rooms WHERE room_id = $1`, [oldRoomId]);
            } // ถ้ามีการจองอยู่ ให้คงไว้และไม่ลบ เพื่อเลี่ยง FK error
          }
        }

        await client.query('COMMIT');
      } catch (txErr) {
        await client.query('ROLLBACK');
        throw txErr;
      } finally {
        client.release();
      }

      return { message: 'Hotel updated successfully' };
    } catch (err) {
      throw err;
    }
  }
}