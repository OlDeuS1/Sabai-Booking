<script setup>

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserCur, getHotelByOwnerId } from '../composables/getData.js'


const router = useRouter()
const ImageTest = `/src/views/assets/images/test.png`

const hotels = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const user = await getUserCur()
    if (user && user.user_id) {
      const res = await getHotelByOwnerId(user.user_id)
      hotels.value = res || []
      console.log('Hotels:', hotels.value)
    }
  } catch (e) {
    console.error('Error loading hotels:', e)
  } finally {
    isLoading.value = false
  }
})

// Handle functions สำหรับปุ่มต่างๆ
const handleDeleteHotel = () => {
  console.log('Handle delete hotel clicked')
  // TODO: Add delete hotel logic
}

const handleAddHotel = () => {
  console.log('Handle add hotel clicked')
  // TODO: Add navigation to create hotel page
  // router.push('/hotel-management/create')
}

const handleViewBookings = (hotelId) => {
  console.log('Handle view bookings clicked for hotel:', hotelId)
  // TODO: Add navigation to hotel bookings page
  router.push(`/hotel-management/${hotelId}/bookings`)
}

const handleEditHotel = (hotelId) => {
  console.log('Handle edit hotel clicked for hotel:', hotelId)
  // TODO: Add navigation to edit hotel page
  // router.push(`/hotel/${hotelId}/edit`)
}

</script>

<template>
  <div class="admin__hotel bg-[#102B58] text-white">
      <div class="admin__hotel-container max-w-7xl mx-auto px-[32px] py-[8px] flex flex-col h-screen sticky top-0 left-0">
          <div class="admin__hotel-header flex justify-between items-center">
            <h1 class="text-4xl font-semibold text-left mt-12 mb-12">My Hotel</h1>
            <div class="admin__hotel-button flex justify-center items-center gap-6">
              <button @click="handleDeleteHotel" class="bg-red-700 cursor-pointer text-white py-2 px-6 rounded-md font-semibold hover:bg-red-800 transition-colors">ลบโรงแรม</button>
              <button @click="handleAddHotel" class="bg-green-500 cursor-pointer text-white py-2 px-6 rounded-md font-semibold hover:bg-green-600 transition-colors">เพิ่มโรงแรม</button>
            </div>
          </div>
          <div class="mt-4">
            <div class="grid grid-cols-4 gap-10 w-full">
              <div v-if="isLoading" class="col-span-4 text-center py-10 text-lg">Loading...</div>
              <div v-else-if="hotels.length === 0" class="col-span-4 text-center py-10 text-lg">ไม่พบโรงแรมของคุณ</div>
              <div v-else v-for="hotel in hotels" :key="hotel.hotel_id" class="p-6 rounded-md shadow-2xl bg-white text-black">
                <img :src="hotel.image_urls && hotel.image_urls.length > 0 ? hotel.image_urls[0] : ImageTest" alt="hotel-image" class="w-75 h-45 object-cover m-auto rounded-md">
                <div class="text-center p-4 font-bold text-[18px]">{{ hotel.hotel_name }} | {{ hotel.city }}</div>
                <div class="flex justify-end gap-2">
                  <button @click="handleViewBookings(hotel.hotel_id)" class="text-white bg-[#102B58] text-[14px] font-semibold p-2.5 cursor-pointer rounded-sm">ดูการจอง</button>
                  <button @click="handleEditHotel(hotel.hotel_id)" class="text-white bg-[#102B58] text-[14px] font-semibold p-2.5 cursor-pointer rounded-sm">แก้ไขรายละเอียด</button>
                </div>
              </div>
            </div>
        </div>
      </div>
  </div>
</template>