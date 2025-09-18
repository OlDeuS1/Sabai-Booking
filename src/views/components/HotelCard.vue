<script setup>
import { ref } from 'vue'

const props = defineProps({
  hotel: Object,
})

</script>

<template>
  <router-link to="">
  <el-card style="max-width: 480px">
    <img
    src="https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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