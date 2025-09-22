<script setup>

</script>

<template>
  <div class="payment">
        <div class="payment-container max-w-7xl mx-auto px-[32px] py-[8px] flex flex-col h-screen sticky top-0 left-0">
            <h1 class="text-4xl font-semibold text-left mt-12 mb-10">ยืนยันและชำระเงิน</h1>
            <div class="payment__content flex justify-center items-center gap-20">
              <div class="payment__qrcode text-[5rem]">QR CODE</div>
              <div class="payment__detail">
                <ul class="flex flex-col gap-2 rounded-[1.2rem] shadow-lg px-8 py-6 mb-6">
                  <li class="px-2 py-1 border-b border-gray-300 mb-4"><h2 class="payment__hotel-title text-xl mb-4 font-semibold">โรงแรมด่าวเบิ่ง</h2></li>
                  <li class="px-2 py-1 text-gray-600"><div class="text-black">วันที่ :</div> 20 กันยายน 2568 - 22 กันยายน 2568</li>
                  <li class="px-2 py-1 text-gray-600"><div class="text-black">ห้อง :</div> Standard</li>
                  <li class="px-2 py-1 text-gray-600"><div class="text-black">จำนวนห้อง :</div> 1 ห้อง</li>
                  <li class="px-2 py-1 text-gray-600"><div class="text-black">จำนวนคน :</div> 2 คน</li>
                  <li class="px-2 py-1 text-gray-600"><div class="text-black">รายละเอียดราคา :</div> 1 ห้องพัก x 3000 บาทต่อคืน</li>
                  <li class="px-2 py-1 text-gray-600"><div class="text-black">ยอดรวม :</div> 30000 บาท</li>
                </ul>
                <button 
                  type="submit" 
                  @click.prevent=""
                  class="mt-6 bg-green-500 cursor-pointer text-white py-2 px-8 rounded-md font-semibold hover:bg-green-600 transition-all">
                  ชำระเงิน
                </button>
              </div>
            </div>
        </div>
    </div>
</template>