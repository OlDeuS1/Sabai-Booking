import { Rating } from "../models/Rating.js";

class RatingController {
  // สร้าง rating ใหม่
  static async createRating(req, res) {
    try {
      const { booking_id, hotel_id, rating } = req.body;
      
      // ตรวจสอบการ login
      const user_id = req.cookies.userId;
      if (!user_id) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // ตรวจสอบข้อมูลที่จำเป็น
      if (!booking_id || !hotel_id || !rating) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // ตรวจสอบค่า rating
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      const newRating = await Rating.create({
        booking_id,
        user_id,
        hotel_id,
        rating
      });

      res.status(201).json({
        message: 'Rating created successfully',
        rating: newRating
      });

    } catch (error) {
      console.error('Error creating rating:', error);
      if (error.message === 'Rating already exists for this booking') {
        return res.status(409).json({ error: 'You have already rated this booking' });
      }
      res.status(500).json({ error: 'Failed to create rating' });
    }
  }

  // ดึง rating ตาม booking_id
  static async getRatingByBookingId(req, res) {
    try {
      const { bookingId } = req.params;
      const rating = await Rating.findByBookingId(bookingId);
      
      if (rating) {
        res.json(rating);
      } else {
        res.status(404).json({ error: 'Rating not found' });
      }
    } catch (error) {
      console.error('Error fetching rating:', error);
      res.status(500).json({ error: 'Failed to fetch rating' });
    }
  }

  // ดึง rating ทั้งหมดของโรงแรม
  static async getRatingsByHotelId(req, res) {
    try {
      const { hotelId } = req.params;
      const ratings = await Rating.findByHotelId(hotelId);
      res.json(ratings);
    } catch (error) {
      console.error('Error fetching hotel ratings:', error);
      res.status(500).json({ error: 'Failed to fetch hotel ratings' });
    }
  }

  // คำนวณคะแนนเฉลี่ยของโรงแรม
  static async getHotelAverageRating(req, res) {
    try {
      const { hotelId } = req.params;
      const averageData = await Rating.getAverageRating(hotelId);
      res.json(averageData);
    } catch (error) {
      console.error('Error calculating average rating:', error);
      res.status(500).json({ error: 'Failed to calculate average rating' });
    }
  }

  // ดึง rating ทั้งหมด (สำหรับ admin)
  static async getAllRatings(req, res) {
    try {
      const ratings = await Rating.getAll();
      res.json(ratings);
    } catch (error) {
      console.error('Error fetching all ratings:', error);
      res.status(500).json({ error: 'Failed to fetch ratings' });
    }
  }
}

export default RatingController;