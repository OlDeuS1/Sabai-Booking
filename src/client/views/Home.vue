<script setup>
import { ref, onMounted } from 'vue';

const loginStatus = ref('');

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/profile', {
      credentials: 'include'
    });
    const data = await res.json();
    if (res.ok) {
      loginStatus.value = `Login แล้ว (userId: ${data.userId})`;
    } else {
      loginStatus.value = 'ยังไม่ได้ login';
    }
  } catch (e) {
    loginStatus.value = 'เชื่อมต่อ server ไม่ได้';
  }
});
</script>

<template>
  <div class="home">
    <p>{{ loginStatus }}</p>
  </div>
</template>

<style scoped>

</style>