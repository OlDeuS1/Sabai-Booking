<script setup>
import { getHotelData, getHotelRoomData, createBooking } from '../composables/getData';
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFormat } from '../composables/useFormat';

const HotelData = ref([])
const RoomData = ref([])
const route = useRoute()
const router = useRouter()
const { formatDate } = useFormat();

onMounted(async () => {
    HotelData.value = await getHotelData()
    RoomData.value = await getHotelRoomData(route.params.id)
});

const hotel = computed(() => {
    return HotelData.value.find(h => h.hotel_id === Number(route.params.id)) || null;
});

const selectData = ref({...route.query} ?? {})

const custom_selectData = function () {
    selectData.value.checkInOutDate = [selectData.value.checkIn ?? '', selectData.value.checkOut ?? '']
    selectData.value.numRoom = Number(selectData.value.numRoom)
    selectData.value.numPeople = Number(selectData.value.numPeople)
}
custom_selectData()

const selectRoomPeople = computed(() => {
    return selectData.value.numPeople > 0 || selectData.value.numRoom > 0 ? `${selectData.value.numPeople} คน / ${selectData.value.numRoom} ห้อง` : 'เลือกผู้เข้าพักและห้องพัก';
});

const rooms = computed(() => {
    return RoomData.value
});

const room_option = ref('')
const processBooking = async function(){
    if(selectData.value.checkInOutDate[0] === '' || selectData.value.checkInOutDate[1] === '') {
        alert('please, select your checkin and checkout')
        return;
    }
    if(!selectData.value.numRoom) {
        alert('please, enter your num room')
        return;
    } 
    if(!selectData.value.numPeople) {
        alert('please, enter your num people')
        return;
    }

    if(!room_option.value){
        alert('please, select your room type')
        return;
    }

    try {
        // เตรียมข้อมูลสำหรับสร้างการจอง
        const bookingData = {
            room_id: room_option.value,
            hotel_id: route.params.id,
            check_in_date: formatDate(selectData.value.checkInOutDate[0]),
            check_out_date: formatDate(selectData.value.checkInOutDate[1]),
            num_guests: selectData.value.numPeople,
            num_rooms: selectData.value.numRoom
        };

        // สร้างการจองใหม่
        const response = await createBooking(bookingData);
        
        if (response.success) {
            // ส่งไปหน้า payment พร้อม booking_id ที่สร้างใหม่
            router.push({ 
                name: 'payment', 
                params: { booking_id: response.booking.booking_id }
            });
        }
    } catch (error) {
        console.error('Error creating booking:', error);
        if (error.response && error.response.status === 401) {
            alert('กรุณาเข้าสู่ระบบก่อนทำการจอง');
            router.push('/login');
        } else {
            alert('เกิดข้อผิดพลาดในการสร้างการจอง กรุณาลองใหม่อีกครั้ง');
        }
    }
}
</script>

<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-8" v-if="hotel">{{ hotel.hotel_name }}</h2>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
                <div class="relative" v-if="hotel && hotel.image_urls">
                    <img :src="hotel.image_urls[0]" alt="hotel-image-1" class="w-full h-96 object-cover rounded-lg shadow-lg">
                </div>

                <div class="grid grid-cols-2 gap-4" v-if="hotel && hotel.image_urls">
                    <img :src="hotel.image_urls[1]" alt="hotel-image-2" class="w-full h-48 object-cover rounded-lg shadow-md">
                    <img :src="hotel.image_urls[2]" alt="hotel-image-3" class="w-full h-48 object-cover rounded-lg shadow-md">
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold text-blue-900 mb-4">สิ่งอำนวยความสะดวก</h3>
                    <div class="space-y-2 text-gray-700" v-if="hotel">
                        <p v-for="item in hotel.amenities.split(',').map(a => a.trim())">- {{ item }}</p>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md" v-if="hotel">
                    <h3 class="text-xl font-semibold text-blue-900 mb-4">สถานที่ตั้ง</h3>
                    <p class="text-gray-700">
                        {{ hotel.address }} {{ hotel.city }} {{ hotel.country }}
                    </p>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold text-blue-900 mb-6">รูปแบบห้องพัก</h3>
                    <div class="space-y-4 grid" v-if="rooms">
                        <el-radio-group v-model="room_option" v-for="room in rooms" key="room.room_id">
                            <el-radio :value="room.room_id" size="large" border>ห้องพัก {{ room.max_guests }} คน | {{ room.beds }} เตียง</el-radio>
                        </el-radio-group>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-1">
                <div class="bg-white p-6 rounded-lg shadow-lg sticky top-8">
                    <div class="mb-6">
                        <div class="text-2xl font-bold text-gray-900 mb-2" v-if="rooms">
                            {{ rooms.find(r => r.room_id == room_option)?.price_per_night || (rooms.length ? Math.min(...rooms.map(r => r.price_per_night)) : 0) }} บาท ต่อ 1 คืน
                        </div>
                    </div>

                    <form>
                        <div class="block mb-4">
                            <div class="mb-2">เช็คอิน - เช็คเอาท์</div>
                            <el-date-picker v-model="selectData.checkInOutDate" type="daterange"
                                start-placeholder="วันที่เข้าพัก" end-placeholder="วันที่ออก"
                                :default-value="[new Date(), new Date()]" />
                        </div>

                        <div class="block mb-4">
                            <div class="mb-2">ผู้เข้าพัก/จำนวนห้อง</div>
                            <el-popover placement="bottom" :width="250" trigger="click" class="pt-2">
                                <template #reference>
                                    <el-button class="w-50"> {{ selectRoomPeople }} </el-button>
                                </template>
                                <div class="people-room-list">
                                    <div class="people-room-item flex justify-between items-center mb-4">
                                        <div class="search-child-title">คน</div>
                                        <el-input-number v-model="selectData.numPeople" :min="0" :max="100"
                                            label="คน" />
                                    </div>
                                    <div class="people-room-item flex justify-between items-center mb-4">
                                        <div class="search-adult-title">ห้องพัก</div>
                                        <el-input-number v-model="selectData.numRoom" :min="0" :max="100"
                                            label="ห้องพัก" />
                                    </div>
                                </div>
                            </el-popover>
                        </div>

                        <button type="submit" @click.prevent="processBooking"
                            class="w-full bg-green-500 cursor-pointer text-white py-3 rounded-md font-semibold hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                            จองห้องพัก
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>