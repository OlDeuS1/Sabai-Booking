<script setup>
import SearchCompo from '../components/searchCompo.vue';
import HotelDetails_Search from '../components/HotelDetails_Search.vue';
import { ref, onMounted, computed } from 'vue'; // ไม่ต้องใช้ watch แล้ว
import { useRoute, useRouter } from 'vue-router';
import { getHotelData } from '../composables/getData';

const route = useRoute();
const router = useRouter();

const searchData = computed(() => route.query);
const allHotels = ref(null); 

onMounted(async () => {
  allHotels.value = await getHotelData();
});

const hotelSearch = computed(() => {
  if (!allHotels.value || !searchData.value.where) {
    return [];
  }
  return allHotels.value.filter(h => 
    h.city.includes(searchData.value.where)
  );
});

const searchHotel = function(payload) {
  const query = {
    where: payload.where,
    numRoom: payload.numRoom,
    numPeople: payload.numPeople,
  };

  if (payload.checkInOutDate && payload.checkInOutDate[0] && payload.checkInOutDate[1]) {
    query.checkIn = new Date(payload.checkInOutDate[0]).toISOString().split('T')[0];
    query.checkOut = new Date(payload.checkInOutDate[1]).toISOString().split('T')[0];
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
      <div class="mr-auto font-medium">ผลการค้นหา {{ hotelSearch.length }} รายการ</div>
      <HotelDetails_Search v-if="allHotels"
        v-for="h in hotelSearch" 
         :key="h.hotel_id" 
        :hotelData="h"
      />
    </div>
  </div>
</template>