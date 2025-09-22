<script setup>



</script>

<template>
  <div class="payment">
        <div class="payment-container max-w-7xl mx-auto px-[32px] py-[8px] flex flex-col h-screen sticky top-0 left-0">
            <h1 class="text-4xl font-semibold text-left mt-12 mb-12">ชำระเงิน</h1>
            <div class="payment__detail">
              <div class="payment__hotel-title">โรงแรมด่าวเบิ่ง</div>
              <div class="payment__checkin-out">20 กันยายน 2568 - 22 กันยายน 2568</div>
              <div class="payment__roomtype">ห้อง : Standard</div>
              <div class="payment__numroom">จำนวนห้อง : 1</div>
              <div class="payment__people">ผู้เข้าพัก : 2</div>
              <div class="payment__sum-price">30000 บาท</div>
            </div>
            <button type="submit" @click.prevent=""
                            class="bg-green-500 cursor-pointer text-white py-3 rounded-md font-semibold hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                            ยืนยัน
                        </button>
        </div>
    </div>
</template>