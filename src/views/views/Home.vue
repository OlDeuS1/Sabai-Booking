<script setup>
import SearchCompo from '../components/searchCompo.vue';
import ListHotel from '../components/ListHotel.vue';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getHotelData } from '../composables/getData';

const router = useRouter();
const hotelData = ref([]);
const isLoading = ref(true)

onMounted(async () => {
  hotelData.value = await getHotelData()
  isLoading.value = false;
});

const bangkokHotels = computed(() => {
  return hotelData.value.filter(h => h.city === 'กรุงเทพ');
});

const huahinHotels = computed(() => {
  return hotelData.value.filter(h => h.city === 'หัวหิน');
});

const phuketHotels = computed(() => {
  return hotelData.value.filter(h => h.city === 'ภูเก็ต');
});

const chiangMaiHotels = computed(() => {
  return hotelData.value.filter(h => h.city === 'เชียงใหม่');
});


const searchData = function(payload) {
  const query = {
      where: payload.where,
      checkIn: payload.checkInOutDate.at(0),
      checkOut: payload.checkInOutDate.at(1),
      numRoom: payload.numRoom,
      numPeople: payload.numPeople,
    }

  if (payload.checkInOutDate && payload.checkInOutDate[0] && payload.checkInOutDate[1]) {
    query.checkIn = new Date(payload.checkInOutDate[0]).toISOString().split('T')[0];
    query.checkOut = new Date(payload.checkInOutDate[1]).toISOString().split('T')[0];
  }

  router.push({
    name: 'search',
    query,
  })
}

</script>

<template>
  <div class="home relative">
    <div class="home__container max-w-7xl mx-auto px-[32px] py-[8px] flex flex-col items-center">
      <div class="bg-[url(../assets/images/hero-background.png)] w-full h-[20rem] bg-center bg-no-repeat bg-cover absolute top-0 left-0 -z-10 brightness-[65%]"></div>
      <div class="hero-bg h-[20rem] w-full text-white relative">
        <div class="hero-intro absolute top-1/2 left-1/2 -translate-1/2 w-full text-center">
          <h1 class="text-5xl font-bold mb-4">จองที่พักปลอดภัย ไว้ใจเราได้</h1>
          <div class="text-2xl text-gray-200 font-medium bg-[#102B58] inline-block py-3 px-5 rounded-md">บริการทุก 24 ชั่วโมง</div>
        </div>
      </div>
      <SearchCompo @send-search-data="searchData" :hodelData="hotelData" v-if="!isLoading" />
      <ListHotel v-if="!isLoading" :hotels="bangkokHotels" />
      <ListHotel v-if="!isLoading" :hotels="huahinHotels" />
      <ListHotel v-if="!isLoading" :hotels="phuketHotels" />
      <ListHotel v-if="!isLoading" :hotels="chiangMaiHotels" />
    </div>
  </div>
</template>

<style scoped>

</style>