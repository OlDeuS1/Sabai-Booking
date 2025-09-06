<script setup>
import { ref } from 'vue';
import flatPickr from 'vue-flatpickr-component';
import Multiselect from 'vue-multiselect'

const checkInDate = ref(null);
const checkOutDate = ref(null);
const where = ref(null);

</script>


<template>
    <div class="search-compo p-6 my-4 mx-auto flex gap-4 shadow-md rounded-lg bg-white max-w-[60rem]">
        <div class="search-where flex flex-col">
            <label for="inputWhere" class="mb-2">สถานที่</label>
           <Multiselect
                v-model="where"
                :options="['กรุงเทพ', 'เชียงใหม่', 'ภูเก็ต', 'พัทยา']"
                :searchable="true"
                :close-on-select="true"
                :show-labels="false"
                placeholder="เลือกสถานที่"
                class="text-[#212121] w-full" >
            </Multiselect>
        </div>
        <div class="search-check-in flex flex-col">
            <label for="inputCheckIn" class="mb-2">เช็คอิน</label>
            <flat-pickr
                v-model="checkInDate"
                class="search-input-check-in text-[#212121] p-2 rounded cursor-pointer border border-gray-300"
                placeholder="เลือกวันที่เช็คอิน"
                name="checkInDate"
                id="inputCheckIn"
            />
        </div>
        <div class="search-check-out flex flex-col">
            <label for="inputCheckOut" class="mb-2">เช็คเอาท์</label>
            <flat-pickr
                v-model="checkOutDate"
                class="search-input-check-out text-[#212121] p-2 rounded cursor-pointer border border-gray-300"
                placeholder="เลือกวันที่เช็คเอาท์"
                name="checkOutDate"
                id="inputCheckOut"
            />
        </div>
        <router-link to="/search" class="search-button self-end rounded-[50%] bg-[#212121] text-white px-2 py-2 hover:bg-[#3b3b3b] transition">
            <img class="w-[1.5rem]" src="../assets/icons/magnifying-glass.svg" alt="search-icon">
        </router-link>
    </div>
</template>
<style scoped>
:deep(.multiselect) {
    font-size: 16px;
    width: 15rem;
    height: 40px;
    border: 1px solid #D1D5DB;
    border-radius: 5px;
}

:deep(.multiselect__tags) {
    height: 100%;
    padding-bottom: 8px;
    display: flex;
    align-items: center;
}

:deep(.multiselect__placeholder) {
    font-size: 16px;
    margin-bottom: 0;
}

:deep(.multiselect__input), :deep(.multiselect__single) {
    font-size: 16px;
    margin-bottom: 0;
    padding: 0;
}
</style>