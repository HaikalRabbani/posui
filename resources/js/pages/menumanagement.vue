<template>
    <AdminLayout>
        <div class="space-y-6 font-['Poppins']">
            
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
                        <span class="text-[13px] text-[#5A7A9A] font-medium">data</span>
                    </div>

                    <div class="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                        
                        <div class="relative w-full sm:w-48 flex-shrink-0">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input 
                                type="text" v-model="searchQuery" placeholder="Cari menu..." 
                                class="w-full pl-9 pr-3 py-1.5 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC]"
                            >
                        </div>

                        <select v-model="filterCategory" class="px-3 py-1.5 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] bg-white flex-shrink-0">
                            <option value="">Semua Kategori</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                        </select>

                        <select v-model="filterStation" class="px-3 py-1.5 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] bg-white flex-shrink-0">
                            <option value="">Semua Station</option>
                            <option v-for="st in stations" :key="st.id" :value="st.id">{{ st.name }}</option>
                        </select>

                        <div class="w-px h-6 bg-[#D4E4F4] hidden sm:block mx-1"></div>
                        
                        <button @click="openCategoryModal" class="bg-white border border-[#D4E4F4] text-[#5A7A9A] hover:bg-[#F0F4F8] hover:text-[#1B4F8A] px-3 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap flex-shrink-0">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                            Kategori
                        </button>
                        
                        <button @click="openStationModal" class="bg-white border border-[#D4E4F4] text-[#5A7A9A] hover:bg-[#F0F4F8] hover:text-[#1B4F8A] px-3 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap flex-shrink-0">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            Station
                        </button>

                        <button @click="openModal()" class="bg-[#2E7DD6] hover:bg-[#1B4F8A] text-white px-3 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap flex-shrink-0">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                            Menu
                        </button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-[#D4E4F4] bg-[#F7FAFD]">
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider w-2/5">Produk</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Harga</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Stok & Status</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="isLoadingData" class="border-b border-[#EBF3FB]">
                                <td colspan="4" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Memuat data...</td>
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
                                            <p class="text-[14px] text-[#1A2332] font-semibold leading-tight">
                                                {{ item.name.length > 25 ? item.name.slice(0, 25) + '..' : item.name }}
                                            </p>
                                            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#F0F4F8] border border-[#D4E4F4] text-[11px] font-medium text-[#5A7A9A]">
                                                <span class="w-1.5 h-1.5 rounded-full bg-[#8AAFCC]"></span>
                                                {{ item.category?.name || 'Tanpa Kategori' }}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                
                                <td class="px-5 py-3">
                                    <p class="text-[14px] text-[#1B4F8A] font-bold font-['JetBrains_Mono']">Rp {{ formatRupiah(item.price || 0) }}</p>
                                </td>
                                
                                <td class="px-5 py-3">
                                    <div class="flex flex-col items-start gap-1">
                                        <span class="text-[13px] text-[#1A2332] font-semibold font-['JetBrains_Mono']">Sisa: {{ formatRupiah(item.stock || 0) }}</span>
                                        <span :class="[ 
                                            'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border',
                                            item.is_active ? 'bg-green-50 text-[#2A7A4B] border-green-200' : 'bg-red-50 text-[#B83B2A] border-red-200'
                                        ]">
                                            <span :class="['w-1.5 h-1.5 rounded-full', item.is_active ? 'bg-[#2A7A4B]' : 'bg-[#B83B2A]']"></span>
                                            {{ item.is_active ? 'Tersedia' : 'Habis' }}
                                        </span>
                                    </div>
                                </td>

                                <td class="px-5 py-3 text-right whitespace-nowrap">
                                    <button @click="openViewModal(item)" class="text-[#5A7A9A] hover:text-[#1B4F8A] p-1.5 transition-colors mr-1" title="Lihat Detail">
                                        <svg class="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </button>
                                    <button @click="openModal(item)" class="text-[#2E7DD6] hover:text-[#1B4F8A] p-1.5 transition-colors mr-1" title="Edit Menu">
                                        <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button @click="confirmDelete(item, 'product')" class="text-[#B83B2A] hover:text-red-800 p-1.5 transition-colors" title="Hapus Menu">
                                        <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
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
                        Detail Menu
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
                                    <span class="w-1.5 h-1.5 rounded-full bg-[#8AAFCC]"></span>
                                    Kategori: {{ viewModal.data.category?.name || '-' }}
                                </span>
                                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-100 text-[11px] font-medium text-orange-700">
                                    <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                    Station: {{ viewModal.data.station?.name || '-' }}
                                </span>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3 p-3 bg-[#F7FAFD] rounded-lg border border-[#D4E4F4]">
                            <div>
                                <p class="text-[11px] font-medium text-[#5A7A9A] mb-0.5">Harga Jual</p>
                                <p class="text-[14px] font-bold text-[#1B4F8A] font-['JetBrains_Mono']">Rp {{ formatRupiah(viewModal.data.price) }}</p>
                            </div>
                            <div>
                                <p class="text-[11px] font-medium text-[#5A7A9A] mb-0.5">Harga Modal</p>
                                <p class="text-[14px] font-semibold text-[#1A2332] font-['JetBrains_Mono']">Rp {{ formatRupiah(viewModal.data.cost_price || 0) }}</p>
                            </div>
                            <div class="pt-2 border-t border-[#D4E4F4]">
                                <p class="text-[11px] font-medium text-[#5A7A9A] mb-0.5">Margin</p>
                                <p class="text-[13px] font-semibold text-[#2A7A4B] font-['JetBrains_Mono']">+Rp {{ formatRupiah((viewModal.data.price || 0) - (viewModal.data.cost_price || 0)) }}</p>
                            </div>
                            <div class="pt-2 border-t border-[#D4E4F4]">
                                <p class="text-[11px] font-medium text-[#5A7A9A] mb-0.5">Sisa Stok</p>
                                <p class="text-[13px] font-semibold text-[#1A2332] font-['JetBrains_Mono']">{{ formatRupiah(viewModal.data.stock || 0) }}</p>
                            </div>
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
                                    :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332]', crudErrors.categoryName ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6]']" />
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
                                <input type="text" v-model="newStationName" @input="crudErrors.stationName = false" placeholder="Nama station (misal: Dapur Utama)" 
                                    :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332]', crudErrors.stationName ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6]']" />
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

        <div v-if="isModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-xl overflow-hidden border border-[#D4E4F4] max-h-[90vh] flex flex-col">
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <h3 class="text-[16px] font-semibold text-[#1A2332]">{{ isEditMode ? 'Edit Menu' : 'Tambah Menu Baru' }}</h3>
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
                            :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332] placeholder-[#8AAFCC]', formErrors.name ? 'border-[#B83B2A] focus:border-[#B83B2A] bg-red-50' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white']" />
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

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Stok Menu</label>
                            <input type="text" v-model="form.stock" @input="formatInputNumber('stock')" placeholder="0" 
                                :class="['w-full px-3 py-2 text-[14px] font-[\'JetBrains_Mono\'] rounded-lg border focus:outline-none transition-colors text-[#1A2332] placeholder-[#8AAFCC]', formErrors.stock ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white']" />
                            <span v-if="formErrors.stock" class="text-[#B83B2A] text-[11px] mt-1 block">Stok wajib diisi (isi 0 jika habis).</span>
                        </div>
                        <div>
                            <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Status Ketersediaan</label>
                            <div :class="['w-full px-3 py-2 text-[14px] rounded-lg border border-[#D4E4F4] font-medium flex items-center gap-2 cursor-not-allowed transition-colors', form.is_active ? 'bg-green-50 text-[#2A7A4B] border-green-200' : 'bg-red-50 text-[#B83B2A] border-red-200']">
                                <span :class="['w-2 h-2 rounded-full', form.is_active ? 'bg-[#2A7A4B]' : 'bg-[#B83B2A]']"></span>
                                {{ form.is_active ? 'Tersedia' : 'Habis' }}
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 p-4 bg-[#F0F4F8] rounded-lg border border-[#D4E4F4]">
                        <div>
                            <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Harga Modal (Rp)</label>
                            <input type="text" v-model="form.cost_price" @input="formatInputNumber('cost_price')" placeholder="10.000" 
                                :class="['w-full px-3 py-2 text-[14px] font-[\'JetBrains_Mono\'] rounded-lg border focus:outline-none transition-colors text-[#1A2332] placeholder-[#8AAFCC]', formErrors.cost_price ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white']" />
                            <span v-if="formErrors.cost_price" class="text-[#B83B2A] text-[11px] mt-1 block">Modal wajib diisi.</span>
                        </div>
                        <div>
                            <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Harga Jual (Rp)</label>
                            <input type="text" v-model="form.price" @input="formatInputNumber('price')" placeholder="15.000" 
                                :class="['w-full px-3 py-2 text-[14px] font-[\'JetBrains_Mono\'] font-semibold rounded-lg border focus:outline-none transition-colors text-[#1B4F8A] placeholder-[#8AAFCC]', formErrors.price ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white']" />
                            <span v-if="formErrors.price" class="text-[#B83B2A] text-[11px] mt-1 block">Harga jual kosong/kurang dari modal.</span>
                        </div>
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
import { ref, reactive, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import AdminLayout from '../components/adminlayout.vue';

// ================= STATE =================
const currentUserOutletId = ref(null);
const products = ref([]);
const categories = ref([]);
const stations = ref([]); 
const isLoadingData = ref(true);
const isSubmitting = ref(false);
const isSubmittingCrud = ref(false); 

const searchQuery = ref('');
const filterCategory = ref('');
const filterStation = ref('');

const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedProductId = ref(null);
const imagePreview = ref(null);

const viewModal = reactive({ show: false, data: {} }); 
const crudModals = reactive({ category: false, station: false });
// Tambahan 'type' pada deleteModal untuk membedakan target hapus (product/category/station)
const deleteModal = reactive({ show: false, id: null, name: '', type: '', isDeleting: false });

const newCategoryName = ref('');
const newStationName = ref('');

const alert = reactive({ show: false, message: '', type: 'success' });
const modalAlert = reactive({ show: false, message: '' });

const form = reactive({
    name: '', category_id: '', station_id: '', cost_price: '', price: '', stock: '0', description: '', is_active: false, image: null
});
const formErrors = reactive({ name: false, category_id: false, cost_price: false, price: false, stock: false });
const crudErrors = reactive({ categoryName: false, stationName: false });

// ================= WATCHER & COMPUTED =================
watch(() => form.stock, (newVal) => {
    // Menghapus titik sebelum konversi ke Integer
    const stockNum = parseInt(newVal.toString().replace(/\./g, '')) || 0;
    form.is_active = stockNum > 0;
});
watch([searchQuery, filterCategory, filterStation], () => { currentPage.value = 1; });

const calculatedMargin = computed(() => {
    const jual = parseInt(form.price.toString().replace(/\./g, '')) || 0;
    const modal = parseInt(form.cost_price.toString().replace(/\./g, '')) || 0;
    return Math.max(0, jual - modal);
});

// ================= FUNGSI UX (FORMAT ANGKA) =================
const formatRupiah = (angka) => new Intl.NumberFormat('id-ID').format(angka || 0);

// Fungsi untuk format ribuan secara realtime di form input
const formatInputNumber = (field) => {
    // 1. Ambil nilai asli dan hapus semua karakter selain angka
    let rawValue = form[field].toString().replace(/[^0-9]/g, '');
    
    // 2. Jika kosong, biarkan kosong
    if (!rawValue) {
        form[field] = '';
    } else {
        // 3. Format menggunakan locale id-ID (otomatis nambahin titik)
        form[field] = new Intl.NumberFormat('id-ID').format(rawValue);
    }
    
    // Matikan warning merah kalau user udah ngetik angka
    formErrors[field] = false;
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.image = file;
        imagePreview.value = URL.createObjectURL(file);
    }
};

const validateForm = () => {
    formErrors.name = !form.name.trim();
    formErrors.category_id = !form.category_id;
    formErrors.cost_price = form.cost_price === '';
    formErrors.stock = form.stock === '';

    const jual = parseInt(form.price.toString().replace(/\./g, '')) || 0;
    const modal = parseInt(form.cost_price.toString().replace(/\./g, '')) || 0;
    formErrors.price = !form.price || jual < modal;

    return !formErrors.name && !formErrors.category_id && !formErrors.cost_price && !formErrors.stock && !formErrors.price;
};

// ================= PAGINATION & FILTER =================
const currentPage = ref(1);
const itemsPerPage = ref(5); 

const sortedAndFilteredProducts = computed(() => {
    let filtered = Array.isArray(products.value) ? [...products.value] : [];
    
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        filtered = filtered.filter(p => p?.name?.toLowerCase().includes(q));
    }
    if (filterCategory.value !== '') {
        filtered = filtered.filter(p => p.category_id === filterCategory.value);
    }
    if (filterStation.value !== '') {
        filtered = filtered.filter(p => p.station_id === filterStation.value);
    }

    return filtered.sort((a, b) => {
        if (a.is_active === b.is_active) return 0;
        return a.is_active ? -1 : 1; 
    });
});

const totalPages = computed(() => Math.ceil(sortedAndFilteredProducts.value.length / itemsPerPage.value));
const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return sortedAndFilteredProducts.value.slice(start, start + itemsPerPage.value);
});

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };

// ================= API CALLS (PRODUK) =================
const fetchProducts = async () => {
    isLoadingData.value = true;
    try {
        const token = localStorage.getItem('auth_token');
        const res = await axios.get('https://api.etres.my.id/api/v1/products?limit=1000', { headers: { Authorization: `Bearer ${token}` } });
        
        if (Array.isArray(res.data.data)) products.value = res.data.data;
        else if (Array.isArray(res.data)) products.value = res.data;
        else if (res.data && Array.isArray(res.data.data?.data)) products.value = res.data.data.data;
        else products.value = [];
        
    } catch (error) { 
        showAlert('Gagal mengambil data menu.', 'error'); 
        products.value = [];
    } finally { 
        isLoadingData.value = false; 
    }
};

const submitForm = async () => {
    if (!validateForm()) return;
    isSubmitting.value = true;
    try {
        const token = localStorage.getItem('auth_token');
        const formData = new FormData();
        
        // Menghapus format titik sebelum di-push ke Backend (API butuh integer murni)
        const rawCostPrice = form.cost_price.toString().replace(/\./g, '');
        const rawPrice = form.price.toString().replace(/\./g, '');
        const rawStock = form.stock.toString().replace(/\./g, '');

        formData.append('name', form.name);
        formData.append('category_id', form.category_id);
        if (form.station_id) formData.append('station_id', form.station_id);
        formData.append('cost_price', rawCostPrice || 0);
        formData.append('price', rawPrice);
        formData.append('stock', rawStock || 0); 
        formData.append('description', form.description || '');
        formData.append('is_active', form.is_active ? 1 : 0);
        
        if (form.image instanceof File) {
            const ext = form.image.name.split('.').pop();
            const safeName = form.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            formData.append('image', form.image, `${safeName}-${Math.floor(100000+Math.random()*900000)}.${ext}`);
        }

        let endpoint = 'https://api.etres.my.id/api/v1/products';
        if (isEditMode.value) {
            endpoint += `/${selectedProductId.value}`;
            formData.append('_method', 'PUT');
        }

        await axios.post(endpoint, formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
        showAlert(isEditMode.value ? 'Menu berhasil diperbarui!' : 'Menu baru ditambahkan!', 'success');
        closeModal();
        await fetchProducts(); 
    } catch (error) {
        modalAlert.message = error.response?.data?.message || 'Terjadi kesalahan.';
        modalAlert.show = true;
    } finally {
        isSubmitting.value = false;
    }
};

// ================= GLOBAL DELETE MODAL =================
const confirmDelete = (item, type = 'product') => { 
    deleteModal.id = item.id; 
    deleteModal.name = item.name; 
    deleteModal.type = type; // Menandai target API
    deleteModal.show = true; 
};
const closeDeleteModal = () => { 
    deleteModal.show = false; 
    deleteModal.id = null; 
    deleteModal.name = ''; 
    deleteModal.type = '';
    deleteModal.isDeleting = false; 
};

// Fungsi dinamis untuk menghapus produk, kategori, atau station via Modal Custom
const executeDelete = async () => {
    deleteModal.isDeleting = true;
    try {
        const token = localStorage.getItem('auth_token');
        const baseUrl = 'https://api.etres.my.id/api/v1';

        if (deleteModal.type === 'product') {
            await axios.delete(`${baseUrl}/products/${deleteModal.id}`, { headers: { Authorization: `Bearer ${token}` } });
            showAlert('Menu berhasil dihapus!', 'success');
            if (paginatedProducts.value.length === 1 && currentPage.value > 1) currentPage.value--;
            await fetchProducts();
        } 
        else if (deleteModal.type === 'category') {
            await axios.delete(`${baseUrl}/categories/${deleteModal.id}`, { headers: { Authorization: `Bearer ${token}` } });
            await fetchCategories();
        } 
        else if (deleteModal.type === 'station') {
            await axios.delete(`${baseUrl}/stations/${deleteModal.id}`, { headers: { Authorization: `Bearer ${token}` } });
            await fetchStations();
        }

        closeDeleteModal();
    } catch (error) { 
        showAlert(`Gagal menghapus data.`, 'error'); 
        deleteModal.isDeleting = false; 
    }
};

// ================= API CALLS (KATEGORI & STATION) =================
const fetchCategories = async () => {
    try {
        const token = localStorage.getItem('auth_token');
        const res = await axios.get('https://api.etres.my.id/api/v1/categories?limit=1000', { headers: { Authorization: `Bearer ${token}` } });
        
        if (Array.isArray(res.data.data)) categories.value = res.data.data;
        else if (Array.isArray(res.data)) categories.value = res.data;
        else if (res.data && Array.isArray(res.data.data?.data)) categories.value = res.data.data.data;
        else categories.value = [];
        
    } catch (error) { console.error('Kategori gagal dimuat', error); categories.value = []; }
};

const openCategoryModal = () => { crudErrors.categoryName = false; newCategoryName.value = ''; crudModals.category = true; };
const addCategory = async () => {
    if (!newCategoryName.value.trim()) { crudErrors.categoryName = true; return; }
    isSubmittingCrud.value = true;
    try {
        await axios.post('https://api.etres.my.id/api/v1/categories', { name: newCategoryName.value, outlet_id: currentUserOutletId.value }, { headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` } });
        newCategoryName.value = ''; await fetchCategories();
    } catch (e) { alert('Gagal menambah kategori.'); } finally { isSubmittingCrud.value = false; }
};

const fetchStations = async () => {
    try {
        const token = localStorage.getItem('auth_token');
        const res = await axios.get('https://api.etres.my.id/api/v1/stations?limit=1000', { headers: { Authorization: `Bearer ${token}` } });
        
        if (Array.isArray(res.data.data)) stations.value = res.data.data;
        else if (Array.isArray(res.data)) stations.value = res.data;
        else if (res.data && Array.isArray(res.data.data?.data)) stations.value = res.data.data.data;
        else stations.value = [];
        
    } catch (error) { console.error('Gagal memuat station'); stations.value = []; }
};

const openStationModal = () => { crudErrors.stationName = false; newStationName.value = ''; crudModals.station = true; };
const addStation = async () => {
    if (!newStationName.value.trim()) { crudErrors.stationName = true; return; }
    isSubmittingCrud.value = true;
    try {
        await axios.post('https://api.etres.my.id/api/v1/stations', { name: newStationName.value }, { headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` } });
        newStationName.value = ''; await fetchStations();
    } catch (e) { alert('Gagal menambah station.'); } finally { isSubmittingCrud.value = false; }
};

// ================= MODAL UTILS (PRODUK) =================
const openViewModal = (item) => { viewModal.data = item; viewModal.show = true; };
const showAlert = (msg, type) => { alert.message = msg; alert.type = type; alert.show = true; setTimeout(() => alert.show = false, 4000); };
const openModal = (item = null) => {
    formErrors.name = false; formErrors.category_id = false; formErrors.cost_price = false; formErrors.price = false; formErrors.stock = false; modalAlert.show = false;
    
    if (item) {
        isEditMode.value = true; selectedProductId.value = item.id;
        form.name = item.name; 
        form.category_id = item.category_id; 
        form.station_id = item.station_id || '';
        form.description = item.description; 
        form.is_active = item.is_active === 1 || item.is_active === true;
        
        // Memasukkan angka yang sudah berformat titik ke dalam form modal
        form.cost_price = item.cost_price ? new Intl.NumberFormat('id-ID').format(item.cost_price) : '0'; 
        form.price = item.price ? new Intl.NumberFormat('id-ID').format(item.price) : '0'; 
        form.stock = item.stock ? new Intl.NumberFormat('id-ID').format(item.stock) : '0';
        
        imagePreview.value = item.image ? `https://api.etres.my.id/storage/${item.image}` : null; form.image = null;
    } else {
        isEditMode.value = false; selectedProductId.value = null;
        form.name = ''; form.category_id = ''; form.station_id = '';
        form.cost_price = ''; form.price = ''; form.stock = ''; form.description = ''; form.is_active = false;
        form.image = null; imagePreview.value = null;
    }
    isModalOpen.value = true;
};
const closeModal = () => { isModalOpen.value = false; };

onMounted(async () => {
    try {
        const response = await axios.get('https://api.etres.my.id/api/v1/me', { headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` } });
        currentUserOutletId.value = response.data.user.outlet_id || (response.data.user.outlet?.id);
    } catch (e) {}
    
    await fetchCategories(); 
    await fetchStations(); 
    await fetchProducts();
});
</script>