<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { createHotel } from '../composables/getData.js'

const router = useRouter()

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

const mainFileInput = ref(null)
const sub1FileInput = ref(null)
const sub2FileInput = ref(null)

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
        const imageUrls = []
        if (images.value.main) imageUrls.push(images.value.main)
        if (images.value.sub1) imageUrls.push(images.value.sub1)
        if (images.value.sub2) imageUrls.push(images.value.sub2)

        const hotelData = {
            hotel_name: hotelName.value.trim(),
            description: description.value.trim(),
            address: address.value.trim(),
            city: city.value.trim(),
            country: country.value.trim(),
            star_rating: 3,
            contact_phone: contactPhone.value.trim(),
            contact_email: contactEmail.value.trim(),
            amenities: amenities.value,
            image_urls: imageUrls,
            rooms: roomTypes.value
        }

        console.log('Submitting hotel data:', hotelData)

        const result = await createHotel(hotelData)
        
        alert(`สร้างโรงแรม "${result.hotel.hotel_name}" สำเร็จ! รอการอนุมัติจากผู้ดูแลระบบ`)
        router.push('/hotel-management')
        
    } catch (error) {
        console.error('Error submitting hotel:', error)
        alert(error.response?.data?.error || 'เกิดข้อผิดพลาดในการสร้างโรงแรม')
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="bg-[#102B58] p-4">
        <div class="flex items-center justify-between max-w-4xl mx-auto mb-8 mt-8">
            <RouterLink to="/hotel-management" class="flex items-center text-white hover:text-green-400 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7">
                    </path>
                </svg>
                <span class="text-lg ml-2">กลับไปยังการจัดการโรงแรม</span>
            </RouterLink>
            <h1 class="text-white text-2xl font-semibold">เพิ่มโรงแรม</h1>
        </div>

        <div class="max-w-4xl mx-auto">
            <div class="lg:col-span-2 space-y-8 mb-8">
                <div class="relative bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                    <img v-if="images.main" :src="images.main" alt="Main image"
                        class="w-full h-full object-cover rounded-lg shadow-lg z-10 absolute">
                    <div class="text-center">
                        <button class="bg-green-500 text-white px-4 py-2 rounded cursor-pointer absolute z-20 -translate-y-1/2 -translate-x-1/2"
                            @click="triggerFileInput('main')">เพิ่มรูปภาพ</button>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="relative bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                        <img v-if="images.sub1" :src="images.sub1" alt="Sub image 1"
                            class="w-full h-full object-cover rounded-lg shadow-md z-10 absolute">
                        <button class="bg-green-500 text-white px-3 py-2 text-sm rounded cursor-pointer absolute z-20"
                            @click="triggerFileInput('sub1')">เพิ่มรูปภาพ</button>
                    </div>

                    <div class="relative bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                        <img v-if="images.sub2" :src="images.sub2" alt="Sub image 2"
                            class="w-full h-full object-cover rounded-lg shadow-md z-10 absolute">
                        <button class="bg-green-500 text-white px-3 py-2 text-sm rounded cursor-pointer absolute z-20"
                            @click="triggerFileInput('sub2')">เพิ่มรูปภาพ</button>
                    </div>
                </div>
            </div>

            <input ref="mainFileInput" type="file" accept="image/*" class="hidden"
                @change="handleImageUpload('main', $event)">
            <input ref="sub1FileInput" type="file" accept="image/*" class="hidden"
                @change="handleImageUpload('sub1', $event)">
            <input ref="sub2FileInput" type="file" accept="image/*" class="hidden"
                @change="handleImageUpload('sub2', $event)">

            <div class="space-y-6">
                <!-- Hotel Name -->
                <div>
                    <label class="block text-white mb-4 bg-[#212121] p-2 w-24 text-center rounded">ชื่อโรงแรม</label>
                    <input v-model="hotelName" type="text" placeholder="ชื่อโรงแรม"
                        class="w-full px-3 py-2 rounded bg-white text-black" required>
                </div>

                <!-- Description -->
                <div>
                    <label class="block text-white mb-4 bg-[#212121] p-2 w-42 text-center rounded">รายละเอียดโรงแรม</label>
                    <textarea v-model="description" placeholder="รายละเอียดเกี่ยวกับโรงแรม" rows="4"
                        class="bg-white text-black w-full px-3 py-2 rounded resize-none"></textarea>
                </div>

                <!-- Address -->
                <div>
                    <label class="block text-white mb-4 bg-[#212121] p-2 w-16 text-center rounded">ที่อยู่</label>
                    <input v-model="address" type="text" placeholder="ที่อยู่โรงแรม"
                        class="w-full px-3 py-2 rounded bg-white text-black" required>
                </div>

                <!-- City and Country -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-white mb-4 bg-[#212121] p-2 w-16 text-center rounded">เมือง</label>
                        <input v-model="city" type="text" placeholder="เมือง"
                            class="w-full px-3 py-2 rounded bg-white text-black" required>
                    </div>
                    <div>
                        <label class="block text-white mb-4 bg-[#212121] p-2 w-16 text-center rounded">ประเทศ</label>
                        <input v-model="country" type="text" placeholder="ประเทศ"
                            class="w-full px-3 py-2 rounded bg-white text-black" required>
                    </div>
                </div>

                <!-- Contact Information -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-white mb-4 bg-[#212121] p-2 w-20 text-center rounded">เบอร์โทร</label>
                        <input v-model="contactPhone" type="tel" placeholder="เบอร์โทรศัพท์"
                            class="w-full px-3 py-2 rounded bg-white text-black">
                    </div>
                    <div>
                        <label class="block text-white mb-4 bg-[#212121] p-2 w-16 text-center rounded">อีเมล</label>
                        <input v-model="contactEmail" type="email" placeholder="อีเมล"
                            class="w-full px-3 py-2 rounded bg-white text-black">
                    </div>
                </div>

                <div>
                    <label
                        class="block text-white mb-4 bg-[#212121] p-2 w-42 text-center rounded">สิ่งอำนวยความสะดวก</label>

                    <div class="flex gap-2 mb-3 bg-white items-center justify-between rounded">
                        <div class="flex-1">
                            <input v-model="newAmenity" type="text" placeholder="พิมพ์สิ่งอำนวยความสะดวก"
                                class="w-full px-3 py-2 rounded bg-white text-black"
                                @keyup.enter="addAmenity">
                        </div>
                        <div>
                            <button @click="addAmenity" :disabled="!newAmenity.trim()"
                                class="bg-white text-black text-xl px-2 m-2 rounded border-1 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">
                                +
                            </button>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div v-for="(amenity, index) in amenities" :key="index"
                            class="bg-white p-3 rounded flex items-center justify-between">
                            <span>{{ amenity }}</span>
                            <button @click="removeAmenity(index)"
                                class="text-red-500 text-md px-2 border rounded hover:text-red-700 cursor-pointer">
                                x
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Room Types -->
                <div>
                    <label class="block text-white mb-4 bg-[#212121] p-2 w-32 text-center rounded">ประเภทห้องพัก</label>
                    
                    <!-- Room Type Form -->
                    <div class="bg-white p-4 rounded mb-4">
                        <div class="grid grid-cols-2 gap-4 mb-3">
                            <div>
                                <label class="block text-black text-sm mb-1">ประเภทห้อง</label>
                                <input v-model="newRoom.room_type" type="text" placeholder="เช่น Standard, Deluxe, Suite"
                                    class="w-full px-3 py-2 border rounded text-black">
                            </div>
                            <div>
                                <label class="block text-black text-sm mb-1">ราคาต่อคืน (บาท)</label>
                                <input v-model.number="newRoom.price_per_night" type="number" min="1" placeholder="1000"
                                    class="w-full px-3 py-2 border rounded text-black">
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-3 gap-4 mb-3">
                            <div>
                                <label class="block text-black text-sm mb-1">จำนวนผู้เข้าพัก</label>
                                <input v-model.number="newRoom.max_guests" type="number" min="1" max="10" placeholder="2"
                                    class="w-full px-3 py-2 border rounded text-black">
                            </div>
                            <div>
                                <label class="block text-black text-sm mb-1">จำนวนเตียง</label>
                                <input v-model.number="newRoom.beds" type="number" min="1" max="5" placeholder="1"
                                    class="w-full px-3 py-2 border rounded text-black">
                            </div>
                            <div>
                                <label class="block text-black text-sm mb-1">จำนวนห้อง</label>
                                <input v-model.number="newRoom.quantity" type="number" min="1" placeholder="10"
                                    class="w-full px-3 py-2 border rounded text-black">
                            </div>
                        </div>
                        
                        <button @click="addRoomType" :disabled="!canAddRoom"
                            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed">
                            เพิ่มประเภทห้อง
                        </button>
                    </div>

                    <!-- Room Types List -->
                    <div class="space-y-2" v-if="roomTypes.length > 0">
                        <div v-for="(room, index) in roomTypes" :key="index"
                            class="bg-white p-3 rounded flex items-center justify-between">
                            <div class="text-black">
                                <span class="font-semibold">{{ room.room_type }}</span> - 
                                {{ room.price_per_night.toLocaleString() }} บาท/คืน | 
                                {{ room.max_guests }} คน | 
                                {{ room.beds }} เตียง | 
                                {{ room.quantity }} ห้อง
                            </div>
                            <button @click="removeRoomType(index)"
                                class="text-red-500 text-md px-2 border rounded hover:text-red-700">
                                ลบ
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-4 gap-4">
                    <RouterLink to="/hotel-management" 
                        class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors">
                        ยกเลิก
                    </RouterLink>
                    <button @click="submitForm" :disabled="isSubmitting"
                        class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                        {{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>