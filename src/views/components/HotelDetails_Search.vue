<script setup>
const MapPin = `/src/views/assets/icons/map-pin.png`
const ImageTest = `/src/views/assets/images/test.png`

const props = defineProps({
    hotelData: {
        type: Object,
        default: {},
    }
})
</script>

<template>
    <router-link :to="{ name: 'hotel-detail', params: { id: props.hotelData.hotel_id } }">
    <div class="grid mb-24 mt-6 w-full">
        <div class="flex shadow-2xl rounded-lg bg-white">
            <img :src="ImageTest" alt="test-hotel-image" class="w-100 h-50 object-cover rounded-md">
            <div class="p-8 pt-4">
                <!-- ชื่อโรงแรม -->
                <div class="font-extrabold text-[28px]">
                    <span>{{ props.hotelData.hotel_name }}</span>
                    <span> | </span>
                    <span>{{ props.hotelData.city }}</span>
                </div> 
                <!-- สถานที่ตั้ง -->
                <div class="mt-4 mb-4 inline-flex gap-1.5">
                    <img :src="MapPin" alt="pin-location" class="w-6 h-6">
                    <span class="">{{ props.hotelData.description }}</span>
                </div>
                <!-- สิ่งอำนวยความสะดวก -->
                <div>
                    <span v-for="a in props.hotelData.amenities">{{ String(a).replace(',', ' | ') }}</span>
                </div>
            </div>
            <div class="flex justify-end items-end mb-4 ml-auto mr-4">
                <div class="bg-[#00D35F] p-2.5 text-white rounded-sm font-semibold">{{ props.hotelData.price_per_night ? props.hotelData.price_per_night : 0 }} / คืน</div>
            </div>
        </div>
    </div>
    </router-link>
</template>