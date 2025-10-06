import db from "../server/db/db.js";

export class Hotel {
  static getAllWithImages() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT h.hotel_id, h.hotel_name, h.description, h.address, h.city, h.country, h.star_rating, h.contact_phone, h.contact_email,
               h.status, h.amenities,
               AVG(r.rating) AS avg_rating,
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
        SELECT h.hotel_id, h.hotel_name, h.description, h.address, h.city, h.country, h.star_rating, 
               h.contact_phone, h.contact_email, h.status, h.amenities,
               u.user_id as owner_id, u.first_name as owner_first_name, u.last_name as owner_last_name, 
               u.email as owner_email, u.phone_number as owner_phone,
               AVG(r.rating) AS avg_rating,
               COUNT(r.rating_id) AS review_count
        FROM hotels h
        JOIN users u ON h.owner_id = u.user_id
        LEFT JOIN ratings r ON r.hotel_id = h.hotel_id
        WHERE h.status != 'deleted'
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
      const sql = `UPDATE hotels SET status = ? WHERE hotel_id = ?`;
      db.run(sql, [status, hotelId], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  // ดึงโรงแรมตาม owner ID
  static getByOwnerId(ownerId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT h.hotel_id, h.hotel_name, h.description, h.address, h.city, h.country, h.star_rating, 
               h.contact_phone, h.contact_email, h.status, h.amenities, h.owner_id,
               AVG(r.rating) AS avg_rating,
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

  // ลบโรงแรม
  static delete(hotelId) {
    return new Promise((resolve, reject) => {
      // ลบรูปภาพของโรงแรมก่อน
      const deleteImagesSQL = `DELETE FROM hotel_images WHERE hotel_id = ?`;
      db.run(deleteImagesSQL, [hotelId], (err) => {
        if (err) {
          reject(err);
          return;
        }

        // ลบห้องของโรงแรม
        const deleteRoomsSQL = `DELETE FROM rooms WHERE hotel_id = ?`;
        db.run(deleteRoomsSQL, [hotelId], (err) => {
          if (err) {
            reject(err);
            return;
          }

          // ลบโรงแรม
          const deleteHotelSQL = `DELETE FROM hotels WHERE hotel_id = ?`;
          db.run(deleteHotelSQL, [hotelId], function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(this.changes > 0);
            }
          });
        });
      });
    });
  }
}