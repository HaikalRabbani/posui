<template>
    <AdminLayout>
        <div class="space-y-6">
            
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
                                type="text" v-model="searchQuery" placeholder="Cari nama menu..." 
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
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Info Menu</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Kategori</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Station</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Harga Modal</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Harga Jual</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Margin</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Stok</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Status</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="isLoadingData" class="border-b border-[#EBF3FB]">
                                <td colspan="9" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Memuat data...</td>
                            </tr>
                            <tr v-else-if="paginatedProducts.length === 0" class="border-b border-[#EBF3FB]">
                                <td colspan="9" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Tidak ada data menu ditemukan.</td>
                            </tr>
                            <tr v-else v-for="item in paginatedProducts" :key="item.id" class="border-b border-[#EBF3FB] hover:bg-[#F7FAFD] transition-colors">
                                <td class="px-5 py-3">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded bg-[#D4E4F4] overflow-hidden flex-shrink-0">
                                            <img v-if="item.image" :src="`https://api.etres.my.id/storage/${item.image}`" class="w-full h-full object-cover" />
                                            <svg v-else class="w-full h-full text-[#8AAFCC] p-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        </div>
                                        <div>
                                            <p class="text-[14px] text-[#1A2332] font-semibold">{{ item.name }}</p>
                                            <p class="text-[11px] text-[#5A7A9A] truncate max-w-[120px]">{{ item.description || '-' }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-5 py-3">
                                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0F4F8] border border-[#D4E4F4] text-[12px] font-medium text-[#5A7A9A] whitespace-nowrap">
                                        <span class="w-1.5 h-1.5 rounded-full bg-[#8AAFCC]"></span>
                                        {{ item.category?.name || 'Tanpa Kategori' }}
                                    </span>
                                </td>
                                <td class="px-5 py-3">
                                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-100 text-[12px] font-medium text-orange-700 whitespace-nowrap">
                                        <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                        {{ item.station?.name || 'Belum Diatur' }}
                                    </span>
                                </td>
                                <td class="px-5 py-3 text-[13px] text-[#5A7A9A] font-medium font-['JetBrains_Mono'] whitespace-nowrap">Rp {{ formatRupiah(item.cost_price || 0) }}</td>
                                <td class="px-5 py-3 text-[14px] text-[#1B4F8A] font-bold font-['JetBrains_Mono'] whitespace-nowrap">Rp {{ formatRupiah(item.price || 0) }}</td>
                                <td class="px-5 py-3 whitespace-nowrap">
                                    <span class="text-[13px] font-semibold text-[#2A7A4B] font-['JetBrains_Mono'] bg-green-50 px-2 py-1 rounded border border-green-100">
                                        +Rp {{ formatRupiah((item.price || 0) - (item.cost_price || 0)) }}
                                    </span>
                                </td>
                                <td class="px-5 py-3 text-[13px] text-[#1A2332] font-semibold font-['JetBrains_Mono']">{{ item.stock || 0 }}</td>
                                <td class="px-5 py-3 whitespace-nowrap">
                                    <span :class="[ 
                                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold border',
                                        item.is_active ? 'bg-green-50 text-[#2A7A4B] border-green-200' : 'bg-red-50 text-[#B83B2A] border-red-200'
                                    ]">
                                        <span :class="['w-1.5 h-1.5 rounded-full', item.is_active ? 'bg-[#2A7A4B]' : 'bg-[#B83B2A]']"></span>
                                        {{ item.is_active ? 'Tersedia' : 'Habis' }}
                                    </span>
                                </td>
                                <td class="px-5 py-3 text-right whitespace-nowrap">
                                    <button @click="openModal(item)" class="text-[#2E7DD6] hover:text-[#1B4F8A] p-1 transition-colors mr-2" title="Edit Menu">
                                        <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button @click="confirmDelete(item)" class="text-[#B83B2A] hover:text-red-800 p-1 transition-colors" title="Hapus Menu">
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
                    
                    <div v-if="crudAlert.category" class="p-3 mb-4 rounded-lg border bg-red-50 border-[#B83B2A] text-[#B83B2A] text-[13px] font-medium flex items-center gap-2">
                        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{{ crudAlert.categoryMsg }}</span>
                    </div>

                    <form @submit.prevent="addCategory" class="flex gap-2 mb-6">
                        <input type="text" v-model="newCategoryName" required placeholder="Nama kategori baru..." class="flex-1 px-3 py-2 text-[14px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332]" />
                        <button type="submit" :disabled="isSubmittingCrud" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:bg-[#8AAFCC] text-white text-[13px] font-semibold rounded-lg transition-colors">Tambah</button>
                    </form>
                    <h4 class="text-[12px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-2">Daftar Kategori</h4>
                    <ul class="border border-[#D4E4F4] rounded-lg divide-y divide-[#D4E4F4]">
                        <li v-if="categories.length === 0" class="p-4 text-center text-[13px] text-[#8AAFCC]">Belum ada kategori.</li>
                        <li v-else v-for="cat in categories" :key="cat.id" class="p-3 flex items-center justify-between hover:bg-[#F7FAFD]">
                            <span class="text-[14px] text-[#1A2332] font-medium">{{ cat.name }}</span>
                            <button @click="deleteCategory(cat.id)" class="text-[#B83B2A] hover:bg-red-50 p-1.5 rounded transition-colors" title="Hapus">
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
                    
                    <div v-if="crudAlert.station" class="p-3 mb-4 rounded-lg border bg-red-50 border-[#B83B2A] text-[#B83B2A] text-[13px] font-medium flex items-center gap-2">
                        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{{ crudAlert.stationMsg }}</span>
                    </div>

                    <form @submit.prevent="addStation" class="flex gap-2 mb-6">
                        <input type="text" v-model="newStationName" required placeholder="Nama station (misal: Dapur Utama)" class="flex-1 px-3 py-2 text-[14px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332]" />
                        <button type="submit" :disabled="isSubmittingCrud" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:bg-[#8AAFCC] text-white text-[13px] font-semibold rounded-lg transition-colors">Tambah</button>
                    </form>
                    <h4 class="text-[12px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-2">Daftar Station</h4>
                    <ul class="border border-[#D4E4F4] rounded-lg divide-y divide-[#D4E4F4]">
                        <li v-if="stations.length === 0" class="p-4 text-center text-[13px] text-[#8AAFCC]">Belum ada station.</li>
                        <li v-else v-for="st in stations" :key="st.id" class="p-3 flex items-center justify-between hover:bg-[#F7FAFD]">
                            <span class="text-[14px] text-[#1A2332] font-medium">{{ st.name }}</span>
                            <button @click="deleteStation(st.id)" class="text-[#B83B2A] hover:bg-red-50 p-1.5 rounded transition-colors" title="Hapus">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4">
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
                        <input 
                            type="text" v-model="form.name" @input="formErrors.name = false" required maxlength="100" placeholder="Contoh: Nasi Goreng Spesial" 
                            :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332] placeholder-[#8AAFCC]', formErrors.name ? 'border-[#B83B2A] focus:border-[#B83B2A] bg-red-50' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white']" 
                        />
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Kategori</label>
                            <select v-model="form.category_id" required class="w-full px-3 py-2 text-[14px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] bg-white">
                                <option value="" disabled>Pilih Kategori</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                            </select>
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
                            <input 
                                type="text" v-model="form.stock" @input="enforceNumeric('stock')" required placeholder="0" 
                                class="w-full px-3 py-2 text-[14px] font-['JetBrains_Mono'] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC] bg-white" 
                            />
                        </div>
                        <div>
                            <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Status Ketersediaan (Otomatis)</label>
                            <div :class="[ 
                                'w-full px-3 py-2 text-[14px] rounded-lg border border-[#D4E4F4] font-medium flex items-center gap-2 cursor-not-allowed transition-colors',
                                form.is_active ? 'bg-green-50 text-[#2A7A4B] border-green-200' : 'bg-red-50 text-[#B83B2A] border-red-200'
                            ]">
                                <span :class="['w-2 h-2 rounded-full', form.is_active ? 'bg-[#2A7A4B]' : 'bg-[#B83B2A]']"></span>
                                {{ form.is_active ? 'Tersedia (Stok > 0)' : 'Habis (Stok Kosong)' }}
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 p-4 bg-[#F0F4F8] rounded-lg border border-[#D4E4F4]">
                        <div>
                            <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Harga Modal (Rp)</label>
                            <input 
                                type="text" v-model="form.cost_price" @input="enforceNumeric('cost_price')" required placeholder="10000" 
                                class="w-full px-3 py-2 text-[14px] font-['JetBrains_Mono'] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC] bg-white" 
                            />
                        </div>
                        <div>
                            <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Harga Jual (Rp)</label>
                            <input 
                                type="text" v-model="form.price" @input="enforceNumeric('price')" required placeholder="15000" 
                                :class="['w-full px-3 py-2 text-[14px] font-[\'JetBrains_Mono\'] font-semibold rounded-lg border focus:outline-none transition-colors text-[#1B4F8A] placeholder-[#8AAFCC] bg-white', formErrors.price ? 'border-[#B83B2A] focus:border-[#B83B2A] bg-red-50' : 'border-[#D4E4F4] focus:border-[#2E7DD6]']" 
                            />
                        </div>
                        <div class="col-span-2 pt-2 border-t border-[#D4E4F4] flex items-center justify-between">
                            <span class="text-[13px] font-medium text-[#5A7A9A]">Margin Keuntungan:</span>
                            <span class="text-[14px] font-bold text-[#2A7A4B] font-['JetBrains_Mono']">
                                +Rp {{ formatRupiah(calculatedMargin) }}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Deskripsi (Opsional)</label>
                        <textarea v-model="form.description" rows="2" placeholder="Detail atau komposisi makanan..." class="w-full px-3 py-2 text-[14px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC]"></textarea>
                    </div>

                    <div>
                        <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Foto Menu (Opsional)</label>
                        <div class="flex items-center gap-4">
                            <div v-if="imagePreview" class="w-14 h-14 rounded-lg bg-[#D4E4F4] overflow-hidden flex-shrink-0 border border-[#D4E4F4]">
                                <img :src="imagePreview" class="w-full h-full object-cover" />
                            </div>
                            <div v-else class="w-14 h-14 rounded-lg bg-[#F0F4F8] flex items-center justify-center border border-dashed border-[#8AAFCC] flex-shrink-0">
                                <svg class="w-5 h-5 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
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

        <div v-if="deleteModal.show" class="fixed inset-0 z-[60] flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden border border-[#D4E4F4] text-center p-6">
                <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 border border-red-100">
                    <svg class="w-6 h-6 text-[#B83B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 class="text-[18px] font-bold text-[#1A2332] mb-2">Hapus Menu?</h3>
                <p class="text-[14px] text-[#5A7A9A] mb-6">
                    Yakin ingin menghapus menu <span class="font-semibold text-[#1A2332]">"{{ deleteModal.name }}"</span>? Data tidak dapat dikembalikan.
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

// ================= STATE UTAMA =================
const currentUserOutletId = ref(null);
const products = ref([]);
const categories = ref([]);
const stations = ref([]); 
const isLoadingData = ref(true);
const isSubmitting = ref(false);
const isSubmittingCrud = ref(false); 

// Filter State
const searchQuery = ref('');
const filterCategory = ref('');
const filterStation = ref('');

// State Modals
const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedProductId = ref(null);
const imagePreview = ref(null);

const crudModals = reactive({ category: false, station: false });
const crudAlert = reactive({ category: false, categoryMsg: '', station: false, stationMsg: '' });
const deleteModal = reactive({ show: false, id: null, name: '', isDeleting: false });

const newCategoryName = ref('');
const newStationName = ref('');

const alert = reactive({ show: false, message: '', type: 'success' });
const modalAlert = reactive({ show: false, message: '' });

const form = reactive({
    name: '', category_id: '', station_id: '', cost_price: '', price: '', stock: '0', description: '', is_active: false, image: null
});
const formErrors = reactive({ name: false, price: false });

// ================= WATCHER & COMPUTED =================
watch(() => form.stock, (newVal) => {
    const stockNum = parseInt(newVal) || 0;
    form.is_active = stockNum > 0;
});

// Reset page pagination ketika ada perubahan filter atau search
watch([searchQuery, filterCategory, filterStation], () => { 
    currentPage.value = 1; 
});

const calculatedMargin = computed(() => {
    const jual = parseInt(form.price) || 0;
    const modal = parseInt(form.cost_price) || 0;
    return Math.max(0, jual - modal);
});

// ================= FUNGSI UX =================
const formatRupiah = (angka) => new Intl.NumberFormat('id-ID').format(angka || 0);

const enforceNumeric = (field) => {
    form[field] = form[field].toString().replace(/[^0-9]/g, '');
    if (field === 'price') formErrors.price = false; 
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
    const jual = parseInt(form.price) || 0;
    const modal = parseInt(form.cost_price) || 0;
    formErrors.price = !form.price || jual < modal;
    return !formErrors.name && !formErrors.price;
};

// ================= PAGINATION & FILTER =================
const currentPage = ref(1);
const itemsPerPage = ref(5); 

const sortedAndFilteredProducts = computed(() => {
    let filtered = products.value;

    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
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


// ================= API CALLS: UTAMA (MENU) =================
const fetchProducts = async () => {
    isLoadingData.value = true;
    try {
        const token = localStorage.getItem('auth_token');
        const res = await axios.get('https://api.etres.my.id/api/v1/products?limit=1000', { 
            headers: { Authorization: `Bearer ${token}` } 
        });
        products.value = res.data.data || [];
    } catch (error) {
        showAlert('Gagal mengambil data menu.', 'error');
    } finally {
        isLoadingData.value = false;
    }
};

const submitForm = async () => {
    modalAlert.show = false;
    if (!validateForm()) {
        modalAlert.message = 'Harap perbaiki kolom yang merah. Harga jual tidak boleh lebih kecil dari modal.';
        modalAlert.show = true;
        return;
    }

    isSubmitting.value = true;
    try {
        const token = localStorage.getItem('auth_token');
        const formData = new FormData();
        
        formData.append('name', form.name);
        formData.append('category_id', form.category_id);
        if (form.station_id) formData.append('station_id', form.station_id);
        formData.append('cost_price', form.cost_price || 0);
        formData.append('price', form.price);
        formData.append('stock', form.stock || 0); 
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

        await axios.post(endpoint, formData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        
        showAlert(isEditMode.value ? 'Menu berhasil diperbarui!' : 'Menu baru ditambahkan!', 'success');
        closeModal();
        await fetchProducts(); 
    } catch (error) {
        modalAlert.message = error.response?.data?.message || 'Terjadi kesalahan. Gagal menyimpan data.';
        modalAlert.show = true;
    } finally {
        isSubmitting.value = false;
    }
};

const confirmDelete = (item) => {
    deleteModal.id = item.id; deleteModal.name = item.name; deleteModal.show = true;
};
const closeDeleteModal = () => {
    deleteModal.show = false; deleteModal.id = null; deleteModal.name = ''; deleteModal.isDeleting = false;
};
const executeDelete = async () => {
    deleteModal.isDeleting = true;
    try {
        const token = localStorage.getItem('auth_token');
        await axios.delete(`https://api.etres.my.id/api/v1/products/${deleteModal.id}`, { headers: { Authorization: `Bearer ${token}` } });
        showAlert('Menu berhasil dihapus!', 'success');
        if (paginatedProducts.value.length === 1 && currentPage.value > 1) currentPage.value--;
        await fetchProducts();
        closeDeleteModal();
    } catch (error) {
        showAlert('Gagal menghapus menu.', 'error');
        deleteModal.isDeleting = false;
    }
};

// ================= API CALLS: KATEGORI =================
const openCategoryModal = () => { 
    crudAlert.category = false;
    crudModals.category = true; 
};
const fetchCategories = async () => {
    try {
        const token = localStorage.getItem('auth_token');
        const res = await axios.get('https://api.etres.my.id/api/v1/categories?limit=1000', { headers: { Authorization: `Bearer ${token}` } });
        categories.value = res.data.data || res.data;
    } catch (error) { console.error('Kategori gagal dimuat', error); }
};
const addCategory = async () => {
    if (!newCategoryName.value) return;
    isSubmittingCrud.value = true;
    crudAlert.category = false;
    try {
        const token = localStorage.getItem('auth_token');
        await axios.post('https://api.etres.my.id/api/v1/categories', { 
            name: newCategoryName.value
        }, { headers: { Authorization: `Bearer ${token}` } });
        
        newCategoryName.value = '';
        await fetchCategories();
    } catch (e) { 
        crudAlert.categoryMsg = e.response?.data?.message || 'Gagal menambah kategori (Pastikan Model Category backend sudah update)';
        crudAlert.category = true;
    } finally { 
        isSubmittingCrud.value = false; 
    }
};
const deleteCategory = async (id) => {
    if(!confirm('Hapus kategori ini?')) return;
    crudAlert.category = false;
    try {
        const token = localStorage.getItem('auth_token');
        await axios.delete(`https://api.etres.my.id/api/v1/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        await fetchCategories();
    } catch (e) { 
        crudAlert.categoryMsg = e.response?.data?.message || 'Gagal menghapus kategori.';
        crudAlert.category = true;
    }
};

// ================= API CALLS: STATION =================
const openStationModal = () => { 
    crudAlert.station = false;
    crudModals.station = true; 
};
const fetchStations = async () => {
    try {
        const token = localStorage.getItem('auth_token');
        const res = await axios.get('https://api.etres.my.id/api/v1/stations?limit=1000', { headers: { Authorization: `Bearer ${token}` } });
        stations.value = res.data.data || res.data;
    } catch (error) {
        console.error('Gagal memuat station.');
    }
};
const addStation = async () => {
    if (!newStationName.value) return;
    isSubmittingCrud.value = true;
    crudAlert.station = false;
    try {
        const token = localStorage.getItem('auth_token');
        await axios.post('https://api.etres.my.id/api/v1/stations', { name: newStationName.value }, { headers: { Authorization: `Bearer ${token}` } });
        newStationName.value = '';
        await fetchStations();
    } catch (e) { 
        crudAlert.stationMsg = e.response?.data?.message || 'Gagal menambah station.';
        crudAlert.station = true;
    } finally { 
        isSubmittingCrud.value = false; 
    }
};
const deleteStation = async (id) => {
    if(!confirm('Hapus station ini?')) return;
    crudAlert.station = false;
    try {
        const token = localStorage.getItem('auth_token');
        await axios.delete(`https://api.etres.my.id/api/v1/stations/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        await fetchStations();
    } catch (e) { 
        crudAlert.stationMsg = e.response?.data?.message || 'Gagal menghapus station.';
        crudAlert.station = true;
    }
};

// ================= UTILS =================
const showAlert = (msg, type) => { alert.message = msg; alert.type = type; alert.show = true; setTimeout(() => alert.show = false, 4000); };
const openModal = (item = null) => {
    formErrors.name = false; formErrors.price = false; modalAlert.show = false;
    if (item) {
        isEditMode.value = true; selectedProductId.value = item.id;
        form.name = item.name; form.category_id = item.category_id; form.station_id = item.station_id || '';
        form.cost_price = item.cost_price || ''; form.price = item.price; form.stock = item.stock || '0';
        form.description = item.description; form.is_active = item.is_active === 1 || item.is_active === true;
        form.image = null; imagePreview.value = item.image ? `https://api.etres.my.id/storage/${item.image}` : null;
    } else {
        isEditMode.value = false; selectedProductId.value = null;
        form.name = ''; form.category_id = categories.value.length > 0 ? categories.value[0].id : ''; form.station_id = '';
        form.cost_price = ''; form.price = ''; form.stock = '0'; form.description = ''; form.is_active = false;
        form.image = null; imagePreview.value = null;
    }
    isModalOpen.value = true;
};
const closeModal = () => { isModalOpen.value = false; };

onMounted(async () => {
    await fetchCategories();
    await fetchStations();
    await fetchProducts();
});
</script>