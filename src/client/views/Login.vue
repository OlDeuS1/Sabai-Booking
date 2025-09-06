<script setup>
import { ref } from 'vue';
import ButtonSubmit from '../components/ButtonSubmit.vue';
import FormInput from '../components/FormInput.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref('');

// console.log(email.value)

// function handleLogin() {
//   if (email.value === 'user@example.com' && password.value === 'password') {
//     error.value = '';
//     alert('Login successful!');
//   } else {
//     error.value = 'Invalid email or password.';
//   }
// }

async function handleLogin() {
  error.value = '';
  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) {
      error.value = data.error || 'Login failed.';
    } else {
      error.value = '';
      router.push('/');
      // TODO: save user info/token if needed
    }
  } catch (e) {
    error.value = 'Network error.';
  }
}
</script>

<template>
  <div class="login bg-white h-screen flex justify-center items-center text-blue-950">
    <div class="login__form w-sm mx-auto border-gray-200 border-2 rounded-md shadow-xl px-6 py-8">
      <RouterLink to="/" class="inline-flex mb-6 items-center text-gray-400 hover:text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
        </svg>
        <div class="ml-1 text-sm">กลับไปยังหน้าหลัก</div>
      </RouterLink>
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