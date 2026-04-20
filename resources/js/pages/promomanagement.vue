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


            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white border border-[#D4E4F4] p-5 rounded-xl shadow-sm">
                    <p class="text-[12px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1">Total Promo Aktif</p>
                    <h3 class="text-[24px] font-bold text-[#1A2332] font-['JetBrains_Mono']">{{ activePromosCount }}</h3>
                </div>
                <div class="bg-white border border-[#D4E4F4] p-5 rounded-xl shadow-sm">
                    <p class="text-[12px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1">Promo Nominal</p>
                    <h3 class="text-[24px] font-bold text-[#1B4F8A] font-['JetBrains_Mono']">{{ nominalPromosCount }}</h3>
                </div>
                <div class="bg-white border border-[#D4E4F4] p-5 rounded-xl shadow-sm">
                    <p class="text-[12px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1">Promo Persentase</p>
                    <h3 class="text-[24px] font-bold text-[#2A7A4B] font-['JetBrains_Mono']">{{ percentagePromosCount }}</h3>
                </div>
            </div>

            <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div class="p-4 border-b border-[#D4E4F4] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F7FAFD]">
                    <div class="relative w-full sm:w-72">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input type="text" v-model="searchQuery" placeholder="Cari nama promo..." class="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] transition-colors">
                    </div>
                    <button @click="openModal()" class="bg-[#1B4F8A] hover:bg-[#1A2332] text-white px-4 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap w-full sm:w-auto justify-center">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                        Buat Promo Baru
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-[#D4E4F4] bg-[#F7FAFD]">
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Nama Promo</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Tipe Diskon</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Masa Berlaku</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Status</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#EBF3FB]">
                            <tr v-if="isLoading">
                                <td colspan="5" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] animate-pulse font-medium">Memuat data promo...</td>
                            </tr>
                            <tr v-else-if="filteredPromos.length === 0">
                                <td colspan="5" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Belum ada promo tersedia atau data tidak ditemukan.</td>
                            </tr>
                            <tr v-else v-for="promo in filteredPromos" :key="promo.id" class="hover:bg-[#F7FAFD] transition-colors">
                                <td class="px-5 py-3">
                                    <p class="font-bold text-[#1A2332] text-[13px]">{{ promo.name }}</p>
                                    <p v-if="promo.min_purchase > 0" class="text-[11px] text-[#5A7A9A] mt-0.5">Min. Beli: Rp {{ formatRupiah(promo.min_purchase) }}</p>
                                </td>
                                <td class="px-5 py-3">
                                    <span :class="['px-2 py-0.5 rounded text-[11px] font-bold', promo.type === 'percentage' ? 'bg-[#EBF3FB] text-[#1B4F8A]' : 'bg-green-50 text-[#2A7A4B]']">
                                        {{ promo.type === 'percentage' ? promo.value + '%' : 'Rp ' + formatRupiah(promo.value) }}
                                    </span>
                                </td>
                                <td class="px-5 py-3 text-[12px] text-[#5A7A9A]">
                                    {{ formatDate(promo.start_date) }} <span class="mx-1 text-[#8AAFCC]">-</span> {{ formatDate(promo.end_date) }}
                                </td>
                                <td class="px-5 py-3">
                                    <span :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border', promo.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200']">
                                        {{ promo.is_active ? 'Aktif' : 'Non-Aktif' }}
                                    </span>
                                </td>
                                <td class="px-5 py-3 text-right whitespace-nowrap">
                                    <button @click="openModal(promo)" class="text-[#2E7DD6] hover:text-[#1B4F8A] p-1.5 transition-colors bg-[#EBF3FB] hover:bg-[#D4E4F4] rounded-lg mr-1" title="Edit Promo"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                    <button @click="confirmDelete(promo)" class="text-[#B83B2A] hover:text-red-800 p-1.5 transition-colors bg-red-50 hover:bg-red-100 rounded-lg" title="Hapus Promo"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div v-if="modal.show" class="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4 font-['Poppins']">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-[#D4E4F4] animate-[fadeIn_0.2s_ease-out]">
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <h3 class="text-[16px] font-bold text-[#1A2332]">{{ modal.isEdit ? 'Edit Promo' : 'Buat Promo Baru' }}</h3>
                    <button @click="closeModal" class="text-[#8AAFCC] hover:text-[#B83B2A] transition-colors focus:outline-none"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <form @submit.prevent="submitForm" class="p-6 space-y-4">
                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Nama Promo <span class="text-[#B83B2A]">*</span></label>
                        <input type="text" v-model="form.name" required placeholder="Contoh: Diskon Kemerdekaan" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6]">
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Tipe Diskon <span class="text-[#B83B2A]">*</span></label>
                            <select v-model="form.type" required class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6] bg-white">
                                <option value="percentage">Persentase (%)</option>
                                <option value="nominal">Nominal (Rp)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Nilai Diskon <span class="text-[#B83B2A]">*</span></label>
                            <input type="number" v-model="form.value" required :placeholder="form.type === 'percentage' ? 'Contoh: 10' : 'Contoh: 15000'" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6] font-['JetBrains_Mono']">
                        </div>
                    </div>

                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Minimum Pembelian (Rp)</label>
                        <input type="number" v-model="form.min_purchase" placeholder="Biarkan kosong jika tidak ada" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6] font-['JetBrains_Mono']">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Tanggal Mulai <span class="text-[#B83B2A]">*</span></label>
                            <input type="date" v-model="form.start_date" required class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6] font-['JetBrains_Mono'] text-[#1A2332]">
                        </div>
                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Tanggal Berakhir <span class="text-[#B83B2A]">*</span></label>
                            <input type="date" v-model="form.end_date" required class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6] font-['JetBrains_Mono'] text-[#1A2332]">
                        </div>
                    </div>

                    <div class="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="isActive" v-model="form.is_active" class="w-4 h-4 text-[#2E7DD6] rounded border-[#D4E4F4] focus:ring-[#2E7DD6]">
                        <label for="isActive" class="text-[13px] font-medium text-[#1A2332] cursor-pointer">Aktifkan Promo Ini</label>
                    </div>

                    <div class="pt-4 flex justify-end gap-2 border-t border-[#D4E4F4]">
                        <button type="button" @click="closeModal" class="px-4 py-2 text-[13px] font-medium text-[#5A7A9A] hover:bg-[#F0F4F8] rounded-lg transition-colors">Batal</button>
                        <button type="submit" :disabled="modal.isSubmitting" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:opacity-50 text-white text-[13px] font-semibold rounded-lg transition-colors">
                            {{ modal.isSubmitting ? 'Menyimpan...' : 'Simpan Promo' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="deleteModal.show" class="fixed inset-0 z-[60] flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4 font-['Poppins']">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden border border-[#D4E4F4] text-center p-6 animate-[fadeIn_0.2s_ease-out]">
                <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 border border-red-100">
                    <svg class="w-6 h-6 text-[#B83B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 class="text-[18px] font-bold text-[#1A2332] mb-2">Hapus Promo?</h3>
                <p class="text-[14px] text-[#5A7A9A] mb-6">Yakin ingin menghapus promo <span class="font-bold text-[#1A2332]">"{{ deleteModal.promoName }}"</span>?</p>
                <div class="flex justify-center gap-3">
                    <button @click="deleteModal.show = false" class="px-4 py-2 w-full text-[14px] font-medium text-[#5A7A9A] bg-[#F0F4F8] hover:bg-[#D4E4F4] rounded-lg transition-colors">Batal</button>
                    <button @click="executeDelete" :disabled="deleteModal.isDeleting" class="px-4 py-2 w-full text-[14px] font-semibold text-white bg-[#B83B2A] hover:bg-red-800 disabled:opacity-50 rounded-lg transition-colors">
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

const apiBase = 'https://api.etres.my.id/api/v1';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('auth_token')}` });

const alert = reactive({ show: false, message: '', type: 'success' });
const showAlert = (msg, type = 'success') => { alert.message = msg; alert.type = type; alert.show = true; setTimeout(() => alert.show = false, 3000); };

const promos = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');

const modal = reactive({ show: false, isEdit: false, id: null, isSubmitting: false });
const form = reactive({ name: '', type: 'percentage', value: '', min_purchase: '', start_date: '', end_date: '', is_active: true });

const deleteModal = reactive({ show: false, id: null, promoName: '', isDeleting: false });

const formatRupiah = (val) => new Intl.NumberFormat('id-ID').format(val || 0);
const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const fetchPromos = async () => {
    isLoading.value = true;
    try {
        const res = await axios.get(`${apiBase}/discounts`, { headers: authHeaders() });
        promos.value = res.data.data || res.data || [];
    } catch (e) {
        console.error('Gagal mengambil data promo', e);
        showAlert('Gagal memuat data promo', 'error');
    } finally {
        isLoading.value = false;
    }
};

const openModal = (item = null) => {
    modal.isEdit = !!item;
    if (item) {
        modal.id = item.id;
        form.name = item.name;
        form.type = item.type;
        form.value = item.value;
        form.min_purchase = item.min_purchase || '';
        form.start_date = item.start_date;
        form.end_date = item.end_date;
        form.is_active = item.is_active;
    } else {
        modal.id = null;
        form.name = ''; form.type = 'percentage'; form.value = ''; form.min_purchase = ''; 
        form.start_date = new Date().toLocaleDateString('en-CA'); 
        form.end_date = ''; form.is_active = true;
    }
    modal.show = true;
};

const closeModal = () => { modal.show = false; };

const submitForm = async () => {
    modal.isSubmitting = true;
    try {
        const payload = {
            ...form,
            value: Number(form.value),
            min_purchase: form.min_purchase ? Number(form.min_purchase) : 0,
            is_active: Boolean(form.is_active)
        };

        if (modal.isEdit) {
            await axios.put(`${apiBase}/discounts/${modal.id}`, payload, { headers: authHeaders() });
            showAlert('Promo berhasil diperbarui', 'success');
        } else {
            await axios.post(`${apiBase}/discounts`, payload, { headers: authHeaders() });
            showAlert('Promo baru berhasil dibuat', 'success');
        }
        closeModal();
        fetchPromos();
    } catch (e) {
        showAlert(e.response?.data?.message || 'Gagal menyimpan data promo', 'error');
        console.error(e.response?.data);
    } finally {
        modal.isSubmitting = false;
    }
};

const confirmDelete = (item) => {
    deleteModal.id = item.id;
    deleteModal.promoName = item.name;
    deleteModal.show = true;
};

const executeDelete = async () => {
    deleteModal.isDeleting = true;
    try {
        await axios.delete(`${apiBase}/discounts/${deleteModal.id}`, { headers: authHeaders() });
        showAlert('Promo berhasil dihapus', 'success');
        deleteModal.show = false;
        fetchPromos();
    } catch (e) {
        showAlert('Gagal menghapus promo', 'error');
    } finally {
        deleteModal.isDeleting = false;
    }
};

// ==========================================
// AUTO-DELETE VISUAL (REALTIME FILTER)
// ==========================================
const filteredPromos = computed(() => {
    // Ambil tanggal hari ini dalam format YYYY-MM-DD
    const today = new Date().toLocaleDateString('en-CA'); 
    
    return promos.value.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase());
        
        // Cek apakah tanggal berakhir (end_date) masih lebih besar atau sama dengan hari ini.
        // Jika sudah lebih kecil (kadaluarsa), maka akan otomatis disembunyikan (false).
        const isNotExpired = p.end_date >= today; 
        
        return matchesSearch && isNotExpired;
    });
});

// Stats
const activePromosCount = computed(() => filteredPromos.value.filter(p => p.is_active).length);
const nominalPromosCount = computed(() => filteredPromos.value.filter(p => p.type === 'nominal').length);
const percentagePromosCount = computed(() => filteredPromos.value.filter(p => p.type === 'percentage').length);

onMounted(() => {
    fetchPromos();
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
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>