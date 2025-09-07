<script setup>
import HotelCard from './HotelCard.vue';
</script>

<template>
  <div class="hotel mb-15">
    <div class="hotel__to flex gap-5 items-center mb-6">
      <div class="hotel__to-title text-2xl font-bold">ที่พักในกรุงเทพ</div>
      <router-link to=""><img class="hotel__to-icon" src="../assets/icons/arrow-circle-right-fill.svg" alt="arrow-right"></router-link>
    </div>
    <div class="hotel__list flex gap-4">
      <HotelCard />
      <HotelCard />
      <HotelCard />
      <HotelCard />
    </div>
  </div>
</template>