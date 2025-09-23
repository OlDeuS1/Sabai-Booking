<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePreviousRoute } from '../composables/usePrevRoute'
import { getBookingById, updateBookingStatus } from '../composables/getData'
import generatePayload from 'promptpay-qr'
import QRCode from 'qrcode'

const route = useRoute()
const router = useRouter()
const { previousRoute } = usePreviousRoute()

// ข้อมูลการจอง
const bookingData = ref(null)
const isLoading = ref(true)
const error = ref('')

// PromptPay ข้อมูล
const promptPayPhone = '0875513773' // เปลี่ยนเป็นเบอร์โทรของโรงแรม
const qrCodeImage = ref('')
const isPaymentConfirmed = ref(false)

// คำนวณจำนวนคืน
const nights = computed(() => {
  if (!bookingData.value) return 0
  const checkIn = new Date(bookingData.value.check_in_date)
  const checkOut = new Date(bookingData.value.check_out_date)
  const timeDiff = checkOut.getTime() - checkIn.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
})

// ฟอร์แมตวันที่เป็นภาษาไทย
const formatThaiDate = (dateString) => {
  const date = new Date(dateString)
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ]
  return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`
}

// ดึงข้อมูลการจอง
const fetchBookingData = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    const bookingId = route.params.booking_id
    if (!bookingId) {
      throw new Error('ไม่พบรหัสการจอง')
    }

    const booking = await getBookingById(bookingId)
    bookingData.value = booking
  } catch (err) {
    console.error('Error fetching booking:', err)
    error.value = 'ไม่สามารถโหลดข้อมูลการจองได้'
  } finally {
    isLoading.value = false
  }
}

// สร้าง QR Code
const generateQRCode = async () => {
  try {
    if (!bookingData.value) return
    
    const payload = generatePayload(promptPayPhone, { amount: bookingData.value.total_price })
    const qrCodeDataURL = await QRCode.toDataURL(payload)
    qrCodeImage.value = qrCodeDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
  }
}

// ยืนยันการชำระเงิน
const confirmPayment = async () => {
  try {
    const bookingId = route.params.booking_id
    
    // อัปเดตสถานะการจองเป็น confirmed
    await updateBookingStatus(bookingId, 'confirmed')
    
    isPaymentConfirmed.value = true
    alert('การชำระเงินเสร็จสมบูรณ์! ขอบคุณที่ใช้บริการ')
    
    // redirect ไปหน้าประวัติการจอง
    setTimeout(() => {
      router.push('/historyBooking')
    }, 2000)
  } catch (error) {
    console.error('Error confirming payment:', error)
    alert('เกิดข้อผิดพลาดในการยืนยันการชำระเงิน กรุณาลองใหม่อีกครั้ง')
  }
}

onMounted(async () => {
  await fetchBookingData()
  if (bookingData.value) {
    await generateQRCode()
  }
})

</script>

<template>
  <div class="payment">
        <div class="payment-container max-w-7xl mx-auto px-[32px] py-[8px] flex flex-col h-screen sticky top-0 left-0">
            <h1 class="text-4xl font-semibold text-left mt-12 mb-10">
              <router-link :to="previousRoute">&LeftArrow;&nbsp;</router-link>ยืนยันและชำระเงิน
            </h1>
            
            <!-- Loading state -->
            <div v-if="isLoading" class="flex justify-center items-center h-64">
              <div class="text-lg">กำลังโหลดข้อมูลการจอง...</div>
            </div>
            
            <!-- Error state -->
            <div v-else-if="error" class="flex justify-center items-center h-64">
              <div class="text-red-500 text-lg">{{ error }}</div>
            </div>
            
            <!-- Payment content -->
            <div v-else-if="bookingData" class="payment__content flex justify-center items-center gap-20">
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
                    <h2 class="payment__hotel-title text-xl mb-4 font-semibold">{{ bookingData.hotel_name }}</h2>
                  </li>
                  <li class="px-2 py-1 text-gray-600">
                    <div class="text-black">วันที่ :</div> 
                    {{ formatThaiDate(bookingData.check_in_date) }} - {{ formatThaiDate(bookingData.check_out_date) }}
                  </li>
                  <li class="px-2 py-1 text-gray-600">
                    <div class="text-black">ห้อง :</div> {{ bookingData.room_type }}
                  </li>
                  <li class="px-2 py-1 text-gray-600">
                    <div class="text-black">จำนวนคน :</div> {{ bookingData.num_guests }} คน
                  </li>
                  <li class="px-2 py-1 text-gray-600">
                    <div class="text-black">รายละเอียดราคา :</div> 
                    {{ bookingData.price_per_night ? bookingData.price_per_night.toLocaleString() : 0 }} บาทต่อคืน x {{ nights }} คืน
                  </li>
                  <li class="px-2 py-1 text-gray-600 font-semibold border-t border-gray-300 pt-2">
                    <div class="text-black text-lg">ยอดรวม :</div> {{ bookingData.total_price ? bookingData.total_price.toLocaleString() : 0 }} บาท
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