<script setup>
const Calendar = `/src/views/assets/icons/calendar.png`
const Amount = `/src/views/assets/icons/amount-room.png`
const Price = `/src/views/assets/icons/price.png`
const ImageTest = `/src/views/assets/images/test.png`
import { ref } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
    booking: {
        type: Object,
        required: true,
    }
});

const booking = ref({ ...props.booking });

const ThaiMonth = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม'
]

const checkIn = new Date(booking.value.check_in_date)
const checkOut = new Date(booking.value.check_out_date)

const checkInDay = dayjs(checkIn).date()
const checkOutDay = dayjs(checkOut).date()

const checkInMonth = ThaiMonth[dayjs(checkIn).month()]
const checkOutMonth = ThaiMonth[dayjs(checkOut).month()]

const checkInYear = dayjs(checkIn).year() + 543
const checkOutYear = dayjs(checkOut).year() + 543

</script>

<template>
    <div class="grid m-10 justify-center">
        <div class="flex shadow-2xl rounded-lg p-4">
            <img :src="ImageTest" alt="test-hotel-image" class="w-50 h-50 object-cover rounded-md">
            <div class="grid p-8 pt-0 w-250">
                <!-- ชื่อโรงแรม -->
                <div class="font-bold text-[24px]">
                    <span>{{ booking.hotel_name }}</span>
                </div> 
                <!-- วันที่จองเข้า - ออก -->
                <div class="inline-flex gap-1.5">
                    <img :src="Calendar" alt="calendar" class="w-6 h-6">
                    <span class="">{{ checkInDay }} {{ checkInMonth }} {{ checkInYear }} - {{ checkOutDay }} {{ checkOutMonth }} {{ checkOutYear }}</span>
                </div>
                <!-- จำนวนห้องที่พัก/คืน -->
                <div class="inline-flex gap-1.5">
                    <span class="">ห้อง : {{ booking.room_type }}</span>
                </div>
                <div class="inline-flex gap-1.5">
                    <span class="">ผู้เข้าพัก : {{ booking.num_guests }}</span>
                </div>
                <!-- จำนวนเงิน -->
                <div class="inline-flex gap-1.5">
                    <img :src="Price" alt="price" class="w-6 h-6">
                    <span class="">{{ booking.total_price }}</span>
                </div>
            </div>
            <div class="flex items-end mr-4">
                <div class="p-2.5 text-center w-30 text-white rounded-sm font-semibold" 
                    :class="{
                        'bg-[#00D35F]': booking.booking_status === 'completed'
                        , 'bg-[#F2B900]': booking.booking_status === 'pending'
                        , 'bg-red-500': booking.booking_status === 'cancelled'
                        , 'bg-blue-500': booking.booking_status === 'confirmed'
                    }">
                    {{ booking.booking_status }}
                </div>
            </div>
        </div>
    </div>
</template>