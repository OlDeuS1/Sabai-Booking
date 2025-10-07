<script setup>

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserCur, getHotelByOwnerId, deleteHotel } from '../composables/getData.js'


const router = useRouter()
const ImageTest = `/src/views/assets/images/test.png`

const hotels = ref([])
const isLoading = ref(true)
const showDeleteModal = ref(false)
const selectedHotels = ref([])
const isSelectionMode = ref(false)

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

// ฟังก์ชันเข้าสู่โหมดเลือกโรงแรม
const handleDeleteHotel = () => {
  if (hotels.value.length === 0) {
    alert('ไม่มีโรงแรมให้ลบ')
    return
  }
  isSelectionMode.value = true
  selectedHotels.value = []
}

// ฟังก์ชันเลือก/ยกเลิกเลือกโรงแรม
const toggleHotelSelection = (hotel) => {
  const index = selectedHotels.value.findIndex(h => h.hotel_id === hotel.hotel_id)
  if (index > -1) {
    // ถ้าเลือกไว้แล้ว ให้ยกเลิก
    selectedHotels.value.splice(index, 1)
  } else {
    // ถ้ายังไม่ได้เลือก ให้เพิ่มเข้าไป
    selectedHotels.value.push(hotel)
  }
}

// ตรวจสอบว่าโรงแรมนี้ถูกเลือกหรือไม่
const isHotelSelected = (hotel) => {
  return selectedHotels.value.some(h => h.hotel_id === hotel.hotel_id)
}

// ฟังก์ชันยกเลิกการเลือก
const cancelSelection = () => {
  isSelectionMode.value = false
  selectedHotels.value = []
}

// ฟังก์ชันยืนยันการลบโรงแรมที่เลือก
const confirmDeleteSelectedHotels = () => {
  if (selectedHotels.value.length === 0) {
    alert('กรุณาเลือกโรงแรมที่ต้องการลบ')
    return
  }
  showDeleteModal.value = true
}

const confirmDeleteHotels = async () => {
  if (!selectedHotels.value || selectedHotels.value.length === 0) return
  
  try {
    // ลบโรงแรมทีละโรงแรม
    const deletePromises = selectedHotels.value.map(hotel => deleteHotel(hotel.hotel_id))
    await Promise.all(deletePromises)
    
    // ลบโรงแรมออกจาก array ในหน้า UI
    const deletedIds = selectedHotels.value.map(h => h.hotel_id)
    hotels.value = hotels.value.filter(h => !deletedIds.includes(h.hotel_id))
    
    const hotelCount = selectedHotels.value.length
    alert(`ซ่อนโรงแรม ${hotelCount} แห่งเรียบร้อยแล้ว`)
  } catch (error) {
    console.error('Error deleting hotels:', error)
    alert('เกิดข้อผิดพลาดในการลบโรงแรม: ' + error.message)
  } finally {
    showDeleteModal.value = false
    isSelectionMode.value = false
    selectedHotels.value = []
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
}

const handleAddHotel = () => {
  console.log('Handle add hotel clicked')
  router.push('/hotel-management/create')
}

const handleViewBookings = (hotelId) => {
  console.log('Handle view bookings clicked for hotel:', hotelId)
  router.push(`/hotel-management/${hotelId}/bookings`)
}

const handleEditHotel = (hotelId) => {
  console.log('Handle edit hotel clicked for hotel:', hotelId)
  router.push(`/hotel-management/${hotelId}/edit`)
}

</script>

<template>
  <div class="admin__hotel bg-[#102B58] text-white">
      <div class="admin__hotel-container max-w-7xl mx-auto px-[32px] py-[8px] flex flex-col h-screen sticky top-0 left-0">
          <div class="admin__hotel-header flex justify-between items-center">
            <h1 class="text-4xl font-semibold text-left mt-12 mb-12">My Hotel</h1>
            <div class="admin__hotel-button flex justify-center items-center gap-6">
              <!-- ปุ่มเมื่อไม่ได้อยู่ในโหมดเลือก -->
              <template v-if="!isSelectionMode">
                <button @click="handleDeleteHotel" class="bg-red-600 cursor-pointer text-white py-2 px-6 rounded-md font-semibold hover:bg-red-700 transition-colors">ลบโรงแรม</button>
                <button @click="handleAddHotel" class="bg-green-500 cursor-pointer text-white py-2 px-6 rounded-md font-semibold hover:bg-green-600 transition-colors">เพิ่มโรงแรม</button>
              </template>
              
              <!-- ปุ่มเมื่ออยู่ในโหมดเลือก -->
              <template v-else>
                <span class="text-lg font-medium">เลือกโรงแรมที่ต้องการลบ ({{ selectedHotels.length }})</span>
                <button @click="cancelSelection" class="bg-gray-500 cursor-pointer text-white py-2 px-6 rounded-md font-semibold hover:bg-gray-600 transition-colors">ยกเลิก</button>
                <button @click="confirmDeleteSelectedHotels" 
                        :disabled="selectedHotels.length === 0"
                        :class="{ 'opacity-50 cursor-not-allowed': selectedHotels.length === 0 }"
                        class="bg-red-600 cursor-pointer text-white py-2 px-6 rounded-md font-semibold hover:bg-red-700 transition-colors">
                  ลบที่เลือก ({{ selectedHotels.length }})
                </button>
              </template>
            </div>
          </div>
          <div class="mt-4">
            <div class="grid grid-cols-4 gap-10 w-full">
              <div v-if="isLoading" class="col-span-4 text-center py-10 text-lg">Loading...</div>
              <div v-else-if="hotels.length === 0" class="col-span-4 text-center py-10 text-lg">ไม่พบโรงแรมของคุณ</div>
              <div v-else v-for="hotel in hotels" :key="hotel.hotel_id" 
                   class="p-6 rounded-md shadow-2xl bg-white text-black relative transition-all duration-200"
                   :class="{ 'ring-4 ring-red-400 bg-red-50': isSelectionMode && isHotelSelected(hotel) }">
                
                <!-- Selection Checkbox (แสดงเมื่ออยู่ในโหมดเลือก) -->
                <div v-if="isSelectionMode" 
                     @click="toggleHotelSelection(hotel)"
                     class="absolute top-4 right-4 w-8 h-8 rounded-full border-2 cursor-pointer flex items-center justify-center transition-colors z-10"
                     :class="isHotelSelected(hotel) ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300 hover:border-red-400'">
                  <svg v-if="isHotelSelected(hotel)" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                
                <img :src="hotel.image_urls && hotel.image_urls.length > 0 ? hotel.image_urls[0] : ImageTest" alt="hotel-image" class="w-75 h-45 object-cover m-auto rounded-md">
                <div class="text-center p-4 font-bold text-[18px]">{{ hotel.hotel_name }} | {{ hotel.city }}</div>
                
                <!-- ปุ่มปกติ (แสดงเมื่อไม่ได้อยู่ในโหมดเลือก) -->
                <div v-if="!isSelectionMode" class="flex justify-end gap-2">
                  <button @click="handleViewBookings(hotel.hotel_id)" class="text-white bg-[#102B58] text-[14px] font-semibold p-2.5 cursor-pointer rounded-sm hover:bg-blue-900 transition-colors">ดูการจอง</button>
                  <button @click="handleEditHotel(hotel.hotel_id)" class="text-white bg-[#102B58] text-[14px] font-semibold p-2.5 cursor-pointer rounded-sm hover:bg-blue-900 transition-colors">แก้ไขรายละเอียด</button>
                </div>
                
                <!-- แสดงสถานะเลือกแล้ว (แสดงเมื่ออยู่ในโหมดเลือก) -->
                <div v-if="isSelectionMode" class="flex justify-center mt-2">
                  <span v-if="isHotelSelected(hotel)" class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ✓ เลือกแล้ว
                  </span>
                  <span v-else class="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
                    คลิกเพื่อเลือก
                  </span>
                </div>
              </div>
            </div>
        </div>
      </div>

      <!-- Modal ยืนยันการลบ -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white text-black p-6 rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
          <h3 class="text-xl font-semibold mb-4 text-center">ยืนยันการลบโรงแรม</h3>
          
          <!-- แสดงรายการโรงแรมที่จะลบ -->
          <div class="mb-4">
            <p class="text-gray-700 mb-3 text-center">
              คุณต้องการลบโรงแรมจำนวน {{ selectedHotels.length }} แห่ง ดังต่อไปนี้:
            </p>
            <div class="max-h-48 overflow-y-auto bg-gray-50 rounded-lg p-3">
              <div v-for="hotel in selectedHotels" :key="hotel.hotel_id" 
                   class="flex items-center gap-3 py-2 border-b border-gray-200 last:border-b-0">
                <img :src="hotel.image_urls && hotel.image_urls.length > 0 ? hotel.image_urls[0] : ImageTest" 
                     alt="hotel-image" class="w-12 h-9 object-cover rounded">
                <div class="flex-1">
                  <div class="font-medium text-sm">{{ hotel.hotel_name }}</div>
                  <div class="text-xs text-gray-600">{{ hotel.city }}, {{ hotel.country }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <p class="text-orange-600 text-sm mb-6 text-center">
            ⚠️ โรงแรมที่ลบจะถูกซ่อนและไม่แสดงในระบบ
          </p>
          
          <div class="flex justify-center gap-4">
            <button @click="cancelDelete" 
                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors">
              ยกเลิก
            </button>
            <button @click="confirmDeleteHotels" 
                    class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
              ยืนยันลบทั้งหมด ({{ selectedHotels.length }})
            </button>
          </div>
        </div>
      </div>
  </div>
</template>