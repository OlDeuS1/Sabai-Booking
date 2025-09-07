<script setup>
import { ref, computed } from 'vue';

const checkInOutDate = ref([null, null]);
const where = ref(null);
const numPeople = ref(0);
const numRoom = ref(0);

const handleSearch = () => {
    console.log('Where:', where.value);
    console.log('Check-in-out Date:', checkInOutDate.value);
    console.log('Number of People:', numPeople.value);
    console.log('Number of Rooms:', numRoom.value);
};

const searchRoomPeople = computed(() => {
    return  numPeople.value > 0 || numRoom.value > 0 ? `${numPeople.value} คน / ${numRoom.value} ห้อง` : 'เลือกผู้เข้าพักและห้องพัก';
});

const querySearchAsync = (queryString, cb) => {
    const results = queryString ? ['กรุงเทพ', 'เชียงใหม่', 'ภูเก็ต', 'พัทยา'].filter((d) => d.toLocaleLowerCase().includes(queryString)) : [];
    cb(results.map((d) => ({ value: d })));
};

</script>


<template>
    <div class="search-compo p-5 inline-flex gap-4 items-center justify-center shadow-md rounded-lg bg-white relative -top-15">
        <div class="search-where flex flex-col">
            <div class="demo-block">
                <div class="mb-2 text-[#212121] font-medium">สถานที่</div>
                <el-autocomplete
                    v-model="where"
                    :fetch-suggestions="querySearchAsync"
                    class="w-50"
                    placeholder="คุณจะไปที่ไหน"
                >
                    <template #loading>
                    <svg class="circular" viewBox="0 0 50 50">
                        <circle class="path" cx="25" cy="25" r="20" fill="none" />
                    </svg>
                    </template>
                </el-autocomplete>
            </div>
        </div>
        <div class="search-check-out flex flex-col">
            <div class="mb-2 text-[#212121] font-medium">เช็คอิน - เช็คเอาท์</div>
            <div class="block">
                <el-date-picker
                    v-model="checkInOutDate"
                    type="daterange"
                    range-separator="ถึง"
                    start-placeholder="วันนี่เข้าพัก"
                    end-placeholder="วันที่ออก"
                />
            </div>
        </div>
        <div class="search-people-room flex flex-col">
            <div class="mb-2 text-[#212121] font-medium">ผู้เข้าพัก / ห้องพัก</div>
            <el-popover placement="bottom" :width="250" trigger="click" class="pt-2">
                <template #reference>
                    <el-button> {{ searchRoomPeople }} </el-button>
                </template>
                <div class="people-room-list">
                    <div class="people-room-item flex justify-between items-center mb-4">
                        <div class="search-adult-title">ห้องพัก</div>
                        <el-input-number v-model="numRoom" :min="0" :max="100" label="ห้องพัก" />
                    </div>
                    <div class="people-room-item flex justify-between items-center mb-4">
                        <div class="search-child-title">คน</div>
                        <el-input-number v-model="numPeople" :min="0" :max="100" label="คน" />
                    </div>
                </div>
            </el-popover>
        </div>
        <button @click="handleSearch" class="search-button self-end rounded-[50%] bg-[#212121] text-white px-2 py-2 hover:bg-[#3b3b3b] transition cursor-pointer">
            <img class="w-[1.5rem]" src="../assets/icons/magnifying-glass.svg" alt="search-icon">
        </button>
    </div>
</template>
<style scoped>

:deep(.el-button) {
    height: 100%;
}

</style>