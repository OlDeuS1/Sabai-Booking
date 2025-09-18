<script setup>
    import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
</script>

<template>
    <div class="bg-[#212121] p-32 pt-16">
        <!-- ส่วนของผู้ใช้บริการ/ลูกค้า -->
        <div class="grid justify-center text-white">
            <div class="flex justify-between mb-4 items-center">
                <div class="text-2xl font-semibold">รายชื่อผู้ใช้</div>
                <div class="relative">
                    <input type="text" name="" id="" class="rounded-sm p-3 text-sm w-80 h-10 bg-white text-black border-none" placeholder="ค้นหาชื่อผู้ใช้">
                    <button type="submit" class="absolute inset-y-1 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-black cursor-pointer">
                        <MagnifyingGlassIcon class="w-5 h-5 text-white"/>
                    </button>
                </div>
            </div>
            <table class="table-auto w-300">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border border-l-0 border-r-0">
                        <td >1</td>
                        <td class="border">ธนภัทร มลิแก้ว</td>
                        <td class="border">66070080@kmitl.ac.th</td>
                        <td >064-951-5415</td>
                        <td class="text-right">
                            <button class="cursor-pointer bg-[#102B58] text-white p-2 w-30 rounded-sm">ประวัติการจอง</button>
                        </td>
                    </tr>

                    <tr class="border border-l-0 border-r-0">
                        <td >1</td>
                        <td class="border">ธนภัทร มลิแก้ว</td>
                        <td class="border">66070080@kmitl.ac.th</td>
                        <td >064-951-5415</td>
                        <td class="text-right">
                            <button class="cursor-pointer bg-[#102B58] text-white p-2 w-30 rounded-sm">ประวัติการจอง</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- ส่วนของโรงแรม -->
        <div class="grid justify-center text-white">
            <div class="flex justify-between mt-28 mb-4 items-center">
                <div class="text-2xl font-semibold">รายชื่อโรงแรม</div>
                <div class="relative">
                    <input type="text" name="" id="" class="rounded-sm p-3 text-sm w-80 h-10 bg-white text-black border-none" placeholder="ค้นหาชื่อโรงแรม">
                    <button type="submit" class="absolute inset-y-1 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-black cursor-pointer">
                        <MagnifyingGlassIcon class="w-5 h-5 text-white"/>
                    </button>
                </div>
            </div>
            <table class="table-auto w-300">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th class="w-100"></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border border-l-0 border-r-0">
                        <td >1</td>
                        <td class="border">
                            <div class="text-lg mb-1">โรงแรมดาวเด่น</div> <!-- ชื่อโรงแรม -->
                            <div class="text-sm opacity-50">ณัจกิจ ปิ่นโต</div> <!-- ชื่อผู้ให้บริการโรงแรม -->
                        </td>
                        <td class="border">หมู่บ้าน Golden town รัตนาธิเบศก์ บางรักใหญ่ บางบัวทอง นนทบุรี 1110</td>
                        <td>
                            <ul>
                                <li>ห้องพัก 1 คน 1 เตียง</li>
                                <li>ห้องพัก 2 คน 1 เตียง</li>
                                <li>ห้องพัก 2 คน 2 เตียง</li>
                                <li>ห้องพัก 4 คน 2 เตียง</li>
                            </ul>
                        </td>
                        <td class="text-right">
                            <button class="cursor-pointer bg-[#FF0000] text-white p-2 w-30 rounded-sm">ลบ</button>
                        </td>
                    </tr>
                    
                    <tr class="border border-l-0 border-r-0">
                        <td >1</td>
                        <td class="border">
                            <div class="text-lg mb-1">โรงแรมดาวเด่น</div> <!-- ชื่อโรงแรม -->
                            <div class="text-sm opacity-50">ณัจกิจ ปิ่นโต</div> <!-- ชื่อผู้ให้บริการโรงแรม -->
                        </td>
                        <td class="border">หมู่บ้าน Golden town รัตนาธิเบศก์ บางรักใหญ่ บางบัวทอง นนทบุรี 1110</td>
                        <td>
                            <ul>
                                <li>ห้องพัก 1 คน 1 เตียง</li>
                                <li>ห้องพัก 2 คน 1 เตียง</li>
                                <li>ห้องพัก 2 คน 2 เตียง</li>
                                <li>ห้องพัก 4 คน 2 เตียง</li>
                            </ul>
                        </td>
                        <td class="text-right">
                            <button class="cursor-pointer bg-[#00D35F] text-white p-2 w-30 rounded-sm">อนุมัติ</button>
                            <button class="cursor-pointer bg-[#F2B900] text-white p-2 w-30 rounded-sm ml-6">ปฏิเสธ</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
    th{
        padding: 4px;
    }
    td{
        padding: 24px;
    }
</style>