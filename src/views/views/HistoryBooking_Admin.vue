<script setup>
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getUserBookingHistory } from '../composables/getData'

const route = useRoute()
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
    <div class="bg-[#212121] p-32 pt-16">
        <div class="grid justify-center text-white">
            <div class="flex mb-10">
                <router-link to="/admin" class="flex items-center">
                        <div><ChevronLeftIcon class="w-6 h-6"/></div>
                        <div class="text-white text-xl">กลับไปยังหน้าการจัดการ</div>
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
                    <tr v-if="isLoading">
                        <td colspan="6" class="text-center">กำลังโหลดข้อมูล...</td>
                    </tr>
                    <tr v-else-if="userBookings.length === 0">
                        <td colspan="6" class="text-center">ไม่มีประวัติการจอง</td>
                    </tr>
                    <tr v-else class="border border-l-0 border-r-0" v-for="(booking, index) in userBookings" :key="booking.id">
                        <td>{{ index + 1 }}</td>
                        <td class="border">{{ booking.hotel_name || 'ไม่ระบุ' }}</td>
                        <td class="border">{{ booking.room_type || 'ไม่ระบุ' }}</td>
                        <td>{{ booking.check_in_date || 'ไม่ระบุ' }}</td>
                        <td class="border">{{ booking.check_out_date || 'ไม่ระบุ' }}</td>
                        <td class="border">{{ booking.total_price ? booking.total_price.toLocaleString() : '0' }} บาท</td>
                        <td class="border">{{ booking.booking_status || 'ไม่ระบุ' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
    th{
        padding: 4px;
        text-align: left;
        padding-left: 24px;
        padding-bottom: 16px;
    }
    td{
        padding: 36px;
    }
</style>