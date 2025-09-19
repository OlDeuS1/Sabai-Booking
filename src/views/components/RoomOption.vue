<script setup>
    import { ref } from 'vue'

    const RoomOption = ref('')
</script>

<template>
        <div>
            <el-radio-group v-model="RoomOption">
            <el-radio value="1" size="large" border>Option A</el-radio>
            </el-radio-group>
        </div>
</template>