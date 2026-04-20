<template>
    <AdminLayout>
        <transition name="fade">
            <div v-if="alert.show" :class="[
                'fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 max-w-sm transition-all duration-300',
                alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
            ]">
                <svg v-if="alert.type === 'success'" class="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                <svg v-else class="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p class="text-[13px] font-medium font-['Poppins']">{{ alert.message }}</p>
            </div>
        </transition>

        <div class="space-y-6 font-['Poppins'] pb-10">
            
            <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
                <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div class="flex items-center gap-2 bg-[#F7FAFD] border border-[#D4E4F4] rounded-lg px-3 py-1.5">
                        <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <input type="date" v-model="filters.start_date" @change="fetchAnalytics" class="bg-transparent text-[13px] font-medium text-[#1A2332] outline-none">
                        <span class="text-[12px] text-[#8AAFCC] font-bold">-</span>
                        <input type="date" v-model="filters.end_date" @change="fetchAnalytics" class="bg-transparent text-[13px] font-medium text-[#1A2332] outline-none">
                    </div>

                    <select v-if="userRole !== 'karyawan'" v-model="filters.outlet_id" @change="fetchAnalytics" class="border border-[#D4E4F4] bg-white text-[#1A2332] text-[13px] rounded-lg px-3 py-2 focus:outline-none focus:border-[#2E7DD6] font-medium min-w-[150px]">
                        <option value="">Semua Cabang</option>
                        <option v-for="out in outlets" :key="out.id" :value="out.id">{{ out.name }}</option>
                    </select>
                </div>

                <div class="relative">
                    <button @click="showExportMenu = !showExportMenu" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] text-white text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Ekspor Laporan
                        <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    
                    <transition name="fade">
                        <div v-if="showExportMenu" class="absolute right-0 mt-2 w-40 bg-white border border-[#D4E4F4] rounded-xl shadow-lg py-2 z-50">
                            <button @click="exportData('pdf')" class="w-full text-left px-4 py-2 text-[13px] text-[#1A2332] hover:bg-[#F0F4F8] hover:text-[#1B4F8A] transition-colors flex items-center gap-2">
                                <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                Format PDF
                            </button>
                            <button @click="exportData('excel')" class="w-full text-left px-4 py-2 text-[13px] text-[#1A2332] hover:bg-[#F0F4F8] hover:text-[#1B4F8A] transition-colors flex items-center gap-2">
                                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Format Excel
                            </button>
                            <button @click="exportData('csv')" class="w-full text-left px-4 py-2 text-[13px] text-[#1A2332] hover:bg-[#F0F4F8] hover:text-[#1B4F8A] transition-colors flex items-center gap-2">
                                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                                Format CSV
                            </button>
                        </div>
                    </transition>
                </div>
            </div>

            <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
                <div class="w-8 h-8 border-4 border-[#D4E4F4] border-t-[#2E7DD6] rounded-full animate-spin mb-4"></div>
                <p class="text-[13px] font-medium text-[#8AAFCC] animate-pulse">Menarik data analitik dari server...</p>
            </div>

            <div v-else class="space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm relative overflow-hidden group">
                        <div class="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1 relative z-10">Total Pendapatan</p>
                        <h3 class="text-[22px] font-black text-[#1B4F8A] font-['JetBrains_Mono'] relative z-10">Rp {{ formatRupiah(analyticsData.summary.revenue) }}</h3>
                    </div>
                    <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm relative overflow-hidden group">
                        <div class="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1 relative z-10">Jumlah Transaksi</p>
                        <h3 class="text-[22px] font-black text-[#2A7A4B] font-['JetBrains_Mono'] relative z-10">{{ formatRupiah(analyticsData.summary.transactions) }}</h3>
                    </div>
                    <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm relative overflow-hidden group">
                        <div class="absolute right-0 top-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1 relative z-10">Rata-rata Transaksi</p>
                        <h3 class="text-[22px] font-black text-[#B83B2A] font-['JetBrains_Mono'] relative z-10">Rp {{ formatRupiah(analyticsData.summary.avg_order) }}</h3>
                    </div>
                    <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm relative overflow-hidden group">
                        <div class="absolute right-0 top-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1 relative z-10">Total Item Terjual</p>
                        <h3 class="text-[22px] font-black text-purple-700 font-['JetBrains_Mono'] relative z-10">{{ formatRupiah(analyticsData.summary.items_sold) }}</h3>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <div class="bg-white rounded-xl border border-[#D4E4F4] shadow-sm col-span-1 lg:col-span-2 flex flex-col">
                        <div class="p-5 border-b border-[#D4E4F4] bg-[#F7FAFD] rounded-t-xl">
                            <h3 class="text-[14px] font-bold text-[#1A2332]">Tren Pendapatan</h3>
                        </div>
                        <div class="p-6 flex-1 flex flex-col">
                            <div v-if="analyticsData.revenue_chart.length === 0" class="flex-1 flex items-center justify-center text-[13px] text-[#8AAFCC]">Tidak ada data di periode ini.</div>
                            
                            <div v-else class="relative flex-1 flex items-end gap-2 sm:gap-4 h-64 pt-6">
                                <div class="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                                    <div class="border-b border-dashed border-[#D4E4F4] w-full h-0"></div>
                                    <div class="border-b border-dashed border-[#D4E4F4] w-full h-0"></div>
                                    <div class="border-b border-dashed border-[#D4E4F4] w-full h-0"></div>
                                    <div class="border-b border-[#D4E4F4] w-full h-0"></div>
                                </div>
                                
                                <div v-for="(day, idx) in analyticsData.revenue_chart" :key="idx" class="relative flex-1 flex flex-col items-center justify-end h-full group z-10">
                                    <div class="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1A2332] text-white text-[10px] py-1 px-2 rounded whitespace-nowrap pointer-events-none font-['JetBrains_Mono']">
                                        Rp {{ formatRupiah(day.revenue) }}
                                    </div>
                                    <div class="w-full max-w-[40px] bg-gradient-to-t from-[#2E7DD6] to-[#60A5FA] rounded-t-sm transition-all duration-500 ease-out" 
                                         :style="`height: ${(day.revenue / maxRevenueChart) * 100}%`"></div>
                                    <span class="text-[10px] text-[#5A7A9A] mt-2 font-medium truncate max-w-full">{{ formatShortDate(day.date) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col">
                        <div class="p-5 border-b border-[#D4E4F4] bg-[#F7FAFD] rounded-t-xl">
                            <h3 class="text-[14px] font-bold text-[#1A2332]">Produk Terlaris</h3>
                        </div>
                        <div class="p-5 flex-1 overflow-y-auto max-h-[350px]">
                            <div v-if="analyticsData.top_products.length === 0" class="h-full flex items-center justify-center text-[13px] text-[#8AAFCC]">Tidak ada data penjualan.</div>
                            
                            <div v-else class="space-y-4">
                                <div v-for="(prod, idx) in analyticsData.top_products" :key="idx">
                                    <div class="flex justify-between items-end mb-1">
                                        <p class="text-[12px] font-bold text-[#1A2332] truncate pr-2">{{ prod.name }}</p>
                                        <p class="text-[11px] font-semibold text-[#2A7A4B] font-['JetBrains_Mono'] whitespace-nowrap">{{ prod.sold }} Porsi</p>
                                    </div>
                                    <div class="w-full h-2 bg-[#F0F4F8] rounded-full overflow-hidden">
                                        <div class="h-full bg-[#2A7A4B] rounded-full" :style="`width: ${(prod.sold / maxProductSold) * 100}%`"></div>
                                    </div>
                                    <p class="text-[10px] text-[#8AAFCC] mt-1 text-right font-['JetBrains_Mono']">Rp {{ formatRupiah(prod.revenue) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="userRole !== 'karyawan' && !filters.outlet_id" class="bg-white rounded-xl border border-[#D4E4F4] shadow-sm col-span-1 lg:col-span-2 flex flex-col">
                        <div class="p-5 border-b border-[#D4E4F4] bg-[#F7FAFD] rounded-t-xl">
                            <h3 class="text-[14px] font-bold text-[#1A2332]">Kinerja Tiap Cabang</h3>
                        </div>
                        <div class="p-6">
                            <div v-if="analyticsData.outlet_performance.length === 0" class="py-10 flex items-center justify-center text-[13px] text-[#8AAFCC]">Data cabang tidak tersedia.</div>
                            
                            <div v-else class="space-y-5">
                                <div v-for="(out, idx) in analyticsData.outlet_performance" :key="idx">
                                    <div class="flex justify-between items-center mb-1.5">
                                        <p class="text-[13px] font-bold text-[#1A2332] flex items-center gap-2">
                                            <span class="w-2 h-2 rounded-full bg-[#1B4F8A]"></span>
                                            {{ out.name }}
                                        </p>
                                        <p class="text-[13px] font-bold text-[#1B4F8A] font-['JetBrains_Mono']">Rp {{ formatRupiah(out.revenue) }}</p>
                                    </div>
                                    <div class="w-full h-2.5 bg-[#F0F4F8] rounded-full overflow-hidden">
                                        <div class="h-full bg-gradient-to-r from-[#2E7DD6] to-[#1B4F8A] rounded-full" :style="`width: ${(out.revenue / maxOutletRevenue) * 100}%`"></div>
                                    </div>
                                    <p class="text-[10px] text-[#5A7A9A] mt-1">{{ out.transactions }} Transaksi</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col" :class="{'lg:col-span-3': userRole === 'karyawan' || filters.outlet_id}">
                        <div class="p-5 border-b border-[#D4E4F4] bg-[#F7FAFD] rounded-t-xl">
                            <h3 class="text-[14px] font-bold text-[#1A2332]">Metode Pembayaran</h3>
                        </div>
                        <div class="p-5 flex-1 flex flex-col justify-center">
                            <div v-if="analyticsData.payment_methods.length === 0" class="py-10 flex items-center justify-center text-[13px] text-[#8AAFCC]">Belum ada transaksi.</div>
                            
                            <div v-else class="space-y-4">
                                <div v-for="(pm, idx) in analyticsData.payment_methods" :key="idx" class="flex items-center gap-4 bg-[#F7FAFD] p-3 rounded-lg border border-[#D4E4F4]">
                                    <div class="w-10 h-10 rounded-full bg-white border border-[#D4E4F4] flex items-center justify-center text-[#1B4F8A] shadow-sm shrink-0">
                                        <svg v-if="pm.method.toLowerCase() === 'cash'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        <svg v-else-if="pm.method.toLowerCase() === 'qris'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                    </div>
                                    <div class="flex-1">
                                        <p class="text-[12px] font-bold text-[#5A7A9A] uppercase tracking-wider">{{ pm.method }}</p>
                                        <p class="text-[15px] font-bold text-[#1A2332] font-['JetBrains_Mono']">Rp {{ formatRupiah(pm.total) }}</p>
                                    </div>
                                    <div class="text-right">
                                        <span class="text-[11px] font-bold bg-blue-50 text-[#1B4F8A] px-2 py-1 rounded">
                                            {{ Math.round((pm.total / analyticsData.summary.revenue) * 100) || 0 }}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';
import AdminLayout from '../components/adminlayout.vue';

const apiBase = 'https://api.etres.my.id/api/v1'; 
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('auth_token')}` });
const userRole = ref(localStorage.getItem('user_role') || 'karyawan');

// Notification State
const alert = reactive({ show: false, message: '', type: 'success' });
const showAlert = (msg, type = 'success') => { alert.message = msg; alert.type = type; alert.show = true; setTimeout(() => alert.show = false, 4000); };

// State
const isLoading = ref(true);
const outlets = ref([]);
const showExportMenu = ref(false);

// Filter Defaults (Bulan Ini)
const today = new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
const filters = reactive({
    start_date: firstDay.toISOString().split('T')[0],
    end_date: today.toISOString().split('T')[0],
    outlet_id: ''
});

// Data Structure
const analyticsData = reactive({
    summary: { revenue: 0, transactions: 0, avg_order: 0, items_sold: 0 },
    revenue_chart: [], 
    top_products: [], 
    payment_methods: [], 
    outlet_performance: [] 
});

// Computed Data untuk CSS Charts (Proporsional)
const maxRevenueChart = computed(() => {
    if (analyticsData.revenue_chart.length === 0) return 1;
    return Math.max(...analyticsData.revenue_chart.map(d => d.revenue)) || 1;
});
const maxProductSold = computed(() => {
    if (analyticsData.top_products.length === 0) return 1;
    return Math.max(...analyticsData.top_products.map(p => p.sold)) || 1;
});
const maxOutletRevenue = computed(() => {
    if (analyticsData.outlet_performance.length === 0) return 1;
    return Math.max(...analyticsData.outlet_performance.map(out => out.revenue)) || 1;
});

// Utility
const formatRupiah = (angka) => new Intl.NumberFormat('id-ID').format(angka || 0);
const formatShortDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

// API Fetching
const fetchOutlets = async () => {
    if (userRole.value === 'karyawan') return; // Karyawan tidak butuh dropdown
    try {
        const res = await axios.get(`${apiBase}/outlets?limit=100`, { headers: authHeaders() });
        outlets.value = res.data.data?.data || res.data.data || [];
    } catch (e) { console.error("Gagal load outlet"); }
};

const fetchAnalytics = async () => {
    isLoading.value = true;
    try {
        const params = {
            start_date: filters.start_date,
            end_date: filters.end_date,
            outlet_id: filters.outlet_id
        };

        // KONEKSI API MENGGUNAKAN /reports
        const res = await axios.get(`${apiBase}/reports`, { headers: authHeaders(), params });
        const data = res.data;

        analyticsData.summary = data.summary || { revenue: 0, transactions: 0, avg_order: 0, items_sold: 0 };
        analyticsData.revenue_chart = data.revenue_chart || [];
        analyticsData.top_products = data.top_products || [];
        analyticsData.payment_methods = data.payment_methods || [];
        analyticsData.outlet_performance = data.outlet_performance || [];

    } catch (error) {
        console.error(error);
        showAlert("Gagal mengambil data laporan.", "error");
        
        // --- FALLBACK KOSONG ---
        analyticsData.summary = { revenue: 0, transactions: 0, avg_order: 0, items_sold: 0 };
        analyticsData.revenue_chart = [];
        analyticsData.top_products = [];
        analyticsData.payment_methods = [];
        analyticsData.outlet_performance = [];
    } finally {
        isLoading.value = false;
    }
};

// Export Function
const exportData = async (format) => {
    showExportMenu.value = false;
    try {
        const params = new URLSearchParams({
            start_date: filters.start_date,
            end_date: filters.end_date,
            outlet_id: filters.outlet_id,
            format: format
        }).toString();
        
        window.open(`${apiBase}/reports/export?${params}&token=${localStorage.getItem('auth_token')}`, '_blank');
        
        showAlert(`Mengekspor laporan ke format ${format.toUpperCase()}...`, "success");
    } catch (e) {
        showAlert(`Gagal mengekspor laporan.`, "error");
    }
};

onMounted(async () => {
    await fetchOutlets();
    fetchAnalytics();
});
</script>

<style scoped>
/* Transisi Fade untuk Dropdown & Toast */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>