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
                        <div class="relative w-full sm:w-48 flex-shrink-0">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input type="text" v-model="searchQuery" placeholder="Cari master menu..." class="w-full pl-9 pr-3 py-1.5 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC] transition-colors">
                        </div>

                        <select v-model="filterCategory" class="px-3 py-1.5 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] bg-white flex-shrink-0">
                            <option value="">Semua Kategori</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                        </select>

                        <template v-if="userRole === 'manager' || userRole === 'developer'">
                            <div class="w-px h-6 bg-[#D4E4F4] hidden sm:block mx-1"></div>
                            
                            <button @click="openCategoryModal" class="bg-white border border-[#D4E4F4] text-[#5A7A9A] hover:bg-[#F0F4F8] hover:text-[#1B4F8A] px-3 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap flex-shrink-0 shadow-sm">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                Kategori
                            </button>
                            
                            <button @click="openStationModal" class="bg-white border border-[#D4E4F4] text-[#5A7A9A] hover:bg-[#F0F4F8] hover:text-[#1B4F8A] px-3 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap flex-shrink-0 shadow-sm">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                Station
                            </button>

                            <button @click="openModal()" class="bg-[#2E7DD6] hover:bg-[#1B4F8A] text-white px-3 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap flex-shrink-0 shadow-sm">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                                Tambah Menu
                            </button>
                        </template>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-[#D4E4F4] bg-[#F7FAFD]">
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider w-2/5">Master Produk</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Kategori & Station</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Harga Modal (Pusat)</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="isLoadingData" class="border-b border-[#EBF3FB]">
                                <td colspan="4" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium animate-pulse">Memuat master katalog...</td>
                            </tr>
                            <tr v-else-if="paginatedProducts.length === 0" class="border-b border-[#EBF3FB]">
                                <td colspan="4" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Tidak ada data menu ditemukan.</td>
                            </tr>
                            <tr v-else v-for="item in paginatedProducts" :key="item.id" class="border-b border-[#EBF3FB] hover:bg-[#F7FAFD] transition-colors">
                                <td class="px-5 py-3">
                                    <div class="flex items-center gap-4">
                                        <div class="w-12 h-12 rounded-lg bg-[#D4E4F4] overflow-hidden flex-shrink-0 border border-[#D4E4F4]">
                                            <img v-if="item.image" :src="`https://api.etres.my.id/storage/${item.image}`" class="w-full h-full object-cover" />
                                            <svg v-else class="w-full h-full text-[#8AAFCC] p-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        </div>
                                        <div class="flex flex-col items-start gap-1">
                                            <p class="text-[14px] text-[#1A2332] font-semibold leading-tight">{{ item.name }}</p>
                                        </div>
                                    </div>
                                </td>
                                
                                <td class="px-5 py-3">
                                    <div class="flex flex-col items-start gap-1.5">
                                        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#F0F4F8] border border-[#D4E4F4] text-[11px] font-medium text-[#5A7A9A]">
                                            <span class="w-1.5 h-1.5 rounded-full bg-[#8AAFCC]"></span>
                                            {{ item.category?.name || 'Tanpa Kategori' }}
                                        </span>
                                        <span v-if="item.station" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-[11px] font-medium text-orange-700">
                                            <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                            {{ item.station.name }}
                                        </span>
                                    </div>
                                </td>
                                
                                <td class="px-5 py-3">
                                    <p class="text-[14px] text-[#1B4F8A] font-bold font-['JetBrains_Mono']">Rp {{ formatRupiah(item.cost_price || 0) }}</p>
                                </td>

                                <td class="px-5 py-3 text-right whitespace-nowrap">
                                    <button @click="openViewModal(item)" class="text-[#5A7A9A] hover:text-[#1B4F8A] p-1.5 transition-colors mr-1 bg-[#F0F4F8] hover:bg-[#D4E4F4] rounded-lg" title="Lihat Detail">
                                        <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </button>
                                    
                                    <template v-if="userRole === 'manager' || userRole === 'developer'">
                                        <button @click="openModal(item)" class="text-[#2E7DD6] hover:text-[#1B4F8A] p-1.5 transition-colors bg-[#EBF3FB] hover:bg-[#D4E4F4] rounded-lg mr-1" title="Edit Master">
                                            <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button @click="confirmDelete(item, 'product')" class="text-[#B83B2A] hover:text-red-800 p-1.5 transition-colors bg-red-50 hover:bg-red-100 rounded-lg" title="Hapus Master">
                                            <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </template>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="p-4 bg-white flex items-center justify-between border-t border-[#D4E4F4]" v-if="totalPages > 0">
                    <p class="text-[12px] text-[#5A7A9A]">
                        Halaman <span class="font-semibold text-[#1A2332] font-['JetBrains_Mono']">{{ currentPage }}</span> dari <span class="font-semibold text-[#1A2332] font-['JetBrains_Mono']">{{ totalPages }}</span>
                    </p>
                    <div class="flex gap-2">
                        <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1.5 border border-[#D4E4F4] text-[13px] rounded-lg text-[#1A2332] disabled:opacity-50 hover:bg-[#F0F4F8] transition-colors">Sebelumnya</button>
                        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1.5 border border-[#D4E4F4] text-[13px] rounded-lg text-[#1A2332] disabled:opacity-50 hover:bg-[#F0F4F8] transition-colors">Selanjutnya</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="viewModal.show" class="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden border border-[#D4E4F4] flex flex-col">
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <h3 class="text-[16px] font-semibold text-[#1A2332] flex items-center gap-2">
                        <svg class="w-5 h-5 text-[#1B4F8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Detail Master Menu
                    </h3>
                    <button @click="viewModal.show = false" class="text-[#8AAFCC] hover:text-[#B83B2A] transition-colors focus:outline-none">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div class="p-6 flex flex-col sm:flex-row gap-6">
                    <div class="w-full sm:w-1/3 flex-shrink-0">
                        <div class="aspect-square rounded-xl bg-[#F0F4F8] border border-[#D4E4F4] overflow-hidden flex items-center justify-center">
                            <img v-if="viewModal.data.image" :src="`https://api.etres.my.id/storage/${viewModal.data.image}`" class="w-full h-full object-cover" />
                            <svg v-else class="w-12 h-12 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                    </div>
                    
                    <div class="flex-1 space-y-4">
                        <div>
                            <h4 class="text-[18px] font-bold text-[#1A2332] leading-tight mb-2">{{ viewModal.data.name }}</h4>
                            <div class="flex flex-wrap gap-2">
                                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0F4F8] border border-[#D4E4F4] text-[11px] font-medium text-[#5A7A9A]">
                                    Kategori: {{ viewModal.data.category?.name || '-' }}
                                </span>
                                <span v-if="viewModal.data.station" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-100 text-[11px] font-medium text-orange-700">
                                    Station: {{ viewModal.data.station.name }}
                                </span>
                            </div>
                        </div>

                        <div class="p-3 bg-[#F7FAFD] rounded-lg border border-[#D4E4F4]">
                            <p class="text-[11px] font-medium text-[#5A7A9A] mb-0.5">Harga Modal (Master)</p>
                            <p class="text-[16px] font-bold text-[#1A2332] font-['JetBrains_Mono']">Rp {{ formatRupiah(viewModal.data.cost_price || 0) }}</p>
                        </div>

                        <div>
                            <p class="text-[12px] font-medium text-[#5A7A9A] mb-1">Deskripsi:</p>
                            <p class="text-[13px] text-[#1A2332] bg-[#F0F4F8] p-2.5 rounded-lg border border-[#D4E4F4]">
                                {{ viewModal.data.description || 'Tidak ada deskripsi.' }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-xl overflow-hidden border border-[#D4E4F4] max-h-[90vh] flex flex-col">
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <h3 class="text-[16px] font-semibold text-[#1A2332]">{{ isEditMode ? 'Edit Master Menu' : 'Tambah Master Menu Baru' }}</h3>
                    <button @click="closeModal" class="text-[#8AAFCC] hover:text-[#B83B2A] transition-colors focus:outline-none">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form @submit.prevent="submitForm" class="p-6 space-y-4 overflow-y-auto">
                    
                    <div v-if="modalAlert.show" class="p-3 mb-2 rounded-lg border bg-red-50 border-[#B83B2A] text-[#B83B2A] text-[13px] font-medium flex items-center gap-2">
                        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{{ modalAlert.message }}</span>
                    </div>

                    <div>
                        <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Nama Menu</label>
                        <input type="text" v-model="form.name" @input="formErrors.name = false" maxlength="100" placeholder="Contoh: Nasi Goreng" 
                            :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332]', formErrors.name ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white']" />
                        <span v-if="formErrors.name" class="text-[#B83B2A] text-[11px] mt-1 block">Nama menu wajib diisi.</span>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Kategori</label>
                            <select v-model="form.category_id" @change="formErrors.category_id = false" :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332]', formErrors.category_id ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white']">
                                <option value="" disabled>Pilih Kategori</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                            </select>
                            <span v-if="formErrors.category_id" class="text-[#B83B2A] text-[11px] mt-1 block">Pilih kategori.</span>
                        </div>
                        <div>
                            <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Station (Opsional)</label>
                            <select v-model="form.station_id" class="w-full px-3 py-2 text-[14px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] bg-white">
                                <option value="">Tanpa Station</option>
                                <option v-for="st in stations" :key="st.id" :value="st.id">{{ st.name }}</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Harga Modal / Base Cost (Rp)</label>
                        <input type="text" v-model="form.cost_price" @input="formatInputNumber('cost_price')" placeholder="10.000" 
                            :class="['w-full px-3 py-2 text-[14px] font-[\'JetBrains_Mono\'] rounded-lg border focus:outline-none transition-colors text-[#1A2332]', formErrors.cost_price ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white']" />
                        <span v-if="formErrors.cost_price" class="text-[#B83B2A] text-[11px] mt-1 block">Modal wajib diisi.</span>
                    </div>

                    <div>
                        <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Deskripsi (Opsional)</label>
                        <textarea v-model="form.description" rows="2" placeholder="Detail komposisi..." class="w-full px-3 py-2 text-[14px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC]"></textarea>
                    </div>

                    <div>
                        <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Foto Menu (Opsional)</label>
                        <div class="flex items-center gap-4">
                            <div v-if="imagePreview" class="w-14 h-14 rounded-lg bg-[#D4E4F4] overflow-hidden flex-shrink-0 border border-[#D4E4F4]"><img :src="imagePreview" class="w-full h-full object-cover" /></div>
                            <div v-else class="w-14 h-14 rounded-lg bg-[#F0F4F8] flex items-center justify-center border border-dashed border-[#8AAFCC] flex-shrink-0"><svg class="w-5 h-5 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>
                            <input type="file" @change="handleFileUpload" accept="image/jpeg, image/png, image/jpg" class="w-full text-[13px] text-[#5A7A9A] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[13px] file:font-semibold file:bg-[#EBF3FB] file:text-[#1B4F8A] hover:file:bg-[#D4E4F4] transition-colors" />
                        </div>
                    </div>

                    <div class="pt-4 flex justify-end gap-2 border-t border-[#D4E4F4]">
                        <button type="button" @click="closeModal" class="px-4 py-2 text-[14px] font-medium text-[#5A7A9A] hover:bg-[#F0F4F8] rounded-lg transition-colors">Batal</button>
                        <button type="submit" :disabled="isSubmitting" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:bg-[#8AAFCC] text-white text-[14px] font-semibold rounded-lg transition-colors">
                            {{ isSubmitting ? 'Menyimpan...' : 'Simpan Data' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="crudModals.category" class="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-[#D4E4F4] flex flex-col max-h-[80vh]">
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <h3 class="text-[16px] font-semibold text-[#1A2332] flex items-center gap-2">
                        <svg class="w-5 h-5 text-[#1B4F8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                        Manajemen Kategori
                    </h3>
                    <button @click="crudModals.category = false" class="text-[#8AAFCC] hover:text-[#B83B2A] transition-colors focus:outline-none">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div class="p-6 overflow-y-auto">
                    <form @submit.prevent="addCategory" class="mb-6">
                        <div class="flex gap-2 items-start">
                            <div class="flex-1">
                                <input type="text" v-model="newCategoryName" @input="crudErrors.categoryName = false" placeholder="Nama kategori baru..." 
                                    :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332]', crudErrors.categoryName ? 'border-[#B83B2A] bg-red-50' : 'border-[#D4E4F4] focus:border-[#2E7DD6]']" />
                                <span v-if="crudErrors.categoryName" class="text-[#B83B2A] text-[11px] mt-1 block">Nama kategori wajib diisi.</span>
                            </div>
                            <button type="submit" :disabled="isSubmittingCrud" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:bg-[#8AAFCC] text-white text-[13px] font-semibold rounded-lg transition-colors h-[38px]">Tambah</button>
                        </div>
                    </form>
                    <h4 class="text-[12px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-2">Daftar Kategori</h4>
                    <ul class="border border-[#D4E4F4] rounded-lg divide-y divide-[#D4E4F4]">
                        <li v-if="categories.length === 0" class="p-4 text-center text-[13px] text-[#8AAFCC]">Belum ada kategori.</li>
                        <li v-else v-for="cat in categories" :key="cat.id" class="p-3 flex items-center justify-between hover:bg-[#F7FAFD]">
                            <span class="text-[14px] text-[#1A2332] font-medium">{{ cat.name }}</span>
                            <button @click="confirmDelete(cat, 'category')" class="text-[#B83B2A] hover:bg-red-50 p-1.5 rounded transition-colors" title="Hapus">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div v-if="crudModals.station" class="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-[#D4E4F4] flex flex-col max-h-[80vh]">
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <h3 class="text-[16px] font-semibold text-[#1A2332] flex items-center gap-2">
                        <svg class="w-5 h-5 text-[#1B4F8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        Manajemen Station
                    </h3>
                    <button @click="crudModals.station = false" class="text-[#8AAFCC] hover:text-[#B83B2A] transition-colors focus:outline-none">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div class="p-6 overflow-y-auto">
                    <form @submit.prevent="addStation" class="mb-6">
                        <div class="flex gap-2 items-start">
                            <div class="flex-1">
                                <input type="text" v-model="newStationName" @input="crudErrors.stationName = false" placeholder="Nama station (misal: Dapur)" 
                                    :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332]', crudErrors.stationName ? 'border-[#B83B2A] bg-red-50' : 'border-[#D4E4F4] focus:border-[#2E7DD6]']" />
                                <span v-if="crudErrors.stationName" class="text-[#B83B2A] text-[11px] mt-1 block">Nama station wajib diisi.</span>
                            </div>
                            <button type="submit" :disabled="isSubmittingCrud" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:bg-[#8AAFCC] text-white text-[13px] font-semibold rounded-lg transition-colors h-[38px]">Tambah</button>
                        </div>
                    </form>
                    <h4 class="text-[12px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-2">Daftar Station</h4>
                    <ul class="border border-[#D4E4F4] rounded-lg divide-y divide-[#D4E4F4]">
                        <li v-if="stations.length === 0" class="p-4 text-center text-[13px] text-[#8AAFCC]">Belum ada station.</li>
                        <li v-else v-for="st in stations" :key="st.id" class="p-3 flex items-center justify-between hover:bg-[#F7FAFD]">
                            <span class="text-[14px] text-[#1A2332] font-medium">{{ st.name }}</span>
                            <button @click="confirmDelete(st, 'station')" class="text-[#B83B2A] hover:bg-red-50 p-1.5 rounded transition-colors" title="Hapus">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div v-if="deleteModal.show" class="fixed inset-0 z-[80] flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden border border-[#D4E4F4] text-center p-6">
                <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 border border-red-100">
                    <svg class="w-6 h-6 text-[#B83B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 class="text-[18px] font-bold text-[#1A2332] mb-2">Hapus Data?</h3>
                <p class="text-[14px] text-[#5A7A9A] mb-6">
                    Yakin ingin menghapus <span class="font-semibold text-[#1A2332]">"{{ deleteModal.name }}"</span>? Data tidak dapat dikembalikan.
                </p>
                <div class="flex justify-center gap-3">
                    <button @click="closeDeleteModal" class="px-4 py-2 w-full text-[14px] font-medium text-[#5A7A9A] bg-[#F0F4F8] hover:bg-[#D4E4F4] rounded-lg transition-colors">Batal</button>
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

// ================= STATE GLOBAL =================
const userRole = ref(localStorage.getItem('user_role') || 'karyawan');
const apiBase = 'https://api.etres.my.id/api/v1';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('auth_token')}` });

const products = ref([]);
const categories = ref([]);
const stations = ref([]);
const isLoadingData = ref(true);
const isSubmitting = ref(false);
const isSubmittingCrud = ref(false); 

const searchQuery = ref('');
const filterCategory = ref('');
const itemsPerPage = ref(10);
const currentPage = ref(1);

// State Form Master Menu
const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedProductId = ref(null);
const imagePreview = ref(null);
const form = reactive({ name: '', category_id: '', station_id: '', cost_price: '', description: '', image: null });
const formErrors = reactive({ name: false, category_id: false, cost_price: false });

// State Modal Tambahan
const viewModal = reactive({ show: false, data: {} }); 
const crudModals = reactive({ category: false, station: false });
const crudErrors = reactive({ categoryName: false, stationName: false });
const deleteModal = reactive({ show: false, id: null, name: '', type: '', isDeleting: false });
const alert = reactive({ show: false, message: '', type: 'success' });
const modalAlert = reactive({ show: false, message: '' });

const newCategoryName = ref('');
const newStationName = ref('');

// ================= UTILS & COMPUTED =================
const formatRupiah = (angka) => new Intl.NumberFormat('id-ID').format(angka || 0);

const formatInputNumber = (field) => {
    let rawValue = form[field].toString().replace(/[^0-9]/g, '');
    form[field] = rawValue ? new Intl.NumberFormat('id-ID').format(rawValue) : '';
    formErrors[field] = false;
};

const handleFileUpload = (e) => { 
    const file = e.target.files[0];
    if (file) {
        form.image = file; 
        imagePreview.value = URL.createObjectURL(file);
    }
};

const sortedAndFilteredProducts = computed(() => {
    let filtered = Array.isArray(products.value) ? [...products.value] : [];
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        filtered = filtered.filter(p => p?.name?.toLowerCase().includes(q));
    }
    if (filterCategory.value) {
        filtered = filtered.filter(p => p.category_id === filterCategory.value);
    }
    return filtered;
});
const totalPages = computed(() => Math.ceil(sortedAndFilteredProducts.value.length / itemsPerPage.value));
const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return sortedAndFilteredProducts.value.slice(start, start + itemsPerPage.value);
});
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };


// ================= API CALLS =================
const showAlert = (msg, type) => { alert.message = msg; alert.type = type; alert.show = true; setTimeout(() => alert.show = false, 4000); };

const fetchAllData = async () => {
    isLoadingData.value = true;
    try {
        const [resCat, resSt, resProd] = await Promise.all([
            axios.get(`${apiBase}/categories?limit=100`, { headers: authHeaders() }),
            axios.get(`${apiBase}/stations?limit=100`, { headers: authHeaders() }),
            axios.get(`${apiBase}/products?limit=1000`, { headers: authHeaders() })
        ]);
        categories.value = resCat.data.data?.data || resCat.data.data || resCat.data || [];
        stations.value = resSt.data.data?.data || resSt.data.data || resSt.data || [];
        products.value = resProd.data.data?.data || resProd.data.data || resProd.data || [];
    } catch (e) {
        showAlert('Gagal memuat data dari server.', 'error');
    } finally { isLoadingData.value = false; }
};

// ================= CRUD KATEGORI & STATION =================
const fetchCategories = async () => {
    try {
        const res = await axios.get(`${apiBase}/categories?limit=100`, { headers: authHeaders() });
        categories.value = res.data.data?.data || res.data.data || res.data || [];
    } catch (error) { console.error('Gagal load kategori'); }
};
const openCategoryModal = () => { crudErrors.categoryName = false; newCategoryName.value = ''; crudModals.category = true; };
const addCategory = async () => {
    if (!newCategoryName.value.trim()) { crudErrors.categoryName = true; return; }
    isSubmittingCrud.value = true;
    try {
        // Hapus pengiriman outlet_id karena backend skrg pakai owner_id dari Token Auth
        await axios.post(`${apiBase}/categories`, { name: newCategoryName.value }, { headers: authHeaders() });
        newCategoryName.value = ''; 
        await fetchCategories();
    } catch (e) { alert('Gagal menambah kategori.'); } finally { isSubmittingCrud.value = false; }
};

const fetchStations = async () => {
    try {
        const res = await axios.get(`${apiBase}/stations?limit=100`, { headers: authHeaders() });
        stations.value = res.data.data?.data || res.data.data || res.data || [];
    } catch (error) { console.error('Gagal load station'); }
};
const openStationModal = () => { crudErrors.stationName = false; newStationName.value = ''; crudModals.station = true; };
const addStation = async () => {
    if (!newStationName.value.trim()) { crudErrors.stationName = true; return; }
    isSubmittingCrud.value = true;
    try {
        await axios.post(`${apiBase}/stations`, { name: newStationName.value }, { headers: authHeaders() });
        newStationName.value = ''; 
        await fetchStations();
    } catch (e) { alert('Gagal menambah station.'); } finally { isSubmittingCrud.value = false; }
};


// ================= MODAL MASTER MENU =================
const openViewModal = (item) => { viewModal.data = item; viewModal.show = true; };
const openModal = (item = null) => {
    formErrors.name = false; formErrors.category_id = false; formErrors.cost_price = false;
    modalAlert.show = false;
    
    if (item) {
        isEditMode.value = true; selectedProductId.value = item.id;
        form.name = item.name; form.category_id = item.category_id; form.station_id = item.station_id || '';
        form.description = item.description || ''; form.image = null;
        form.cost_price = item.cost_price ? new Intl.NumberFormat('id-ID').format(item.cost_price) : '0'; 
        imagePreview.value = item.image ? `https://api.etres.my.id/storage/${item.image}` : null;
    } else {
        isEditMode.value = false; selectedProductId.value = null;
        form.name = ''; form.category_id = ''; form.station_id = ''; form.cost_price = ''; form.description = ''; form.image = null;
        imagePreview.value = null;
    }
    isModalOpen.value = true;
};
const closeModal = () => { isModalOpen.value = false; };

const submitForm = async () => {
    formErrors.name = !form.name.trim();
    formErrors.category_id = !form.category_id;
    formErrors.cost_price = form.cost_price === '';

    if (formErrors.name || formErrors.category_id || formErrors.cost_price) return;

    isSubmitting.value = true;
    try {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('category_id', form.category_id);
        if (form.station_id) formData.append('station_id', form.station_id);
        formData.append('cost_price', form.cost_price.toString().replace(/\./g, '') || 0);
        formData.append('description', form.description || '');
        if (form.image) formData.append('image', form.image);

        let endpoint = `${apiBase}/products`;
        if (isEditMode.value) {
            endpoint += `/${selectedProductId.value}`;
            formData.append('_method', 'PUT');
        }

        await axios.post(endpoint, formData, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } });
        
        showAlert(isEditMode.value ? 'Katalog diperbarui!' : 'Katalog baru ditambahkan!', 'success');
        closeModal();
        await fetchAllData(); 
    } catch (error) {
        modalAlert.message = error.response?.data?.message || 'Gagal menyimpan master menu.';
        modalAlert.show = true;
    } finally { isSubmitting.value = false; }
};


// ================= GLOBAL DELETE =================
const confirmDelete = (item, type = 'product') => { 
    deleteModal.id = item.id; deleteModal.name = item.name; deleteModal.type = type; deleteModal.show = true; 
};
const closeDeleteModal = () => { 
    deleteModal.show = false; deleteModal.id = null; deleteModal.name = ''; deleteModal.type = ''; deleteModal.isDeleting = false; 
};

const executeDelete = async () => {
    deleteModal.isDeleting = true;
    try {
        if (deleteModal.type === 'product') {
            await axios.delete(`${apiBase}/products/${deleteModal.id}`, { headers: authHeaders() });
            showAlert('Katalog berhasil dihapus!', 'success');
            await fetchAllData();
        } 
        else if (deleteModal.type === 'category') {
            await axios.delete(`${apiBase}/categories/${deleteModal.id}`, { headers: authHeaders() });
            await fetchCategories();
        } 
        else if (deleteModal.type === 'station') {
            await axios.delete(`${apiBase}/stations/${deleteModal.id}`, { headers: authHeaders() });
            await fetchStations();
        }
        closeDeleteModal();
    } catch (error) { 
        showAlert(`Gagal menghapus data.`, 'error'); 
        deleteModal.isDeleting = false; 
    }
};

onMounted(() => { fetchAllData(); });
</script>