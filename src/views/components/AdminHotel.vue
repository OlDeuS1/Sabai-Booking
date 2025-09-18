<script setup>
    const ImageTest = `/src/views/assets/images/test.png`
</script>

<template>
    <div class="m-16">
        <div class="grid grid-cols-3 m-auto w-300">
            <div class="p-6 w-90 rounded-md shadow-2xl">
                <img :src="ImageTest" alt="test-hotel-image" class="w-75 h-45 object-cover m-auto rounded-md">
                <div class="text-center p-4 font-bold text-[18px]">โรงแรมดาวมีไว้เบิ่ง 1 | กรุงเทพ</div>

                <div class="flex justify-end">
                    <button class="text-white bg-[#102B58] text-[14px] font-semibold p-2.5 cursor-pointer rounded-sm">แก้ไขรายละเอียด</button>
                </div>
            </div>

            <div class="p-6 w-90 rounded-md shadow-2xl">
                <img :src="ImageTest" alt="test-hotel-image" class="w-80 h-45 object-cover m-auto rounded-md">
                <div class="text-center p-4 font-bold text-[18px]">โรงแรมดาวมีไว้เบิ่ง 1 | กรุงเทพ</div>
                
                <div class="flex justify-end">
                    <button class="text-white bg-[#102B58] text-[14px] font-semibold p-2.5 cursor-pointer rounded-sm">แก้ไขรายละเอียด</button>
                </div>
            </div>

            <div class="p-6 w-90 rounded-md shadow-2xl">
                <img :src="ImageTest" alt="test-hotel-image" class="w-80 h-45 object-cover m-auto rounded-md">
                <div class="text-center p-4 font-bold text-[18px]">โรงแรมดาวมีไว้เบิ่ง 1 | กรุงเทพ</div>
                
                <div class="flex justify-end">
                    <button class="text-white bg-[#102B58] text-[14px] font-semibold p-2.5 cursor-pointer rounded-sm">แก้ไขรายละเอียด</button>
                </div>
            </div>
        </div>
    </div>
</template>