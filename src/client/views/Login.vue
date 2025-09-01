<script setup>
import { ref } from 'vue';
import ButtonSubmit from '../components/ButtonSubmit.vue';
import FormInput from '../components/FormInput.vue';

const email = ref('');
const password = ref('');
const error = ref('');

console.log(email.value)

function handleLogin() {
  if (email.value === 'user@example.com' && password.value === 'password') {
    error.value = '';
    alert('Login successful!');
  } else {
    error.value = 'Invalid email or password.';
  }
}
</script>

<template>
  <div class="login bg-white h-screen flex justify-center items-center text-blue-950">
    <div class="login__form w-sm mx-auto border-gray-200 border-2 rounded-md shadow-xl px-6 py-8">
      <h2 class="text-center mb-6 text-2xl font-bold">เข้าสู่ระบบ</h2>
      <form class="form flex flex-col justify-center items-center" @submit.prevent="handleLogin" >
        <FormInput inputType="email" inputName="email" inputPlaceHolder="ป้อนอีเมล" labelValue="อีเมล"  @updateModelValue="email = $event" />
        <FormInput inputType="password" inputName="password" inputPlaceHolder="ป้อนรหัสผ่าน" labelValue="รหัสผ่าน" @updateModelValue="password = $event" />
        <p v-if="error" class="error text-red-600 text-sm justify-self-start">{{ error }}</p>
        <ButtonSubmit typeBtn="login"/>
      </form>
      <div class="text-center mt-6 text-sm text-gray-400">ยังไม่ได้เป็นสมาชิกใช่ไหม? <router-link to="/register" class="text-green-400 hover:underline">สมัครสมาชิก</router-link></div>
    </div>
  </div>
</template>