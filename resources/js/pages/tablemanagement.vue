<template>
    <AdminLayout>
        <div class="space-y-6 font-['Poppins'] pb-10">
            
            <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-[#D4E4F4] pb-4">
                <div class="flex flex-wrap items-center gap-3">
                    <div class="relative w-full sm:w-64">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input type="text" v-model="searchQuery" @input="debounceSearch" placeholder="Cari nama atau kode meja..." class="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC]">
                    </div>

                    <select v-if="userRole === 'developer' || outlets.length > 1" v-model="selectedOutlet" @change="fetchTables" class="border border-[#D4E4F4] bg-white text-[#1A2332] text-[13px] rounded-lg px-3 py-2 focus:outline-none focus:border-[#2E7DD6]">
                        <option value="">Semua Outlet</option>
                        <option v-for="out in outlets" :key="out.id" :value="out.id">{{ out.name }}</option>
                    </select>
                </div>

                <button @click="openModal()" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] text-white text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                    Tambah Meja Baru
                </button>
            </div>

            <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
                <div v-if="alert.show" :class="['p-3 rounded-lg border text-[13px] font-medium flex items-center justify-between gap-2', alert.type === 'error' ? 'bg-red-50 border-[#B83B2A] text-[#B83B2A]' : 'bg-[#EBF3FB] border-[#2E7DD6] text-[#1B4F8A]' ]">
                    <div class="flex items-center gap-2">
                        <svg v-if="alert.type === 'error'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{{ alert.message }}</span>
                    </div>
                    <button @click="alert.show = false"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
            </transition>

            <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-[#D4E4F4] bg-[#F7FAFD]">
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Info Meja</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Status</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-center">QR Code</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#EBF3FB]">
                            <tr v-if="isLoading" class="border-b border-[#EBF3FB]">
                                <td colspan="4" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium animate-pulse">Memuat data meja...</td>
                            </tr>
                            <tr v-else-if="tables.length === 0">
                                <td colspan="4" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Belum ada meja.</td>
                            </tr>
                            <tr v-else v-for="table in tables" :key="table.id" :class="table.is_active ? 'hover:bg-[#F7FAFD]' : 'bg-gray-50 opacity-75'" class="transition-colors">
                                <td class="px-5 py-3">
                                    <p class="text-[14px] font-bold text-[#1A2332] flex items-center gap-2">
                                        {{ table.name }} 
                                        <span v-if="table.code" class="text-[10px] bg-[#EBF3FB] text-[#1B4F8A] px-1.5 py-0.5 rounded font-['JetBrains_Mono']">{{ table.code }}</span>
                                    </p>
                                    <p class="text-[11px] text-[#8AAFCC] mt-0.5">{{ table.outlet?.name }} &bull; Kapasitas: {{ table.capacity }} org</p>
                                </td>
                                <td class="px-5 py-3">
                                    <div class="flex flex-col items-start gap-1">
                                        <span :class="[
                                            'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border',
                                            table.status === 'available' ? 'bg-blue-50 text-[#2E7DD6] border-blue-200' : '',
                                            table.status === 'occupied' ? 'bg-orange-50 text-orange-600 border-orange-200' : '',
                                            table.status === 'dirty' ? 'bg-red-50 text-[#B83B2A] border-red-200' : ''
                                        ]">
                                            {{ table.status === 'available' ? 'Tersedia' : table.status === 'occupied' ? 'Terisi' : 'Kotor' }}
                                        </span>
                                        <span v-if="!table.is_active" class="text-[10px] text-red-500 font-semibold">Nonaktif</span>
                                    </div>
                                </td>
                                <td class="px-5 py-3 text-center">
                                    <div v-if="table.qr_token && table.is_active" class="inline-block p-1 bg-white border border-[#D4E4F4] rounded-lg">
                                        <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://pos.etres.my.id/menu/${table.qr_token}`" 
                                             class="w-14 h-14 object-contain" 
                                             alt="QR Meja" />
                                    </div>
                                    <span v-else class="text-[10px] text-[#8AAFCC]">{{ table.is_active ? 'No Token' : 'Disabled' }}</span>
                                </td>
                                <td class="px-5 py-3 text-right whitespace-nowrap">
                                    <button v-if="table.qr_token && table.is_active" @click="printQr(table)" class="text-[#1B4F8A] hover:bg-[#EBF3FB] p-1.5 rounded-lg mr-1 transition-colors" title="Print QR Meja">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                    </button>
                                    <button @click="openModal(table)" class="text-[#2E7DD6] p-1.5 bg-[#EBF3FB] hover:bg-[#D4E4F4] rounded-lg mr-1 transition-colors" title="Edit">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button @click="confirmDelete(table)" class="text-[#B83B2A] p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Hapus">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="p-4 bg-white flex items-center justify-between border-t border-[#D4E4F4]" v-if="totalPages > 0">
                    <p class="text-[12px] text-[#5A7A9A]">Halaman <span class="font-semibold text-[#1A2332] font-['JetBrains_Mono']">{{ currentPage }}</span> dari <span class="font-semibold text-[#1A2332] font-['JetBrains_Mono']">{{ totalPages }}</span></p>
                    <div class="flex gap-2">
                        <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1.5 border border-[#D4E4F4] text-[13px] rounded-lg text-[#1A2332] disabled:opacity-50 hover:bg-[#F0F4F8] transition-colors">Prev</button>
                        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1.5 border border-[#D4E4F4] text-[13px] rounded-lg text-[#1A2332] disabled:opacity-50 hover:bg-[#F0F4F8] transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-[#D4E4F4] flex flex-col">
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <h3 class="text-[16px] font-semibold text-[#1A2332]">{{ isEditMode ? 'Edit Data Meja' : 'Tambah Meja Baru' }}</h3>
                    <button @click="closeModal" class="text-[#8AAFCC] hover:text-[#B83B2A]"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <form @submit.prevent="submitForm" class="p-6 space-y-4">
                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Outlet <span class="text-[#B83B2A]">*</span></label>
                        <select v-model="form.outlet_id" required class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:border-[#2E7DD6] outline-none bg-white">
                            <option value="" disabled>Pilih Outlet</option>
                            <option v-for="out in outlets" :key="out.id" :value="out.id">{{ out.name }}</option>
                        </select>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Nama Meja <span class="text-[#B83B2A]">*</span></label>
                            <input type="text" v-model="form.name" required placeholder="Cth: Meja 1, VIP A" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:border-[#2E7DD6] outline-none">
                        </div>
                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Kode Meja</label>
                            <input type="text" v-model="form.code" placeholder="Cth: T-01" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:border-[#2E7DD6] outline-none uppercase font-['JetBrains_Mono']">
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Kapasitas (Orang)</label>
                            <input type="number" v-model="form.capacity" min="1" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:border-[#2E7DD6] outline-none">
                        </div>
                        <div v-if="isEditMode">
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Status Fisik</label>
                            <select v-model="form.status" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:border-[#2E7DD6] outline-none bg-white">
                                <option value="available">Tersedia</option>
                                <option value="occupied">Terisi</option>
                                <option value="dirty">Kotor</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 pt-2 pb-2">
                        <input type="checkbox" v-model="form.is_active" id="is_active" class="w-4 h-4 text-[#2E7DD6] rounded border-gray-300 focus:ring-[#2E7DD6]">
                        <label for="is_active" class="text-[13px] font-medium text-[#1A2332]">Meja Aktif (Bisa diorder)</label>
                    </div>

                    <div class="pt-4 flex justify-end gap-2 border-t border-[#D4E4F4]">
                        <button type="button" @click="closeModal" class="px-4 py-2 text-[13px] font-medium text-[#5A7A9A] hover:bg-[#F0F4F8] rounded-lg transition-colors">Batal</button>
                        <button type="submit" :disabled="isSubmitting" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:opacity-50 text-white text-[13px] font-semibold rounded-lg transition-colors">
                            {{ isSubmitting ? 'Menyimpan...' : 'Simpan Data' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="deleteModal.show" class="fixed inset-0 z-[80] flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden border border-[#D4E4F4] text-center p-6">
                <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 border border-red-100">
                    <svg class="w-6 h-6 text-[#B83B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 class="text-[18px] font-bold text-[#1A2332] mb-2">Hapus Meja?</h3>
                <p class="text-[14px] text-[#5A7A9A] mb-6">Yakin ingin menghapus <span class="font-semibold text-[#1A2332]">{{ deleteModal.tableName }}</span>?</p>
                <div class="flex justify-center gap-3">
                    <button @click="deleteModal.show = false" class="px-4 py-2 w-full text-[14px] font-medium text-[#5A7A9A] bg-[#F0F4F8] hover:bg-[#D4E4F4] rounded-lg transition-colors">Batal</button>
                    <button @click="executeDelete" :disabled="deleteModal.isDeleting" class="px-4 py-2 w-full text-[14px] font-semibold text-white bg-[#B83B2A] hover:bg-red-800 disabled:opacity-50 rounded-lg transition-colors">
                        {{ deleteModal.isDeleting ? 'Proses...' : 'Hapus' }}
                    </button>
                </div>
            </div>
        </div>

    </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import AdminLayout from '../components/adminlayout.vue';

const apiBase = 'https://api.etres.my.id/api/v1'; 
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('auth_token')}` });
const userRole = ref(localStorage.getItem('user_role') || 'karyawan');

const tables = ref([]);
const outlets = ref([]);
const isLoading = ref(true);
const isSubmitting = ref(false);
const searchQuery = ref('');
const selectedOutlet = ref('');
let searchTimeout = null;

// Paginasi
const currentPage = ref(1);
const itemsPerPage = ref(15);
const totalPages = ref(1);

const alert = reactive({ show: false, message: '', type: 'success' });
const showAlert = (msg, type = 'success') => { alert.message = msg; alert.type = type; alert.show = true; setTimeout(() => alert.show = false, 3000); };

const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedId = ref(null);

// Form Sesuai Model Terbaru
const form = reactive({ 
    name: '', 
    code: '', 
    capacity: 2, 
    outlet_id: '', 
    status: 'available', 
    is_active: true 
});

const deleteModal = reactive({ show: false, id: null, tableName: '', isDeleting: false });

const fetchOutlets = async () => {
    try {
        const res = await axios.get(`${apiBase}/outlets?limit=100`, { headers: authHeaders() });
        outlets.value = res.data.data?.data || res.data.data || [];
        if (outlets.value.length === 1) selectedOutlet.value = outlets.value[0].id;
    } catch (e) { console.error(e); }
};

const fetchTables = async () => {
    isLoading.value = true;
    try {
        const params = { page: currentPage.value, limit: itemsPerPage.value, search: searchQuery.value, outlet_id: selectedOutlet.value };
        const res = await axios.get(`${apiBase}/tables`, { headers: authHeaders(), params });
        
        tables.value = res.data.data?.data || res.data.data || [];
        totalPages.value = res.data.data?.last_page || res.data.last_page || 1;
    } catch (e) { showAlert("Gagal memuat data", "error"); }
    finally { isLoading.value = false; }
};

const debounceSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => { currentPage.value = 1; fetchTables(); }, 500);
};
const prevPage = () => { if (currentPage.value > 1) { currentPage.value--; fetchTables(); } };
const nextPage = () => { if (currentPage.value < totalPages.value) { currentPage.value++; fetchTables(); } };

const openModal = (table = null) => {
    isEditMode.value = !!table;
    if (table) {
        selectedId.value = table.id;
        form.name = table.name;
        form.code = table.code || '';
        form.capacity = table.capacity || 2;
        form.outlet_id = table.outlet_id || '';
        form.status = table.status || 'available';
        form.is_active = !!table.is_active;
    } else {
        selectedId.value = null;
        Object.assign(form, { name: '', code: '', capacity: 2, outlet_id: outlets.value.length === 1 ? outlets.value[0].id : '', status: 'available', is_active: true });
    }
    isModalOpen.value = true;
};

const closeModal = () => { isModalOpen.value = false; };

const submitForm = async () => {
    isSubmitting.value = true;
    try {
        const url = isEditMode.value ? `${apiBase}/tables/${selectedId.value}` : `${apiBase}/tables`;
        const method = isEditMode.value ? 'put' : 'post';
        
        // Backend tidak butuh qr_token, model yang akan urus
        await axios[method](url, form, { headers: authHeaders() });
        
        showAlert(`Meja berhasil ${isEditMode.value ? 'diperbarui' : 'disimpan'}!`, 'success');
        closeModal();
        fetchTables();
    } catch (e) { showAlert(e.response?.data?.message || "Gagal menyimpan meja", "error"); }
    finally { isSubmitting.value = false; }
};

const confirmDelete = (t) => { deleteModal.id = t.id; deleteModal.tableName = t.name; deleteModal.show = true; };
const executeDelete = async () => {
    deleteModal.isDeleting = true;
    try {
        await axios.delete(`${apiBase}/tables/${deleteModal.id}`, { headers: authHeaders() });
        showAlert("Meja dihapus!", "success");
        deleteModal.show = false;
        fetchTables();
    } catch (e) { showAlert("Gagal menghapus meja", "error"); }
    finally { deleteModal.isDeleting = false; }
};

// FITUR PRINT QR
const printQr = (table) => {
    const frontEndUrl = `https://pos.etres.my.id/menu/${table.qr_token}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(frontEndUrl)}`;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html><head><title>Print QR ${table.name}</title>
        <style>
            body { font-family: 'Arial', sans-serif; text-align: center; padding: 50px; background-color: #f4f4f4; }
            .card { background: white; border: 2px dashed #8AAFCC; border-radius: 20px; padding: 40px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { margin: 0; color: #1B4F8A; font-size: 45px; text-transform: uppercase; }
            h2 { margin: 5px 0 20px 0; color: #5A7A9A; font-size: 20px; font-weight: normal; }
            img { width: 300px; height: 300px; margin-bottom: 20px; }
            .footer { color: #8AAFCC; font-size: 14px; margin-top: 10px; border-top: 1px solid #eee; padding-top: 10px;}
        </style></head><body>
        <div class="card">
            <h1>${table.name}</h1>
            <h2>Scan QR untuk Memesan</h2>
            <img src="${qrUrl}" />
            <div class="footer">${table.outlet?.name || 'POS Restaurant'}</div>
        </div>
        <script>window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 500); }<\/script>
        </body></html>
    `);
    printWindow.document.close();
};

onMounted(async () => {
    await fetchOutlets();
    fetchTables();
});
</script>