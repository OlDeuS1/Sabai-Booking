<script setup>
import RoomOption from '../components/RoomOption.vue';
import { getHotelRoomData } from '../composables/getData';
import { ref } from 'vue'

const BookingDate = ref('')

onMounted(async () => {
  hotelData.value = await getHotelData()
});

const RoomType = ref('')
const props = {
    value: 'id',
    label: 'label',
    options: 'options',
    disabled: 'disabled',
}

const options = [
    {
        id: 'Option1',
        label: 'Option1',
    },
    {
        id: 'Option2',
        label: 'Option2',
        disabled: true,
    },
    {
        id: 'Option3',
        label: 'Option3',
    },
    {
        id: 'Option4',
        label: 'Option4',
        disabled: true,
    },
    {
        id: 'Option5',
        label: 'Option5',
    },
]

const RoomData = ref()

const selectRoomPeople = 'เลือกผู้เข้าพักและห้องพัก'
</script>

<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">โรงแรมดาวมีไวบ์บิง 5 | กรุงเทพ</h2>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
                <div class="relative">
                    <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=400&fit=crop"
                        alt="Luxury Resort View" class="w-full h-96 object-cover rounded-lg shadow-lg">
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=200&fit=crop"
                        alt="Pool View" class="w-full h-48 object-cover rounded-lg shadow-md">
                    <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=200&fit=crop"
                        alt="Night Pool" class="w-full h-48 object-cover rounded-lg shadow-md">
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold text-blue-900 mb-4">สิ่งอำนวยความสะดวก</h3>
                    <div class="space-y-2 text-gray-700">
                        <p>• WiFi ฟรี สำหรับผู้เข้าพักทุกท่าน</p>
                        <p>• ที่จอดรถ เชื่อมต่อโดยตรง จองได้ไม่จำกัดเวลา 30 คัน</p>
                        <p>• ระบบล็อก สำหรับความปลอดภัย เปิดปิดโซนล่าง 2ช เดินทาง</p>
                        <p>• รการสิงห์ เชื่อมต่อแกตมีขียงบ่งที่ต่อมา 200+ บาท</p>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold text-blue-900 mb-4">สถานที่ตั้ง</h3>
                    <p class="text-gray-700">
                        93.9 กม.2 ปทมนตา ค่อนปจง เค ครมเมียส์มารำ ปจธมี ขวภนครเปรจอยขิมสุธ คคอมพา โทษ 10140
                    </p>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold text-blue-900 mb-6">รูปแบบห้องพัก</h3>
                    <div class="space-y-4">
                        <room-option />
                        <room-option />
                    </div>
                </div>
            </div>

            <div class="lg:col-span-1">
                <div class="bg-white p-6 rounded-lg shadow-lg sticky top-8">
                    <div class="mb-6">
                        <div class="text-2xl font-bold text-gray-900 mb-2">2000 บาท ต่อ 1 คืน</div>
                    </div>

                    <form>
                        <div class="block mb-4">
                            <div class="mb-2">เช็คอิน - เช็คเอาท์</div>
                            <el-date-picker v-model="BookingDate" type="daterange" start-placeholder="วันที่เข้าพัก"
                                end-placeholder="วันที่ออก" :default-value="[new Date(), new Date()]" />
                        </div>

                        <div class="block mb-4">
                            <div class="mb-2">ผู้เข้าพัก/จำนวนห้อง</div>
                            <el-popover placement="bottom" :width="250" trigger="click" class="pt-2">
                                <template #reference>
                                    <el-button class="w-50"> {{ selectRoomPeople }} </el-button>
                                </template>
                                <div class="people-room-list">
                                    <div class="people-room-item flex justify-between items-center mb-4">
                                        <div class="search-adult-title">ห้องพัก</div>
                                        <el-input-number v-model="RoomData" :min="0" :max="100" label="ห้องพัก" />
                                    </div>
                                    <div class="people-room-item flex justify-between items-center mb-4">
                                        <div class="search-child-title">คน</div>
                                        <el-input-number v-model="RoomData" :min="0" :max="100" label="คน" />
                                    </div>
                                </div>
                            </el-popover>
                        </div>

                        <button type="submit"
                            class="w-full bg-green-500 text-white py-3 rounded-md font-semibold hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                            จองห้องพัก
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>