import { Payment } from "../models/Payment.js";
import { Booking } from "../models/Booking.js";

class PaymentController {
  static async createPayment(req, res) {
    try {
      const { booking_id, payment_method = 'PromptPay' } = req.body;

      if (!booking_id) {
        return res.status(400).json({ error: "ต้องระบุ booking_id" });
      }

      // ตรวจสอบว่าการจองมีอยู่จริง
      const booking = await Booking.findById(booking_id);
      if (!booking) {
        return res.status(404).json({ error: "ไม่พบการจองที่ระบุ" });
      }

      // ตรวจสอบว่ามี payment record อยู่แล้วหรือไม่
      const existingPayment = await Payment.findByBookingId(booking_id);
      if (existingPayment) {
        return res.status(409).json({ error: "มีการชำระเงินสำหรับการจองนี้แล้ว" });
      }

      // สร้าง payment record
      const paymentData = {
        booking_id: parseInt(booking_id),
        amount: booking.total_price,
        payment_method,
        payment_status: 'completed'
      };

      const newPayment = await Payment.create(paymentData);
      
      res.status(201).json({
        success: true,
        payment: newPayment,
        message: "บันทึกการชำระเงินสำเร็จ"
      });

    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getPaymentByBookingId(req, res) {
    try {
      const bookingId = req.params.bookingId;
      const payment = await Payment.findByBookingId(bookingId);
      
      if (!payment) {
        return res.status(404).json({ error: "ไม่พบการชำระเงินสำหรับการจองนี้" });
      }

      res.json(payment);
    } catch (error) {
      console.error("Error getting payment:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllPayments(req, res) {
    try {
      const payments = await Payment.getAll();
      res.json(payments);
    } catch (error) {
      console.error("Error getting all payments:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async updatePaymentStatus(req, res) {
    try {
      const paymentId = req.params.paymentId;
      const { status } = req.body;

      if (!['pending', 'completed', 'failed'].includes(status)) {
        return res.status(400).json({ error: "สถานะการชำระเงินไม่ถูกต้อง" });
      }

      const updatedPayment = await Payment.updateStatus(paymentId, status);
      
      res.json({
        success: true,
        payment: updatedPayment,
        message: "อัปเดตสถานะการชำระเงินสำเร็จ"
      });

    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default PaymentController;