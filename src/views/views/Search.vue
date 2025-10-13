<script setup>
import SearchCompo from '../components/searchCompo.vue';
import HotelDetails_Search from '../components/HotelDetails_Search.vue';
import { ref, onMounted, computed } from 'vue'; // ไม่ต้องใช้ watch แล้ว
import { useRoute, useRouter } from 'vue-router';
import { useFormat } from '../composables/useFormat';
import { getHotelData, getHotelRoomData } from '../composables/getData';

const route = useRoute();
const router = useRouter();
const { formatDate } = useFormat();

const searchData = computed(() => route.query);
const allHotels = ref(null); 

onMounted(async () => {
  allHotels.value = await getHotelData();

  if(allHotels.value){
    allHotels.value = await Promise.all(allHotels.value.map(async h => {
      const hotelRooms = await getHotelRoomData(h.hotel_id);
      h.max_guests = [...hotelRooms].every(r => r.max_guests === false) ? [1] : [...hotelRooms].map(r => r.max_guests);
      h.quantity = [...hotelRooms].map(r => r.quantity).reduce((a, b) => a + b, 0) || 10;
      h.price_per_night = { ...hotelRooms.at(0)}['price_per_night'] ?? 0;

      return h; 
    }));
  }

});

const hotelSearch = computed(() => {
  if (!allHotels.value) {
    return [];
  }
  if(searchData.value.where === '' && !parseInt(searchData.value.numRoom) && !parseInt(searchData.value.numPeople)) {
    return allHotels.value;
  }
  return allHotels.value.filter(h => {
    const isCity = searchData.value.where ? h.city.includes(searchData.value.where) : true;
    const isRoom = searchData.value.numRoom ? h.quantity >= parseInt(searchData.value.numRoom) : true;
    const isPeople = searchData.value.numPeople ? h.max_guests?.find(ht => ht >= parseInt(searchData.value.numPeople)) : true;

    return isCity && isRoom && isPeople;
  });
});

const searchHotel = function(payload) {
  const query = {
    where: payload.where,
    numRoom: payload.numRoom,
    numPeople: payload.numPeople,
  };

  if (payload.checkInOutDate && payload.checkInOutDate[0] && payload.checkInOutDate[1]) {
    query.checkIn = formatDate(payload.checkInOutDate[0]);
    query.checkOut = formatDate(payload.checkInOutDate[1]);
  }

  router.push({
    name: 'search',
    query,
  });
};
</script>

<template>
  <div class="search relative">
    <div class="search__container max-w-7xl mx-auto px-[32px] py-[8px] flex flex-col items-center">
      <SearchCompo 
        v-if="allHotels" 
        class="top-0 my-15" 
        :search-data="searchData" 
        :hodelData="allHotels" 
        @send-search-data="searchHotel"
      />
      <div v-if="allHotels" class="mr-auto font-medium">ผลการค้นหา {{ hotelSearch.length }} รายการ</div>
      <div class="hotel__search w-full" v-if="hotelSearch.length">
        <HotelDetails_Search 
          v-for="h in hotelSearch" 
          :key="h.hotel_id" 
          :hotelData="h"
          :searchData="searchData"
          />
      </div>
      <div class="hotel__search w-full text-center text-gray-400 py-15" v-else>
        ไม่พบข้อมูลที่ค้นหา
      </div>
    </div>
  </div>
</template>