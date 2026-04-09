<template>
    <AdminLayout>
        <div class="space-y-6 font-['Poppins'] pb-10">

            <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
                <div v-if="alert.show" :class="['p-3 rounded-lg border text-[13px] font-medium flex items-center justify-between gap-2', alert.type === 'error' ? 'bg-red-50 border-[#B83B2A] text-[#B83B2A]' : 'bg-green-50 border-[#2A7A4B] text-[#2A7A4B]' ]">
                    <div class="flex items-center gap-2">
                        <svg v-if="alert.type === 'error'" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <svg v-else class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{{ alert.message }}</span>
                    </div>
                    <button @click="alert.show = false" class="focus:outline-none"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
            </transition>

            <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden flex flex-col">
                
                <div class="p-4 border-b border-[#D4E4F4] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 bg-[#F7FAFD]">
                    <div class="flex items-center gap-2">
                        <span class="text-[13px] text-[#5A7A9A] font-medium">Tampilkan</span>
                        <select v-model="itemsPerPage" @change="currentPage = 1" class="border border-[#D4E4F4] bg-white text-[#1A2332] text-[13px] rounded-md px-2 py-1 focus:outline-none focus:border-[#2E7DD6]">
                            <option :value="5">5</option>
                            <option :value="10">10</option>
                            <option :value="15">15</option>
                            <option :value="50">50</option>
                        </select>
                    </div>

                    <div class="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                        <div class="relative w-full sm:w-64 flex-shrink-0">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input type="text" v-model="searchQuery" placeholder="Cari nama outlet..." class="w-full pl-9 pr-3 py-1.5 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC] transition-colors">
                        </div>

                        <div class="w-px h-6 bg-[#D4E4F4] hidden sm:block mx-1"></div>

                        <button @click="openOutletModal()" class="bg-[#2E7DD6] hover:bg-[#1B4F8A] text-white px-4 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                            Tambah Outlet
                        </button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-[#D4E4F4] bg-[#F7FAFD]">
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Nama Outlet</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Alamat & Telp</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#EBF3FB]">
                            <tr v-if="isLoading" class="border-b border-[#EBF3FB]">
                                <td colspan="3" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium animate-pulse">Memuat data outlet...</td>
                            </tr>
                            <tr v-else-if="paginatedOutlets.length === 0" class="border-b border-[#EBF3FB]">
                                <td colspan="3" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Tidak ada data outlet ditemukan.</td>
                            </tr>
                            <tr v-else v-for="outlet in paginatedOutlets" :key="outlet.id" class="hover:bg-[#F7FAFD] transition-colors">
                                <td class="px-5 py-3 font-semibold text-[#1A2332] text-[14px]">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-full bg-[#EBF3FB] text-[#1B4F8A] border border-[#D4E4F4] flex items-center justify-center font-bold text-[12px] flex-shrink-0">
                                            {{ outlet.name.charAt(0).toUpperCase() }}
                                        </div>
                                        <span>{{ outlet.name }}</span>
                                    </div>
                                </td>
                                <td class="px-5 py-3">
                                    <p class="text-[13px] text-[#1A2332] font-medium">{{ outlet.address || '-' }}</p>
                                    <p class="text-[11px] text-[#5A7A9A] font-['JetBrains_Mono'] mt-0.5">{{ outlet.phone || 'Tidak ada nomor telepon' }}</p>
                                </td>
                                <td class="px-5 py-3 text-right whitespace-nowrap">
                                    <button @click="openMenuManager(outlet)" class="text-[#2A7A4B] hover:text-green-800 p-1.5 transition-colors mr-2 bg-green-50 hover:bg-green-100 rounded-lg inline-flex items-center gap-1.5 text-[11px] font-bold px-3" title="Kelola Katalog Menu Outlet">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                        Kelola Menu
                                    </button>
                                    <button @click="openOutletModal(outlet)" class="text-[#2E7DD6] hover:text-[#1B4F8A] p-1.5 transition-colors bg-[#EBF3FB] hover:bg-[#D4E4F4] rounded-lg mr-1" title="Edit Data Outlet">
                                        <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button @click="confirmDelete(outlet)" class="text-[#B83B2A] hover:text-red-800 p-1.5 transition-colors bg-red-50 hover:bg-red-100 rounded-lg" title="Hapus Outlet">
                                        <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="p-4 bg-white flex items-center justify-between border-t border-[#D4E4F4]" v-if="totalPages > 0">
                    <p class="text-[12px] text-[#5A7A9A]">Halaman <span class="font-semibold text-[#1A2332] font-['JetBrains_Mono']">{{ currentPage }}</span> dari <span class="font-semibold text-[#1A2332] font-['JetBrains_Mono']">{{ totalPages }}</span></p>
                    <div class="flex gap-2">
                        <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1.5 border border-[#D4E4F4] text-[13px] rounded-lg text-[#1A2332] disabled:opacity-50 hover:bg-[#F0F4F8] transition-colors">Sebelumnya</button>
                        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1.5 border border-[#D4E4F4] text-[13px] rounded-lg text-[#1A2332] disabled:opacity-50 hover:bg-[#F0F4F8] transition-colors">Selanjutnya</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="outletModal.show" class="fixed inset-0 z-[60] flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-[#D4E4F4] flex flex-col">
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <h3 class="text-[16px] font-semibold text-[#1A2332]">{{ outletModal.isEdit ? 'Edit Data Outlet' : 'Tambah Outlet Baru' }}</h3>
                    <button @click="outletModal.show = false" class="text-[#8AAFCC] hover:text-[#B83B2A] transition-colors focus:outline-none"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <form @submit.prevent="submitOutlet" class="p-6 space-y-4">
                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Nama Outlet <span class="text-[#B83B2A]">*</span></label>
                        <input type="text" v-model="formOutlet.name" required placeholder="Contoh: Cabang Sudirman" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332]">
                    </div>
                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Nomor Telepon</label>
                        <input type="tel" v-model="formOutlet.phone" placeholder="08123456789" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] font-['JetBrains_Mono']">
                    </div>
                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Alamat Lengkap</label>
                        <textarea v-model="formOutlet.address" rows="3" placeholder="Alamat lengkap outlet..." class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] resize-none"></textarea>
                    </div>
                    <div class="pt-4 flex justify-end gap-2 border-t border-[#D4E4F4]">
                        <button type="button" @click="outletModal.show = false" class="px-4 py-2 text-[13px] font-medium text-[#5A7A9A] hover:bg-[#F0F4F8] rounded-lg transition-colors">Batal</button>
                        <button type="submit" :disabled="outletModal.isSubmitting" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:opacity-50 text-white text-[13px] font-semibold rounded-lg transition-colors">
                            {{ outletModal.isSubmitting ? 'Menyimpan...' : 'Simpan Data' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="menuModal.show" class="fixed inset-0 z-[70] flex items-center justify-center bg-[#1A2332]/60 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden border border-[#D4E4F4] flex flex-col max-h-[90vh] animate-[fadeIn_0.2s_ease-out]">
                
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD] flex-shrink-0">
                    <div>
                        <h3 class="text-[18px] font-bold text-[#1A2332] flex items-center gap-2">
                            <svg class="w-5 h-5 text-[#2A7A4B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                            Katalog Cabang: {{ menuModal.outletName }}
                        </h3>
                        <p class="text-[12px] text-[#5A7A9A] mt-0.5">Centang station yang tersedia, lalu atur stok dan harga menu untuk cabang ini.</p>
                    </div>
                    <button @click="menuModal.show = false" class="text-[#8AAFCC] hover:text-[#B83B2A] p-1.5 border border-[#D4E4F4] rounded bg-white shadow-sm transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>

                <div class="overflow-y-auto flex-1 bg-white p-4">
                    <div v-if="menuModal.isLoading" class="text-center py-10 text-[13px] text-[#8AAFCC] animate-pulse">Menyiapkan daftar master menu...</div>
                    <div v-else-if="menuForm.length === 0" class="text-center py-10 text-[13px] text-[#8AAFCC]">Belum ada Master Menu yang dibuat. Silakan buat di halaman Manajemen Menu.</div>
                    
                    <div v-else class="space-y-4">
                        
                        <div class="bg-[#F0F4F8] border border-[#D4E4F4] p-4 rounded-lg">
                            <h4 class="text-[13px] font-bold text-[#1A2332] mb-2 flex items-center gap-1.5">
                                <svg class="w-4 h-4 text-[#1B4F8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                1. Pilih Station yang Tersedia di Cabang Ini
                            </h4>
                            <p class="text-[11px] text-[#5A7A9A] mb-3">Menu di tabel bawah akan otomatis terfilter sesuai station yang dicentang.</p>
                            
                            <div class="flex flex-wrap gap-3">
                                <label v-for="st in stations" :key="st.id" class="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#D4E4F4] rounded-lg text-[12px] font-medium text-[#1A2332] cursor-pointer hover:border-[#2A7A4B] transition-colors shadow-sm">
                                    <input type="checkbox" :value="st.id" v-model="menuModal.selectedStations" class="w-3.5 h-3.5 text-[#2A7A4B] rounded">
                                    {{ st.name }}
                                </label>
                            </div>
                        </div>

                        <div class="border border-[#D4E4F4] rounded-lg overflow-hidden">
                            <table class="w-full text-left border-collapse">
                                <thead class="bg-[#F7FAFD]">
                                    <tr class="border-b border-[#D4E4F4]">
                                        <th class="p-3 text-center w-12">
                                            <input type="checkbox" @change="toggleAllMenus" v-model="isAllSelected" class="w-4 h-4 rounded text-[#2A7A4B] focus:ring-[#2A7A4B]">
                                        </th>
                                        <th class="p-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Menu & Station</th>
                                        <th class="p-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider w-40">Harga Jual (Rp)</th>
                                        <th class="p-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider w-28">Stok</th>
                                        <th class="p-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-center w-24">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-[#EBF3FB]">
                                    <tr v-if="filteredMenuForm.length === 0">
                                        <td colspan="5" class="p-6 text-center text-[12px] text-[#8AAFCC]">Tidak ada menu yang sesuai dengan station yang dipilih.</td>
                                    </tr>
                                    <tr v-else v-for="(prod, idx) in filteredMenuForm" :key="prod.id" :class="prod.selected ? 'bg-white' : 'bg-gray-50 opacity-60'">
                                        <td class="p-3 text-center">
                                            <input type="checkbox" v-model="prod.selected" class="w-4 h-4 rounded text-[#2A7A4B] focus:ring-[#2A7A4B]">
                                        </td>
                                        <td class="p-3">
                                            <p class="text-[13px] font-semibold text-[#1A2332]">{{ prod.name }}</p>
                                            <div class="flex items-center gap-2 mt-0.5">
                                                <span class="text-[10px] text-[#5A7A9A] font-['JetBrains_Mono']">Modal: Rp {{ formatRupiah(prod.cost_price) }}</span>
                                                <span v-if="prod.station_id" class="text-[9px] px-1.5 py-0.5 bg-orange-50 text-orange-700 rounded">{{ getStationName(prod.station_id) }}</span>
                                                <span v-else class="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">Tanpa Station</span>
                                            </div>
                                        </td>
                                        <td class="p-3">
                                            <input type="text" v-model="prod.price" @input="formatProductNumber(prod.indexInOriginal, 'price')" :disabled="!prod.selected" placeholder="Cth: 15.000" class="w-full px-2 py-1.5 text-[12px] font-['JetBrains_Mono'] font-bold text-[#1B4F8A] border border-[#D4E4F4] rounded outline-none focus:border-[#2A7A4B] disabled:bg-transparent disabled:border-transparent">
                                        </td>
                                        <td class="p-3">
                                            <input type="text" v-model="prod.stock" @input="formatProductNumber(prod.indexInOriginal, 'stock')" :disabled="!prod.selected" class="w-full px-2 py-1.5 text-[12px] font-['JetBrains_Mono'] font-semibold text-[#1A2332] border border-[#D4E4F4] rounded outline-none focus:border-[#2A7A4B] disabled:bg-transparent disabled:border-transparent text-center">
                                        </td>
                                        <td class="p-3 text-center">
                                            <span v-if="prod.selected" :class="['px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider', getRawNumber(prod.stock) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
                                                {{ getRawNumber(prod.stock) > 0 ? 'Tersedia' : 'Habis' }}
                                            </span>
                                            <span v-else class="text-[10px] text-[#8AAFCC]">-</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

                <div class="px-6 py-4 border-t border-[#D4E4F4] bg-[#F7FAFD] flex justify-end gap-3 rounded-b-xl flex-shrink-0">
                    <button @click="menuModal.show = false" class="px-4 py-2 text-[13px] font-medium text-[#5A7A9A] hover:bg-[#EBF3FB] rounded-lg transition-colors">Batal</button>
                    <button @click="saveOutletMenu" :disabled="menuModal.isSaving" class="px-5 py-2 bg-[#2A7A4B] hover:bg-green-800 disabled:opacity-50 text-white text-[13px] font-semibold rounded-lg shadow-sm transition-colors">
                        {{ menuModal.isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi Cabang' }}
                    </button>
                </div>
            </div>
        </div>

        <div v-if="deleteModal.show" class="fixed inset-0 z-[80] flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden border border-[#D4E4F4] text-center p-6">
                <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 border border-red-100">
                    <svg class="w-6 h-6 text-[#B83B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 class="text-[18px] font-bold text-[#1A2332] mb-2">Hapus Outlet?</h3>
                <p class="text-[14px] text-[#5A7A9A] mb-6">Yakin ingin menghapus <span class="font-semibold text-[#1A2332]">"{{ deleteModal.name }}"</span>? Semua riwayat dan pengaturan menu cabang ini akan hilang.</p>
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
const showAlert = (msg, type = 'success') => { alert.message = msg; alert.type = type; alert.show = true; setTimeout(() => alert.show = false, 4000); };

// --- STATE OUTLET & GLOBAL ---
const outlets = ref([]);
const stations = ref([]); 
const isLoading = ref(true);
const searchQuery = ref('');
const itemsPerPage = ref(10);
const currentPage = ref(1);

const outletModal = reactive({ show: false, isEdit: false, id: null, isSubmitting: false });
const formOutlet = reactive({ name: '', address: '', phone: '' });

const deleteModal = reactive({ show: false, id: null, name: '', isDeleting: false });

// --- STATE MENU MANAGER ---
const menuModal = reactive({ show: false, outletId: null, outletName: '', isLoading: false, isSaving: false, selectedStations: [] });
const menuForm = ref([]);
const masterProducts = ref([]);
const isAllSelected = ref(false);

// --- COMPUTED & UTILS ---
const formatRupiah = (angka) => new Intl.NumberFormat('id-ID').format(angka || 0);
const getRawNumber = (str) => parseInt(str.toString().replace(/[^0-9]/g, '')) || 0;

const getStationName = (id) => {
    const st = stations.value.find(s => s.id === id);
    return st ? st.name : '';
};

const paginatedOutlets = computed(() => {
    let filtered = outlets.value.filter(o => o.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return filtered.slice(start, start + itemsPerPage.value);
});

const totalPages = computed(() => Math.ceil(outlets.value.filter(o => o.name.toLowerCase().includes(searchQuery.value.toLowerCase())).length / itemsPerPage.value));
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };

// Format angka real-time di array asli berdasarkan index original
const formatProductNumber = (originalIndex, field) => {
    let rawValue = menuForm.value[originalIndex][field].toString().replace(/[^0-9]/g, '');
    menuForm.value[originalIndex][field] = rawValue ? new Intl.NumberFormat('id-ID').format(rawValue) : '';
};

// --- LOGIKA FILTER DINAMIS STATION ---
const filteredMenuForm = computed(() => {
    return menuForm.value.filter(prod => {
        // Jika menu tidak terikat ke station master, selalu muncul (misal Kerupuk/Rokok)
        if (!prod.station_id) return true;
        // Jika terikat, hanya muncul jika stationnya dicentang oleh manajer
        return menuModal.selectedStations.includes(prod.station_id);
    });
});

const toggleAllMenus = () => {
    // Hanya centang menu yang sedang tampil di layar (sesuai filter station)
    filteredMenuForm.value.forEach(m => m.selected = isAllSelected.value);
};

// --- API CALLS ---
const fetchInitialData = async () => {
    isLoading.value = true;
    try {
        const [resOut, resProd, resStat] = await Promise.all([
            axios.get(`${apiBase}/outlets?limit=1000`, { headers: authHeaders() }),
            axios.get(`${apiBase}/products?limit=1000`, { headers: authHeaders() }),
            axios.get(`${apiBase}/stations?limit=100`, { headers: authHeaders() })
        ]);
        outlets.value = resOut.data.data?.data || resOut.data.data || resOut.data || [];
        masterProducts.value = resProd.data.data?.data || resProd.data.data || resProd.data || [];
        stations.value = resStat.data.data?.data || resStat.data.data || resStat.data || [];
    } catch (e) {
        showAlert("Gagal memuat data", "error");
    } finally { isLoading.value = false; }
};

const openOutletModal = (item = null) => {
    outletModal.isEdit = !!item;
    if (item) {
        outletModal.id = item.id;
        formOutlet.name = item.name; formOutlet.address = item.address || ''; formOutlet.phone = item.phone || '';
    } else {
        outletModal.id = null;
        formOutlet.name = ''; formOutlet.address = ''; formOutlet.phone = '';
    }
    outletModal.show = true;
};

const submitOutlet = async () => {
    outletModal.isSubmitting = true;
    try {
        const payload = { ...formOutlet };
        let endpoint = `${apiBase}/outlets`;
        if (outletModal.isEdit) {
            endpoint += `/${outletModal.id}`;
            payload._method = 'PUT';
        }

        await axios.post(endpoint, payload, { headers: authHeaders() });
        showAlert(`Outlet berhasil ${outletModal.isEdit ? 'diperbarui' : 'ditambahkan'}!`, 'success');
        outletModal.show = false;
        fetchInitialData();
    } catch (error) {
        showAlert(error.response?.data?.message || 'Gagal menyimpan outlet.', 'error');
    } finally { outletModal.isSubmitting = false; }
};

const confirmDelete = (item) => {
    deleteModal.id = item.id; deleteModal.name = item.name; deleteModal.show = true;
};

const executeDelete = async () => {
    deleteModal.isDeleting = true;
    try {
        await axios.delete(`${apiBase}/outlets/${deleteModal.id}`, { headers: authHeaders() });
        showAlert('Outlet berhasil dihapus!', 'success');
        deleteModal.show = false;
        fetchInitialData();
    } catch (error) {
        showAlert('Gagal menghapus outlet.', 'error');
    } finally { deleteModal.isDeleting = false; }
};

// --- MENU MANAGER LOGIC ---
const openMenuManager = async (outlet) => {
    menuModal.outletId = outlet.id;
    menuModal.outletName = outlet.name;
    menuModal.show = true;
    menuModal.isLoading = true;
    menuModal.selectedStations = []; // Reset station check
    isAllSelected.value = false;

    try {
        const res = await axios.get(`${apiBase}/outlets/${outlet.id}/products`, { headers: authHeaders() });
        const outletProducts = res.data.data || []; 
        
        const activeStationsSet = new Set();

        menuForm.value = masterProducts.value.map((master, idx) => {
            const existingPivot = outletProducts.find(op => op.id === master.id);
            
            if (existingPivot && existingPivot.pivot) {
                // Jika menu pernah diset untuk outlet ini
                if (master.station_id) activeStationsSet.add(master.station_id);
                
                return {
                    indexInOriginal: idx, 
                    id: master.id, name: master.name, cost_price: master.cost_price, station_id: master.station_id,
                    selected: true,
                    price: new Intl.NumberFormat('id-ID').format(existingPivot.pivot.price),
                    stock: new Intl.NumberFormat('id-ID').format(existingPivot.pivot.stock),
                };
            } else {
                return {
                    indexInOriginal: idx,
                    id: master.id, name: master.name, cost_price: master.cost_price, station_id: master.station_id,
                    selected: false, price: '', stock: '0'
                };
            }
        });
        
        // Auto-check station berdasarkan menu yang sedang aktif di outlet ini.
        if (outletProducts.length === 0) {
            menuModal.selectedStations = stations.value.map(s => s.id);
        } else {
            menuModal.selectedStations = Array.from(activeStationsSet);
        }
        
    } catch (e) {
        showAlert('Gagal mengambil data menu cabang', 'error');
    } finally { menuModal.isLoading = false; }
};

const saveOutletMenu = async () => {
    menuModal.isSaving = true;
    try {
        // Yang disimpan ke backend HANYA menu yang dicentang
        const selectedMenus = menuForm.value.filter(m => m.selected);
        
        let hasInvalidData = false;
        selectedMenus.forEach(m => { if (!m.price) hasInvalidData = true; });
        if (hasInvalidData) {
            alert('Semua menu yang dicentang wajib diisi Harga Jualnya!');
            menuModal.isSaving = false;
            return;
        }

        const payload = {
            products: selectedMenus.map(m => {
                const pureStock = getRawNumber(m.stock);
                return {
                    product_id: m.id,
                    price: getRawNumber(m.price),
                    stock: pureStock,
                    is_active: pureStock > 0 // Otomatis Deteksi Tersedia/Habis
                };
            })
        };

        await axios.post(`${apiBase}/outlets/${menuModal.outletId}/sync-products`, payload, { headers: authHeaders() });
        
        showAlert('Konfigurasi menu cabang berhasil disimpan!', 'success');
        menuModal.show = false;
    } catch (error) {
        showAlert('Gagal menyimpan katalog cabang.', 'error');
    } finally { menuModal.isSaving = false; }
};

onMounted(() => fetchInitialData());
</script>

<style scoped>
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
input[type=checkbox] {
    cursor: pointer;
}
</style>