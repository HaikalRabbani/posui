<template>
    <AdminLayout>
        <div class="space-y-6 font-['Poppins'] pb-10">
            
            <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div class="p-4 border-b border-[#D4E4F4] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#F7FAFD]">
                    <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div class="relative w-full sm:w-64">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input
                                type="text"
                                v-model="searchQuery"
                                @input="debounceSearch"
                                placeholder="Cari No. Invoice..."
                                class="w-full pl-9 pr-3 py-1.5 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC]"
                            >
                        </div>

                        <select v-model="filterStatus" @change="fetchTransactions" class="border border-[#D4E4F4] bg-white text-[#1A2332] text-[13px] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2E7DD6]">
                            <option value="all">Semua Status</option>
                            <option value="paid">Selesai (Paid)</option>
                            <option value="pending">Menunggu (Pending)</option>
                            <option value="cancelled">Dibatalkan</option>
                        </select>
                    </div>

                    <div class="flex items-center gap-2">
                        <span class="text-[13px] text-[#5A7A9A] font-medium hidden sm:block">Tampilkan</span>
                        <select v-model="itemsPerPage" @change="fetchTransactions" class="border border-[#D4E4F4] bg-white text-[#1A2332] text-[13px] rounded-md px-2 py-1.5 focus:outline-none focus:border-[#2E7DD6]">
                            <option :value="10">10</option>
                            <option :value="25">25</option>
                            <option :value="50">50</option>
                        </select>
                        <span class="text-[13px] text-[#5A7A9A] font-medium hidden sm:block">data</span>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-[#D4E4F4] bg-[#F7FAFD]">
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">No. Invoice</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Outlet</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Waktu Pesanan</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Meja / Tipe</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Total Harga</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Status</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="isLoading" class="border-b border-[#EBF3FB]">
                                <td colspan="7" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium animate-pulse">Menarik data transaksi...</td>
                            </tr>
                            <tr v-else-if="transactions.length === 0" class="border-b border-[#EBF3FB]">
                                <td colspan="7" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Tidak ada data transaksi.</td>
                            </tr>
                            <tr v-else v-for="tx in transactions" :key="tx.id" class="border-b border-[#EBF3FB] hover:bg-[#F7FAFD] transition-colors">
                                <td class="px-5 py-3 text-[13px] text-[#1B4F8A] font-bold font-['JetBrains_Mono']">
                                    {{ tx.invoice }}
                                    <span v-if="tx.logs && tx.logs.length > 0" class="ml-1 text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded" title="Pernah Diedit">Edited</span>
                                </td>
                                <td class="px-5 py-3 text-[13px] font-semibold text-[#1A2332] whitespace-nowrap">{{ tx.outlet }}</td>
                                <td class="px-5 py-3 text-[13px] text-[#5A7A9A] whitespace-nowrap">{{ tx.date }}</td>
                                <td class="px-5 py-3 text-[13px] font-medium text-[#1A2332]">
                                    <span v-if="tx.table" class="px-2 py-0.5 bg-[#EBF3FB] text-[#1B4F8A] rounded text-[11px] font-bold">Meja {{ tx.table }}</span>
                                    <span v-else class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px] font-bold">Takeaway</span>
                                    <p class="text-[11px] text-[#8AAFCC] mt-0.5">Kasir: {{ tx.cashier }}</p>
                                </td>
                                <td class="px-5 py-3 text-[13px] font-semibold text-[#1A2332] font-['JetBrains_Mono']">Rp {{ formatRupiah(calculateTotal(tx)) }}</td>
                                <td class="px-5 py-3 text-[13px]">
                                    <span :class="[
                                        'px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase tracking-wider',
                                        tx.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : '',
                                        tx.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-200' : '',
                                        tx.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : ''
                                    ]">
                                        {{ tx.status === 'paid' ? 'Selesai' : tx.status === 'pending' ? 'Pending' : 'Dibatalkan' }}
                                    </span>
                                </td>
                                <td class="px-5 py-3 text-right whitespace-nowrap">
                                    <button @click="openDetail(tx)" class="text-[#2E7DD6] hover:text-[#1B4F8A] p-1.5 transition-colors bg-[#EBF3FB] hover:bg-[#D4E4F4] rounded-lg inline-flex items-center gap-1.5 text-[12px] font-semibold">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#D4E4F4]" v-if="totalPages > 0">
                    <p class="text-[12px] text-[#5A7A9A]">
                        Menampilkan Halaman <span class="font-semibold text-[#1A2332] font-['JetBrains_Mono']">{{ currentPage }}</span> dari <span class="font-semibold text-[#1A2332] font-['JetBrains_Mono']">{{ totalPages }}</span>
                        (Total: {{ totalData }} data)
                    </p>
                    <div class="flex gap-2">
                        <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1.5 border border-[#D4E4F4] text-[13px] rounded-lg text-[#1A2332] disabled:opacity-50 hover:bg-[#F0F4F8] transition-colors">Sebelumnya</button>
                        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1.5 border border-[#D4E4F4] text-[13px] rounded-lg text-[#1A2332] disabled:opacity-50 hover:bg-[#F0F4F8] transition-colors">Selanjutnya</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="selectedTx" class="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden border border-[#D4E4F4] max-h-[90vh] flex flex-col font-['Poppins'] relative">
                
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-start bg-[#F7FAFD]">
                    <div>
                        <h3 class="text-[18px] font-bold text-[#1A2332] font-['JetBrains_Mono']">{{ selectedTx.invoice }}</h3>
                        <p class="text-[12px] text-[#5A7A9A] mt-0.5">
                            {{ selectedTx.date }} &bull; <span class="font-semibold text-[#1B4F8A]">{{ selectedTx.outlet }}</span>
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button v-if="!isEditMode" @click="printReceipt" class="text-white bg-[#1B4F8A] hover:bg-blue-900 px-3 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            Cetak
                        </button>
                        <button @click="closeDetail" class="text-[#8AAFCC] hover:text-[#B83B2A] transition-colors focus:outline-none bg-white p-1.5 rounded-md border border-[#D4E4F4]">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                <div class="p-6 overflow-y-auto space-y-4">
                    <div class="flex justify-between items-center p-3 bg-[#EBF3FB] rounded-lg border border-[#D4E4F4]">
                        <div>
                            <p class="text-[11px] font-semibold text-[#5A7A9A] uppercase">Kasir</p>
                            <p class="text-[13px] font-bold text-[#1A2332]">{{ selectedTx.cashier }}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-[11px] font-semibold text-[#5A7A9A] uppercase">Tipe</p>
                            <p class="text-[13px] font-bold text-[#1B4F8A]">{{ selectedTx.table ? `Meja ${selectedTx.table}` : 'Takeaway' }}</p>
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between border-b border-[#D4E4F4] pb-2 mb-3">
                            <p class="text-[13px] font-semibold text-[#1A2332]">Rincian Pesanan</p>
                            
                            <button v-if="!isEditMode && selectedTx.status !== 'cancelled'" @click="enableEditMode" class="text-[#B83B2A] hover:text-red-800 text-[12px] font-semibold flex items-center gap-1 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors border border-red-100">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                Edit / Void Item
                            </button>
                        </div>

                        <ul v-if="!isEditMode" class="space-y-3">
                            <li v-for="(item, i) in selectedTx.items" :key="i" class="flex justify-between items-start">
                                <div>
                                    <p class="text-[13px] font-medium text-[#1A2332]" :class="{'line-through text-[#8AAFCC]': item.qty === item.cancelled_qty}">{{ item.name }}</p>
                                    <div class="flex items-center gap-2">
                                        <p class="text-[11px] text-[#5A7A9A]">{{ item.qty - item.cancelled_qty }}x @ Rp {{ formatRupiah(item.price) }}</p>
                                        <span v-if="item.cancelled_qty > 0" class="text-[10px] text-[#B83B2A] bg-red-50 px-1.5 rounded">{{ item.cancelled_qty }} dibatalkan</span>
                                    </div>
                                </div>
                                <p class="text-[13px] font-semibold text-[#1A2332] font-['JetBrains_Mono']">Rp {{ formatRupiah((item.qty - item.cancelled_qty) * item.price) }}</p>
                            </li>
                        </ul>

                        <div v-else class="space-y-4">
                            <div class="bg-red-50 border border-red-100 p-2.5 rounded-lg mb-4">
                                <p class="text-[12px] text-[#B83B2A] font-medium">Kurangi kuantitas item untuk membatalkannya (Void). Stok akan dikembalikan dan tagihan akan dihitung ulang secara otomatis.</p>
                            </div>
                            
                            <ul class="space-y-3">
                                <li v-for="(item, i) in editData.items" :key="i" class="flex justify-between items-center bg-[#F7FAFD] p-2 rounded-lg border border-[#D4E4F4]">
                                    <div class="flex-1">
                                        <p class="text-[13px] font-medium text-[#1A2332]">{{ item.name }}</p>
                                        <p class="text-[11px] text-[#5A7A9A]">Harga: Rp {{ formatRupiah(item.price) }}</p>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <div class="flex items-center bg-white border border-[#D4E4F4] rounded-lg overflow-hidden">
                                            <button type="button" @click="decreaseQty(i)" :disabled="item.qty <= 0" class="px-2.5 py-1 text-[#1A2332] hover:bg-[#F0F4F8] disabled:opacity-30">-</button>
                                            <span class="px-2 text-[13px] font-semibold font-['JetBrains_Mono'] w-6 text-center">{{ item.qty }}</span>
                                            <button type="button" @click="increaseQty(i)" :disabled="item.qty >= item.original_qty" class="px-2.5 py-1 text-[#1A2332] hover:bg-[#F0F4F8] disabled:opacity-30">+</button>
                                        </div>
                                    </div>
                                </li>
                            </ul>

                            <div class="mt-4">
                                <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Alasan Pembatalan / Perubahan <span class="text-red-500">*</span></label>
                                <textarea v-model="cancelReason" rows="2" placeholder="Contoh: Barang tumpah, pelanggan cancel..." class="w-full px-3 py-2 text-[13px] border border-[#D4E4F4] rounded-lg focus:outline-none focus:border-[#2E7DD6] resize-none"></textarea>
                            </div>
                            
                            <div class="flex justify-end gap-2 pt-2">
                                <button @click="cancelEdit" class="px-4 py-2 text-[12px] font-medium text-[#5A7A9A] bg-[#F0F4F8] hover:bg-[#D4E4F4] rounded-lg transition-colors">Batal Edit</button>
                                <button @click="saveEdit" :disabled="!cancelReason.trim() || isSaving" class="px-4 py-2 bg-[#B83B2A] hover:bg-red-800 disabled:opacity-50 text-white text-[12px] font-semibold rounded-lg transition-colors">
                                    {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-if="!isEditMode && selectedTx.logs && selectedTx.logs.length > 0" class="mt-4 bg-[#F7FAFD] border border-[#D4E4F4] rounded-lg p-3">
                        <p class="text-[12px] font-semibold text-[#1A2332] mb-2 flex items-center gap-1.5">
                            <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Log Perubahan
                        </p>
                        <div class="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#D4E4F4] before:to-transparent">
                            <div v-for="(log, idx) in selectedTx.logs" :key="idx" class="relative flex items-center group is-active">
                                <div class="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-[#8AAFCC] z-10 shrink-0"></div>
                                <div class="ml-3 bg-white p-2 rounded border border-[#D4E4F4] shadow-sm w-full">
                                    <div class="flex items-center justify-between mb-0.5">
                                        <p class="font-bold text-[#1A2332] text-[11px]">{{ log.action }}</p>
                                        <span class="text-[10px] text-[#8AAFCC] font-['JetBrains_Mono']">{{ log.date }}</span>
                                    </div>
                                    <p class="text-[11px] text-[#5A7A9A]">Alasan: {{ log.reason }}</p>
                                    <p class="text-[10px] text-[#8AAFCC] mt-1 text-right">Oleh: {{ log.by }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="!isEditMode" class="border-t border-dashed border-[#8AAFCC] pt-3 flex justify-between items-center">
                        <p class="text-[14px] font-bold text-[#1A2332]">Total Tagihan</p>
                        <p class="text-[18px] font-bold text-[#2A7A4B] font-['JetBrains_Mono']">Rp {{ formatRupiah(calculateTotal(selectedTx)) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import AdminLayout from '../components/adminlayout.vue';

const apiBase = 'https://api.etres.my.id/api/v1';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('auth_token')}` });

// State
const transactions = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');
const filterStatus = ref('all');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalPages = ref(1);
const totalData = ref(0);

const selectedTx = ref(null);
const isEditMode = ref(false);
const isSaving = ref(false);
const cancelReason = ref('');
const editData = ref({ items: [] });
let searchTimeout = null;

// Utilities
const formatRupiah = (angka) => new Intl.NumberFormat('id-ID').format(angka || 0);
const calculateTotal = (tx) => {
    if (!tx || !tx.items) return 0;
    return tx.items.reduce((sum, item) => sum + ((item.qty - (item.cancelled_qty || 0)) * item.price), 0);
};

// API Fetching
const fetchTransactions = async () => {
    isLoading.value = true;
    try {
        const params = {
            page: currentPage.value,
            limit: itemsPerPage.value,
            invoice_number: searchQuery.value, // Disesuaikan dengan penamaan parameter di Controller baru
            status: filterStatus.value === 'all' ? '' : filterStatus.value
        };

        const response = await axios.get(`${apiBase}/history-transactions`, { headers: authHeaders(), params });
        const respData = response.data;
        
        // Laravel mereturn langsung paginasi di root JSON
        const dataArray = respData.data || [];
        totalPages.value = respData.last_page || 1;
        totalData.value = respData.total || dataArray.length;

        // Pemetaan (Mapping) sesuai struktur HistoryTransaction.php
        transactions.value = dataArray.map(history => {
            return {
                id: history.order_id, // Tetap gunakan order_id untuk payload Edit/Void
                history_id: history.id,
                invoice: history.invoice_number || '-',
                cashier: history.cashier?.name || 'Kasir', // Diambil langsung dari History
                table: history.order?.table?.name || null, // Meja tetap di dalam Order
                outlet: history.outlet?.name || 'Cabang Tidak Diketahui', // NAMA OUTLET SEKARANG MUNCUL
                status: history.status,
                date: history.paid_at ? new Date(history.paid_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-',
                total_price: history.total_price,
                payment_method: history.payment_method || 'Tunai',
                items: history.order?.items ? history.order.items.map(item => ({
                    id: item.id,
                    name: item.product?.name || 'Item Terhapus',
                    qty: item.qty,
                    cancelled_qty: item.cancelled_qty || 0,
                    price: item.price
                })) : [],
                logs: history.order?.logs || [] 
            };
        });

    } catch (error) {
        console.error("Gagal mengambil data riwayat", error);
    } finally {
        isLoading.value = false;
    }
};

// Pagination & Search Logic
const debounceSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentPage.value = 1;
        fetchTransactions();
    }, 500);
};

const prevPage = () => { if (currentPage.value > 1) { currentPage.value--; fetchTransactions(); } };
const nextPage = () => { if (currentPage.value < totalPages.value) { currentPage.value++; fetchTransactions(); } };

// Modal Logic
const openDetail = (tx) => { selectedTx.value = tx; isEditMode.value = false; };
const closeDetail = () => { selectedTx.value = null; isEditMode.value = false; };

const enableEditMode = () => {
    isEditMode.value = true; 
    cancelReason.value = '';
    editData.value.items = selectedTx.value.items.map(item => ({
        ...item, original_qty: item.qty, qty: item.qty - (item.cancelled_qty || 0)
    }));
};
const cancelEdit = () => { isEditMode.value = false; };
const increaseQty = (index) => { if (editData.value.items[index].qty < editData.value.items[index].original_qty) editData.value.items[index].qty++; };
const decreaseQty = (index) => { if (editData.value.items[index].qty > 0) editData.value.items[index].qty--; };

// SIMPAN KE BACKEND API
const saveEdit = async () => {
    isSaving.value = true;
    const payload = {
        reason: cancelReason.value,
        items: []
    };

    selectedTx.value.items.forEach((item, index) => {
        const editedItem = editData.value.items[index];
        const newCancelledQty = item.qty - editedItem.qty;
        
        if (newCancelledQty !== (item.cancelled_qty || 0)) {
            payload.items.push({
                id: item.id,
                cancelled_qty: newCancelledQty
            });
        }
    });

    if (payload.items.length === 0) {
        alert("Tidak ada perubahan kuantitas item.");
        isSaving.value = false;
        return;
    }

    try {
        await axios.post(`${apiBase}/orders/${selectedTx.value.id}/void-items`, payload, {
            headers: authHeaders()
        });

        alert("Pesanan berhasil diubah!");
        isEditMode.value = false;
        closeDetail();
        fetchTransactions(); // Reload data dari DB untuk tampilan terbaru

    } catch (error) {
        alert(error.response?.data?.message || "Gagal menyimpan perubahan ke server");
    } finally {
        isSaving.value = false;
    }
};

// Cetak Struk
const printReceipt = () => {
    if (!selectedTx.value) return;
    const tx = selectedTx.value;
    const total = calculateTotal(tx);
    let itemsHtml = '';
    tx.items.forEach(item => {
        const validQty = item.qty - (item.cancelled_qty || 0);
        if (validQty > 0) {
            itemsHtml += `<div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px;">
                <div><div>${item.name}</div><div style="color: #555;">${validQty} x ${formatRupiah(item.price)}</div></div>
                <div>${formatRupiah(validQty * item.price)}</div></div>`;
        }
    });

    const printWindow = window.open('', '_blank', 'width=400,height=600');
    printWindow.document.write(`
        <html><head><title>Struk - ${tx.invoice}</title>
        <style>body { font-family: monospace; width: 300px; padding: 20px; } .line { border-top: 1px dashed #000; margin: 10px 0; }</style>
        </head><body><h2 style="text-align:center; margin:0;">POS F&B</h2><div class="line"></div>
        <p style="font-size:12px;">Outlet: ${tx.outlet}<br>No: ${tx.invoice}<br>Kasir: ${tx.cashier}</p><div class="line"></div>
        ${itemsHtml}<div class="line"></div>
        <div style="display:flex; justify-content:space-between; font-weight:bold;"><span>TOTAL</span><span>Rp ${formatRupiah(total)}</span></div>
        <script>window.onload = () => { window.print(); window.close(); }<\/script></body></html>
    `);
    printWindow.document.close();
};

onMounted(() => fetchTransactions());
</script>