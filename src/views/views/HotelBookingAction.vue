<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getHotelBookings, updateBookingStatus } from '../composables/getData.js';

const route = useRoute();
const hotelId = route.params.hotelId;
const bookings = ref([]);
const isLoading = ref(true);
const hotelName = ref('');

// Status colors mapping
const getStatusColor = (status) => {
  switch(status) {
    case 'pending': return 'bg-[#F2B900]';
    case 'confirmed': return 'bg-[#178649]';
    case 'completed': return 'bg-[#153C7E]';
    case 'cancelled': return 'bg-[#B50A0A]';
    default: return 'bg-gray-500';
  }
};

// Status text mapping
const getStatusText = (status) => {
  switch(status) {
    case 'pending': return 'กำลังรอยืนยัน';
    case 'confirmed': return 'การจองถูกยืนยันแล้ว';
    case 'completed': return 'การจองเสร็จสิ้น';
    case 'cancelled': return 'การจองถูกยกเลิก';
    default: return status;
  }
};

// Format date to Thai format
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('th-TH');
};

// // Confirm booking
// const confirmBooking = async (booking) => {
//   try {
//     await updateBookingStatus(booking.booking_id, 'confirmed');
//     booking.booking_status = 'confirmed';
//     alert(`ยืนยันการจองของ ${booking.first_name} ${booking.last_name} เรียบร้อยแล้ว`);
//   } catch (error) {
//     console.error('Error confirming booking:', error);
//     alert('เกิดข้อผิดพลาดในการยืนยันการจอง');
//   }
// };

// // Cancel booking
// const cancelBooking = async (booking) => {
//   if (confirm(`คุณแน่ใจหรือไม่ที่จะยกเลิกการจองของ ${booking.first_name} ${booking.last_name}?`)) {
//     try {
//       await updateBookingStatus(booking.booking_id, 'cancelled');
//       booking.booking_status = 'cancelled';
//       alert(`ยกเลิกการจองของ ${booking.first_name} ${booking.last_name} เรียบร้อยแล้ว`);
//     } catch (error) {
//       console.error('Error canceling booking:', error);
//       alert('เกิดข้อผิดพลาดในการยกเลิกการจอง');
//     }
//   }
// };

onMounted(async () => {
  try {
    const data = await getHotelBookings(hotelId);
    bookings.value = data;
    if (data.length > 0) {
      hotelName.value = data[0].hotel_name;
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
    <div class="min-h-screen bg-[#102B58] p-8">
        <div class="max-w-8xl px-24 mx-auto">
            <div class="px-18">
                <router-link to="/hotel-management" class="inline-flex items-center text-white font-semibold mb-10 cursor-pointer">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    กลับไปยังหน้าหลัก
                </router-link>

                <h1 class="text-3xl font-bold text-white mb-8">
                    การจองของ <span class="text-[#00D35F]">{{ hotelName || 'โรงแรม' }}</span>
                </h1>
            </div>

            <div v-if="!isLoading">
                <div v-if="bookings.length === 0" class="text-white text-center py-8">
                    ไม่มีการจองสำหรับโรงแรมนี้
                </div>
                <table v-else class="w-full">
                    <thead>
                        <tr>
                            <th class="px-6 py-4 text-left text-white font-semibold">#</th>
                            <th class="px-6 py-4 text-left text-white font-semibold">ชื่อผู้จอง</th>
                            <th class="px-6 py-4 text-left text-white font-semibold">ประเภทห้องพัก</th>
                            <th class="px-6 py-4 text-left text-white font-semibold">จำนวนคน</th>
                            <th class="px-6 py-4 text-left text-white font-semibold">วันที่เข้าพัก</th>
                            <th class="px-6 py-4 text-left text-white font-semibold">วันที่ออก</th>
                            <th class="px-6 py-4 text-left text-white font-semibold">จำนวนเงิน</th>
                            <th class="px-6 py-4 text-left text-white font-semibold">การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(booking, index) in bookings" :key="booking.booking_id">
                            <td class="px-6 py-8 text-white">{{ index + 1 }}</td>
                            <td class="px-6 py-8 text-white border">คุณ {{ booking.first_name }} {{ booking.last_name }}</td>
                            <td class="px-6 py-8 text-white border">{{ booking.room_type }}</td>
                            <td class="px-6 py-8 text-white border">{{ booking.num_guests }} คน</td>
                            <td class="px-6 py-8 text-white border">{{ formatDate(booking.check_in_date) }}</td>
                            <td class="px-6 py-8 text-white border">{{ formatDate(booking.check_out_date) }}</td>
                            <td class="px-6 py-8 text-white border">{{ booking.total_price.toLocaleString() }} บาท</td>
                            <td class="px-6 py-8 border border-white">
                                <!-- Pending status with action buttons -->
                                <div v-if="booking.booking_status === 'pending'" class="flex gap-2">
                                    <button :class="`px-4 py-2 ${getStatusColor(booking.booking_status)} text-white rounded text-sm font-semibold`">
                                        {{ getStatusText(booking.booking_status) }}
                                    </button>
                                    <!-- <button
                                        @click="cancelBooking(booking)"
                                        class="px-4 py-2 bg-[#FF0000] text-white rounded text-sm font-semibold hover:bg-red-700 cursor-pointer">
                                        ยกเลิกการจอง
                                    </button>
                                    <button
                                        @click="confirmBooking(booking)"
                                        class="px-4 py-2 bg-[#00D35F] text-white rounded text-sm font-semibold hover:bg-green-600 cursor-pointer">
                                        ยืนยันการจอง
                                    </button> -->
                                </div>
                                
                                <!-- Other statuses (read-only) -->
                                <button v-else :class="`px-4 py-2 ${getStatusColor(booking.booking_status)} text-white rounded text-sm font-semibold`">
                                    {{ getStatusText(booking.booking_status) }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Loading state -->
            <div v-else class="text-white text-center py-8">
                กำลังโหลดข้อมูลการจอง...
            </div>
        </div>
    </div>
</template>