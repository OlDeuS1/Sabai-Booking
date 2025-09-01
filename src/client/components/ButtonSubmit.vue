<script setup>
import { computed } from 'vue';
const props = defineProps({
  typeBtn: {
    type: String,
  },
})

const btnSubmit = computed(() => {
  if(props.typeBtn === "login") return "เข้าสู่ระบบ"
  else return "ลงทะเบียน"
})

const classbtnSubmit = computed(() => {
  return {
    "btn-login rounded-md px-4 py-2 bg-blue-950 text-white inline-block cursor-pointer hover:bg-blue-900 transition-all mt-6" : props.typeBtn === "login",
    "btn-register rounded-md px-4 py-2 bg-blue-950 text-white inline-block cursor-pointer hover:bg-blue-900 transition-all mt-6" : props.typeBtn === "register"
  }
})

</script>

<template>
  <button :class="classbtnSubmit" type="submit"> {{ btnSubmit }}</button>
</template>

