<template>
    <AdminLayout>
        <div class="space-y-6 font-['Poppins'] pb-10">
            
            <div class="flex flex-col sm:flex-row items-end justify-end gap-3">
                <div class="flex items-center gap-2">
                    <button 
                        @click="exportData('csv')" 
                        :disabled="isExporting"
                        class="px-3 py-1.5 bg-[#2A7A4B] hover:bg-green-700 disabled:opacity-50 text-white text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        CSV
                    </button>

                    <button 
                        @click="exportData('pdf')" 
                        :disabled="isExporting"
                        class="px-3 py-1.5 bg-[#B83B2A] hover:bg-red-800 disabled:opacity-50 text-white text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        PDF
                    </button>

                    <div class="flex items-center gap-2 bg-white border border-[#D4E4F4] p-1.5 rounded-lg shadow-sm ml-2">
                        <span class="pl-2 text-[13px] text-[#5A7A9A] font-medium">Periode:</span>
                        <select v-model="selectedPeriod" @change="fetchAnalytics" class="border-none bg-transparent text-[#1A2332] text-[13px] font-semibold focus:outline-none cursor-pointer pr-4">
                            <option value="today">Hari Ini</option>
                            <option value="7days">7 Hari Terakhir</option>
                            <option value="30days">30 Hari Terakhir</option>
                            <option value="this_month">Bulan Ini</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col gap-3">
                    <div class="w-10 h-10 rounded-full bg-[#EBF3FB] flex items-center justify-center text-[#1B4F8A]">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p class="text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1">Total Pendapatan</p>
                        <p class="text-[20px] font-bold text-[#1A2332] font-['JetBrains_Mono'] leading-none">Rp {{ formatRupiah(summary.total_revenue) }}</p>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col gap-3">
                    <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#2A7A4B]">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p class="text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1">Order Selesai</p>
                        <p class="text-[20px] font-bold text-[#1A2332] font-['JetBrains_Mono'] leading-none">{{ summary.completed_orders }}</p>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col gap-3">
                    <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
                    <div>
                        <p class="text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1">Avg. Order Value</p>
                        <p class="text-[20px] font-bold text-[#1A2332] font-['JetBrains_Mono'] leading-none">Rp {{ formatRupiah(summary.avg_order_value) }}</p>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col gap-3">
                    <div class="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p class="text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1">Jam Tersibuk</p>
                        <p class="text-[20px] font-bold text-[#1A2332] font-['JetBrains_Mono'] leading-none">{{ summary.busiest_hour }}</p>
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
                            <tr v-if="isLoading" class="border-b border-[#EBF3FB]">
                                <td colspan="3" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] animate-pulse">Memuat data API...</td>
                            </tr>
                            <tr v-else-if="topMenus.length === 0" class="border-b border-[#EBF3FB]">
                                <td colspan="3" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC]">Belum ada data penjualan.</td>
                            </tr>
                            <tr v-else v-for="(item, index) in topMenus" :key="index" class="border-b border-[#EBF3FB] hover:bg-[#F7FAFD]">
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
import axios from 'axios';
import AdminLayout from '../components/adminlayout.vue';

// Import komponen ChartJS
import {
  Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement
} from 'chart.js';
import { Bar, Pie } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
ChartJS.defaults.font.family = "'Poppins', sans-serif";
ChartJS.defaults.color = '#5A7A9A';

// Pastikan base URL ini sesuai dengan URL backend lokal/live Anda
const apiBase = 'https://api.etres.my.id/api/v1';

const isLoading = ref(true);
const isExporting = ref(false);
const selectedPeriod = ref('7days'); 

// Variabel data dinamis
const summary = ref({
    total_revenue: 0,
    completed_orders: 0,
    avg_order_value: 0,
    busiest_hour: '-'
});
const topMenus = ref([]);

// Variabel Chart
const barChartData = ref({ labels: [], datasets: [] });
const paymentChartData = ref({ labels: [], datasets: [] });

// Opsi Chart (sama dengan sebelumnya)
const barChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#1A2332', titleFont: { family: 'Poppins', size: 13 },
            bodyFont: { family: 'JetBrains Mono', size: 14, weight: 'bold' },
            padding: 12, cornerRadius: 8,
            callbacks: {
                label: function(context) { return 'Rp ' + new Intl.NumberFormat('id-ID').format(context.raw); }
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true, grid: { color: '#EBF3FB', drawBorder: false },
            ticks: {
                font: { family: 'JetBrains Mono', size: 11 },
                callback: function(value) {
                    if (value >= 1000000) return (value / 1000000) + 'Jt';
                    if (value >= 1000) return (value / 1000) + 'k';
                    return value;
                }
            }
        },
        x: { grid: { display: false }, ticks: { font: { size: 12 } } }
    }
};

const paymentChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, font: { size: 12 } } },
        tooltip: {
            backgroundColor: '#1A2332', titleFont: { family: 'Poppins', size: 13 }, bodyFont: { family: 'Poppins', size: 13 },
            callbacks: { label: function(context) { return ` ${context.label}: ${context.raw}%`; } }
        }
    }
};

const authHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return { Authorization: `Bearer ${token}` };
};

const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID').format(angka || 0);
};

// ================= FUNGSI MENGAMBIL DATA DARI API (LIVE) =================
const fetchAnalytics = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get(`${apiBase}/analytics?period=${selectedPeriod.value}`, {
            headers: authHeaders()
        });
        const data = response.data;
        
        // Memasukkan data dari API dengan fallback '|| 0' jika value kosong/undefined
        summary.value = {
            total_revenue: data?.summary?.total_revenue || 0,
            completed_orders: data?.summary?.completed_orders || 0,
            avg_order_value: data?.summary?.avg_order_value || 0,
            busiest_hour: data?.summary?.busiest_hour || '-'
        };
        
        topMenus.value = data?.top_menus || [];

        barChartData.value = {
            labels: data?.chart_bar?.labels || [],
            datasets: [{
                label: 'Pendapatan (Rp)',
                backgroundColor: '#2E7DD6', hoverBackgroundColor: '#1B4F8A', borderRadius: 4,
                data: data?.chart_bar?.values || []
            }]
        };

        paymentChartData.value = {
            labels: data?.chart_pie?.labels || [],
            datasets: [{
                backgroundColor: ['#1B4F8A', '#2E7DD6', '#6BAEE8'],
                borderWidth: 2, borderColor: '#FFFFFF', hoverOffset: 4,
                data: data?.chart_pie?.values || []
            }]
        };

    } catch (error) {
        console.error("Gagal mengambil data analitik atau Endpoint belum ada:", error);
        
        // Jika API error (misal 404 karena belum dibikin di backend), kosongkan state grafik & angka jadi 0.
        summary.value = { total_revenue: 0, completed_orders: 0, avg_order_value: 0, busiest_hour: '-' };
        topMenus.value = [];
        barChartData.value = { labels: [], datasets: [{ data: [] }] };
        paymentChartData.value = { labels: [], datasets: [{ data: [] }] };
        
    } finally {
        isLoading.value = false;
    }
};

// ================= FUNGSI EXPORT =================
const exportData = async (format) => {
    isExporting.value = true;
    try {
        const response = await axios.get(`${apiBase}/analytics/export`, {
            params: { period: selectedPeriod.value, format: format },
            headers: authHeaders(),
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        const dateStr = new Date().toISOString().slice(0,10);
        link.setAttribute('download', `Report_Analitik_${dateStr}.${format}`);
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error(`Gagal melakukan export ${format}:`, error);
        alert(`Gagal mengekspor data ke ${format.toUpperCase()}. Pastikan API export sudah disiapkan di backend.`);
    } finally {
        isExporting.value = false;
    }
};

onMounted(() => {
    fetchAnalytics();
});
</script>