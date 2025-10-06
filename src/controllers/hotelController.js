import { Hotel } from "../models/Hotel.js";

class HotelController {
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