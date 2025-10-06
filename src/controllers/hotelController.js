import { Hotel } from "../models/Hotel.js";

class HotelController {
  static async createHotel(req, res) {
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
      } = req.body;

      // ตรวจสอบว่าผู้ใช้ล็อกอินแล้วหรือไม่
      const owner_id = req.cookies.userId;
      if (!owner_id) {
        return res.status(401).json({ error: "กรุณาเข้าสู่ระบบก่อนสร้างโรงแรม" });
      }

      // ตรวจสอบข้อมูลที่จำเป็น
      if (!hotel_name || !address || !city || !country) {
        return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน กรุณากรอกชื่อโรงแรม ที่อยู่ เมือง และประเทศ" });
      }

      const hotelData = {
        owner_id: parseInt(owner_id),
        hotel_name,
        description: description || '',
        address,
        city,
        country,
        contact_phone: contact_phone || '',
        contact_email: contact_email || '',
        amenities: Array.isArray(amenities) ? amenities.join(', ') : amenities || '',
        image_urls: image_urls || [],
        rooms: rooms || []
      };

      const result = await Hotel.create(hotelData);
      
      res.status(201).json({
        success: true,
        hotel: result,
        message: "สร้างโรงแรมสำเร็จ รอการอนุมัติจากผู้ดูแลระบบ"
      });

    } catch (error) {
      console.error("Error creating hotel:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllHotels(req, res) {
    try {
      const hotels = await Hotel.getAllWithImages();
      res.json(hotels);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllHotelAdminData(req, res) {
    try {
      const hotels = await Hotel.getAllAdminData();
      res.json(hotels);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getHotelRooms(req, res) {
    try {
      const hotelId = req.params.hotelId;
      const rooms = await Hotel.getRooms(hotelId);
      res.json(rooms);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // ดึงโรงแรมตาม owner ID
  static async getHotelsByOwnerId(req, res) {
    try {
      const ownerId = req.params.ownerId;
      const hotels = await Hotel.getByOwnerId(ownerId);
      res.json(hotels);
    } catch (error) {
      console.error('Error getting hotels by owner ID:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // อัพเดทสถานะโรงแรม
  static async updateHotelStatus(req, res) {
    try {
      const hotelId = req.params.hotelId;
      const { status } = req.body;

      // ตรวจสอบสถานะที่ส่งมา
      if (!['approved', 'rejected', 'pending', 'deleted'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const result = await Hotel.updateStatus(hotelId, status);
      if (result) {
        res.json({ message: `Hotel status updated to ${status}` });
      } else {
        res.status(404).json({ error: 'Hotel not found' });
      }
    } catch (error) {
      console.error('Error updating hotel status:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // ลบโรงแรม
  static async deleteHotel(req, res) {
    try {
      const hotelId = req.params.hotelId;
      
      const result = await Hotel.delete(hotelId);
      if (result) {
        res.json({ message: 'Hotel deleted successfully' });
      } else {
        res.status(404).json({ error: 'Hotel not found' });
      }
    } catch (error) {
      console.error('Error deleting hotel:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default HotelController;