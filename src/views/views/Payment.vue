<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePreviousRoute } from '../composables/usePrevRoute'
import { getBookingById, updateBookingStatus, createPayment } from '../composables/getData'
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
const promptPayPhone = ref('') // จะดึงจากข้อมูลเจ้าของโรงแรม
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
    
    console.log('Booking data received:', booking)
    
    // ตั้งค่าเบอร์ PromptPay จากเจ้าของโรงแรม
    let phone = booking.owner_phone || booking.contact_phone || '0875513773' // fallback เบอร์
    
    // ฟอร์แมตเบอร์โทรให้ถูกต้องสำหรับ PromptPay
    if (phone) {
      // ลบเครื่องหมายขีด ช่องว่าง และอักขระพิเศษ
      phone = phone.replace(/[-\s\(\)]/g, '')
      // ถ้าเบอร์เริ่มต้นด้วย +66 ให้แปลงเป็น 0
      if (phone.startsWith('+66')) {
        phone = '0' + phone.substring(3)
      }
      // ถ้าเบอร์เริ่มต้นด้วย 66 ให้แปลงเป็น 0
      else if (phone.startsWith('66') && phone.length === 11) {
        phone = '0' + phone.substring(2)
      }
    }
    
    promptPayPhone.value = phone
    
    console.log('PromptPay phone set to:', promptPayPhone.value)
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
    if (!bookingData.value) {
      console.log('No booking data available')
      return
    }
    
    if (!promptPayPhone.value) {
      console.log('No phone number available')
      // ใช้เบอร์ fallback
      promptPayPhone.value = '0875513773'
    }
    
    // แปลง amount เป็น number และตรวจสอบว่าเป็นตัวเลข
    let amount = parseFloat(bookingData.value.total_price)
    if (isNaN(amount) || amount <= 0) {
      console.error('Invalid amount:', bookingData.value.total_price)
      // ใช้ยอดทดสอบ
      amount = 100.00
    }
    
    console.log('Generating QR code with:', {
      phone: promptPayPhone.value,
      amount: amount
    })
    
    const payload = generatePayload(promptPayPhone.value, { amount: amount })
    console.log('Generated payload length:', payload.length)
    
    const qrCodeDataURL = await QRCode.toDataURL(payload, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    console.log('Generated QR code successfully, data URL length:', qrCodeDataURL.length)
    qrCodeImage.value = qrCodeDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
    error.value = 'ไม่สามารถสร้าง QR Code ได้: ' + error.message
  }
}

// ยืนยันการชำระเงิน
const confirmPayment = async () => {
  try {
    const bookingId = route.params.booking_id
    
    // สร้าง payment record
    await createPayment({
      booking_id: bookingId,
      payment_method: 'PromptPay'
    })
    
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
    
    // จัดการข้อผิดพลาดเฉพาะกรณี
    if (error.response && error.response.status === 409) {
      alert('มีการชำระเงินสำหรับการจองนี้แล้ว')
    } else {
      alert('เกิดข้อผิดพลาดในการยืนยันการชำระเงิน กรุณาลองใหม่อีกครั้ง')
    }
  }
}

// Watch for changes in booking data and phone number
watch([bookingData, promptPayPhone], async ([newBookingData, newPhone]) => {
  if (newBookingData && newPhone) {
    console.log('Watch triggered - generating QR code')
    await generateQRCode()
  }
})

// สร้าง QR Code ด้วยข้อมูลทดสอบ (สำหรับ debug)
const generateTestQR = async () => {
  try {
    console.log('Generating test QR code...')
    const testPhone = '0875513773'
    const testAmount = 100.50
    
    const payload = generatePayload(testPhone, { amount: testAmount })
    const qrCodeDataURL = await QRCode.toDataURL(payload, {
      width: 256,
      margin: 2
    })
    qrCodeImage.value = qrCodeDataURL
    promptPayPhone.value = testPhone
    console.log('Test QR code generated successfully')
  } catch (error) {
    console.error('Error generating test QR:', error)
  }
}

onMounted(async () => {
  console.log('Payment component mounted')
  
  // ลองสร้าง QR ทดสอบก่อน
  await generateTestQR()
  
  // แล้วค่อยโหลดข้อมูลจริง
  await fetchBookingData()
  if (bookingData.value) {
    console.log('Generating QR code with real data')
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
                <div v-else-if="isLoading" class="flex items-center justify-center w-64 h-64 bg-gray-100 rounded-lg">
                  <span class="text-gray-500">กำลังสร้าง QR Code...</span>
                </div>
                <div v-else class="flex flex-col items-center justify-center w-64 h-64 bg-red-50 border border-red-200 rounded-lg">
                  <span class="text-red-500 text-sm text-center mb-2">ไม่สามารถสร้าง QR Code ได้</span>
                  <div class="flex gap-2">
                    <button @click="generateQRCode" class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                      ลองใหม่
                    </button>
                    <button @click="generateTestQR" class="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600">
                      ทดสอบ QR
                    </button>
                  </div>
                </div>
                <p class="text-sm text-gray-600 mt-2 text-center">
                  สแกนด้วยแอป Banking หรือ PromptPay<br>
                  <span class="text-xs text-gray-500">ชำระเงินไปที่: {{ promptPayPhone }}</span>
                </p>
                <!-- Debug info (remove in production) -->
                <div v-if="true" class="mt-2 p-2 bg-gray-100 rounded text-xs">
                  Debug: Phone={{ promptPayPhone }}, Amount={{ bookingData?.total_price }}, HasQR={{ !!qrCodeImage }}
                </div>
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