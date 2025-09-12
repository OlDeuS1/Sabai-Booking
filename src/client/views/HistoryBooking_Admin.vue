<script setup>
    import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
</script>

<template>
    <div class="bg-[#212121] p-32 pt-16">
        <div class="grid justify-center text-white">
            <div class="flex mb-10">
                <router-link to="/" class="flex items-center">
                        <div><ChevronLeftIcon class="w-6 h-6"/></div>
                        <div class="text-white text-xl">กลับไปยังหน้าหลัก</div>
                </router-link>
            </div>
            <div class="text-3xl mb-10">
                <span>ประวัติการจอง&nbsp;</span>
                <span class="text-[#00D35F]">คุณ ธนภัทร มลิแก้ว</span>
            </div>
            <table class="table-auto w-300">
                <thead>
                    <tr>
                        <th></th>
                        <th>ชื่อโรงแรม</th>
                        <th>ประเภทห้องพัก</th>
                        <th>วันที่เข้าพัก</th>
                        <th>วันที่ออก</th>
                        <th>จำนวนเงิน</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border border-l-0 border-r-0">
                        <td>1</td>
                        <td class="border">โรงแรมดาวเด่น</td>
                        <td class="border">ห้องพัก 1 คน 1 เตียง</td>
                        <td>01-01-2001</td>
                        <td class="border">03-01-2001</td>
                        <td class="border">5,600 บาท</td>
                    </tr>

                    <tr class="border border-l-0 border-r-0">
                        <td>2</td>
                        <td class="border">โรงแรมดาวมีไว้เบิ่ง | กรุงเทพ</td>
                        <td class="border">ห้องพัก 2 คน 1 เตียง</td>
                        <td>01-02-2001</td>
                        <td class="border">03-02-2001</td>
                        <td class="border">8,500 บาท</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
    th{
        padding: 4px;
        text-align: left;
        padding-left: 24px;
        padding-bottom: 16px;
    }
    td{
        padding: 36px;
    }
</style>