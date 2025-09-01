<template>
  <Disclosure as="nav" class="border-b relative bg-white after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 py-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex shrink-0 items-center">
            <div class="text-2xl font-bold">SABAI BOOKING</div>
          </div>
          <div class="hidden sm:ml-6 sm:block">
                <!-- ใส่ชื่อ -->
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <button type="button" class="bg-[#333333] relative p-2 pl-4 pr-4 rounded-sm text-white hover:bg-[#4A4949] cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
            <span>เข้าสู่ระบบ</span>
          </button>
          <button type="button" class="bg-[#102B58] relative ml-8 p-2 pl-4 pr-4 rounded-sm text-white  hover:bg-[#153C7E] cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
            <span>สมัครสมาชิก</span>
          </button>

        </div>
      </div>
    </div>
  </Disclosure>
</template>

<script setup>
    import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
    import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'

    const navigation = [
    { name: 'Dashboard', href: '#', current: true },
    { name: 'Team', href: '#', current: false },
    { name: 'Projects', href: '#', current: false },
    { name: 'Calendar', href: '#', current: false },
    ]
</script>