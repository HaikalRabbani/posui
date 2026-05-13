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
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Tipe & Cakupan</th>
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
                                    <p v-if="promo.max_discount > 0 && promo.type === 'percentage'" class="text-[11px] text-[#B83B2A] mt-0.5">Maks. Potongan: Rp {{ formatRupiah(promo.max_discount) }}</p>
                                </td>
                                <td class="px-5 py-3">
                                    <span :class="['px-2 py-0.5 rounded text-[11px] font-bold mr-1', promo.type === 'percentage' ? 'bg-[#EBF3FB] text-[#1B4F8A]' : 'bg-green-50 text-[#2A7A4B]']">
                                        {{ promo.type === 'percentage' ? promo.value + '%' : 'Rp ' + formatRupiah(promo.value) }}
                                    </span>
                                    <span v-if="promo.scope === 'products'" class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF4E5] text-[#D97706] border border-[#FFE0B2]">
                                        PRODUK ({{ promo.product_ids?.length || 0 }})
                                    </span>
                                    <span v-else-if="promo.scope === 'categories'" class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]">
                                        KATEGORI ({{ promo.category_ids?.length || 0 }})
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

        <div v-if="modal.show" class="fixed inset-0 z-[60] flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4 font-['Poppins']">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[#D4E4F4] animate-[fadeIn_0.2s_ease-out]">
                <div class="sticky top-0 px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD] z-10">
                    <h3 class="text-[16px] font-bold text-[#1A2332]">{{ modal.isEdit ? 'Edit Promo' : 'Buat Promo Baru' }}</h3>
                    <button @click="closeModal" class="text-[#8AAFCC] hover:text-[#B83B2A] transition-colors focus:outline-none"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <form @submit.prevent="submitForm" class="p-6 space-y-4">
                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Nama Promo <span class="text-[#B83B2A]">*</span></label>
                        <input type="text" v-model="form.name" required placeholder="Contoh: Diskon Kemerdekaan" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6]">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Cakupan (Scope) <span class="text-[#B83B2A]">*</span></label>
                            <select v-model="form.scope" required class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6] bg-white">
                                <option value="global">Seluruh Transaksi</option>
                                <option value="products">Berdasarkan Produk</option>
                                <option value="categories">Berdasarkan Kategori</option>
                            </select>
                        </div>
                    </div>

                    <div v-if="form.scope === 'products'" class="bg-[#F7FAFD] p-3 rounded-lg border border-[#D4E4F4]">
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-2">Pilih Produk <span class="text-[#B83B2A]">*</span></label>
                        
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input type="text" v-model="searchProductQuery" @focus="showProductDropdown = true" @blur="hideProductDropdown" placeholder="Ketik nama produk untuk mencari..." class="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6] bg-white text-[#1A2332]">
                            
                            <ul v-if="showProductDropdown && filteredAvailableProducts.length > 0" class="absolute z-[100] w-full mt-1 bg-white border border-[#D4E4F4] rounded-lg shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                                <li v-for="item in filteredAvailableProducts" :key="item.id" @mousedown.prevent="addProductById(item.id)" class="px-3 py-2 text-[13px] text-[#1A2332] hover:bg-[#F7FAFD] cursor-pointer border-b border-[#EBF3FB] last:border-b-0">
                                    {{ item.name }}
                                </li>
                            </ul>
                            <div v-else-if="showProductDropdown && searchProductQuery && filteredAvailableProducts.length === 0" class="absolute z-[100] w-full mt-1 bg-white border border-[#D4E4F4] rounded-lg shadow-lg p-3 text-[13px] text-[#8AAFCC] text-center">
                                Produk tidak ditemukan.
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-2 mt-3">
                            <span v-for="item in selectedProductsList" :key="item.id" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#EBF3FB] text-[#1B4F8A] border border-[#D4E4F4] animate-[fadeIn_0.2s_ease-out]">
                                {{ item.name }}
                                <button type="button" @click="removeProduct(item.id)" class="text-[#8AAFCC] hover:text-[#B83B2A] focus:outline-none transition-colors">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </span>
                            <span v-if="form.product_ids.length === 0" class="text-[12px] text-[#8AAFCC] italic py-1">Belum ada produk yang dipilih.</span>
                        </div>
                    </div>

                    <div v-if="form.scope === 'categories'" class="bg-[#F7FAFD] p-3 rounded-lg border border-[#D4E4F4]">
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-2">Pilih Kategori <span class="text-[#B83B2A]">*</span></label>
                        
                        <select v-model="tempCategory" @change="addCategory" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6] bg-white">
                            <option value="" disabled>-- Pilih Kategori untuk Ditambahkan --</option>
                            <option v-for="item in availableCategories" :key="item.id" :value="item.id">{{ item.name }}</option>
                        </select>

                        <div class="flex flex-wrap gap-2 mt-3">
                            <span v-for="item in selectedCategoriesList" :key="item.id" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF] animate-[fadeIn_0.2s_ease-out]">
                                {{ item.name }}
                                <button type="button" @click="removeCategory(item.id)" class="text-[#D8B4FE] hover:text-[#9333EA] focus:outline-none transition-colors">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </span>
                            <span v-if="form.category_ids.length === 0" class="text-[12px] text-[#8AAFCC] italic py-1">Belum ada kategori yang dipilih.</span>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Tipe Diskon <span class="text-[#B83B2A]">*</span></label>
                            <select v-model="form.type" @change="formatInputNumber('value')" required class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6] bg-white">
                                <option value="percentage">Persentase (%)</option>
                                <option value="nominal">Nominal (Rp)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Nilai Diskon <span class="text-[#B83B2A]">*</span></label>
                            <input type="text" v-model="form.value" @input="formatInputNumber('value')" required :placeholder="form.type === 'percentage' ? 'Contoh: 10' : 'Contoh: 15.000'" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6] font-['JetBrains_Mono']">
                        </div>
                    </div>

                    <div v-if="form.type === 'percentage'" class="bg-[#F7FAFD] p-3 rounded-lg border border-[#D4E4F4]">
                        <label class="block text-[12px] font-semibold text-[#1B4F8A] mb-1">Batas Maksimal Potongan (Rp)</label>
                        <p class="text-[10px] text-[#5A7A9A] mb-2 leading-tight">Biarkan kosong jika persentase diskon tidak memiliki batas maksimal.</p>
                        <input type="text" v-model="form.max_discount" @input="formatInputNumber('max_discount')" placeholder="Contoh: 15.000" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6] font-['JetBrains_Mono']">
                    </div>

                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Minimum Pembelian (Rp)</label>
                        <input type="text" v-model="form.min_purchase" @input="formatInputNumber('min_purchase')" placeholder="Biarkan kosong jika tidak ada" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6] font-['JetBrains_Mono']">
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

        <div v-if="deleteModal.show" class="fixed inset-0 z-[70] flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4 font-['Poppins']">
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
import AdminLayout from '../components/adminlayout.vue';

const apiBase = 'https://api.etres.my.id/api/v1';
const authHeaders = () => ({ 
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    'Accept': 'application/json'
});

const alert = reactive({ show: false, message: '', type: 'success' });
const showAlert = (msg, type = 'success') => { alert.message = msg; alert.type = type; alert.show = true; setTimeout(() => alert.show = false, 3000); };

const promos = ref([]);
const products = ref([]);
const categories = ref([]); 
const isLoading = ref(true);
const searchQuery = ref('');

const modal = reactive({ show: false, isEdit: false, id: null, isSubmitting: false });
const form = reactive({ 
    name: '', scope: 'global', product_ids: [], category_ids: [], type: 'percentage', 
    value: '', max_discount: '', min_purchase: '', start_date: '', 
    end_date: '', is_active: true 
});

const deleteModal = reactive({ show: false, id: null, promoName: '', isDeleting: false });

const tempCategory = ref('');

// === STATE BARU UNTUK PENCARIAN PRODUK ===
const searchProductQuery = ref('');
const showProductDropdown = ref(false);

const filteredAvailableProducts = computed(() => {
    const q = searchProductQuery.value.toLowerCase();
    return availableProducts.value.filter(p => p.name.toLowerCase().includes(q));
});

const hideProductDropdown = () => {
    // Timeout agar klik pada dropdown sempat dieksekusi sebelum dropdown menghilang
    setTimeout(() => { showProductDropdown.value = false; }, 150);
};

const addProductById = (id) => {
    if (!form.product_ids.includes(id)) {
        form.product_ids.push(id);
    }
    searchProductQuery.value = ''; 
    showProductDropdown.value = false;
};

// Auto Format saat diketik
const formatInputNumber = (field) => {
    let rawValue = String(form[field]).replace(/[^0-9]/g, '');
    if (!rawValue) {
        form[field] = '';
        return;
    }
    if (field === 'value' && form.type === 'percentage') {
        if (parseInt(rawValue) > 100) rawValue = '100'; 
        form[field] = rawValue;
        return;
    }
    form[field] = new Intl.NumberFormat('id-ID').format(rawValue);
};

const formatRupiah = (val) => new Intl.NumberFormat('id-ID').format(val || 0);
const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const removeProduct = (id) => {
    form.product_ids = form.product_ids.filter(pId => pId !== id);
};

const selectedProductsList = computed(() => {
    return form.product_ids.map(id => products.value.find(p => p.id == id)).filter(Boolean);
});

const availableProducts = computed(() => {
    return products.value.filter(p => !form.product_ids.includes(p.id));
});

const addCategory = () => {
    if (tempCategory.value && !form.category_ids.includes(tempCategory.value)) {
        form.category_ids.push(tempCategory.value);
    }
    tempCategory.value = ''; 
};

const removeCategory = (id) => {
    form.category_ids = form.category_ids.filter(cId => cId !== id);
};

const selectedCategoriesList = computed(() => {
    return form.category_ids.map(id => categories.value.find(c => c.id == id)).filter(Boolean);
});

const availableCategories = computed(() => {
    return categories.value.filter(c => !form.category_ids.includes(c.id));
});

const fetchProductsAndCategories = async () => {
    try {
        const resProd = await fetch(`${apiBase}/products?limit=1000`, { headers: authHeaders() });
        const prodJson = await resProd.json();
        const prodData = prodJson.data || prodJson;
        products.value = Array.isArray(prodData?.data) ? prodData.data : (Array.isArray(prodData) ? prodData : []);
        
        const resCat = await fetch(`${apiBase}/categories?limit=100`, { headers: authHeaders() });
        const catJson = await resCat.json();
        const catData = catJson.data || catJson;
        categories.value = Array.isArray(catData?.data) ? catData.data : (Array.isArray(catData) ? catData : []);
    } catch (e) {
        console.error('Gagal mengambil data produk/kategori', e);
    }
};

const fetchPromos = async () => {
    isLoading.value = true;
    try {
        const res = await fetch(`${apiBase}/discounts`, { headers: authHeaders() });
        const resJson = await res.json();
        const data = resJson.data || resJson;
        promos.value = Array.isArray(data) ? data : [];
    } catch (e) {
        console.error('Gagal mengambil data promo', e);
        showAlert('Gagal memuat data promo, pastikan migrasi database sudah dijalankan', 'error');
        promos.value = []; 
    } finally {
        isLoading.value = false;
    }
};

const openModal = (item = null) => {
    modal.isEdit = !!item;
    searchProductQuery.value = ''; 
    tempCategory.value = '';

    if (item) {
        modal.id = item.id;
        form.name = item.name;
        form.scope = item.scope || 'global';
        form.product_ids = item.product_ids || [];
        form.category_ids = item.category_ids || [];
        form.type = item.type;
        
        form.value = item.type === 'percentage' ? item.value : new Intl.NumberFormat('id-ID').format(item.value);
        form.max_discount = item.max_discount ? new Intl.NumberFormat('id-ID').format(item.max_discount) : '';
        form.min_purchase = item.min_purchase ? new Intl.NumberFormat('id-ID').format(item.min_purchase) : '';
        
        form.start_date = item.start_date;
        form.end_date = item.end_date;
        form.is_active = item.is_active;
    } else {
        modal.id = null;
        form.name = ''; form.scope = 'global'; 
        form.product_ids = []; form.category_ids = []; 
        form.type = 'percentage'; form.value = ''; form.max_discount = ''; 
        form.min_purchase = ''; form.start_date = new Date().toLocaleDateString('en-CA'); 
        form.end_date = ''; form.is_active = true;
    }
    modal.show = true;
};

const closeModal = () => { modal.show = false; };

const submitForm = async () => {
    modal.isSubmitting = true;
    try {
        const pureValue = Number(String(form.value).replace(/\./g, ''));
        const pureMaxDiscount = form.max_discount ? Number(String(form.max_discount).replace(/\./g, '')) : null;
        const pureMinPurchase = form.min_purchase ? Number(String(form.min_purchase).replace(/\./g, '')) : 0;

        const payload = {
            ...form,
            value: pureValue,
            product_ids: form.scope === 'products' ? form.product_ids : [],
            category_ids: form.scope === 'categories' ? form.category_ids : [],
            max_discount: pureMaxDiscount,
            min_purchase: pureMinPurchase,
            is_active: Boolean(form.is_active)
        };

        if (form.scope === 'products' && payload.product_ids.length === 0) {
            showAlert('Pilih minimal satu produk', 'error');
            modal.isSubmitting = false;
            return;
        }
        if (form.scope === 'categories' && payload.category_ids.length === 0) {
            showAlert('Pilih minimal satu kategori', 'error');
            modal.isSubmitting = false;
            return;
        }

        let url = `${apiBase}/discounts`;
        let method = 'POST';

        if (modal.isEdit) {
            url = `${apiBase}/discounts/${modal.id}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: { ...authHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal menyimpan data promo');
        }

        showAlert(`Promo ${modal.isEdit ? 'diperbarui' : 'baru berhasil dibuat'}`, 'success');
        closeModal();
        fetchPromos();
    } catch (e) {
        showAlert(e.message, 'error');
        console.error(e);
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
        const response = await fetch(`${apiBase}/discounts/${deleteModal.id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        
        if (!response.ok) throw new Error('Gagal menghapus promo');
        
        showAlert('Promo berhasil dihapus', 'success');
        deleteModal.show = false;
        fetchPromos();
    } catch (e) {
        showAlert(e.message, 'error');
    } finally {
        deleteModal.isDeleting = false;
    }
};

const filteredPromos = computed(() => {
    const today = new Date().toLocaleDateString('en-CA'); 
    if (!Array.isArray(promos.value)) return [];

    return promos.value.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase());
        const isNotExpired = p.end_date >= today; 
        return matchesSearch && isNotExpired;
    });
});

const activePromosCount = computed(() => filteredPromos.value.filter(p => p.is_active).length);
const nominalPromosCount = computed(() => filteredPromos.value.filter(p => p.type === 'nominal').length);
const percentagePromosCount = computed(() => filteredPromos.value.filter(p => p.type === 'percentage').length);

onMounted(() => {
    fetchPromos();
    fetchProductsAndCategories();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #D4E4F4; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8AAFCC; }

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