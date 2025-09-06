<script setup>
import Navbar from './components/Navigation.vue'
import Footer from './components/Footer.vue';
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';

const routes = useRoute()

const showNav = computed(() => {
  return routes.path === '/login' || routes.path === '/register' ? false : true;
})

const userNow = ref(null)

onMounted(async () => {
  try {
    const resUsers = await axios.get('http://localhost:3000/api/users');
    const resUserNow = await axios.get(`http://localhost:3000/api/profile`, { withCredentials: true });
    userNow.value = Array.from(resUsers.data).filter(user => user.user_id === Number(resUserNow.data.userId))[0];
  } catch (error) {
    console.error('Error:', error);
  }
});

</script>

<template>
  <Navbar v-show="showNav" :userNow="userNow" />
  <router-view :userNow="userNow" />
  <Footer v-show="showNav" />
</template>

<style scoped></style>
