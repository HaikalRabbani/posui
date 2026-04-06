<template>
    <AdminLayout>
        <div class="space-y-6 font-['Poppins'] pb-10">
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 class="text-[24px] font-semibold text-[#1A2332]">Laporan & Analitik</h1>
                    <p class="text-[14px] text-[#5A7A9A] mt-1">Pantau performa penjualan dan tren pesanan.</p>
                </div>
                <div class="flex items-center gap-2 bg-white border border-[#D4E4F4] p-1.5 rounded-lg shadow-sm">
                    <span class="pl-2 text-[13px] text-[#5A7A9A] font-medium">Periode:</span>
                    <select v-model="selectedPeriod" class="border-none bg-transparent text-[#1A2332] text-[13px] font-semibold focus:outline-none cursor-pointer pr-4">
                        <option value="today">Hari Ini</option>
                        <option value="7days">7 Hari Terakhir</option>
                        <option value="30days">30 Hari Terakhir</option>
                        <option value="this_month">Bulan Ini</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col gap-3">
                    <div class="w-10 h-10 rounded-full bg-[#EBF3FB] flex items-center justify-center text-[#1B4F8A]">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p class="text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1">Total Pendapatan</p>
                        <p class="text-[20px] font-bold text-[#1A2332] font-['JetBrains_Mono'] leading-none">Rp 12.450.000</p>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col gap-3">
                    <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#2A7A4B]">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p class="text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1">Order Selesai</p>
                        <p class="text-[20px] font-bold text-[#1A2332] font-['JetBrains_Mono'] leading-none">342</p>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col gap-3">
                    <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
                    <div>
                        <p class="text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1">Avg. Order Value</p>
                        <p class="text-[20px] font-bold text-[#1A2332] font-['JetBrains_Mono'] leading-none">Rp 36.400</p>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col gap-3">
                    <div class="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p class="text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1">Jam Tersibuk</p>
                        <p class="text-[20px] font-bold text-[#1A2332] font-['JetBrains_Mono'] leading-none">19:00 - 20:00</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div class="lg:col-span-2 bg-white border border-[#D4E4F4] rounded-xl shadow-sm p-5">
                    <div class="mb-6">
                        <h3 class="text-[16px] font-semibold text-[#1A2332]">Grafik Pendapatan</h3>
                        <p class="text-[12px] text-[#5A7A9A]">Tren total pendapatan harian</p>
                    </div>
                    <div class="h-[300px] w-full">
                        <Bar v-if="!isLoading" :data="barChartData" :options="barChartOptions" />
                        <div v-else class="w-full h-full flex items-center justify-center">
                            <span class="text-[#8AAFCC] text-[13px] animate-pulse">Memuat grafik...</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm p-5 flex flex-col">
                    <div class="mb-6">
                        <h3 class="text-[16px] font-semibold text-[#1A2332]">Metode Pembayaran</h3>
                        <p class="text-[12px] text-[#5A7A9A]">Proporsi penggunaan metode bayar</p>
                    </div>
                    <div class="flex-1 flex items-center justify-center relative min-h-[250px]">
                        <Pie v-if="!isLoading" :data="paymentChartData" :options="paymentChartOptions" />
                        <div v-else class="w-full h-full flex items-center justify-center">
                            <span class="text-[#8AAFCC] text-[13px] animate-pulse">Memuat grafik...</span>
                        </div>
                    </div>
                </div>
                
            </div>

            <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden">
                <div class="px-5 py-4 border-b border-[#D4E4F4] bg-[#F7FAFD]">
                    <h3 class="text-[14px] font-semibold text-[#1A2332]">Produk Terlaris (Top 5)</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-[#D4E4F4]">
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Nama Menu</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Quantity Terjual</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Total Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in topMenus" :key="index" class="border-b border-[#EBF3FB] hover:bg-[#F7FAFD]">
                                <td class="px-5 py-3 text-[13px] font-medium text-[#1A2332] flex items-center gap-3">
                                    <span class="w-6 h-6 rounded-full bg-[#EBF3FB] border border-[#D4E4F4] text-[#1B4F8A] flex items-center justify-center text-[11px] font-bold">{{ index + 1 }}</span>
                                    {{ item.name }}
                                </td>
                                <td class="px-5 py-3 text-[13px] font-semibold text-[#1A2332] text-right font-['JetBrains_Mono']">{{ item.qty }}</td>
                                <td class="px-5 py-3 text-[13px] font-semibold text-[#2A7A4B] text-right font-['JetBrains_Mono']">Rp {{ formatRupiah(item.revenue) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '../components/adminlayout.vue';

// Import komponen ChartJS
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
ChartJS.defaults.font.family = "'Poppins', sans-serif";
ChartJS.defaults.color = '#5A7A9A';

const isLoading = ref(true);
const selectedPeriod = ref('7days'); // Default filter

// ================= KONFIGURASI BAR CHART (PENDAPATAN) =================
const barChartData = ref({
    labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
    datasets: [
        {
            label: 'Pendapatan (Rp)',
            backgroundColor: '#2E7DD6', // Blue primary
            hoverBackgroundColor: '#1B4F8A', // Navy
            borderRadius: 4,
            data: [1200000, 1500000, 900000, 2100000, 2400000, 3200000, 2800000]
        }
    ]
});

const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#1A2332',
            titleFont: { family: 'Poppins', size: 13 },
            bodyFont: { family: 'JetBrains Mono', size: 14, weight: 'bold' },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
                label: function(context) {
                    return 'Rp ' + new Intl.NumberFormat('id-ID').format(context.raw);
                }
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: { color: '#EBF3FB', drawBorder: false },
            ticks: {
                font: { family: 'JetBrains Mono', size: 11 },
                callback: function(value) {
                    if (value >= 1000000) return (value / 1000000) + 'Jt';
                    if (value >= 1000) return (value / 1000) + 'k';
                    return value;
                }
            }
        },
        x: {
            grid: { display: false },
            ticks: { font: { size: 12 } }
        }
    }
};

// ================= KONFIGURASI PIE CHART (METODE PEMBAYARAN) =================
const paymentChartData = ref({
    labels: ['QRIS', 'Tunai', 'Transfer'],
    datasets: [
        {
            // Menyesuaikan warna: Navy (QRIS), Blue (Tunai), Sky (Transfer)
            backgroundColor: ['#1B4F8A', '#2E7DD6', '#6BAEE8'],
            borderWidth: 2,
            borderColor: '#FFFFFF',
            hoverOffset: 4,
            data: [65, 25, 10] // Persentase Dummy
        }
    ]
});

const paymentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                padding: 20,
                font: { size: 12 }
            }
        },
        tooltip: {
            backgroundColor: '#1A2332',
            titleFont: { family: 'Poppins', size: 13 },
            bodyFont: { family: 'Poppins', size: 13 },
            callbacks: {
                label: function(context) {
                    return ` ${context.label}: ${context.raw}%`;
                }
            }
        }
    }
};

// ================= DATA TOP MENU (DUMMY) =================
const topMenus = ref([
    { name: 'Nasi Goreng Spesial', qty: 145, revenue: 3625000 },
    { name: 'Kopi Susu Gula Aren', qty: 120, revenue: 2160000 },
    { name: 'Ayam Geprek Sambal Matah', qty: 98, revenue: 2450000 },
    { name: 'Kentang Goreng', qty: 85, revenue: 1275000 },
    { name: 'Es Teh Manis', qty: 76, revenue: 380000 }
]);

const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID').format(angka || 0);
};

onMounted(() => {
    // Simulasi loading API
    setTimeout(() => {
        isLoading.value = false;
    }, 600);
});
</script>