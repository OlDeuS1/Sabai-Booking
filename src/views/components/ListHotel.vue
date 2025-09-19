<script setup>
import HotelCard from './HotelCard.vue';

const props = defineProps({
  hotels: Array,
})

</script>

<template>
  <div class="hotel mb-15">
    <div class="hotel__to flex gap-5 items-center mb-6">
      <div class="hotel__to-title text-2xl font-bold">ที่พักใน{{ props.hotels[0].city }}</div>
      <router-link :to="{name: 'search', query: { where: props.hotels[0].city, numRoom: 1, numPeople: 1}}"><img class="hotel__to-icon" src="../assets/icons/arrow-circle-right-fill.svg" alt="arrow-right"></router-link>
    </div>
    <div class="hotel__list flex gap-4">
      <HotelCard v-for="hk in props.hotels.slice(0, 5)" :key="hk.hotel_id" :hotel="hk" />
    </div>
  </div>
</template>