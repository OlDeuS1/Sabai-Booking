<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getHotelById, updateHotel } from '../composables/getData.js'

const router = useRouter()
const route = useRoute()
const hotelId = route.params.hotelId

const images = ref({
    main: null,
    sub1: null,
    sub2: null
})

// Hotel basic info
const hotelName = ref('')
const description = ref('')
const address = ref('')
const city = ref('')
const country = ref('ไทย')
const contactPhone = ref('')
const contactEmail = ref('')

// Amenities
const newAmenity = ref('')
const amenities = ref([])

// Room types
const newRoom = ref({
    room_type: '',
    price_per_night: 0,
    max_guests: 1,
    beds: 1,
    quantity: 1
})
const roomTypes = ref([])

// Form states
const isSubmitting = ref(false)
const isLoading = ref(true)
const hotel = ref(null)

const mainFileInput = ref(null)
const sub1FileInput = ref(null)
const sub2FileInput = ref(null)

// โหลดข้อมูลโรงแรมเมื่อเริ่มต้น
onMounted(async () => {
  try {
    const foundHotel = await getHotelById(hotelId)
    
    if (foundHotel) {
      hotel.value = foundHotel
      // เติมข้อมูลลงในฟอร์ม
      hotelName.value = foundHotel.hotel_name || ''
      description.value = foundHotel.description || ''
      address.value = foundHotel.address || ''
      city.value = foundHotel.city || ''
      country.value = foundHotel.country || 'ไทย'
      contactPhone.value = foundHotel.contact_phone || ''
      contactEmail.value = foundHotel.contact_email || ''
      
      // แปลง amenities จาก string เป็น array
      if (foundHotel.amenities) {
        amenities.value = foundHotel.amenities.split(', ').filter(a => a.trim())
      }
      
      // เติมรูปภาพ
      if (foundHotel.image_urls && foundHotel.image_urls.length > 0) {
        images.value.main = foundHotel.image_urls[0] || null
        images.value.sub1 = foundHotel.image_urls[1] || null  
        images.value.sub2 = foundHotel.image_urls[2] || null
      }
      
      // เติมข้อมูลห้องพัก
      roomTypes.value = foundHotel.rooms || []
    } else {
      alert('ไม่พบข้อมูลโรงแรม')
      router.push('/hotel-management')
    }
  } catch (error) {
    console.error('Error loading hotel:', error)
    alert('เกิดข้อผิดพลาดในการโหลดข้อมูลโรงแรม')
    router.push('/hotel-management')
  } finally {
    isLoading.value = false
  }
})

const canAddRoom = computed(() => {
    const { room_type, price_per_night, max_guests, beds, quantity } = newRoom.value
    
    if (!room_type.trim() || price_per_night <= 0 || max_guests <= 0 || beds <= 0 || quantity <= 0) {
        return false
    }

    // ตรวจสอบว่าไม่มี room type ซ้ำ
    return !roomTypes.value.some(room =>
        room.room_type === room_type.trim() && 
        room.beds === beds && 
        room.max_guests === max_guests
    )
})

const triggerFileInput = (type) => {
    const fileInputMap = {
        main: mainFileInput,
        sub1: sub1FileInput,
        sub2: sub2FileInput
    }
    fileInputMap[type].value?.click()
}

const handleImageUpload = (type, event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            images.value[type] = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const addAmenity = () => {
    const amenity = newAmenity.value.trim()
    if (amenity && !amenities.value.includes(amenity)) {
        amenities.value.push(amenity)
        newAmenity.value = ''
    }
}

const removeAmenity = (index) => {
    amenities.value.splice(index, 1)
}

const addRoomType = () => {
    if (canAddRoom.value) {
        roomTypes.value.push({
            room_type: newRoom.value.room_type.trim(),
            price_per_night: parseFloat(newRoom.value.price_per_night),
            max_guests: parseInt(newRoom.value.max_guests),
            beds: parseInt(newRoom.value.beds),
            quantity: parseInt(newRoom.value.quantity)
        })
        newRoom.value = {
            room_type: '',
            price_per_night: 0,
            max_guests: 1,
            beds: 1,
            quantity: 1
        }
    }
}

const removeRoomType = (index) => {
    roomTypes.value.splice(index, 1)
}

const validateForm = () => {
    if (!hotelName.value.trim()) {
        alert('กรุณากรอกชื่อโรงแรม')
        return false
    }
    
    if (!address.value.trim()) {
        alert('กรุณากรอกที่อยู่โรงแรม')
        return false
    }
    
    if (!city.value.trim()) {
        alert('กรุณากรอกเมือง')
        return false
    }
    
    if (roomTypes.value.length === 0) {
        alert('กรุณาเพิ่มประเภทห้องพักอย่างน้อย 1 ประเภท')
        return false
    }
    
    return true
}

const submitForm = async () => {
    if (!validateForm()) {
        return
    }

    if (isSubmitting.value) {
        return
    }

    isSubmitting.value = true

    try {
        // เตรียมข้อมูลรูปภาพ
        const imageUrls = Object.values(images.value).filter(img => img !== null)

        const hotelData = {
            hotel_name: hotelName.value.trim(),
            description: description.value.trim(),
            address: address.value.trim(),
            city: city.value.trim(),
            country: country.value.trim(),
            contact_phone: contactPhone.value.trim(),
            contact_email: contactEmail.value.trim(),
            amenities: amenities.value,
            image_urls: imageUrls,
            rooms: roomTypes.value
        }

        // เรียก API สำหรับอัพเดทโรงแรม
        const response = await updateHotel(hotelId, hotelData)
        
        console.log('Hotel update response:', response)
        alert('อัพเดทข้อมูลโรงแรมเรียบร้อยแล้ว!')
        
        router.push('/hotel-management')
    } catch (error) {
        console.error('Error updating hotel:', error)
        alert('เกิดข้อผิดพลาดในการอัพเดทโรงแรม: ' + error.message)
    } finally {
        isSubmitting.value = false
    }
}

const goBack = () => {
    router.push('/hotel-management')
}
</script>

<template>
  <div class="create-hotel bg-[#102B58] text-white min-h-screen">
    <div class="create-hotel-container max-w-4xl mx-auto px-8 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="text-2xl">กำลังโหลดข้อมูลโรงแรม...</div>
      </div>

      <!-- Form -->
      <div v-else>
        <div class="header mb-8">
          <button @click="goBack" class="text-white hover:text-gray-300 mb-4">
            ← กลับไปหน้าจัดการโรงแรม
          </button>
          <h1 class="text-4xl font-bold text-center">แก้ไขข้อมูลโรงแรม</h1>
          <p class="text-gray-300 text-center mt-2">แก้ไขข้อมูลโรงแรม "{{ hotelName }}"</p>
        </div>

        <form @submit.prevent="submitForm" class="space-y-8">
          <!-- Basic Information -->
          <div class="bg-white/10 rounded-lg p-6">
            <h2 class="text-2xl font-semibold mb-4">ข้อมูลพื้นฐาน</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">ชื่อโรงแรม *</label>
                <input v-model="hotelName" 
                       type="text" 
                       class="w-full px-3 py-2 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       required>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">เมือง *</label>
                <input v-model="city" 
                       type="text" 
                       class="w-full px-3 py-2 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       required>
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium mb-2">คำอธิบายโรงแรม</label>
              <textarea v-model="description" 
                        rows="3" 
                        class="w-full px-3 py-2 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </textarea>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium mb-2">ที่อยู่โรงแรม *</label>
              <textarea v-model="address" 
                        rows="2" 
                        class="w-full px-3 py-2 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required>
              </textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label class="block text-sm font-medium mb-2">ประเทศ</label>
                <input v-model="country" 
                       type="text" 
                       class="w-full px-3 py-2 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">เบอร์โทรติดต่อ</label>
                <input v-model="contactPhone" 
                       type="tel" 
                       class="w-full px-3 py-2 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">อีเมลติดต่อ</label>
                <input v-model="contactEmail" 
                       type="email" 
                       class="w-full px-3 py-2 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>
          </div>

          <!-- Images Section -->
          <div class="bg-white/10 rounded-lg p-6">
            <h2 class="text-2xl font-semibold mb-4">รูปภาพโรงแรม</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Main Image -->
              <div>
                <label class="block text-sm font-medium mb-2">รูปภาพหลัก</label>
                <div @click="triggerFileInput('main')" 
                     class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 min-h-[200px] flex items-center justify-center">
                  <div v-if="!images.main" class="text-gray-400">
                    คลิกเพื่อเลือกรูปภาพหลัก
                  </div>
                  <img v-else :src="images.main" alt="Main" class="max-h-40 max-w-full object-cover rounded">
                </div>
                <input ref="mainFileInput" 
                       type="file" 
                       accept="image/*" 
                       @change="handleImageUpload('main', $event)" 
                       class="hidden">
              </div>

              <!-- Sub Image 1 -->
              <div>
                <label class="block text-sm font-medium mb-2">รูปภาพที่ 2</label>
                <div @click="triggerFileInput('sub1')" 
                     class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 min-h-[200px] flex items-center justify-center">
                  <div v-if="!images.sub1" class="text-gray-400">
                    คลิกเพื่อเลือกรูปภาพที่ 2
                  </div>
                  <img v-else :src="images.sub1" alt="Sub 1" class="max-h-40 max-w-full object-cover rounded">
                </div>
                <input ref="sub1FileInput" 
                       type="file" 
                       accept="image/*" 
                       @change="handleImageUpload('sub1', $event)" 
                       class="hidden">
              </div>

              <!-- Sub Image 2 -->
              <div>
                <label class="block text-sm font-medium mb-2">รูปภาพที่ 3</label>
                <div @click="triggerFileInput('sub2')" 
                     class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 min-h-[200px] flex items-center justify-center">
                  <div v-if="!images.sub2" class="text-gray-400">
                    คลิกเพื่อเลือกรูปภาพที่ 3
                  </div>
                  <img v-else :src="images.sub2" alt="Sub 2" class="max-h-40 max-w-full object-cover rounded">
                </div>
                <input ref="sub2FileInput" 
                       type="file" 
                       accept="image/*" 
                       @change="handleImageUpload('sub2', $event)" 
                       class="hidden">
              </div>
            </div>
          </div>

          <!-- Amenities Section -->
          <div class="bg-white/10 rounded-lg p-6">
            <h2 class="text-2xl font-semibold mb-4">สิ่งอำนวยความสะดวก</h2>
            
            <div class="flex gap-2 mb-4">
              <input v-model="newAmenity" 
                     @keyup.enter="addAmenity"
                     type="text" 
                     placeholder="เพิ่มสิ่งอำนวยความสะดวก" 
                     class="flex-1 px-3 py-2 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <button type="button" 
                      @click="addAmenity" 
                      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                เพิ่ม
              </button>
            </div>

            <div class="flex flex-wrap gap-2">
              <span v-for="(amenity, index) in amenities" 
                    :key="index" 
                    class="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {{ amenity }}
                <button type="button" 
                        @click="removeAmenity(index)" 
                        class="text-blue-600 hover:text-blue-800">
                  ×
                </button>
              </span>
            </div>
          </div>

          <!-- Room Types Section -->
          <div class="bg-white/10 rounded-lg p-6">
            <h2 class="text-2xl font-semibold mb-4">ประเภทห้องพัก</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <input v-model="newRoom.room_type" 
                       type="text" 
                       placeholder="ประเภทห้อง" 
                       class="w-full px-3 py-2 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <input v-model.number="newRoom.price_per_night" 
                       type="number" 
                       placeholder="ราคา/คืน" 
                       min="0" 
                       class="w-full px-3 py-2 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <input v-model.number="newRoom.max_guests" 
                       type="number" 
                       placeholder="จำนวนคน" 
                       min="1" 
                       class="w-full px-3 py-2 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <input v-model.number="newRoom.beds" 
                       type="number" 
                       placeholder="จำนวนเตียง" 
                       min="1" 
                       class="w-full px-3 py-2 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div class="flex gap-2">
                <input v-model.number="newRoom.quantity" 
                       type="number" 
                       placeholder="จำนวนห้อง" 
                       min="1" 
                       class="w-full px-3 py-2 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button type="button" 
                        @click="addRoomType" 
                        :disabled="!canAddRoom"
                        :class="{ 'opacity-50 cursor-not-allowed': !canAddRoom }"
                        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  เพิ่ม
                </button>
              </div>
            </div>

            <!-- Room Types List -->
            <div v-if="roomTypes.length > 0" class="space-y-2">
              <div v-for="(room, index) in roomTypes" 
                   :key="index" 
                   class="flex items-center justify-between bg-white/20 p-3 rounded-md">
                <div class="flex-1">
                  <span class="font-medium">{{ room.room_type }}</span> - 
                  <span>{{ room.price_per_night.toLocaleString() }} บาท/คืน</span> - 
                  <span>{{ room.max_guests }} คน</span> - 
                  <span>{{ room.beds }} เตียง</span> - 
                  <span>{{ room.quantity }} ห้อง</span>
                </div>
                <button type="button" 
                        @click="removeRoomType(index)" 
                        class="text-red-400 hover:text-red-300 ml-2">
                  ลบ
                </button>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center gap-4">
            <button type="button" 
                    @click="goBack" 
                    class="px-8 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-semibold">
              ยกเลิก
            </button>
            <button type="submit" 
                    :disabled="isSubmitting"
                    :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
                    class="px-8 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 font-semibold">
              {{ isSubmitting ? 'กำลังอัพเดท...' : 'อัพเดทโรงแรม' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>