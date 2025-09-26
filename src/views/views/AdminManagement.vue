<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getHotelAdminData, getHotelRoomData, getNormalUsers } from '../composables/getData';

const route = useRoute();
const router = useRouter();
const hotelData = ref([]);
const isLoading = ref(true);
const hotelsWithRooms = ref([]);
const userData = ref([])
const searchUser = ref(route.query.user ?? '');
const searchHotel = ref(route.query.hotel ??'');

onMounted(async () => {
  hotelData.value = await getHotelAdminData();
  userData.value = await getNormalUsers();
  
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

const goToUserBookingHistory = (user) => {
  router.push({
    name: 'HistoryBooking_Admin',
    params: { userId: user.user_id },
    query: { 
      firstName: user.first_name, 
      lastName: user.last_name 
    }
  });
};

const updateSearchQuery = function(){
    const query = { ...route.query }

    query.user = searchUser.value ? searchUser.value.toLowerCase() : undefined 
    query.hotel = searchHotel.value ? searchHotel.value.toLowerCase() : undefined 

    router.push({name: 'Admin', query: query})
}

const userFilter = computed(() => {
    if(userData.value.length) {
        if(route.query.user)
            return userData.value.filter(u => String(u.first_name + ' ' + u.last_name).toLowerCase().includes(route.query.user.toLowerCase()))
        return userData.value
    }
})

const hotelFiler = computed(() => {
    if(hotelsWithRooms.value.length) {
        if(route.query.hotel)
            return hotelsWithRooms.value.filter(h => String(h.hotel_name).toLowerCase().includes(route.query.hotel.toLowerCase()))
        return hotelsWithRooms.value
    }
})

</script>

<template>
    <div class="bg-[#212121] p-32 pt-16">
        <!-- ส่วนของผู้ใช้บริการ/ลูกค้า -->
        <div class="grid justify-center text-white">
            <div class="flex justify-between mb-4 items-center">
                <div class="text-2xl font-semibold">รายชื่อผู้ใช้</div>
                <div class="relative">
                    <form @submit.prevent="updateSearchQuery">
                        <input type="text" v-model="searchUser" name="" id="" class="rounded-sm p-3 text-sm w-80 h-10 bg-white text-black border-none" placeholder="ค้นหาชื่อผู้ใช้">
                        <button @click.prevent="updateSearchQuery" type="submit" class="absolute inset-y-1 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-black cursor-pointer">
                            <MagnifyingGlassIcon class="w-5 h-5 text-white"/>
                        </button>
                    </form>
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
                <tbody v-if="userFilter?.length">
                    <tr class="border border-l-0 border-r-0" v-for="(user, index) in userFilter" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td class="border">{{ user.first_name }} {{ user.last_name }}</td>
                        <td class="border">{{ user.email }}</td>
                        <td>{{ user.phone_number }}</td>
                        <td class="text-right">
                            <button @click="goToUserBookingHistory(user)" class="cursor-pointer bg-[#102B58] text-white p-2 w-30 rounded-sm">ประวัติการจอง</button>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr class="border border-l-0 border-r-0 text-gray-400 text-center" colspan="6">ไม่พบข้อมูลที่ค้นหา</tr>
                </tbody>
            </table>
        </div>

        <!-- ส่วนของโรงแรม -->
        <div class="grid justify-center text-white" v-if="!isLoading">
            <div class="flex justify-between mt-28 mb-4 items-center">
                <div class="text-2xl font-semibold">รายชื่อโรงแรม</div>
                <div class="relative">
                    <form @submit.prevent="updateSearchQuery">
                        <input type="text" v-model="searchHotel" name="" id="" class="rounded-sm p-3 text-sm w-80 h-10 bg-white text-black border-none" placeholder="ค้นหาชื่อโรงแรม">
                        <button @click.prevent="updateSearchQuery" type="submit" class="absolute inset-y-1 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-black cursor-pointer">
                            <MagnifyingGlassIcon class="w-5 h-5 text-white"/>
                        </button>
                    </form>
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
                <tbody v-if="hotelFiler?.length">
                    <tr class="border border-l-0 border-r-0" v-for="(hotel, index) in hotelFiler" :key="index">
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
                            <div v-else-if="hotel.status === 'pending'" class="flex gap-3 justify-end">
                                <button class="cursor-pointer bg-[#00D35F] text-white px-5 py-2 rounded-sm hover:bg-green-600 transition-colors">
                                    อนุมัติ
                                </button>
                                <button class="cursor-pointer bg-[#F2B900] text-white px-5 py-2 rounded-sm hover:bg-yellow-600 transition-colors">
                                    ปฏิเสธ
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr class="border border-l-0 border-r-0 text-gray-400 text-center" colspan="6">ไม่พบข้อมูลที่ค้นหา</tr>
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