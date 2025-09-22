<script setup>
import { ref, onMounted } from 'vue'
import { usePreviousRoute } from '../composables/usePrevRoute'
import generatePayload from 'promptpay-qr'
import QRCode from 'qrcode'

const { previousRoute } = usePreviousRoute()

// ข้อมูลการจ่ายเงิน
const paymentData = ref({
  hotelName: 'โรงแรมด่าวเบิ่ง',
  checkIn: '20 กันยายน 2568',
  checkOut: '22 กันยายน 2568',
  roomType: 'Standard',
  roomCount: 1,
  guestCount: 2,
  pricePerNight: 3000,
  totalAmount: 1,
  nights: 2
})

// PromptPay ข้อมูล
const promptPayPhone = '0875513773' // เปลี่ยนเป็นเบอร์โทรของโรงแรม
const qrCodeImage = ref('')
const isPaymentConfirmed = ref(false)

// สร้าง QR Code
const generateQRCode = async () => {
  try {
    const payload = generatePayload(promptPayPhone, { amount: paymentData.value.totalAmount })
    const qrCodeDataURL = await QRCode.toDataURL(payload)
    qrCodeImage.value = qrCodeDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
  }
}

// ยืนยันการชำระเงิน
const confirmPayment = () => {
  isPaymentConfirmed.value = true
  // เพิ่มการประมวลผลการชำระเงินที่นี่
  alert('การชำระเงินเสร็จสมบูรณ์! ขอบคุณที่ใช้บริการ')
  // redirect ไปหน้าความสำเร็จหรือประวัติการจอง
}

onMounted(() => {
  generateQRCode()
})

</script>

<template>
  <div class="payment">
        <div class="payment-container max-w-7xl mx-auto px-[32px] py-[8px] flex flex-col h-screen sticky top-0 left-0">
            <h1 class="text-4xl font-semibold text-left mt-12 mb-10"><router-link :to="previousRoute">&LeftArrow;&nbsp;</router-link>ยืนยันและชำระเงิน</h1>
            <div class="payment__content flex justify-center items-center gap-20">
              <div class="payment__qrcode flex flex-col items-center">
                <h3 class="text-xl font-semibold mb-4">สแกน QR เพื่อชำระเงิน</h3>
                <div v-if="qrCodeImage" class="qr-container bg-white p-4 rounded-lg shadow-lg">
                  <img :src="qrCodeImage" alt="PromptPay QR Code" class="w-64 h-64" />
                </div>
                <div v-else class="flex items-center justify-center w-64 h-64 bg-gray-100 rounded-lg">
                  <span class="text-gray-500">กำลังสร้าง QR Code...</span>
                </div>
                <p class="text-sm text-gray-600 mt-2 text-center">
                  สแกนด้วยแอป Banking หรือ PromptPay
                </p>
              </div>
              <div class="payment__detail">
                <ul class="flex flex-col gap-2 rounded-[1.2rem] shadow-lg px-8 py-6 mb-6">
                  <li class="px-2 py-1 border-b border-gray-300 mb-4">
                    <h2 class="payment__hotel-title text-xl mb-4 font-semibold">{{ paymentData.hotelName }}</h2>
                  </li>
                  <li class="px-2 py-1 text-gray-600">
                    <div class="text-black">วันที่ :</div> {{ paymentData.checkIn }} - {{ paymentData.checkOut }}
                  </li>
                  <li class="px-2 py-1 text-gray-600">
                    <div class="text-black">ห้อง :</div> {{ paymentData.roomType }}
                  </li>
                  <li class="px-2 py-1 text-gray-600">
                    <div class="text-black">จำนวนห้อง :</div> {{ paymentData.roomCount }} ห้อง
                  </li>
                  <li class="px-2 py-1 text-gray-600">
                    <div class="text-black">จำนวนคน :</div> {{ paymentData.guestCount }} คน
                  </li>
                  <li class="px-2 py-1 text-gray-600">
                    <div class="text-black">รายละเอียดราคา :</div> {{ paymentData.roomCount }} ห้องพัก x {{ paymentData.pricePerNight.toLocaleString() }} บาทต่อคืน x {{ paymentData.nights }} คืน
                  </li>
                  <li class="px-2 py-1 text-gray-600 font-semibold border-t border-gray-300 pt-2">
                    <div class="text-black text-lg">ยอดรวม :</div> {{ paymentData.totalAmount.toLocaleString() }} บาท
                  </li>
                </ul>
                <button 
                  type="submit" 
                  @click.prevent="confirmPayment"
                  :disabled="isPaymentConfirmed"
                  :class="[
                    'mt-6 text-white py-2 px-8 rounded-md font-semibold transition-all',
                    isPaymentConfirmed 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-500 cursor-pointer hover:bg-green-600'
                  ]">
                  {{ isPaymentConfirmed ? 'ชำระเงินแล้ว ✓' : 'ยืนยันการชำระเงิน' }}
                </button>
                <p v-if="!isPaymentConfirmed" class="text-sm text-gray-500 mt-2">
                  กดปุ่มหลังจากชำระเงินผ่าน QR Code แล้ว
                </p>
              </div>
            </div>
        </div>
    </div>
</template>