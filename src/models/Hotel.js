import db from "../server/db/db.js";

export class Hotel {
  static getAllWithImages() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT h.hotel_id, h.hotel_name, h.description, h.address, h.city, h.country, h.contact_phone, h.contact_email,
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
        SELECT h.hotel_id, h.hotel_name, h.description, h.address, h.city, h.country, 
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

  // สร้างโรงแรมใหม่
  static create(hotelData) {
    return new Promise((resolve, reject) => {
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
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        RETURNING hotel_id
      `;

      db.get(
        hotelSQL,
        [owner_id, hotel_name, description, address, city, country, contact_phone, contact_email, amenities],
        function (err, row) {
          if (err) {
            reject(err);
            return;
          }

          const hotelId = row.hotel_id;

          // เพิ่มรูปภาพ
          if (image_urls && image_urls.length > 0) {
            const imagePromises = image_urls.map((imageUrl) => {
              return new Promise((resolveImg, rejectImg) => {
                const imgSQL = `INSERT INTO hotel_images (hotel_id, image_url) VALUES (?, ?)`;
                db.run(imgSQL, [hotelId, imageUrl], (imgErr) => {
                  if (imgErr) rejectImg(imgErr);
                  else resolveImg();
                });
              });
            });

            Promise.all(imagePromises)
              .then(() => {
                // เพิ่มห้องพัก
                if (rooms && rooms.length > 0) {
                  const roomPromises = rooms.map((room) => {
                    return new Promise((resolveRoom, rejectRoom) => {
                      const roomSQL = `
                        INSERT INTO rooms (hotel_id, room_type, price_per_night, max_guests, beds, quantity)
                        VALUES (?, ?, ?, ?, ?, ?)
                      `;
                      db.run(
                        roomSQL,
                        [hotelId, room.room_type, room.price_per_night, room.max_guests, room.beds, room.quantity],
                        (roomErr) => {
                          if (roomErr) rejectRoom(roomErr);
                          else resolveRoom();
                        }
                      );
                    });
                  });

                  Promise.all(roomPromises)
                    .then(() => {
                      resolve({ hotel_id: hotelId, hotel_name });
                    })
                    .catch(reject);
                } else {
                  resolve({ hotel_id: hotelId, hotel_name });
                }
              })
              .catch(reject);
          } else {
            // ไม่มีรูปภาพ แต่มีห้องพัก
            if (rooms && rooms.length > 0) {
              const roomPromises = rooms.map((room) => {
                return new Promise((resolveRoom, rejectRoom) => {
                  const roomSQL = `
                    INSERT INTO rooms (hotel_id, room_type, price_per_night, max_guests, beds, quantity)
                    VALUES (?, ?, ?, ?, ?, ?)
                  `;
                  db.run(
                    roomSQL,
                    [hotelId, room.room_type, room.price_per_night, room.max_guests, room.beds, room.quantity],
                    (roomErr) => {
                      if (roomErr) rejectRoom(roomErr);
                      else resolveRoom();
                    }
                  );
                });
              });

              Promise.all(roomPromises)
                .then(() => {
                  resolve({ hotel_id: hotelId, hotel_name });
                })
                .catch(reject);
            } else {
              resolve({ hotel_id: hotelId, hotel_name });
            }
          }
        }
      );
    });
  }

  // ลบโรงแรม (Soft Delete - เปลี่ยน status เป็น deleted)
  static delete(hotelId) {
    return new Promise((resolve, reject) => {
      // เปลี่ยน status เป็น 'deleted' แทนการลบจริง
      const updateStatusSQL = `UPDATE hotels SET status = 'deleted' WHERE hotel_id = ?`;
      db.run(updateStatusSQL, [hotelId], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  // ดึงข้อมูลโรงแรมตาม ID
  static getById(hotelId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT h.hotel_id, h.hotel_name, h.description, h.address, h.city, h.country, 
               h.contact_phone, h.contact_email, h.status, h.amenities, h.owner_id,
               AVG(r.rating) AS avg_rating,
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
  static update(hotelId, hotelData) {
    return new Promise((resolve, reject) => {
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

      // อัพเดทข้อมูลหลักของโรงแรม
      const updateHotelSQL = `
        UPDATE hotels 
        SET hotel_name = ?, description = ?, address = ?, city = ?, country = ?, 
            contact_phone = ?, contact_email = ?, amenities = ?
        WHERE hotel_id = ? AND status != 'deleted'
      `;

      const amenitiesString = Array.isArray(amenities) ? amenities.join(', ') : amenities || '';

      db.run(updateHotelSQL, [
        hotel_name, description, address, city, country, 
        contact_phone, contact_email, amenitiesString, hotelId
      ], function (err) {
        if (err) {
          reject(err);
          return;
        }

        if (this.changes === 0) {
          reject(new Error('Hotel not found or no changes made'));
          return;
        }

        // ลบรูปภาพเก่าและเพิ่มใหม่
        const deleteImagesSQL = `DELETE FROM hotel_images WHERE hotel_id = ?`;
        db.run(deleteImagesSQL, [hotelId], (imgErr) => {
          if (imgErr) {
            reject(imgErr);
            return;
          }

          // เพิ่มรูปภาพใหม่
          if (image_urls && image_urls.length > 0) {
            const insertImageSQL = `INSERT INTO hotel_images (hotel_id, image_url) VALUES (?, ?)`;
            let completedInserts = 0;
            
            image_urls.forEach((imageUrl) => {
              db.run(insertImageSQL, [hotelId, imageUrl], (insertErr) => {
                if (insertErr) {
                  reject(insertErr);
                  return;
                }
                
                completedInserts++;
                if (completedInserts === image_urls.length) {
                  // อัพเดทห้องพัก
                  updateRooms();
                }
              });
            });
          } else {
            updateRooms();
          }
        });

        function updateRooms() {
          // ลบห้องพักเก่า
          const deleteRoomsSQL = `DELETE FROM rooms WHERE hotel_id = ?`;
          db.run(deleteRoomsSQL, [hotelId], (roomErr) => {
            if (roomErr) {
              reject(roomErr);
              return;
            }

            // เพิ่มห้องพักใหม่
            if (rooms && rooms.length > 0) {
              const insertRoomSQL = `
                INSERT INTO rooms (hotel_id, room_type, price_per_night, max_guests, beds, quantity) 
                VALUES (?, ?, ?, ?, ?, ?)
              `;
              let completedRoomInserts = 0;

              rooms.forEach((room) => {
                db.run(insertRoomSQL, [
                  hotelId, room.room_type, room.price_per_night, 
                  room.max_guests, room.beds, room.quantity
                ], (insertRoomErr) => {
                  if (insertRoomErr) {
                    reject(insertRoomErr);
                    return;
                  }
                  
                  completedRoomInserts++;
                  if (completedRoomInserts === rooms.length) {
                    resolve({ message: 'Hotel updated successfully' });
                  }
                });
              });
            } else {
              resolve({ message: 'Hotel updated successfully' });
            }
          });
        }
      });
    });
  }
}