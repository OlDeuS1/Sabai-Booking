<script setup>
import { ref } from 'vue';
import ButtonSubmit from '../components/ButtonSubmit.vue';
import FormInput from '../components/FormInput.vue';
import Multiselect from 'vue-multiselect'

const firstName = ref('');
const lastName = ref('');
const phoneNumber = ref('');
const email = ref('');
const password = ref('');
const rePassword = ref('');
const error = ref('');
const success = ref('');

function handleRegister() {
  if (firstName.value && lastName.value && phoneNumber.value && email.value && password.value && rePassword.value) {
    error.value = '';
    success.value = 'Registration successful!';
  } else {
    success.value = '';
    error.value = 'Please fill in all fields.';
  }
}

const dataSelect = ref(['ลูกค้าทั่วไป', 'โรงแรม'])
const selectRole = ref(null)

</script>

<template>
  <div class="register bg-white mt-8 flex justify-center items-center text-blue-950">
    <div class="register__form w-sm mx-auto border-gray-200 border-2 rounded-md shadow-xl px-6 py-8">
      <RouterLink to="/" class="inline-flex mb-5 items-center text-gray-400 hover:text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
        </svg>
        <div class="ml-1 text-sm">กลับไปยังหน้าหลัก</div>
      </RouterLink>
      <h2 class="text-center mb-6 text-2xl font-bold">ลงทะเบียน</h2>
      <form class="form flex flex-col justify-center items-center" @submit.prevent="handleRegister" >
        <FormInput inputType="text" inputName="firstName" inputPlaceHolder="ป้อนชื่อ" labelValue="ชื่อ" @updateModelValue="firstName = $event" />
        <FormInput inputType="text" inputName="lastName" inputPlaceHolder="ป้อนนามสกุล" labelValue="นามสกุล" @updateModelValue="lastName = $event" />
        <FormInput inputType="text" inputName="phoneNumber" inputPlaceHolder="ป้อนเบอร์โทร" labelValue="เบอร์โทร" @updateModelValue="phoneNumber = $event" />
        <FormInput inputType="email" inputName="email" inputPlaceHolder="ป้อนอีเมล" labelValue="อีเมล" @updateModelValue="email = $event" />
        <FormInput inputType="password" inputName="password" inputPlaceHolder="ป้อนรหัสผ่าน" labelValue="รหัสผ่าน" @updateModelValue="password = $event" />
        <FormInput inputType="password" inputName="re-password" inputPlaceHolder="ป้อนรหัสผ่านอีกครั้ง" labelValue="ยืนยันรหัสผ่าน" @updateModelValue="rePassword = $event" />
        <div class="container_selectRole mb-4 w-full">
          <multiselect 
            v-model="selectRole" 
            :options="dataSelect" 
            :searchable="false" 
            :close-on-select="true" 
            :show-labels="false"
            placeholder="ลูกค้าหรือโรงแรม">
          </multiselect>
        </div>
        <p v-if="error" class="error text-red-600 text-sm justify-self-center">{{ error }}</p>
        <p v-if="error" class="error text-red-600 text-sm justify-self-center">{{ error }}</p>
        <p v-if="success" class="success text-green-400 text-sm justify-self-center">{{ success }}</p>
        <ButtonSubmit typeBtn="register"/>
      </form>
      <div class="text-center mt-6 text-sm text-gray-400">เป็นสมาชิกแล้วใช่ไหม? <routerLink to="/login" class="text-green-400 hover:underline">เข้าสู่ระบบ</routerLink></div>
    </div>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>