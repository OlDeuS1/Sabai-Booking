<script setup>
import HotelDetails_History from '../components/HotelDetails_History.vue';
import { getUserCur, getUserBookingHistory } from '../composables/getData.js';
import { ref, onMounted } from 'vue';

const curUser = ref(null);
const bookings = ref([]);

onMounted(async () => {
    curUser.value = await getUserCur();

    if (curUser.value) {
        bookings.value = await getUserBookingHistory(curUser.value.userId);;
    }
});

</script>


<template>
    <div class="history__booking">
        <div class="history__booking-container max-w-7xl mx-auto px-[32px] py-[8px] flex flex-col">
            <h1 class="text-4xl font-semibold text-left mt-12 mb-6">ประวัติการจอง</h1>
            <div class="history__booking-list flex flex-col gap-4" v-if="bookings.length">
                <HotelDetails_History v-for="b in bookings" :key="b.booking_id" :booking="b" />
            </div>
        </div>
    </div>
    
</template>
