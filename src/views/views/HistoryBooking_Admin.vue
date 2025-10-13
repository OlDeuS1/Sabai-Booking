<script setup>
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFormat } from '../composables/useFormat'
import { getUserBookingHistory } from '../composables/getData'

const route = useRoute()
const { formatDate } = useFormat()
const userBookings = ref([])
const userName = ref('')
const isLoading = ref(true)

onMounted(async () => {
  const userId = route.params.userId
  const firstName = route.query.firstName || ''
  const lastName = route.query.lastName || ''
  userName.value = `${firstName} ${lastName}`
  
  try {
    userBookings.value = await getUserBookingHistory(userId)
  } catch (error) {
    console.error('Error fetching user bookings:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
    <div class="bg-[#212121] pt-16 pb-32">
        <div class="max-w-7xl mx-auto flex flex-col px-2 sm:px-6 lg:px-8 justify-center text-white">
            <div class="flex mb-10">
                <router-link to="/admin" class="flex items-center">
                        <div><ChevronLeftIcon class="w-6 h-6"/></div>
                        <div class="text-white text-xl hover:text-gray-300 transition-all">กลับไปยังหน้าการจัดการ</div>
                </router-link>
            </div>
            <div class="text-3xl mb-10">
                <span>ประวัติการจอง&nbsp;</span>
                <span class="text-[#00D35F]">คุณ {{ userName }}</span>
            </div>
            <table class="table-auto w-300">
                <thead>
                    <tr>
                        <th></th>
                        <th>ชื่อโรงแรม</th>
                        <th>ประเภทห้องพัก</th>
                        <th>วันที่เข้าพัก</th>
                        <th>วันที่ออก</th>
                        <th>จำนวนเงิน</th>
                        <th>สถานะ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="isLoading" class="border-y border-gray-500">
                        <td colspan="7" class="text-center text-gray-400" >กำลังโหลดข้อมูล...</td>
                    </tr>
                    <tr v-else-if="userBookings.length === 0" class="border-y border-gray-500">
                        <td colspan="7" class="text-center text-gray-400">ไม่มีประวัติการจอง</td>
                    </tr>
                    <tr v-else class="border-y border-gray-500" v-for="(booking, index) in userBookings" :key="booking.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ booking.hotel_name || 'ไม่ระบุ' }}</td>
                        <td>{{ booking.room_type || 'ไม่ระบุ' }}</td>
                        <td>{{ formatDate(booking.check_in_date) || 'ไม่ระบุ' }}</td>
                        <td>{{ formatDate(booking.check_out_date) || 'ไม่ระบุ' }}</td>
                        <td>{{ booking.total_price ? booking.total_price.toLocaleString() : '0' }} บาท</td>
                        <td>{{ booking.booking_status || 'ไม่ระบุ' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
    th{
        text-align: left;
        padding: 1rem 2rem;
    }
    td{
        padding: 2.5rem 2rem;
    }
</style>