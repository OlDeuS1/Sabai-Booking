<script setup>
import SearchCompo from '../components/SearchCompo.vue';
import ListHotel from '../components/ListHotel.vue';
import { onMounted, ref } from 'vue';
import axios from 'axios';

const hotelData = ref([]);
const isLoading = ref([true])

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/hotels')
    hotelData.value = res.data;
    isLoading.value = false;
  } catch(err) {
    alert(`eror : ${err.message}`);
  }
})

const filHotel = function(hotelData, fil){
  return hotelData.filter(h => h.city === fil)
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
      <SearchCompo />
      <ListHotel :hotels="filHotel(hotelData, 'กรุงเทพ')" v-if="!isLoading" />
      <!-- <ListHotel />
      <ListHotel />
      <ListHotel /> -->
    </div>
  </div>
</template>

<style scoped>

</style>