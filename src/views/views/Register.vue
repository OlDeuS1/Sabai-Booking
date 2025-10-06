<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ButtonSubmit from '../components/ButtonSubmit.vue';
import FormInput from '../components/FormInput.vue';

const router = useRouter();

const firstName = ref('');
const lastName = ref('');
const phoneNumber = ref('');
const email = ref('');
const password = ref('');
const rePassword = ref('');
const error = ref('');
const success = ref('');

const dataSelect = ref(['ลูกค้าทั่วไป', 'โรงแรม'])
const selectRole = ref(null)

async function handleRegister() {
  error.value = '';
  success.value = '';
  if (!firstName.value || !lastName.value || !phoneNumber.value || !email.value || !password.value || !rePassword.value || !selectRole.value) {
    error.value = 'กรุณากรอกข้อมูลให้ครบทุกช่อง';
    return;
  }
  if (password.value !== rePassword.value) {
    error.value = 'รหัสผ่านไม่ตรงกัน';
    return;
  }
  let role = selectRole.value === 'โรงแรม' ? 'hotel' : 'user';
  try {
    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: firstName.value,
        last_name: lastName.value,
        phone_number: phoneNumber.value,
        email: email.value,
        password: password.value,
        role
      })
    });
    const data = await res.json();
    if (!res.ok) {
      error.value = data.error || 'Registration failed.';
      success.value = '';
    } else {
      error.value = '';
      success.value = 'สมัครสมาชิกสำเร็จ!';
      
      // Auto login after successful registration
      try {
        const loginRes = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: email.value,
            password: password.value
          })
        });
        
        const loginData = await loginRes.json();
        
        if (loginRes.ok) {
          success.value = 'สมัครสมาชิกและเข้าสู่ระบบสำเร็จ!';
          // Redirect to home page after successful login
          setTimeout(() => {
            if (loginData && loginData.role) {
              switch(loginData.role) {
                case 'hotel':
                  router.push('/hotel-management');
                  break;
                default:
                  router.push('/');
                  break;
              }
            } else {
              router.push('/');
            }
          }, 1500);
        } else {
          success.value = 'สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ';
          setTimeout(() => {
            router.push('/login');
          }, 1500);
        }
      } catch (loginError) {
        success.value = 'สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ';
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    }
  } catch (e) {
    error.value = 'Network error.';
    success.value = '';
  }
}
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
          <el-select v-model="selectRole" placeholder="ลูกค้าหรือโรงแรม" class="w-full">
            <el-option
              v-for="(data, index) in dataSelect"
              :key="index"
              :label="data"
              :value="data"
            />
          </el-select>
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