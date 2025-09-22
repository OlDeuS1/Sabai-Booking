<script setup>
import { ref, computed } from 'vue'

const images = ref({
    main: null,
    sub1: null,
    sub2: null
})

const hotelName = ref('')
const newAmenity = ref('')
const amenities = ref([])
const location = ref('')

const newRoom = ref({
    rooms: 0,
    beds: 0
})
const roomTypes = ref([])

const mainFileInput = ref(null)
const sub1FileInput = ref(null)
const sub2FileInput = ref(null)

const canAddRoom = computed(() => {
    const rooms = parseInt(newRoom.value.rooms)
    const beds = parseInt(newRoom.value.beds)

    console.log(rooms, beds)

    if (!rooms || !beds || rooms <= 0 || beds <= 0) {
        return false
    }

    return !roomTypes.value.some(room =>
        room.rooms === rooms && room.beds === beds
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
            rooms: parseInt(newRoom.value.rooms),
            beds: parseInt(newRoom.value.beds)
        })
        newRoom.value = { rooms: 0, beds: 0}
    }
}

const removeRoomType = (index) => {
    roomTypes.value.splice(index, 1)
}

const submitForm = () => {
    if (!hotelName.value.trim()) {
        alert('กรุณากรอกชื่อโรงแรม')
        return
    }

    const formData = {
        hotelName: hotelName.value,
        amenities: amenities.value,
        location: location.value,
        roomTypes: roomTypes.value,
        images: images.value
    }

    console.log(formData)

}
</script>

<template>
    <div class="bg-[#102B58] p-4">
        <div class="flex items-center justify-between max-w-4xl mx-auto mb-8 mt-8">
            <RouterLink to="/" class="flex items-center text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7">
                    </path>
                </svg>
                <span class="text-lg">กลับไปยังการจัดการโรงแรม</span>
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
                <div>
                    <label class="block text-white mb-4 bg-[#212121] p-2 w-24 text-center rounded">ชื่อโรงแรม</label>
                    <input v-model="hotelName" type="text" placeholder="ชื่อโรงแรม"
                        class="w-full px-3 py-2 rounded bg-white text-black focus:outline-none">
                </div>

                <div>
                    <label
                        class="block text-white mb-4 bg-[#212121] p-2 w-42 text-center rounded">สิ่งอำนวยความสะดวก</label>

                    <div class="flex gap-2 mb-3 bg-white items-center justify-between rounded">
                        <div class="flex-1">
                            <input v-model="newAmenity" type="text" placeholder="พิมพ์สิ่งอำนวยความสะดวก"
                                class="w-full px-3 py-2 rounded bg-white text-black outline-none"
                                @keyup.enter="addAmenity">
                        </div>
                        <div>
                            <button @click="addAmenity" :disabled="!newAmenity.trim()"
                                class="bg-white text-black text-xl px-2 m-2 rounded border-1 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                +
                            </button>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div v-for="(amenity, index) in amenities" :key="index"
                            class="bg-white p-3 rounded flex items-center justify-between">
                            <span>{{ amenity }}</span>
                            <button @click="removeAmenity(index)"
                                class="text-red-500 text-md px-2 border rounded hover:text-red-700">
                                x
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-white mb-4 bg-[#212121] p-2 w-24 text-center rounded">สถานที่ตั้ง</label>
                    <textarea v-model="location" placeholder="รายละเอียดสถานที่ตั้งของโรงแรม" rows="4"
                        class="bg-white text-black w-full px-3 py-2 rounded resize-none focus:outline-none"></textarea>
                </div>

                <div>
                    <label class="block text-white mb-4 bg-[#212121] p-2 w-32 text-center rounded">รูปแบบห้องพัก</label>
                    <div class="flex gap-2 mb-3 bg-white items-center justify-between rounded">
                        <div class="ml-3">
                            <span>ห้องพัก</span>
                            <el-input-number v-model="newRoom.rooms" :min="1" controls-position="right" size="default"
                                class="m-2" />
                            <span class="text-black">ห้อง</span>
                            <span class="m-2 text-xl"> | </span>
                            <el-input-number v-model="newRoom.beds" :min="1" controls-position="right" size="default"
                                class="m-2" />
                            <span class="text-black">เตียง</span>
                        </div>
                        <div>
                            <button @click="addRoomType" :disabled="!canAddRoom"
                                class="bg-white text-black text-xl px-2 mr-2.5 rounded border-1 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                +
                            </button>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div v-for="(room, index) in roomTypes" :key="index"
                            class="bg-white p-3 rounded flex items-center justify-between">
                            <span>{{ room.rooms }} ห้อง &nbsp;|&nbsp; {{ room.beds }} เตียง</span>
                            <button @click="removeRoomType(index)"
                                class="text-red-500 text-md px-2 border rounded hover:text-red-700">
                                x
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-4">
                    <button @click="submitForm" class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                        บันทึกข้อมูล
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>