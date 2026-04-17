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
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4E4F4] pb-4">
                <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div class="relative w-full sm:w-64">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input type="text" v-model="searchQuery" @input="debounceSearch" placeholder="Cari nama atau kode promo..." class="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC]">
                    </div>              
                </div>

                <button @click="openModal()" class="w-fit px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] text-white text-[13px] font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                    Tambah Promo
                </button>
            </div>

            <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-[#D4E4F4] bg-[#F7FAFD]">
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Info Promo</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Tipe & Nilai</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Periode Aktif</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-center">Status</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#EBF3FB]">
                            <tr v-if="isLoading" class="border-b border-[#EBF3FB]">
                                <td colspan="5" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium animate-pulse">Memuat data promo...</td>
                            </tr>
                            <tr v-else-if="filteredPromos.length === 0">
                                <td colspan="5" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Belum ada promo yang dibuat.</td>
                            </tr>
                            <tr v-else v-for="promo in paginatedPromos" :key="promo.id" class="hover:bg-[#F7FAFD] transition-colors">
                                <td class="px-5 py-3">
                                    <p class="text-[13px] font-bold text-[#1A2332] flex items-center gap-1.5">
                                        <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                        {{ promo.name }}
                                    </p>
                                    <p v-if="promo.min_purchase > 0" class="text-[11px] text-[#5A7A9A] mt-0.5">Min. Beli: Rp {{ formatRupiah(promo.min_purchase) }}</p>
                                    <p v-else class="text-[11px] text-[#5A7A9A] mt-0.5">Tanpa minimal pembelian</p>
                                </td>
                                <td class="px-5 py-3">
                                    <span v-if="promo.type === 'percentage'" class="text-[13px] font-bold text-[#1B4F8A] font-['JetBrains_Mono']">{{ promo.value }}%</span>
                                    <span v-else class="text-[13px] font-bold text-[#1B4F8A] font-['JetBrains_Mono']">Rp {{ formatRupiah(promo.value) }}</span>
                                    <span class="block text-[10px] text-[#5A7A9A] uppercase mt-0.5">{{ promo.type === 'percentage' ? 'Persentase' : 'Nominal' }}</span>
                                </td>
                                <td class="px-5 py-3">
                                    <p class="text-[12px] text-[#1A2332]">{{ formatDate(promo.start_date) }}</p>
                                    <p class="text-[10px] text-[#8AAFCC] text-center w-4">s/d</p>
                                    <p class="text-[12px] text-[#1A2332]">{{ formatDate(promo.end_date) }}</p>
                                </td>
                                <td class="px-5 py-3 text-center">
                                    <span :class="promo.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                        {{ promo.is_active ? 'Aktif' : 'Nonaktif' }}
                                    </span>
                                </td>
                                <td class="px-5 py-3 text-right whitespace-nowrap">
                                    <button @click="openModal(promo)" class="text-[#2E7DD6] hover:text-[#1B4F8A] p-1.5 transition-colors bg-[#EBF3FB] hover:bg-[#D4E4F4] rounded-lg mr-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                    <button @click="confirmDelete(promo)" class="text-[#B83B2A] hover:text-red-800 p-1.5 transition-colors bg-red-50 hover:bg-red-100 rounded-lg"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="p-4 bg-white flex items-center justify-between border-t border-[#D4E4F4]" v-if="totalPages > 0">
                    <p class="text-[12px] text-[#5A7A9A]">Halaman <span class="font-semibold text-[#1A2332]">{{ currentPage }}</span> dari <span class="font-semibold text-[#1A2332]">{{ totalPages }}</span></p>
                    <div class="flex gap-2">
                        <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1.5 border border-[#D4E4F4] text-[13px] rounded-lg text-[#1A2332] disabled:opacity-50 hover:bg-[#F0F4F8] transition-colors">Prev</button>
                        <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1.5 border border-[#D4E4F4] text-[13px] rounded-lg text-[#1A2332] disabled:opacity-50 hover:bg-[#F0F4F8] transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-[#D4E4F4] flex flex-col">
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <h3 class="text-[16px] font-semibold text-[#1A2332]">{{ isEditMode ? 'Edit Promo' : 'Buat Promo Baru' }}</h3>
                    <button @click="closeModal" class="text-[#8AAFCC] hover:text-[#B83B2A] transition-colors focus:outline-none"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                
                <form @submit.prevent="submitForm" class="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Nama / Kode Promo <span class="text-[#B83B2A]">*</span></label>
                        <input type="text" v-model="form.name" @input="formErrors.name = false" placeholder="Contoh: DISKON MERDEKA" 
                            :class="['w-full px-3 py-2 text-[13px] rounded-lg border focus:outline-none transition-colors text-[#1A2332]', formErrors.name ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2A7A4B]']">
                        <span v-if="formErrors.name" class="text-[#B83B2A] text-[11px] mt-1 block">Nama promo wajib diisi.</span>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Tipe Diskon <span class="text-[#B83B2A]">*</span></label>
                            <select v-model="form.type" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2A7A4B] text-[#1A2332] bg-white">
                                <option value="percentage">Persen (%)</option>
                                <option value="nominal">Nominal (Rp)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Nilai Potongan <span class="text-[#B83B2A]">*</span></label>
                            <input type="text" v-model="form.value" @input="formatInputNumber('value')" :placeholder="form.type === 'percentage' ? 'Maks 100' : 'Cth: 15.000'" 
                                :class="['w-full px-3 py-2 text-[13px] rounded-lg border focus:outline-none transition-colors text-[#1A2332] font-[\'JetBrains_Mono\']', formErrors.value ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2A7A4B]']">
                            <span v-if="formErrors.value" class="text-[#B83B2A] text-[11px] mt-1 block">Nilai potongan wajib diisi.</span>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Minimal Pembelian (Rp) <span class="text-[10px] font-normal text-[#8AAFCC]">(Opsional)</span></label>
                        <input type="text" v-model="form.min_purchase" @input="formatInputNumber('min_purchase')" placeholder="Tanpa minimal beli" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2A7A4B] text-[#1A2332] font-['JetBrains_Mono']">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Berlaku Dari <span class="text-[#B83B2A]">*</span></label>
                            <input type="date" v-model="form.start_date" @input="formErrors.start_date = false" 
                                :class="['w-full px-3 py-2 text-[13px] rounded-lg border focus:outline-none transition-colors text-[#1A2332]', formErrors.start_date ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2A7A4B]']">
                            <span v-if="formErrors.start_date" class="text-[#B83B2A] text-[11px] mt-1 block">Pilih tanggal mulai.</span>
                        </div>
                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Berlaku Sampai <span class="text-[#B83B2A]">*</span></label>
                            <input type="date" v-model="form.end_date" @input="formErrors.end_date = false" 
                                :class="['w-full px-3 py-2 text-[13px] rounded-lg border focus:outline-none transition-colors text-[#1A2332]', formErrors.end_date ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2A7A4B]']">
                            <span v-if="formErrors.end_date" class="text-[#B83B2A] text-[11px] mt-1 block">Pilih tanggal selesai.</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 pt-2">
                        <input type="checkbox" v-model="form.is_active" id="active-promo" class="w-4 h-4 text-[#2A7A4B] rounded border-gray-300 focus:ring-[#2A7A4B]">
                        <label for="active-promo" class="text-[13px] font-medium text-[#1A2332]">Aktifkan promo ini sekarang</label>
                    </div>

                    <div class="pt-4 flex justify-end gap-2 border-t border-[#D4E4F4]">
                        <button type="button" @click="closeModal" class="px-4 py-2 text-[13px] font-medium text-[#5A7A9A] hover:bg-[#F0F4F8] rounded-lg transition-colors">Batal</button>
                        <button type="submit" :disabled="isSubmitting" class="px-4 py-2 bg-[#2A7A4B] hover:bg-green-800 disabled:opacity-50 text-white text-[13px] font-semibold rounded-lg transition-colors">
                            {{ isSubmitting ? 'Menyimpan...' : 'Simpan Promo' }}
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
                <h3 class="text-[18px] font-bold text-[#1A2332] mb-2">Hapus Promo?</h3>
                <p class="text-[14px] text-[#5A7A9A] mb-6">Yakin ingin menghapus promo <span class="font-semibold text-[#1A2332]">"{{ deleteModal.name }}"</span>? Data tidak dapat dikembalikan.</p>
                <div class="flex justify-center gap-3">
                    <button @click="deleteModal.show = false" class="px-4 py-2 w-full text-[14px] font-medium text-[#5A7A9A] bg-[#F0F4F8] hover:bg-[#D4E4F4] rounded-lg">Batal</button>
                    <button @click="executeDelete" :disabled="deleteModal.isDeleting" class="px-4 py-2 w-full text-[14px] font-semibold text-white bg-[#B83B2A] hover:bg-red-800 disabled:opacity-50 rounded-lg">
                        {{ deleteModal.isDeleting ? 'Menghapus...' : 'Ya, Hapus' }}
                    </button>
                </div>
            </div>
        </div>

    </AdminLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';
import AdminLayout from '../components/adminlayout.vue';

const apiBase = 'https://api.etres.my.id/api/v1/discounts'; 
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('auth_token')}` });

const promos = ref([]);
const isLoading = ref(true);
const isSubmitting = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);

const alert = reactive({ show: false, message: '', type: 'success' });
const showAlert = (msg, type = 'success') => { alert.message = msg; alert.type = type; alert.show = true; setTimeout(() => alert.show = false, 4000); };

const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedId = ref(null);

const form = reactive({ name: '', type: 'percentage', value: '', min_purchase: '', start_date: '', end_date: '', is_active: true });
// STATE BARU: UX Form Error Merah
const formErrors = reactive({ name: false, value: false, start_date: false, end_date: false });

const deleteModal = reactive({ show: false, id: null, name: '', isDeleting: false });

const formatRupiah = (angka) => new Intl.NumberFormat('id-ID').format(angka || 0);

// FUNGSI BARU: Auto Format Angka Input
const formatInputNumber = (field) => {
    let rawValue = form[field].toString().replace(/[^0-9]/g, '');
    form[field] = rawValue ? new Intl.NumberFormat('id-ID').format(rawValue) : '';
    if (field === 'value') formErrors.value = false;
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const filteredPromos = computed(() => {
    return promos.value.filter(p => p.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const totalPages = computed(() => Math.ceil(filteredPromos.value.length / itemsPerPage.value));
const paginatedPromos = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return filteredPromos.value.slice(start, start + itemsPerPage.value);
});

// API Fetching
const fetchPromos = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get(`${apiBase}`, { headers: authHeaders() });
        promos.value = response.data.data?.data || response.data.data || response.data || [];
    } catch (error) {
        console.error(error);
        showAlert("Gagal memuat data promo.", "error");
    } finally {
        isLoading.value = false;
    }
};

// Modal Logic
const openModal = (promo = null) => {
    // Reset Notifikasi Merah
    formErrors.name = false;
    formErrors.value = false;
    formErrors.start_date = false;
    formErrors.end_date = false;

    isEditMode.value = !!promo;
    if (promo) {
        selectedId.value = promo.id;
        form.name = promo.name;
        form.type = promo.type; 
        
        // Menerapkan titik format ribuan saat edit
        form.value = promo.value ? new Intl.NumberFormat('id-ID').format(promo.value) : ''; 
        form.min_purchase = promo.min_purchase ? new Intl.NumberFormat('id-ID').format(promo.min_purchase) : '';
        
        form.start_date = promo.start_date ? promo.start_date.split('T')[0] : '';
        form.end_date = promo.end_date ? promo.end_date.split('T')[0] : '';
        form.is_active = !!promo.is_active;
    } else {
        selectedId.value = null;
        Object.assign(form, { name: '', type: 'percentage', value: '', min_purchase: '', start_date: '', end_date: '', is_active: true });
    }
    isModalOpen.value = true;
};
const closeModal = () => { isModalOpen.value = false; };

const submitForm = async () => {
    // 1. Cek UX Validasi Kosong
    formErrors.name = !form.name.trim();
    formErrors.value = !form.value.toString().trim();
    formErrors.start_date = !form.start_date;
    formErrors.end_date = !form.end_date;

    // Jika ada error merah, hentikan fungsi simpan
    if (formErrors.name || formErrors.value || formErrors.start_date || formErrors.end_date) {
        return;
    }

    // 2. Membersihkan titik ribuan dari input string sebelum kirim ke backend
    const cleanValue = parseInt(form.value.toString().replace(/\./g, '')) || 0;
    const cleanMinPurchase = parseInt(form.min_purchase.toString().replace(/\./g, '')) || 0;

    if (form.type === 'percentage' && cleanValue > 100) {
        alert.show = false;
        setTimeout(() => showAlert("Diskon persentase tidak boleh lebih dari 100%", "error"), 100);
        return;
    }

    isSubmitting.value = true;
    try {
        const payload = {
            ...form,
            value: cleanValue,
            min_purchase: cleanMinPurchase
        };

        const url = isEditMode.value ? `${apiBase}/${selectedId.value}` : `${apiBase}`;
        const method = isEditMode.value ? 'put' : 'post';
        
        await axios[method](url, payload, { headers: authHeaders() });
        showAlert(`Promo berhasil ${isEditMode.value ? 'diperbarui' : 'dibuat'}!`, 'success');
        closeModal();
        fetchPromos();
    } catch (error) {
        showAlert(error.response?.data?.message || 'Gagal menyimpan promo.', 'error');
    } finally {
        isSubmitting.value = false;
    }
};

const confirmDelete = (promo) => { deleteModal.id = promo.id; deleteModal.name = promo.name; deleteModal.show = true; };
const executeDelete = async () => {
    deleteModal.isDeleting = true;
    try {
        await axios.delete(`${apiBase}/${deleteModal.id}`, { headers: authHeaders() });
        showAlert("Promo berhasil dihapus!", "success");
        deleteModal.show = false;
        fetchPromos();
    } catch (error) {
        showAlert("Gagal menghapus promo.", "error");
    } finally { deleteModal.isDeleting = false; }
};

onMounted(() => fetchPromos());
</script>

<style scoped>
/* Animasi Fade & Slide Down untuk Alert Float */
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