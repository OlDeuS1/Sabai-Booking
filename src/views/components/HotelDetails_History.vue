<script setup>
const Calendar = `/src/views/assets/icons/calendar.png`
const Amount = `/src/views/assets/icons/amount-room.png`
const Price = `/src/views/assets/icons/price.png`
const ImageTest = `/src/views/assets/images/test.png`
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

const props = defineProps({
    booking: {
        type: Object,
        required: true,
    }
});

const booking = ref({ ...props.booking });

const ThaiMonth = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม'
]

const checkIn = new Date(booking.value.check_in_date)
const checkOut = new Date(booking.value.check_out_date)

const checkInDay = dayjs(checkIn).date()
const checkOutDay = dayjs(checkOut).date()

const checkInMonth = ThaiMonth[dayjs(checkIn).month()]
const checkOutMonth = ThaiMonth[dayjs(checkOut).month()]

const checkInYear = dayjs(checkIn).year() + 543
const checkOutYear = dayjs(checkOut).year() + 543

const rating = ref(0)
const dialogVisible = ref(false)
const router = useRouter()
const currentTime = ref(new Date())
let timeInterval = null

// คำนวณเวลาที่เหลือสำหรับการชำระเงิน
const timeRemaining = computed(() => {
    if (booking.value.booking_status !== 'pending' || !booking.value.expires_at) {
        return null
    }
    
    const expireTime = new Date(booking.value.expires_at)
    const now = currentTime.value
    const diff = expireTime.getTime() - now.getTime()
    
    if (diff <= 0) {
        return { expired: true }
    }
    
    const minutes = Math.floor(diff / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    return {
        expired: false,
        minutes,
        seconds,
        total: diff
    }
})

// ฟังก์ชันไปหน้าชำระเงิน
const goToPayment = () => {
    router.push(`/payment/${booking.value.booking_id}`)
}

// อัพเดทเวลาทุกวินาที
onMounted(() => {
    timeInterval = setInterval(() => {
        currentTime.value = new Date()
    }, 1000)
})

onUnmounted(() => {
    if (timeInterval) {
        clearInterval(timeInterval)
    }
})
</script>

<template>
    <div class="grid mt-5 mb-10 justify-center">
        <div class="flex shadow-2xl rounded-lg p-4">
            <img :src="booking.hotel_image" alt="test-hotel-image" class="w-50 h-50 object-cover rounded-md">
            <div class="grid p-8 pt-0 w-250">
                <!-- ชื่อโรงแรม -->
                <div class="font-bold text-[24px]">
                    <span>{{ booking.hotel_name }}</span>
                </div> 
                <!-- วันที่จองเข้า - ออก -->
                <div class="inline-flex gap-1.5">
                    <img :src="Calendar" alt="calendar" class="w-6 h-6">
                    <span class="">{{ checkInDay }} {{ checkInMonth }} {{ checkInYear }} - {{ checkOutDay }} {{ checkOutMonth }} {{ checkOutYear }}</span>
                </div>
                <!-- จำนวนห้องที่พัก/คืน -->
                <div class="inline-flex gap-1.5">
                    <span class="">ห้อง : {{ booking.room_type }}</span>
                </div>
                <div class="inline-flex gap-1.5">
                    <span class="">ผู้เข้าพัก : {{ booking.num_guests }}</span>
                </div>
                <!-- จำนวนเงิน -->
                <div class="inline-flex gap-1.5">
                    <img :src="Price" alt="price" class="w-6 h-6">
                    <span class="">{{ booking.total_price }}</span>
                </div>
            </div>
            <div class="flex items-end mr-4 gap-3">
                <!-- ปุ่มรีวิวสำหรับ booking ที่เสร็จสิ้นแล้ว -->
                <div class="pb-2 w-auto rounded-sm font-semibold cursor-pointer" v-if="booking.booking_status === 'completed'">
                    <el-rate v-model="rating" @click="dialogVisible = true" allow-half />
                </div>
                
                <!-- ปุ่มชำระเงินและเวลาที่เหลือสำหรับ booking ที่ยังเป็น pending -->
                <div v-if="booking.booking_status === 'pending'" class="pb-2 text-center">
                    <!-- แสดงเวลาที่เหลือ -->
                    <div v-if="timeRemaining" class="mb-2 text-sm">
                        <div v-if="timeRemaining.expired" class="text-red-500 font-semibold">
                            หมดเวลาชำระเงิน
                        </div>
                        <div v-else class="text-orange-600 font-semibold">
                            เวลาที่เหลือ: {{ timeRemaining.minutes }}:{{ String(timeRemaining.seconds).padStart(2, '0') }}
                        </div>
                    </div>
                    <!-- ปุ่มชำระเงิน -->
                    <el-button 
                        v-if="!timeRemaining?.expired"
                        style="padding: 1rem;" 
                        type="warning" 
                        @click="goToPayment" 
                        size="small">
                        ชำระเงิน
                    </el-button>
                </div>

                <el-dialog v-model="dialogVisible" title="ยืนยันการส่งรีวิวโรงแรม" width="500" :before-close="handleClose">
                    <span>คุณแน่ใจหรือไม่ว่าต้องการส่งรีวิวนี้? เมื่อส่งแล้วจะไม่สามารถแก้ไขได้</span>
                    <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="dialogVisible = false">ยกเลิก</el-button>
                        <el-button type="primary" @click="dialogVisible = false">ยืนยัน</el-button>
                    </div>
                    </template>
                </el-dialog>
                
                <!-- Status badge -->
                <div class="p-2.5 text-center w-30 text-white rounded-sm font-semibold" 
                    :class="{
                        'bg-[#00D35F]': booking.booking_status === 'completed',
                        'bg-[#F2B900]': booking.booking_status === 'pending',
                        'bg-red-500': booking.booking_status === 'cancelled',
                        'bg-blue-500': booking.booking_status === 'confirmed'
                    }">
                    {{ booking.booking_status }}
                </div>
            </div>
        </div>
    </div>
</template>