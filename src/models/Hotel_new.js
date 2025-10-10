import db from "../server/db/db.js";

export class Hotel {
  static async getAllWithImages() {
    try {
      const sql = `
        SELECT h.hotel_id, h.hotel_name, h.description, h.address, h.city, h.country, h.contact_phone, h.contact_email,
               h.status, h.amenities,
               ROUND(AVG(r.rating), 2) AS avg_rating,
               COUNT(r.rating_id) AS review_count
        FROM hotels h
        LEFT JOIN ratings r ON r.hotel_id = h.hotel_id
        WHERE h.status = 'approved'
        GROUP BY h.hotel_id
        ORDER BY h.hotel_id DESC
      `;

      const result = await db.query(sql);
      const hotels = result.rows;

      if (hotels.length === 0) {
        return [];
      }

      // ดึงรูปภาพทั้งหมดของแต่ละโรงแรม
      const hotelIds = hotels.map(h => h.hotel_id);
      const imgSql = `SELECT hotel_id, image_url FROM hotel_images WHERE hotel_id = ANY($1)`;
      const imgResult = await db.query(imgSql, [hotelIds]);
      const images = imgResult.rows;

      // รวมรูปภาพเข้าแต่ละโรงแรม
      const imagesByHotel = {};
      images.forEach(img => {
        if (!imagesByHotel[img.hotel_id]) imagesByHotel[img.hotel_id] = [];
        imagesByHotel[img.hotel_id].push(img.image_url);
      });

      const hotelsWithImages = hotels.map(hotel => ({
        ...hotel,
        image_urls: imagesByHotel[hotel.hotel_id] || [],
      }));

      return hotelsWithImages;
    } catch (err) {
      throw err;
    }
  }

  static async getByLocation(city, country) {
    try {
      const sql = `
        SELECT h.hotel_id, h.hotel_name, h.description, h.address, h.city, h.country, 
               h.contact_phone, h.contact_email, h.amenities, h.status,
               ROUND(AVG(r.rating), 2) AS avg_rating,
               COUNT(r.rating_id) AS review_count
        FROM hotels h
        LEFT JOIN ratings r ON r.hotel_id = h.hotel_id
        WHERE h.city ILIKE $1 AND h.country ILIKE $2 AND h.status = 'approved'
        GROUP BY h.hotel_id
        ORDER BY h.hotel_id DESC
      `;

      const result = await db.query(sql, [`%${city}%`, `%${country}%`]);
      const hotels = result.rows;

      if (hotels.length === 0) {
        return [];
      }

      // ดึงรูปภาพทั้งหมดของแต่ละโรงแรม
      const hotelIds = hotels.map(h => h.hotel_id);
      const imgSql = `SELECT hotel_id, image_url FROM hotel_images WHERE hotel_id = ANY($1)`;
      const imgResult = await db.query(imgSql, [hotelIds]);
      const images = imgResult.rows;

      // รวมรูปภาพเข้าแต่ละโรงแรม
      const imagesByHotel = {};
      images.forEach(img => {
        if (!imagesByHotel[img.hotel_id]) imagesByHotel[img.hotel_id] = [];
        imagesByHotel[img.hotel_id].push(img.image_url);
      });

      const hotelsWithImages = hotels.map(hotel => ({
        ...hotel,
        image_urls: imagesByHotel[hotel.hotel_id] || [],
      }));

      return hotelsWithImages;
    } catch (err) {
      throw err;
    }
  }

  static async getRoomsByHotelId(hotelId) {
    try {
      const sql = `
        SELECT r.room_id, r.room_type, r.price_per_night, r.max_guests, r.beds, r.quantity
        FROM rooms r
        WHERE r.hotel_id = $1
      `;
      
      const result = await db.query(sql, [hotelId]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  // อัพเดทสถานะโรงแรม
  static async updateStatus(hotelId, status) {
    try {
      const sql = `UPDATE hotels SET status = $1 WHERE hotel_id = $2`;
      const result = await db.query(sql, [status, hotelId]);
      return result.rowCount > 0;
    } catch (err) {
      throw err;
    }
  }

  // ดึงโรงแรมตาม owner ID
  static async getByOwnerId(ownerId) {
    try {
      const sql = `
        SELECT h.hotel_id, h.hotel_name, h.description, h.address, h.city, h.country, 
               h.contact_phone, h.contact_email, h.amenities, h.status,
               ROUND(AVG(r.rating), 2) AS avg_rating,
               COUNT(r.rating_id) AS review_count
        FROM hotels h
        LEFT JOIN ratings r ON r.hotel_id = h.hotel_id
        WHERE h.owner_id = $1 AND h.status != 'deleted'
        GROUP BY h.hotel_id
        ORDER BY h.hotel_id DESC
      `;

      const result = await db.query(sql, [ownerId]);
      const hotels = result.rows;

      if (hotels.length === 0) {
        return [];
      }

      // ดึงรูปภาพทั้งหมดของแต่ละโรงแรม
      const hotelIds = hotels.map(h => h.hotel_id);
      const imgSql = `SELECT hotel_id, image_url FROM hotel_images WHERE hotel_id = ANY($1)`;
      const imgResult = await db.query(imgSql, [hotelIds]);
      const images = imgResult.rows;

      // รวมรูปภาพเข้าแต่ละโรงแรม
      const imagesByHotel = {};
      images.forEach(img => {
        if (!imagesByHotel[img.hotel_id]) imagesByHotel[img.hotel_id] = [];
        imagesByHotel[img.hotel_id].push(img.image_url);
      });

      const hotelsWithImages = hotels.map(hotel => ({
        ...hotel,
        image_urls: imagesByHotel[hotel.hotel_id] || [],
      }));

      return hotelsWithImages;
    } catch (err) {
      throw err;
    }
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
        image_urls = [],
        rooms = []
      } = hotelData;

      // เพิ่มโรงแรม
      const sql = `
        INSERT INTO hotels (owner_id, hotel_name, description, address, city, country, contact_phone, contact_email, amenities, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
        RETURNING hotel_id
      `;
      
      const result = await db.query(sql, [
        owner_id,
        hotel_name,
        description,
        address,
        city,
        country,
        contact_phone,
        contact_email,
        amenities
      ]);

      const hotelId = result.rows[0].hotel_id;

      // เพิ่มรูปภาพ
      if (image_urls && image_urls.length > 0) {
        for (const imageUrl of image_urls) {
          const imgSQL = `INSERT INTO hotel_images (hotel_id, image_url) VALUES ($1, $2)`;
          await db.query(imgSQL, [hotelId, imageUrl]);
        }
      }

      // เพิ่มห้องพัก
      if (rooms && rooms.length > 0) {
        for (const room of rooms) {
          const roomSQL = `
            INSERT INTO rooms (hotel_id, room_type, price_per_night, max_guests, beds, quantity)
            VALUES ($1, $2, $3, $4, $5, $6)
          `;
          await db.query(roomSQL, [
            hotelId,
            room.room_type,
            room.price_per_night,
            room.max_guests,
            room.beds,
            room.quantity
          ]);
        }
      } else {
        // ถ้าไม่มีข้อมูลห้องพัก ให้สร้างห้องพักเริ่มต้น
        const defaultRoomSQL = `
          INSERT INTO rooms (hotel_id, room_type, price_per_night, max_guests, beds, quantity)
          VALUES ($1, $2, $3, $4, $5, $6)
        `;
        await db.query(defaultRoomSQL, [
          hotelId,
          'Standard',
          1500,
          2,
          1,
          10
        ]);
      }

      return {
        hotel_id: hotelId,
        owner_id,
        hotel_name,
        description,
        address,
        city,
        country,
        contact_phone,
        contact_email,
        amenities,
        status: 'pending'
      };
    } catch (err) {
      throw err;
    }
  }

  // ลบโรงแรม (Soft Delete - เปลี่ยน status เป็น deleted)
  static async delete(hotelId) {
    try {
      // เปลี่ยน status เป็น 'deleted' แทนการลบจริง
      const updateStatusSQL = `UPDATE hotels SET status = 'deleted' WHERE hotel_id = $1`;
      const result = await db.query(updateStatusSQL, [hotelId]);
      return result.rowCount > 0;
    } catch (err) {
      throw err;
    }
  }

  // ดึงข้อมูลโรงแรมตาม ID พร้อมรูปภาพและห้องพัก
  static async getById(hotelId) {
    try {
      const sql = `
        SELECT h.hotel_id, h.hotel_name, h.description, h.address, h.city, h.country, 
               h.contact_phone, h.contact_email, h.amenities, h.status,
               ROUND(AVG(r.rating), 2) AS avg_rating,
               COUNT(r.rating_id) AS review_count
        FROM hotels h
        LEFT JOIN ratings r ON r.hotel_id = h.hotel_id
        WHERE h.hotel_id = $1 AND h.status != 'deleted'
        GROUP BY h.hotel_id
      `;

      const result = await db.query(sql, [hotelId]);
      
      if (result.rows.length === 0) {
        return null;
      }

      const hotel = result.rows[0];

      // ดึงรูปภาพ
      const imgSql = `SELECT image_url FROM hotel_images WHERE hotel_id = $1`;
      const imgResult = await db.query(imgSql, [hotelId]);
      hotel.image_urls = imgResult.rows.map(img => img.image_url);

      // ดึงห้องพัก
      const roomSql = `SELECT * FROM rooms WHERE hotel_id = $1`;
      const roomResult = await db.query(roomSql, [hotelId]);
      hotel.rooms = roomResult.rows;

      return hotel;
    } catch (err) {
      throw err;
    }
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
        image_urls = [],
        rooms = []
      } = hotelData;

      // อัพเดทข้อมูลโรงแรม
      const sql = `
        UPDATE hotels 
        SET hotel_name = $1, description = $2, address = $3, city = $4, country = $5, 
            contact_phone = $6, contact_email = $7, amenities = $8
        WHERE hotel_id = $9 AND status != 'deleted'
      `;

      const amenitiesString = Array.isArray(amenities) ? amenities.join(', ') : amenities || '';
      
      await db.query(sql, [
        hotel_name,
        description,
        address,
        city,
        country,
        contact_phone,
        contact_email,
        amenitiesString,
        hotelId
      ]);

      // อัพเดทรูปภาพ
      if (image_urls && image_urls.length > 0) {
        // ลบรูปภาพเดิมทั้งหมด
        const deleteImagesSQL = `DELETE FROM hotel_images WHERE hotel_id = $1`;
        await db.query(deleteImagesSQL, [hotelId]);

        // เพิ่มรูปภาพใหม่
        for (const imageUrl of image_urls) {
          const insertImageSQL = `INSERT INTO hotel_images (hotel_id, image_url) VALUES ($1, $2)`;
          await db.query(insertImageSQL, [hotelId, imageUrl]);
        }
      }

      // อัพเดทห้องพัก
      if (rooms && rooms.length > 0) {
        // ลบห้องพักเดิมทั้งหมด
        const deleteRoomsSQL = `DELETE FROM rooms WHERE hotel_id = $1`;
        await db.query(deleteRoomsSQL, [hotelId]);

        // เพิ่มห้องพักใหม่
        for (const room of rooms) {
          const insertRoomSQL = `
            INSERT INTO rooms (hotel_id, room_type, price_per_night, max_guests, beds, quantity)
            VALUES ($1, $2, $3, $4, $5, $6)
          `;
          await db.query(insertRoomSQL, [
            hotelId,
            room.room_type,
            room.price_per_night,
            room.max_guests,
            room.beds,
            room.quantity
          ]);
        }
      }

      return {
        hotel_id: hotelId,
        hotel_name,
        description,
        address,
        city,
        country,
        contact_phone,
        contact_email,
        amenities: amenitiesString
      };
    } catch (err) {
      throw err;
    }
  }
}