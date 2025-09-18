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
}

export default HotelController;