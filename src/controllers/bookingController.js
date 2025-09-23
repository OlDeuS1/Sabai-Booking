import { Booking } from "../models/Booking.js";
import { Hotel } from "../models/Hotel.js";

class BookingController {
  static async createBooking(req, res) {
    try {
      const { 
        room_id, 
        hotel_id, 
        check_in_date, 
        check_out_date, 
        num_guests,
        num_rooms = 1
      } = req.body;

      // ตรวจสอบว่าผู้ใช้ล็อกอินแล้วหรือไม่
      const user_id = req.cookies.userId;
      if (!user_id) {
        return res.status(401).json({ error: "กรุณาเข้าสู่ระบบก่อนทำการจอง" });
      }

      // ตรวจสอบข้อมูลที่จำเป็น
      if (!room_id || !hotel_id || !check_in_date || !check_out_date || !num_guests) {
        return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
      }

      // ดึงข้อมูลห้องพักเพื่อคำนวณราคา
      const rooms = await Hotel.getRooms(hotel_id);
      const selectedRoom = rooms.find(room => room.room_id === parseInt(room_id));
      
      if (!selectedRoom) {
        return res.status(404).json({ error: "ไม่พบห้องพักที่เลือก" });
      }

      // คำนวณราคาทั้งหมด
      const total_price = Booking.calculateTotalPrice(
        selectedRoom.price_per_night, 
        check_in_date, 
        check_out_date, 
        num_rooms
      );

      // สร้างการจอง
      const bookingData = {
        user_id: parseInt(user_id),
        room_id: parseInt(room_id),
        hotel_id: parseInt(hotel_id),
        check_in_date,
        check_out_date,
        num_guests: parseInt(num_guests),
        total_price,
        booking_status: 'pending'
      };

      const newBooking = await Booking.create(bookingData);
      
      res.status(201).json({
        success: true,
        booking: newBooking,
        message: "สร้างการจองสำเร็จ"
      });

    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getBookingById(req, res) {
    try {
      const bookingId = req.params.bookingId;
      const booking = await Booking.findById(bookingId);
      
      if (!booking) {
        return res.status(404).json({ error: "ไม่พบการจองที่ระบุ" });
      }

      res.json(booking);
    } catch (error) {
      console.error("Error getting booking:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateBookingStatus(req, res) {
    try {
      const bookingId = req.params.bookingId;
      const { status } = req.body;

      if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
        return res.status(400).json({ error: "สถานะการจองไม่ถูกต้อง" });
      }

      const updatedBooking = await Booking.updateStatus(bookingId, status);
      
      res.json({
        success: true,
        booking: updatedBooking,
        message: "อัปเดตสถานะการจองสำเร็จ"
      });

    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default BookingController;