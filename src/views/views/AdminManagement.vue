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

// ฟังก์ชันอนุมัติโรงแรม
const approveHotel = async (hotel) => {
    try {
        const response = await fetch(`http://localhost:3000/api/hotels/${hotel.hotel_id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                status: 'approved'
            })
        });

        if (response.ok) {
            // อัพเดทสถานะใน local data
            const hotelIndex = hotelsWithRooms.value.findIndex(h => h.hotel_id === hotel.hotel_id);
            if (hotelIndex !== -1) {
                hotelsWithRooms.value[hotelIndex].status = 'approved';
            }
            alert(`อนุมัติโรงแรม "${hotel.hotel_name}" เรียบร้อยแล้ว`);
        } else {
            throw new Error('Failed to approve hotel');
        }
    } catch (error) {
        console.error('Error approving hotel:', error);
        alert('เกิดข้อผิดพลาดในการอนุมัติโรงแรม');
    }
}

// ฟังก์ชันปฏิเสธโรงแรม
const rejectHotel = async (hotel) => {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะปฏิเสธโรงแรม "${hotel.hotel_name}"?`)) {
        try {
            const response = await fetch(`http://localhost:3000/api/hotels/${hotel.hotel_id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    status: 'rejected'
                })
            });

            if (response.ok) {
                // อัพเดทสถานะใน local data
                const hotelIndex = hotelsWithRooms.value.findIndex(h => h.hotel_id === hotel.hotel_id);
                if (hotelIndex !== -1) {
                    hotelsWithRooms.value[hotelIndex].status = 'rejected';
                }
                alert(`ปฏิเสธโรงแรม "${hotel.hotel_name}" เรียบร้อยแล้ว`);
            } else {
                throw new Error('Failed to reject hotel');
            }
        } catch (error) {
            console.error('Error rejecting hotel:', error);
            alert('เกิดข้อผิดพลาดในการปฏิเสธโรงแรม');
        }
    }
}

// ฟังก์ชันปิดใช้งานโรงแรม (Soft Delete)
const deleteHotel = async (hotel) => {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะปิดใช้งานโรงแรม "${hotel.hotel_name}"? โรงแรมจะไม่ปรากฏในระบบ แต่ข้อมูลประวัติจะยังคงอยู่`)) {
        try {
            const response = await fetch(`http://localhost:3000/api/hotels/${hotel.hotel_id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    status: 'deleted'
                })
            });

            if (response.ok) {
                // ลบออกจาก local data (ไม่แสดงในรายการ)
                const hotelIndex = hotelsWithRooms.value.findIndex(h => h.hotel_id === hotel.hotel_id);
                if (hotelIndex !== -1) {
                    hotelsWithRooms.value.splice(hotelIndex, 1);
                }
                alert(`ปิดใช้งานโรงแรม "${hotel.hotel_name}" เรียบร้อยแล้ว`);
            } else {
                throw new Error('Failed to deactivate hotel');
            }
        } catch (error) {
            console.error('Error deactivating hotel:', error);
            alert('เกิดข้อผิดพลาดในการปิดใช้งานโรงแรม');
        }
    }
}

</script>

<template>
    <div class="bg-[#212121] p-32 pt-16">
        <!-- ส่วนของผู้ใช้บริการ/ลูกค้า -->
        <div class="max-w-7xl mx-auto flex flex-col px-2 sm:px-6 lg:px-8 justify-center text-white">
            <div class="flex justify-between mb-4 items-center">
                <div class="text-2xl font-semibold">รายชื่อผู้ใช้</div>
                <div class="relative">
                    <form @submit.prevent="updateSearchQuery">
                        <input type="text" v-model="searchUser" name="" id="" class="rounded-sm p-3 text-sm w-80 h-10 bg-white text-black border-none" placeholder="ค้นหาชื่อผู้ใช้...">
                        <button @click.prevent="updateSearchQuery" type="submit" class="absolute inset-y-1 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-black hover:bg-gray-700 transition-all cursor-pointer">
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
                    <tr class="border-y border-gray-600" v-for="(user, index) in userFilter" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ user.first_name }} {{ user.last_name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.phone_number }}</td>
                        <td class="text-right">
                            <button @click="goToUserBookingHistory(user)" class="cursor-pointer bg-[#102B58] hover:bg-blue-900 transition-all text-white p-2 w-30 rounded-sm">ประวัติการจอง</button>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr class="border border-l-0 border-r-0 text-gray-400 text-center">
                        <td colspan="6">ไม่พบข้อมูลที่ค้นหา</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- ส่วนของโรงแรม -->
        <div class="max-w-7xl mx-auto flex flex-col px-2 sm:px-6 lg:px-8 justify-center text-white" v-if="!isLoading">
            <div class="flex justify-between mt-28 mb-4 items-center">
                <div class="text-2xl font-semibold">รายชื่อโรงแรม</div>
                <div class="relative">
                    <form @submit.prevent="updateSearchQuery">
                        <input type="text" v-model="searchHotel" name="" id="" class="rounded-sm p-3 text-sm w-80 h-10 bg-white text-black border-none" placeholder="ค้นหาชื่อโรงแรม...">
                        <button @click.prevent="updateSearchQuery" type="submit" class="absolute inset-y-1 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-black hover:bg-gray-700 transition-all cursor-pointer">
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
                    <tr class="border-y border-gray-500" v-for="(hotel, index) in hotelFiler" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>
                            <div class="text-lg mb-1">{{ hotel.hotel_name }}</div>
                            <div class="text-sm opacity-50">{{ hotel.owner_first_name }} {{ hotel.owner_last_name }}</div>
                        </td>
                        <td>{{ hotel.address }}</td>
                        <td>
                            <ul v-if="hotel.rooms && hotel.rooms.length > 0">
                                <li v-for="room in hotel.rooms" :key="room.room_id">
                                    ห้องพัก {{ room.max_guests }} คน {{ room.beds }} เตียง ({{ room.room_type }})
                                </li>
                            </ul>
                            <div v-else class="text-gray-500">ไม่มีข้อมูลห้องพัก</div>
                        </td>
                        <td class="text-right">
                            <div v-if="hotel.status === 'approved'">
                                <button @click="deleteHotel(hotel)" class="cursor-pointer bg-[#FF0000] text-white p-2 w-30 rounded-sm hover:bg-red-800 transition-colors">ลบ</button>
                            </div>
                            <div v-else-if="hotel.status === 'pending'" class="flex gap-3 justify-end">
                                <button @click="approveHotel(hotel)" class="cursor-pointer bg-[#00D35F] text-white px-5 py-2 rounded-sm hover:bg-green-600 transition-colors">
                                    อนุมัติ
                                </button>
                                <button @click="rejectHotel(hotel)" class="cursor-pointer bg-[#F2B900] text-white px-5 py-2 rounded-sm hover:bg-yellow-600 transition-colors">
                                    ปฏิเสธ
                                </button>
                            </div>
                            <div v-else-if="hotel.status === 'rejected'" class="text-red-400 font-semibold">
                                ถูกปฏิเสธ
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr class="border border-l-0 border-r-0 text-gray-400 text-center">
                        <td colspan="6">ไม่พบข้อมูลที่ค้นหา</td>
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