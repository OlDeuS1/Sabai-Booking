<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    hodelData: {
        type: Array,
        default: [],
    },
    searchData: {
        type: Object,
        default: null,
    }
})
const emit =  defineEmits(['sendSearchData'])

const hodelData = ref([...props.hodelData])
const searchData = ref({})

const optimizeSearchData = function(){
    searchData.value = props.searchData ? {...props.searchData} : {where: '', checkInOutDate: ['', ''], numPeople: 0, numRoom: 0}
    searchData.value.checkInOutDate = [searchData.value.checkIn ?? '', searchData.value.checkOut ?? '']
    searchData.value.numPeople = Number(searchData.value.numPeople)
    searchData.value.numRoom = Number(searchData.value.numRoom)
}

optimizeSearchData()


const handleSearch = () => {
    emit('sendSearchData', searchData.value);
};

const searchRoomPeople = computed(() => {
    return  searchData.value.numPeople > 0 || searchData.value.numRoom > 0 ? `${searchData.value.numPeople} คน / ${searchData.value.numRoom} ห้อง` : 'เลือกผู้เข้าพักและห้องพัก';
});

const querySearchAsync = (queryString, cb) => {
    const results = queryString ? hodelData.value.filter((d) => d.city.toLocaleLowerCase().includes(queryString.toLocaleLowerCase())) : [];
    const cities = [...new Set(results.map(d => d.city))]
    cb(cities.map(c => ({ value: c })));
};

</script>


<template>
    <div class="search-compo p-5 inline-flex gap-4 items-center justify-center shadow-md rounded-lg bg-white relative -top-15">
        <div class="search-where flex flex-col">
            <div class="demo-block">
                <div class="mb-2 text-[#212121] font-medium">สถานที่</div>
                <el-autocomplete
                    v-model="searchData.where"
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
                    v-model="searchData.checkInOutDate"
                    type="daterange"
                    range-separator="ถึง"
                    start-placeholder="วันที่เข้าพัก"
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
                        <el-input-number v-model="searchData.numRoom" :min="0" :max="100" label="ห้องพัก" />
                    </div>
                    <div class="people-room-item flex justify-between items-center mb-4">
                        <div class="search-child-title">คน</div>
                        <el-input-number v-model="searchData.numPeople" :min="0" :max="100" label="คน" />
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