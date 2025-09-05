<script setup>
    const MapPin = `/src/client/assets/icons/map-pin.png`
    const ImageTest = `/src/client/assets/images/test.png`
</script>

<template>
    <div class="grid m-16 justify-center">
        <div class="flex shadow-2xl rounded-lg">
            <img :src="ImageTest" alt="test-hotel-image" class="w-100 h-50 object-cover rounded-md">
            <div class="p-8 pt-4 min-w-150">
                <!-- ชื่อโรงแรม -->
                <div class="font-extrabold text-[28px]">
                    <span>โรงแรมดาวมีไว้เบิ่ง 1</span>
                    <span> | </span>
                    <span>กรุงเทพ</span>
                </div> 
                <!-- สถานที่ตั้ง -->
                <div class="mt-4 mb-4 inline-flex gap-1.5">
                    <img :src="MapPin" alt="pin-location" class="w-6 h-6">
                    <span class="">กรุงเทพมหานคร, ใจกลางเมือง ติดรถไฟฟ้า</span>
                </div>
                <!-- สิ่งอำนวยความสะดวก -->
                <div>
                    <span>WiFi ฟรี</span>
                    <span> | </span>
                    <span>ที่จอดรถ</span>
                    <span> | </span>
                    <span>สระว่ายน้ำ</span>
                    <span> | </span>
                    <span>อาหารเช้า</span>
                </div>
            </div>
            <div class="flex items-end mb-4 mr-4">
                <div class="bg-[#00D35F] p-2.5 text-white rounded-sm font-semibold">2000 บาท / คืน</div>
            </div>
        </div>
    </div>
</template>