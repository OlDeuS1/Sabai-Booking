<script setup>
import { ref } from 'vue'

const props = defineProps({
  hotel: Object,
})

</script>

<template>
  <router-link :to="{ name: 'hotel-detail', params: { id: props.hotel.hotel_id }, query: {where: props.hotel.city, numRoom: 1, numPeople: 1} }">
    <el-card style="max-width: 480px">
      <img
      :src="props.hotel.image_urls[0]"
      style="width: 100%"
      />
      <div class="hotel__detail pt-4">
        <div class="font-bold text-[#212121]">{{ props.hotel.hotel_name }}</div>
        <el-rate
          v-model="props.hotel.avg_rating"
          disabled
          show-score
          text-color="#1c398e"
          score-template="{value} points"
        />
      </div>
    </el-card>
  </router-link>
</template>

<style scoped>

.el-rate {
  --el-rate-fill-color: #1c398e !important;
}

</style>