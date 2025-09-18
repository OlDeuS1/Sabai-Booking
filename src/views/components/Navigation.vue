<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { UserFilled } from '@element-plus/icons-vue'

const props = defineProps({
  userCur: {
    type: Object,
    default: null
  }
})

</script>

<template>
  <Disclosure as="nav" class="border-b relative bg-white after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 py-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex shrink-0 items-center">
            <router-link to="/"><div class="text-2xl font-bold">SABAI BOOKING</div></router-link>
          </div>
          <div class="hidden sm:ml-6 sm:block">
                <!-- ใส่ชื่อ -->
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <router-link to="/login" v-if="props.userCur === null">
            <button type="button" class="bg-[#333333] relative p-2 pl-4 pr-4 rounded-sm text-white hover:bg-[#4A4949] cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
              <span>เข้าสู่ระบบ</span>
            </button>
          </router-link>
          <router-link to="/register" v-if="props.userCur === null">
            <button type="button" class="bg-[#102B58] relative ml-8 p-2 pl-4 pr-4 rounded-sm text-white  hover:bg-[#153C7E] cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
              <span>สมัครสมาชิก</span>
            </button>
          </router-link>
          <div class="userCur text-gray-700 flex items-center gap-3" v-if="props.userCur !== null">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link cursor-pointer flex items-center gap-2 text-[#212121] font-medium">
                {{ props.userCur.first_name }} {{ props.userCur.last_name }} <el-avatar :icon="UserFilled" />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item><router-link to="/historyBooking">ประวัติการจอง</router-link></el-dropdown-item>
                  <el-dropdown-item><router-link to="/logout">ออกจากระบบ</router-link></el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
  </Disclosure>
</template>

<style scoped>

:deep(.el-avatar) {
  background-color: #212121;
  width: 22px;
  height: 22px;
}

:deep(.el-avatar svg) {
  width: 12px;
  height: 12px;
} 

:deep(.el-dropdown-menu__item) {
  width: 10rem;
}

</style>