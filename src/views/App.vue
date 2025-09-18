<script setup>
import Navbar from './components/Navigation.vue'
import Footer from './components/Footer.vue';
import { useRoute } from 'vue-router';
import { computed, onMounted, ref, watch } from 'vue';
import axios from 'axios';

const route = useRoute();

const showNav = computed(() => {
  return route.path !== '/login' && route.path !== '/register';
});

const userCur = ref(null);

const fetchUserCurrent = async () => {
  try {
    const resUsers = await axios.get('http://localhost:3000/api/users');
    const resUserCur = await axios.get(`http://localhost:3000/api/profile`, { withCredentials: true });
    userCur.value = Array.from(resUsers.data).filter(user => user.user_id === Number(resUserCur.data.userId))[0];
  } catch (error) {
    console.error('Error fetching user:', error);
    userCur.value = null;
  }
};

onMounted(fetchUserCurrent);

watch(() => route.path, (newPath) => {
  if (newPath !== '/login' && newPath !== '/register') {
    fetchUserCurrent();
  }
});

</script>

<template>
  <Navbar v-show="showNav" :userCur="userCur" />
  <router-view :userCur="userCur" />
  <Footer v-show="showNav" />
</template>

<style scoped></style>