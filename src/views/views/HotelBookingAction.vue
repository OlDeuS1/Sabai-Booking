<template>
    <div class="min-h-screen bg-[#102B58] p-8">
        <div class="max-w-8xl px-24 mx-auto">
            <div class="px-18">
                <router-link to="/" class="inline-flex items-center text-white font-semibold mb-10 cursor-pointer">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    กลับไปยังหน้าหลัก
                </router-link>

                <h1 class="text-3xl font-bold text-white mb-8">
                    การจองของ <span class="text-[#00D35F]">โรงแรมดาวมีไว้เบิ่ง 1 | กรุงเทพ</span>
                </h1>
            </div>

            <div>
                <table class="w-full">
                    <thead>
                        <tr>
                            <th class="px-6 py-4 text-left text-white font-semibold"></th>
                            <th class="px-6 py-4 text-left text-white font-semibold">ชื่อผู้จอง</th>
                            <th class="px-6 py-4 text-left text-white font-semibold">ประเภทห้องพัก</th>
                            <th class="px-6 py-4 text-left text-white font-semibold">จำนวนคน</th>
                            <th class="px-6 py-4 text-left text-white font-semibold">วันที่เข้าพัก</th>
                            <th class="px-6 py-4 text-left text-white font-semibold">วันที่ออก</th>
                            <th class="px-6 py-4 text-left text-white font-semibold">จำนวนเงิน</th>
                            <th class="px-6 py-4 text-left text-white font-semibold"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="px-6 py-8 text-white">1</td>
                            <td class="px-6 py-8 text-white border">คุณ ธนภัทร มลิแก้ว</td>
                            <td class="px-6 py-8 text-white border">ห้องพัก 1 คน 1 เตียง</td>
                            <td class="px-6 py-8 text-white border">6 คน</td>
                            <td class="px-6 py-8 text-white border">01-01-2001</td>
                            <td class="px-6 py-8 text-white border">03-01-2001</td>
                            <td class="px-6 py-8 text-white border">5,600 บาท</td>
                            <td class="px-6 py-8 border border-white">
                                <button class="px-4 py-2 bg-[#F2B900] text-white rounded text-sm font-semibold mr-4">
                                    กำลังรอยืนยัน
                                </button>
                                <button
                                    class="px-4 py-2 bg-[#FF0000] text-white rounded text-sm font-semibold hover:bg-red-700 cursor-pointer mr-4">
                                    ยกเลิกการจอง
                                </button>
                                <button
                                    class="px-4 py-2 bg-[#00D35F] text-white rounded text-sm font-semibold hover:bg-green-600 cursor-pointer">
                                    ยืนยันการจอง
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td class="px-6 py-8 text-white">2</td>
                            <td class="px-6 py-8 text-white border">คุณ ธนภัทร มลิแก้ว</td>
                            <td class="px-6 py-8 text-white border">ห้องพัก 1 คน 1 เตียง</td>
                            <td class="px-6 py-8 text-white border">6 คน</td>
                            <td class="px-6 py-8 text-white border">01-01-2001</td>
                            <td class="px-6 py-8 text-white border">03-01-2001</td>
                            <td class="px-6 py-8 text-white border">5,600 บาท</td>
                            <td class="px-6 py-8 border border-white">
                                <button class="px-4 py-2 bg-[#178649] text-white rounded text-sm font-semibold">
                                    การจองถูกยืนยันแล้ว
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td class="px-6 py-8 text-white">3</td>
                            <td class="px-6 py-8 text-white border">คุณ ธนภัทร มลิแก้ว</td>
                            <td class="px-6 py-8 text-white border">ห้องพัก 1 คน 1 เตียง</td>
                            <td class="px-6 py-8 text-white border">6 คน</td>
                            <td class="px-6 py-8 text-white border">01-01-2001</td>
                            <td class="px-6 py-8 text-white border">03-01-2001</td>
                            <td class="px-6 py-8 text-white border">5,600 บาท</td>
                            <td class="px-6 py-8 border border-white">
                                <button class="px-4 py-2 bg-[#153C7E] text-white rounded text-sm font-semibold">
                                    การจองเสร็จสิ้น
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td class="px-6 py-8 text-white">4</td>
                            <td class="px-6 py-8 text-white border">คุณ ธนภัทร มลิแก้ว</td>
                            <td class="px-6 py-8 text-white border">ห้องพัก 1 คน 1 เตียง</td>
                            <td class="px-6 py-8 text-white border">6 คน</td>
                            <td class="px-6 py-8 text-white border">01-01-2001</td>
                            <td class="px-6 py-8 text-white border">03-01-2001</td>
                            <td class="px-6 py-8 text-white border">5,600 บาท</td>
                            <td class="px-6 py-8 border border-white">
                                <button class="px-4 py-2 bg-[#B50A0A] text-white rounded text-sm font-semibold">
                                    การจองถูกยกเลิก
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>