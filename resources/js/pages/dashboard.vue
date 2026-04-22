<template>
    <AdminLayout>
        <transition name="fade">
            <div v-if="alert.show" :class="[
                'fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-sm border flex items-center gap-3 max-w-sm transition-all duration-300',
                alert.type === 'success' ? 'bg-[#F7FAFD] border-[#2A7A4B] text-[#1A5A35]' : 'bg-[#F7FAFD] border-[#B83B2A] text-[#8A2A1A]'
            ]">
                <p class="text-[13px] font-medium font-['Poppins']">{{ alert.message }}</p>
            </div>
        </transition>

        <div class="space-y-6 font-['Poppins'] pb-10">
            
            <div v-if="userRole === 'developer'" class="space-y-6 pt-2">
                
                <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
                    <div class="w-8 h-8 border-4 border-[#D4E4F4] border-t-[#2E7DD6] rounded-full animate-spin mb-4"></div>
                    <p class="text-[13px] font-medium text-[#8AAFCC] animate-pulse">Memuat Metrik Sistem...</p>
                </div>

                <div v-else class="space-y-6">
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col justify-center">
                            <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1">Total Pengguna</p>
                            <h3 class="text-[24px] font-black text-[#1A2332] font-['JetBrains_Mono']">{{ devData.totalUsers }}</h3>
                        </div>
                        
                        <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col justify-center">
                            <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1">Outlet Aktif</p>
                            <h3 class="text-[24px] font-black text-[#1A2332] font-['JetBrains_Mono']">{{ devData.totalOutlets }}</h3>
                        </div>

                        <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col justify-center">
                            <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1">Kategori Menu</p>
                            <h3 class="text-[24px] font-black text-[#1A2332] font-['JetBrains_Mono']">{{ devData.totalCategories }}</h3>
                        </div>

                        <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col justify-center">
                            <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1">Item Produk</p>
                            <h3 class="text-[24px] font-black text-[#1A2332] font-['JetBrains_Mono']">{{ devData.totalProducts }}</h3>
                        </div>

                        <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col justify-center">
                            <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1">Tabel / Meja</p>
                            <h3 class="text-[24px] font-black text-[#1A2332] font-['JetBrains_Mono']">{{ devData.totalTables }}</h3>
                        </div>
                    </div>
                    
                    <div class="bg-[#F7FAFD] border border-[#D4E4F4] rounded-xl p-5 flex justify-between items-center shadow-sm">
                        <div>
                            <p class="text-[14px] font-bold text-[#1A2332] mb-1">Status Server API</p>
                            <p class="text-[12px] text-[#5A7A9A]">Layanan berjalan dengan normal</p>
                        </div>
                        <div class="flex items-center gap-2 bg-[#EBF3FB] border border-[#D4E4F4] px-3 py-1.5 rounded-md">
                            <span class="w-2.5 h-2.5 bg-[#2A7A4B] rounded-full animate-pulse"></span>
                            <span class="text-[12px] font-bold text-[#1B4F8A]">Online</span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="space-y-6 pt-2">
                
                <div class="bg-[#F7FAFD] border border-[#D4E4F4] rounded-xl shadow-sm p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                            <div class="flex bg-white border border-[#D4E4F4] rounded-lg overflow-hidden flex-row">
                                <button @click="setFilter('hari_ini')" :class="['px-3 py-1.5 text-[13px] font-medium transition-colors', activeFilter === 'hari_ini' ? 'bg-[#2E7DD6] text-white' : 'text-[#5A7A9A] hover:bg-[#F7FAFD]']">Hari Ini</button>
                                <button @click="setFilter('7_hari')" :class="['px-3 py-1.5 text-[13px] font-medium border-l border-[#D4E4F4] transition-colors', activeFilter === '7_hari' ? 'bg-[#2E7DD6] text-white border-transparent' : 'text-[#5A7A9A] hover:bg-[#F7FAFD]']">7 Hari</button>
                                <button @click="setFilter('1_bulan')" :class="['px-3 py-1.5 text-[13px] font-medium border-l border-[#D4E4F4] transition-colors', activeFilter === '1_bulan' ? 'bg-[#2E7DD6] text-white border-transparent' : 'text-[#5A7A9A] hover:bg-[#F7FAFD]']">1 Bulan</button>
                                <button @click="setFilter('1_tahun')" :class="['px-3 py-1.5 text-[13px] font-medium border-l border-[#D4E4F4] transition-colors', activeFilter === '1_tahun' ? 'bg-[#2E7DD6] text-white border-transparent' : 'text-[#5A7A9A] hover:bg-[#F7FAFD]']">1 Tahun</button>
                                <button @click="setFilter('lifetime')" :class="['px-3 py-1.5 text-[13px] font-medium border-l border-[#D4E4F4] transition-colors', activeFilter === 'lifetime' ? 'bg-[#2E7DD6] text-white border-transparent' : 'text-[#5A7A9A] hover:bg-[#F7FAFD]']">Lifetime</button>
                            </div>
    
                            <select v-if="userRole !== 'karyawan'" v-model="filters.outlet_id" @change="fetchAnalytics" class="border border-[#D4E4F4] bg-white text-[#1A2332] text-[13px] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2E7DD6] font-medium min-w-[150px]">
                                <option value="">Semua Cabang</option>
                                <option v-for="out in outlets" :key="out.id" :value="out.id">{{ out.name }}</option>
                            </select>
                        </div>
                    </div>

                <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
                    <div class="w-8 h-8 border-4 border-[#D4E4F4] border-t-[#2E7DD6] rounded-full animate-spin mb-4"></div>
                    <p class="text-[13px] font-medium text-[#8AAFCC] animate-pulse">Menarik data analitik...</p>
                </div>
                
                

                <div v-else class="space-y-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm">
                            <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1">Total Pendapatan</p>
                            <h3 class="text-[24px] font-black text-[#1A2332] font-['JetBrains_Mono']">Rp {{ formatRupiah(analyticsData.summary.revenue) }}</h3>
                        </div>
                        <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm">
                            <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1">Jumlah Transaksi</p>
                            <h3 class="text-[24px] font-black text-[#1A2332] font-['JetBrains_Mono']">{{ formatRupiah(analyticsData.summary.transactions) }}</h3>
                        </div>
                        <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm">
                            <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1">Rata-rata Transaksi</p>
                            <h3 class="text-[24px] font-black text-[#1A2332] font-['JetBrains_Mono']">Rp {{ formatRupiah(analyticsData.summary.avg_order) }}</h3>
                        </div>
                        <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm">
                            <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1">Item Terjual</p>
                            <h3 class="text-[24px] font-black text-[#1A2332] font-['JetBrains_Mono']">{{ formatRupiah(analyticsData.summary.items_sold) }}</h3>
                        </div>
                    </div>
                    
                    
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        <div class="bg-white rounded-xl border border-[#D4E4F4] shadow-sm col-span-1 lg:col-span-2 flex flex-col">
                            <div class="p-5 border-b border-[#D4E4F4] bg-[#F7FAFD] rounded-t-xl">
                                <h3 class="text-[14px] font-bold text-[#1A2332]">Tren Penjualan</h3>
                            </div>
                            <div class="p-6 flex-1 flex flex-col h-64">
                                <div v-if="analyticsData.revenue_chart.length === 0" class="flex-1 flex items-center justify-center text-[13px] text-[#8AAFCC]">Tidak ada data di periode ini.</div>
                                
                                <div v-else class="relative flex-1 flex items-end gap-2 h-full pt-8 pb-2">
                                    <div class="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-8">
                                        <div class="border-b border-dashed border-[#D4E4F4] w-full h-0" v-for="i in 3" :key="i"></div>
                                        <div class="border-b border-[#D4E4F4] w-full h-0"></div>
                                    </div>
                                    
                                    <div v-for="(day, idx) in analyticsData.revenue_chart" :key="idx" class="relative flex-1 flex flex-col items-center justify-end h-full group z-10">
                                        <div class="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1A2332] text-white text-[11px] py-1 px-2 rounded whitespace-nowrap pointer-events-none font-['JetBrains_Mono']">
                                            Rp {{ formatRupiah(day.revenue) }}
                                        </div>
                                        <div class="w-full max-w-[36px] bg-[#2E7DD6] rounded-t-sm transition-colors duration-300" 
                                             :style="`height: ${(day.revenue / maxRevenueChart) * 100}%`">
                                        </div>
                                        <span class="text-[10px] text-[#5A7A9A] font-medium mt-3 whitespace-nowrap">{{ formatShortDate(day.date) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col">
                            <div class="p-5 border-b border-[#D4E4F4] bg-[#F7FAFD] rounded-t-xl">
                                <h3 class="text-[14px] font-bold text-[#1A2332]">Produk Terlaris</h3>
                            </div>
                            <div class="p-5 flex-1 overflow-y-auto max-h-[350px]">
                                <div v-if="analyticsData.top_products.length === 0" class="h-full flex items-center justify-center text-[13px] text-[#8AAFCC]">Belum ada penjualan.</div>
                                
                                <div v-else class="space-y-4">
                                    <div v-for="(prod, idx) in analyticsData.top_products.slice(0, 7)" :key="idx">
                                        <div class="flex justify-between items-center mb-1">
                                            <p class="text-[13px] font-medium text-[#1A2332] truncate pr-2">{{ prod.name }}</p>
                                            <p class="text-[12px] font-bold text-[#1B4F8A] font-['JetBrains_Mono']">{{ prod.sold }}</p>
                                        </div>
                                        <div class="w-full h-1.5 bg-[#EBF3FB] rounded-full overflow-hidden">
                                            <div class="h-full bg-[#2E7DD6] rounded-full" :style="`width: ${(prod.sold / maxProductSold) * 100}%`"></div>
                                        </div>
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

const alert = reactive({ show: false, message: '', type: 'success' });
const showAlert = (msg, type = 'success') => { alert.message = msg; alert.type = type; alert.show = true; setTimeout(() => alert.show = false, 4000); };

const isLoading = ref(true);
const outlets = ref([]);
const showExportMenu = ref(false);

const devData = reactive({
    totalUsers: 0,
    totalOutlets: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalTables: 0
});

const formatDateLocal = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const activeFilter = ref('hari_ini');
const today = new Date();

const filters = reactive({
    start_date: formatDateLocal(today),
    end_date: formatDateLocal(today),
    outlet_id: ''
});

const setFilter = (type) => {
    activeFilter.value = type;
    const current = new Date();
    filters.end_date = formatDateLocal(current);
    
    if (type === 'hari_ini') {
        filters.start_date = formatDateLocal(current);
    } else if (type === '7_hari') {
        const d = new Date(current);
        d.setDate(d.getDate() - 7);
        filters.start_date = formatDateLocal(d);
    } else if (type === '1_bulan') {
        const d = new Date(current);
        d.setMonth(d.getMonth() - 1);
        filters.start_date = formatDateLocal(d);
    } else if (type === '1_tahun') {
        const d = new Date(current);
        d.setFullYear(d.getFullYear() - 1);
        filters.start_date = formatDateLocal(d);
    } else if (type === 'lifetime') {
        filters.start_date = '2000-01-01'; 
    }
    
    fetchAnalytics();
};

const analyticsData = reactive({
    summary: { revenue: 0, transactions: 0, avg_order: 0, items_sold: 0 },
    revenue_chart: [], 
    top_products: []
});

const maxRevenueChart = computed(() => {
    if (analyticsData.revenue_chart.length === 0) return 1;
    return Math.max(...analyticsData.revenue_chart.map(d => d.revenue)) || 1;
});
const maxProductSold = computed(() => {
    if (analyticsData.top_products.length === 0) return 1;
    return Math.max(...analyticsData.top_products.map(p => p.sold)) || 1;
});

const formatRupiah = (angka) => new Intl.NumberFormat('id-ID').format(angka || 0);
const formatShortDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

const fetchDevData = async () => {
    isLoading.value = true;
    try {
        const [users, outletsRes, products, categories, tables] = await Promise.all([
            axios.get(`${apiBase}/users`, { headers: authHeaders() }),
            axios.get(`${apiBase}/outlets?limit=100`, { headers: authHeaders() }),
            axios.get(`${apiBase}/products?limit=1000`, { headers: authHeaders() }),
            axios.get(`${apiBase}/categories?limit=1000`, { headers: authHeaders() }),
            axios.get(`${apiBase}/tables?limit=1000`, { headers: authHeaders() })
        ]);
        
        devData.totalUsers = users.data.data?.data?.length ?? users.data.data?.length ?? users.data.length ?? 0;
        devData.totalOutlets = outletsRes.data.data?.data?.length ?? outletsRes.data.data?.length ?? outletsRes.data.length ?? 0;
        devData.totalProducts = products.data.data?.data?.length ?? products.data.data?.length ?? products.data.length ?? 0;
        devData.totalCategories = categories.data.data?.data?.length ?? categories.data.data?.length ?? categories.data.length ?? 0;
        devData.totalTables = tables.data.data?.data?.length ?? tables.data.data?.length ?? tables.data.length ?? 0;

    } catch (error) {
        console.error(error);
        showAlert("Gagal menarik data sistem.", "error");
    } finally {
        isLoading.value = false;
    }
};

const fetchAnalytics = async () => {
    isLoading.value = true;
    try {
        if (userRole.value === 'manager' && outlets.value.length === 0) {
            const res = await axios.get(`${apiBase}/outlets?limit=100`, { headers: authHeaders() });
            outlets.value = res.data.data?.data || res.data.data || [];
        }

        const params = { start_date: filters.start_date, end_date: filters.end_date, outlet_id: filters.outlet_id };
        const res = await axios.get(`${apiBase}/reports`, { headers: authHeaders(), params });
        const data = res.data;

        analyticsData.summary = data.summary || { revenue: 0, transactions: 0, avg_order: 0, items_sold: 0 };
        analyticsData.revenue_chart = data.revenue_chart || [];
        analyticsData.top_products = data.top_products || [];
        
    } catch (error) {
        console.error(error);
        showAlert("Gagal memuat data analitik.", "error");
    } finally {
        isLoading.value = false;
    }
};

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

onMounted(() => {
    if (userRole.value === 'developer') {
        fetchDevData();
    } else {
        fetchAnalytics();
    }
});
</script>

<style scoped>
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