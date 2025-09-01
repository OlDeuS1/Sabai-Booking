<script setup>
import Navbar from './components/Navigation.vue'
import Footer from './components/Footer.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const routes = useRoute()

const showNav = computed(() => {
  return routes.path === '/login' || routes.path === '/register' ? false : true;
})

</script>

<template>
  <Navbar v-show="showNav" />
  <router-view />
  <Footer v-show="showNav" />
</template>

<style scoped></style>
