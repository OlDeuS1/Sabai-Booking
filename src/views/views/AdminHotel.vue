<script setup>
const ImageTest = `/src/views/assets/images/test.png`

</script>

<template>
  <div class="admin__hotel bg-[#102B58] text-white">
      <div class="admin__hotel-container max-w-7xl mx-auto px-[32px] py-[8px] flex flex-col h-screen sticky top-0 left-0">
          <div class="admin__hotel-header flex justify-between items-center">
            <h1 class="text-4xl font-semibold text-left mt-12 mb-12">My Hotel</h1>
            <div class="admin__hotel-button flex justify-center items-center gap-6">
              <button class="bg-red-700 cursor-pointer text-white py-2 px-6 rounded-md font-semibold hover:bg-red-800 transition-colors">ลบโรงแรม</button>
              <button class="bg-green-500 cursor-pointer text-white py-2 px-6 rounded-md font-semibold hover:bg-green-600 transition-colors">เพิ่มโรงแรม</button>
            </div>
          </div>
          <div class="mt-4">
            <div class="grid grid-cols-4 gap-10 w-full">
                <div class="p-6 rounded-md shadow-2xl bg-white text-black">
                    <img :src="ImageTest" alt="test-hotel-image" class="w-75 h-45 object-cover m-auto rounded-md">
                    <div class="text-center p-4 font-bold text-[18px]">โรงแรมดาวมีไว้เบิ่ง 1 | กรุงเทพ</div>

                    <div class="flex justify-end">
                        <button class="text-white bg-[#102B58] text-[14px] font-semibold p-2.5 cursor-pointer rounded-sm">แก้ไขรายละเอียด</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
  </div>
</template>