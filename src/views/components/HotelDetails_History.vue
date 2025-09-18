<script setup>
    const Calendar = `/src/views/assets/icons/calendar.png`
    const Amount = `/src/views/assets/icons/amount-room.png`
    const Price = `/src/views/assets/icons/price.png`
    const ImageTest = `/src/views/assets/images/test.png`
</script>

<template>
    <div class="grid m-10 justify-center">
        <div class="flex shadow-2xl rounded-lg p-4">
            <img :src="ImageTest" alt="test-hotel-image" class="w-50 h-50 object-cover rounded-md">
            <div class="grid p-8 pt-0 min-w-250">
                <!-- ชื่อโรงแรม -->
                <div class="font-bold text-[24px]">
                    <span>โรงแรมดาวมีไว้เบิ่ง 1</span>
                    <span> | </span>
                    <span>กรุงเทพ</span>
                </div> 
                <!-- วันที่จองเข้า - ออก -->
                <div class="inline-flex gap-1.5">
                    <img :src="Calendar" alt="calendar" class="w-6 h-6">
                    <span class="">12 สิงหาคม - 14 สิงหาคม</span>
                </div>
                <!-- จำนวนห้องที่พัก/คืน -->
                <div class="inline-flex gap-1.5">
                    <img :src="Amount" alt="amount-room" class="w-6 h-6">
                    <span class="">1 ห้อง | 2 คืน</span>
                </div>
                <!-- จำนวนเงิน -->
                <div class="inline-flex gap-1.5">
                    <img :src="Price" alt="price" class="w-6 h-6">
                    <span class="">4,000 บาท</span>
                </div>
            </div>
            <!-- สถานะ: สำเร็จ -->
            <div class="flex items-end mr-4">
                <div class="bg-[#00D35F] p-2.5 text-center w-30 text-white rounded-sm font-semibold">สำเร็จ</div>
            </div>
            <!-- สถานะ: กำลังรอ -->
            <!-- <div class="flex items-end mr-4">
                <div class="bg-[#F2B900] p-2.5 text-center w-30 text-white rounded-sm font-semibold">กำลังรอ</div>
            </div> -->
        </div>
    </div>
</template>