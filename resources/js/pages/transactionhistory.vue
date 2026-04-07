<template>
    <AdminLayout>
        <div class="space-y-6 font-['Poppins'] pb-10">
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 class="text-[24px] font-semibold text-[#1A2332]">Riwayat Transaksi</h1>
                    <p class="text-[14px] text-[#5A7A9A] mt-1">Pantau, edit, dan cetak struk riwayat pesanan.</p>
                </div>
            </div>

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
                                placeholder="Cari No. Invoice..."
                                class="w-full pl-9 pr-3 py-1.5 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC]"
                            >
                        </div>

                        <select v-model="filterStatus" class="border border-[#D4E4F4] bg-white text-[#1A2332] text-[13px] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2E7DD6]">
                            <option value="all">Semua Status</option>
                            <option value="paid">Selesai (Paid)</option>
                            <option value="pending">Menunggu (Pending)</option>
                            <option value="cancelled">Dibatalkan</option>
                        </select>
                    </div>

                    <div class="flex items-center gap-2">
                        <span class="text-[13px] text-[#5A7A9A] font-medium hidden sm:block">Tampilkan</span>
                        <select v-model="itemsPerPage" @change="currentPage = 1" class="border border-[#D4E4F4] bg-white text-[#1A2332] text-[13px] rounded-md px-2 py-1.5 focus:outline-none focus:border-[#2E7DD6]">
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
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Waktu Pesanan</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Meja / Tipe</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Total Harga</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Status</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="paginatedData.length === 0" class="border-b border-[#EBF3FB]">
                                <td colspan="6" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Tidak ada data transaksi.</td>
                            </tr>
                            <tr v-else v-for="tx in paginatedData" :key="tx.id" class="border-b border-[#EBF3FB] hover:bg-[#F7FAFD] transition-colors">
                                <td class="px-5 py-3 text-[13px] text-[#1B4F8A] font-bold font-['JetBrains_Mono']">
                                    {{ tx.invoice }}
                                    <span v-if="tx.logs && tx.logs.length > 0" class="ml-1 text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded" title="Pernah Diedit">Edited</span>
                                </td>
                                <td class="px-5 py-3 text-[13px] text-[#5A7A9A] whitespace-nowrap">{{ tx.date }}</td>
                                <td class="px-5 py-3 text-[13px] font-medium text-[#1A2332]">
                                    <span v-if="tx.table" class="px-2 py-0.5 bg-[#EBF3FB] text-[#1B4F8A] rounded text-[11px] font-bold">Meja {{ tx.table }}</span>
                                    <span v-else class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px] font-bold">Takeaway</span>
                                    <p class="text-[11px] text-[#8AAFCC] mt-0.5">Kasir: {{ tx.cashier }}</p>
                                </td>
                                <td class="px-5 py-3 text-[13px] font-semibold text-[#1A2332] font-['JetBrains_Mono']">Rp {{ formatRupiah(calculateTotal(tx)) }}</td>
                                <td class="px-5 py-3 text-[13px]">
                                    <span :class="[
                                        'px-2.5 py-1 text-[11px] font-bold rounded-full border',
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
                        Menampilkan <span class="font-semibold text-[#1A2332] font-['JetBrains_Mono']">{{ startIndex + 1 }}</span> - <span class="font-semibold text-[#1A2332] font-['JetBrains_Mono']">{{ endIndex }}</span> dari <span class="font-semibold text-[#1A2332] font-['JetBrains_Mono']">{{ filteredData.length }}</span> transaksi
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
                        <p class="text-[12px] text-[#5A7A9A] mt-0.5">{{ selectedTx.date }}</p>
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
                            <button v-if="!isEditMode && selectedTx.status !== 'cancelled'" @click="enableEditMode" class="text-[#B83B2A] hover:text-red-800 text-[12px] font-semibold flex items-center gap-1">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                Void / Cancel Item
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
                                <p class="text-[12px] text-[#B83B2A] font-medium">Kurangi kuantitas item untuk membatalkannya (Void). Item yang dibatalkan tidak akan masuk ke total tagihan.</p>
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
                                <textarea v-model="cancelReason" rows="2" placeholder="Contoh: Makanan habis, salah input pesanan..." class="w-full px-3 py-2 text-[13px] border border-[#D4E4F4] rounded-lg focus:outline-none focus:border-[#2E7DD6] resize-none"></textarea>
                            </div>
                            
                            <div class="flex justify-end gap-2 pt-2">
                                <button @click="cancelEdit" class="px-4 py-2 text-[12px] font-medium text-[#5A7A9A] bg-[#F0F4F8] hover:bg-[#D4E4F4] rounded-lg transition-colors">Batal Edit</button>
                                <button @click="saveEdit" :disabled="!cancelReason.trim()" class="px-4 py-2 bg-[#B83B2A] hover:bg-red-800 disabled:opacity-50 text-white text-[12px] font-semibold rounded-lg transition-colors">Simpan Perubahan</button>
                            </div>
                        </div>
                    </div>

                    <div v-if="!isEditMode && selectedTx.logs && selectedTx.logs.length > 0" class="mt-4 bg-[#F7FAFD] border border-[#D4E4F4] rounded-lg p-3">
                        <p class="text-[12px] font-semibold text-[#1A2332] mb-2 flex items-center gap-1.5">
                            <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Log Perubahan
                        </p>
                        <div class="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#D4E4F4] before:to-transparent">
                            <div v-for="(log, idx) in selectedTx.logs" :key="idx" class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div class="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-[#8AAFCC] text-[#8AAFCC] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                                <div class="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-2 rounded border border-[#D4E4F4] shadow-sm">
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
import { ref, computed } from 'vue';
import AdminLayout from '../components/adminlayout.vue';

// --- DATA DUMMY (Berubah dari Customer ke Cashier) ---
const transactions = ref([
    { 
        id: 1, invoice: 'INV-260401-001', cashier: 'Budi (Shift Pagi)', table: 4, status: 'paid', date: '01 Apr 2026 14:30', 
        items: [
            { name: 'Nasi Goreng Spesial', qty: 2, cancelled_qty: 0, price: 35000 }, 
            { name: 'Es Teh Manis', qty: 2, cancelled_qty: 0, price: 7500 }
        ],
        logs: []
    },
    { 
        id: 2, invoice: 'INV-260401-002', cashier: 'Siti (Shift Pagi)', table: null, status: 'pending', date: '01 Apr 2026 15:10', 
        items: [
            { name: 'Ayam Geprek', qty: 1, cancelled_qty: 0, price: 25000 }, 
            { name: 'Es Jeruk', qty: 1, cancelled_qty: 0, price: 20000 }
        ],
        logs: []
    },
    { 
        id: 3, invoice: 'INV-260401-003', cashier: 'Budi (Shift Pagi)', table: 2, status: 'paid', date: '01 Apr 2026 16:45', 
        items: [
            { name: 'Steak Ayam', qty: 2, cancelled_qty: 0, price: 50000 }, 
            { name: 'Kopi Susu', qty: 1, cancelled_qty: 1, price: 20000 }
        ],
        logs: [
            { date: '01 Apr 2026 16:50', action: 'Void 1x Kopi Susu', reason: 'Mesin kopi rusak', by: 'Siti (Shift Pagi)' }
        ]
    }
]);

const searchQuery = ref('');
const filterStatus = ref('all');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const selectedTx = ref(null);

const isEditMode = ref(false);
const cancelReason = ref('');
const editData = ref({ items: [] });

const formatRupiah = (angka) => new Intl.NumberFormat('id-ID').format(angka);
const calculateTotal = (tx) => tx.items.reduce((sum, item) => sum + ((item.qty - item.cancelled_qty) * item.price), 0);

const filteredData = computed(() => transactions.value.filter(tx => 
    (filterStatus.value === 'all' || tx.status === filterStatus.value) && 
    tx.invoice.toLowerCase().includes(searchQuery.value.toLowerCase())
));
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value) || 1);
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredData.value.length));
const paginatedData = computed(() => filteredData.value.slice(startIndex.value, endIndex.value));
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };

const openDetail = (tx) => { selectedTx.value = tx; isEditMode.value = false; };
const closeDetail = () => { selectedTx.value = null; isEditMode.value = false; };

const enableEditMode = () => {
    isEditMode.value = true;
    cancelReason.value = '';
    editData.value.items = selectedTx.value.items.map(item => ({
        ...item, original_qty: item.qty, qty: item.qty - item.cancelled_qty
    }));
};
const cancelEdit = () => { isEditMode.value = false; };
const increaseQty = (index) => { if (editData.value.items[index].qty < editData.value.items[index].original_qty) editData.value.items[index].qty++; };
const decreaseQty = (index) => { if (editData.value.items[index].qty > 0) editData.value.items[index].qty--; };

const saveEdit = () => {
    let actionDetails = [];
    selectedTx.value.items.forEach((item, index) => {
        const editedItem = editData.value.items[index];
        const newCancelledQty = item.qty - editedItem.qty;
        if (newCancelledQty !== item.cancelled_qty) {
            const diff = newCancelledQty - item.cancelled_qty;
            if (diff > 0) actionDetails.push(`Void ${diff}x ${item.name}`);
            else actionDetails.push(`Restore ${Math.abs(diff)}x ${item.name}`);
            item.cancelled_qty = newCancelledQty;
        }
    });

    if (actionDetails.length > 0) {
        const now = new Date();
        const formattedDate = `${now.getDate().toString().padStart(2, '0')} Apr ${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        if (!selectedTx.value.logs) selectedTx.value.logs = [];
        selectedTx.value.logs.unshift({
            date: formattedDate,
            action: actionDetails.join(', '),
            reason: cancelReason.value,
            by: 'Admin / Kasir' 
        });
    }
    isEditMode.value = false;
};

const printReceipt = () => {
    if (!selectedTx.value) return;
    const tx = selectedTx.value;
    const total = calculateTotal(tx);
    
    let itemsHtml = '';
    tx.items.forEach(item => {
        const validQty = item.qty - item.cancelled_qty;
        if (validQty > 0) {
            itemsHtml += `
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px;">
                    <div>
                        <div>${item.name}</div>
                        <div style="color: #555;">${validQty} x ${formatRupiah(item.price)}</div>
                    </div>
                    <div>${formatRupiah(validQty * item.price)}</div>
                </div>
            `;
        }
    });

    const receiptContent = `
        <html>
        <head>
            <title>Struk Pembayaran - ${tx.invoice}</title>
            <style>
                body { font-family: 'Courier New', Courier, monospace; margin: 0; padding: 20px; width: 300px; color: #000; }
                .center { text-align: center; }
                .line { border-top: 1px dashed #000; margin: 10px 0; }
                .bold { font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="center">
                <h2 style="margin-bottom: 5px;">POS F&B OUTLET</h2>
                <p style="font-size: 12px; margin-top: 0;">Jl. Contoh Alamat No. 123</p>
            </div>
            <div class="line"></div>
            <div style="font-size: 12px;">
                <p>No: ${tx.invoice}</p>
                <p>Tgl: ${tx.date}</p>
                <p>Kasir: ${tx.cashier}</p>
                <p>Tipe: ${tx.table ? `Meja ${tx.table}` : 'Takeaway'}</p>
            </div>
            <div class="line"></div>
            ${itemsHtml}
            <div class="line"></div>
            <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold;">
                <span>TOTAL</span>
                <span>Rp ${formatRupiah(total)}</span>
            </div>
            <div class="line"></div>
            <div class="center" style="font-size: 12px; margin-top: 20px;">
                <p>Terima Kasih!</p>
                <p>Silakan berkunjung kembali.</p>
            </div>
            <script>
                window.onload = function() { window.print(); window.close(); }
            <\/script>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank', 'width=400,height=600');
    printWindow.document.open();
    printWindow.document.write(receiptContent);
    printWindow.document.close();
};
</script>