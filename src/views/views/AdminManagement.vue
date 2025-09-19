<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getHotelAdminData, getHotelRoomData } from '../composables/getData';

const router = useRouter();
const hotelData = ref([]);
const isLoading = ref(true);
const hotelsWithRooms = ref([]);

onMounted(async () => {
  hotelData.value = await getHotelAdminData();
  
  // Fetch room data for each hotel
  const hotelPromises = hotelData.value.map(async (hotel) => {
    const rooms = await getHotelRoomData(hotel.hotel_id);
    return {
      ...hotel,
      rooms: rooms || []
    };
  });
  
  hotelsWithRooms.value = await Promise.all(hotelPromises);
  isLoading.value = false;
});
</script>

<template>
    <div class="bg-[#212121] p-32 pt-16">
        <!-- ส่วนของผู้ใช้บริการ/ลูกค้า -->
        <div class="grid justify-center text-white">
            <div class="flex justify-between mb-4 items-center">
                <div class="text-2xl font-semibold">รายชื่อผู้ใช้</div>
                <div class="relative">
                    <input type="text" name="" id="" class="rounded-sm p-3 text-sm w-80 h-10 bg-white text-black border-none" placeholder="ค้นหาชื่อผู้ใช้">
                    <button type="submit" class="absolute inset-y-1 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-black cursor-pointer">
                        <MagnifyingGlassIcon class="w-5 h-5 text-white"/>
                    </button>
                </div>
            </div>
            <table class="table-auto w-300">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border border-l-0 border-r-0">
                        <td >1</td>
                        <td class="border">ธนภัทร มลิแก้ว</td>
                        <td class="border">66070080@kmitl.ac.th</td>
                        <td >064-951-5415</td>
                        <td class="text-right">
                            <button class="cursor-pointer bg-[#102B58] text-white p-2 w-30 rounded-sm">ประวัติการจอง</button>
                        </td>
                    </tr>

                    <tr class="border border-l-0 border-r-0">
                        <td >1</td>
                        <td class="border">ธนภัทร มลิแก้ว</td>
                        <td class="border">66070080@kmitl.ac.th</td>
                        <td >064-951-5415</td>
                        <td class="text-right">
                            <button class="cursor-pointer bg-[#102B58] text-white p-2 w-30 rounded-sm">ประวัติการจอง</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- ส่วนของโรงแรม -->
        <div class="grid justify-center text-white" v-if="!isLoading">
            <div class="flex justify-between mt-28 mb-4 items-center">
                <div class="text-2xl font-semibold">รายชื่อโรงแรม</div>
                <div class="relative">
                    <input type="text" name="" id="" class="rounded-sm p-3 text-sm w-80 h-10 bg-white text-black border-none" placeholder="ค้นหาชื่อโรงแรม">
                    <button type="submit" class="absolute inset-y-1 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-black cursor-pointer">
                        <MagnifyingGlassIcon class="w-5 h-5 text-white"/>
                    </button>
                </div>
            </div>
            <table class="table-auto w-300">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th class="w-100"></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border border-l-0 border-r-0" v-for="(hotel, index) in hotelsWithRooms" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td class="border">
                            <div class="text-lg mb-1">{{ hotel.hotel_name }}</div>
                            <div class="text-sm opacity-50">{{ hotel.owner_first_name }} {{ hotel.owner_last_name }}</div>
                        </td>
                        <td class="border">{{ hotel.address }}</td>
                        <td>
                            <ul v-if="hotel.rooms && hotel.rooms.length > 0">
                                <li v-for="room in hotel.rooms" :key="room.room_id">
                                    ห้องพัก {{ room.max_guests }} คน {{ room.beds }} เตียง ({{ room.room_type }})
                                </li>
                            </ul>
                            <div v-else class="text-gray-400 italic">ไม่มีข้อมูลห้องพัก</div>
                        </td>
                        <td class="text-right">
                            <div v-if="hotel.status === 'approved'">
                                <button class="cursor-pointer bg-[#FF0000] text-white p-2 w-30 rounded-sm">ลบ</button>
                            </div>
                            <div v-else-if="hotel.status === 'pending'">
                                <button class="cursor-pointer bg-[#00D35F] text-white p-2 w-30 rounded-sm">อนุมัติ</button>
                                <button class="cursor-pointer bg-[#F2B900] text-white p-2 w-30 rounded-sm ml-6">ปฏิเสธ</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
    th{
        padding: 4px;
    }
    td{
        padding: 24px;
    }
</style>