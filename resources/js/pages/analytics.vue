<template>
    <AdminLayout>
        <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm">
                    <p class="text-[12px] font-medium text-[#5A7A9A] uppercase">Pendapatan Hari Ini</p>
                    <p class="text-[24px] font-bold text-[#1A2332] mt-2 font-['JetBrains_Mono']">Rp 0</p>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from '../components/adminlayout.vue';
</script>