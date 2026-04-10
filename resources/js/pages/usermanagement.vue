<template>
    <AdminLayout>
        <div class="space-y-6 font-['Poppins'] pb-10">
            
            <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-[#D4E4F4] pb-4">

                <div class="flex flex-wrap items-center gap-3">
                    <div class="relative w-full sm:w-64">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input type="text" v-model="searchQuery" placeholder="Cari nama atau email..." class="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC] transition-colors">
                    </div>



                    <div class="w-px h-8 bg-[#D4E4F4] hidden sm:block"></div>

                    <button @click="openModal()" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] text-white text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                        {{ currentUserRole === 'developer' ? 'Tambah Manager' : 'Tambah User' }}
                    </button>
                </div>
            </div>

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
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-[#D4E4F4] bg-[#F7FAFD]">
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Nama & Email</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Role</th>
                                <th v-if="currentUserRole !== 'developer'" class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Outlet (Penempatan)</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#EBF3FB]">
                            <tr v-if="isLoading" class="border-b border-[#EBF3FB]">
                                <td colspan="4" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium animate-pulse">Memuat data user...</td>
                            </tr>
                            <tr v-else-if="filteredUsers.length === 0" class="border-b border-[#EBF3FB]">
                                <td colspan="4" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Tidak ada data ditemukan.</td>
                            </tr>
                            <tr v-else v-for="user in paginatedUsers" :key="user.id" class="hover:bg-[#F7FAFD] transition-colors">
                                <td class="px-5 py-3">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-full bg-[#EBF3FB] text-[#1B4F8A] border border-[#D4E4F4] flex items-center justify-center font-bold text-[12px] flex-shrink-0">
                                            {{ user.name.charAt(0).toUpperCase() }}
                                        </div>
                                        <div>
                                            <p class="text-[13px] font-semibold text-[#1A2332]">{{ user.name }}</p>
                                            <p class="text-[11px] text-[#5A7A9A]">{{ user.email }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-5 py-3">
                                    <span :class="[
                                        'px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase tracking-wider',
                                        user.role === 'developer' ? 'bg-purple-50 text-purple-700 border-purple-200' : '',
                                        user.role === 'manager' ? 'bg-blue-50 text-[#1B4F8A] border-blue-200' : '',
                                        user.role === 'karyawan' ? 'bg-green-50 text-[#2A7A4B] border-green-200' : ''
                                    ]">
                                        {{ user.role }}
                                    </span>
                                </td>
                                <td v-if="currentUserRole !== 'developer'" class="px-5 py-3 text-[13px] text-[#5A7A9A] font-medium">
                                    {{ getOutletName(user) }}
                                </td>
                                <td class="px-5 py-3 text-right whitespace-nowrap">
                                    
                                    <button v-if="currentUserRole === 'developer' && user.role === 'manager'" @click="openKaryawanListModal(user)" class="text-[#2A7A4B] hover:text-green-800 p-1.5 transition-colors mr-2 bg-green-50 hover:bg-green-100 rounded-lg inline-flex items-center gap-1.5 text-[11px] font-bold px-2" title="Kelola Karyawan Manager Ini">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                        Lihat Karyawan
                                    </button>
                                    
                                    <button @click="openModal(user)" class="text-[#2E7DD6] hover:text-[#1B4F8A] p-1.5 transition-colors bg-[#EBF3FB] hover:bg-[#D4E4F4] rounded-lg mr-1" title="Edit User">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button @click="confirmDelete(user, 'main')" class="text-[#B83B2A] hover:text-red-800 p-1.5 transition-colors bg-red-50 hover:bg-red-100 rounded-lg" title="Hapus User">
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
                        <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1.5 border border-[#D4E4F4] text-[13px] rounded-lg text-[#1A2332] disabled:opacity-50 hover:bg-[#F0F4F8] transition-colors">Prev</button>
                        <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1.5 border border-[#D4E4F4] text-[13px] rounded-lg text-[#1A2332] disabled:opacity-50 hover:bg-[#F0F4F8] transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-[#D4E4F4] flex flex-col">
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <h3 class="text-[16px] font-semibold text-[#1A2332]">{{ isEditMode ? 'Edit Profil' : (currentUserRole === 'developer' ? 'Tambah Manager Baru' : 'Tambah User Baru') }}</h3>
                    <button @click="closeModal" class="text-[#8AAFCC] hover:text-[#B83B2A] transition-colors focus:outline-none">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form @submit.prevent="submitForm('main')" class="p-6 space-y-4">
                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Nama Lengkap <span class="text-[#B83B2A]">*</span></label>
                        <input type="text" v-model="form.name" required placeholder="Masukkan nama..." class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332]">
                    </div>
                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Email <span class="text-[#B83B2A]">*</span></label>
                        <input type="email" v-model="form.email" required placeholder="email@contoh.com" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332]">
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Role <span class="text-[#B83B2A]">*</span></label>
                            
                            <select v-model="form.role" required class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] bg-white" :disabled="currentUserRole === 'developer'">
                                <option value="manager" v-if="currentUserRole === 'developer' || currentUserRole === 'manager'">Manager / Owner</option>
                                <option value="karyawan" v-if="currentUserRole !== 'developer'">Karyawan / Kasir</option>
                            </select>
                        </div>
                        <div v-if="form.role === 'karyawan'">
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Outlet Penempatan</label>
                            <select v-model="form.outlet_id" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] bg-white">
                                <option value="">Pilih Outlet</option>
                                <option v-for="out in outlets" :key="out.id" :value="out.id">{{ out.name }}</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">{{ isEditMode ? 'Password Baru (Opsional)' : 'Password Default' }} <span v-if="!isEditMode" class="text-[#B83B2A]">*</span></label>
                        <input type="password" v-model="form.password" :required="!isEditMode" placeholder="Minimal 8 karakter" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] font-['JetBrains_Mono']">
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

        <div v-if="karyawanListModal.show" class="fixed inset-0 z-[60] flex items-center justify-center bg-[#1A2332]/60 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden border border-[#D4E4F4] flex flex-col max-h-[90vh] animate-[fadeIn_0.2s_ease-out]">
                
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <div>
                        <h3 class="text-[18px] font-bold text-[#1A2332] flex items-center gap-2">
                            <svg class="w-5 h-5 text-[#2A7A4B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            Daftar Karyawan: {{ karyawanListModal.managerName }}
                        </h3>
                        <p class="text-[12px] text-[#5A7A9A] mt-0.5">Melihat dan mengelola karyawan di bawah wewenang manager ini.</p>
                    </div>
                    <button @click="karyawanListModal.show = false" class="text-[#8AAFCC] hover:text-[#B83B2A] transition-colors p-1.5 border border-[#D4E4F4] rounded bg-white shadow-sm">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div class="px-6 py-3 border-b border-[#D4E4F4] flex justify-between items-center bg-white">
                    <span class="text-[12px] font-semibold text-[#5A7A9A] bg-[#F0F4F8] px-3 py-1 rounded-full">Total: {{ karyawanList.length }} Karyawan</span>
                    <button @click="openModalKaryawan(null)" class="px-3 py-1.5 bg-[#2A7A4B] hover:bg-green-700 text-white text-[12px] font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                        Tambah Karyawan
                    </button>
                </div>

                <div class="overflow-y-auto flex-1 bg-[#F0F4F8] p-4">
                    <div class="bg-white border border-[#D4E4F4] rounded-lg shadow-sm overflow-hidden">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b border-[#D4E4F4] bg-[#F7FAFD]">
                                    <th class="px-4 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Nama & Email</th>
                                    <th class="px-4 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Outlet (Penempatan)</th>
                                    <th class="px-4 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-[#EBF3FB]">
                                <tr v-if="karyawanListModal.isLoading" class="bg-white">
                                    <td colspan="3" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium animate-pulse">Menarik data dari server...</td>
                                </tr>
                                <tr v-else-if="karyawanList.length === 0" class="bg-white">
                                    <td colspan="3" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Manager ini belum memiliki karyawan.</td>
                                </tr>
                                <tr v-else v-for="kar in karyawanList" :key="kar.id" class="bg-white hover:bg-[#F7FAFD]">
                                    <td class="px-4 py-3">
                                        <p class="text-[13px] font-semibold text-[#1A2332]">{{ kar.name }}</p>
                                        <p class="text-[11px] text-[#5A7A9A]">{{ kar.email }}</p>
                                    </td>
                                    <td class="px-4 py-3 text-[12px] text-[#5A7A9A] font-medium">{{ getOutletName(kar) }}</td>
                                    <td class="px-4 py-3 text-right whitespace-nowrap">
                                        <button @click="openModalKaryawan(kar)" class="text-[#2E7DD6] hover:text-[#1B4F8A] p-1.5 transition-colors bg-[#EBF3FB] hover:bg-[#D4E4F4] rounded-lg mr-1" title="Edit">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button @click="confirmDelete(kar, 'karyawan')" class="text-[#B83B2A] hover:text-red-800 p-1.5 transition-colors bg-red-50 hover:bg-red-100 rounded-lg" title="Hapus">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="karyawanFormModal.show" class="fixed inset-0 z-[70] flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-[#D4E4F4] flex flex-col">
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <h3 class="text-[15px] font-semibold text-[#1A2332]">{{ karyawanFormModal.isEdit ? 'Edit Karyawan' : 'Tambah Karyawan Baru' }}</h3>
                </div>
                <form @submit.prevent="submitForm('karyawan')" class="p-6 space-y-4">
                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Nama Lengkap <span class="text-[#B83B2A]">*</span></label>
                        <input type="text" v-model="formKaryawan.name" required class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2A7A4B] text-[#1A2332]">
                    </div>
                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Email <span class="text-[#B83B2A]">*</span></label>
                        <input type="email" v-model="formKaryawan.email" required class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2A7A4B] text-[#1A2332]">
                    </div>
                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Outlet Penempatan</label>
                        <select v-model="formKaryawan.outlet_id" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2A7A4B] text-[#1A2332] bg-white">
                            <option value="">Pilih Outlet</option>
                            <option v-for="out in managerOutlets" :key="out.id" :value="out.id">{{ out.name }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">{{ karyawanFormModal.isEdit ? 'Password Baru (Opsional)' : 'Password Default' }} <span v-if="!karyawanFormModal.isEdit" class="text-[#B83B2A]">*</span></label>
                        <input type="password" v-model="formKaryawan.password" :required="!karyawanFormModal.isEdit" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2A7A4B] text-[#1A2332] font-['JetBrains_Mono']">
                    </div>

                    <div class="pt-4 flex justify-end gap-2 border-t border-[#D4E4F4]">
                        <button type="button" @click="karyawanFormModal.show = false" class="px-4 py-2 text-[12px] font-medium text-[#5A7A9A] hover:bg-[#F0F4F8] rounded-lg transition-colors">Batal</button>
                        <button type="submit" :disabled="isSubmitting" class="px-4 py-2 bg-[#2A7A4B] hover:bg-green-800 disabled:opacity-50 text-white text-[12px] font-semibold rounded-lg transition-colors">
                            {{ isSubmitting ? 'Loading...' : 'Simpan' }}
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
                <h3 class="text-[18px] font-bold text-[#1A2332] mb-2">Hapus Akun?</h3>
                <p class="text-[14px] text-[#5A7A9A] mb-6">Yakin ingin menghapus <span class="font-semibold text-[#1A2332]">"{{ deleteModal.name }}"</span>? Data tidak dapat dikembalikan.</p>
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

// --- STATE GLOBAL ---
const apiBase = 'https://api.etres.my.id/api/v1';
const currentUserRole = ref(localStorage.getItem('user_role') || 'manager');
const users = ref([]);
const outlets = ref([]); 
const isLoading = ref(true);
const isSubmitting = ref(false);

const searchQuery = ref('');
const filterRole = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);

const alert = reactive({ show: false, message: '', type: 'success' });
const showAlert = (msg, type = 'success') => { alert.message = msg; alert.type = type; alert.show = true; setTimeout(() => alert.show = false, 4000); };

// --- STATE MODAL UTAMA ---
const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedUserId = ref(null);
const form = reactive({ name: '', email: '', role: 'karyawan', outlet_id: '', password: '' });

// --- STATE DEVELOPER: LIST KARYAWAN ---
const karyawanListModal = reactive({ show: false, managerId: null, managerName: '', isLoading: false });
const karyawanList = ref([]);
const managerOutlets = ref([]); 
const karyawanFormModal = reactive({ show: false, isEdit: false, id: null });
const formKaryawan = reactive({ name: '', email: '', role: 'karyawan', outlet_id: '', password: '', owner_id: null });

// --- STATE DELETE MODAL ---
const deleteModal = reactive({ show: false, id: null, name: '', type: 'main', isDeleting: false });

// --- HELPER & COMPUTED ---
const getOutletName = (usr) => {
    if (usr.outlet) return usr.outlet.name;
    if (usr.outlet_id) {
        const out = outlets.value.find(o => o.id === usr.outlet_id) || managerOutlets.value.find(o => o.id === usr.outlet_id);
        return out ? out.name : `Outlet #${usr.outlet_id}`;
    }
    return '-';
};

const filteredUsers = computed(() => {
    return users.value.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.value.toLowerCase());
        
        // LOGIKA PENYARINGAN KHUSUS DEVELOPER
        if (currentUserRole.value === 'developer') {
            return matchSearch && u.role === 'manager'; // HANYA Tampilkan Manager di Tabel Utama
        }
        
        // Logika Normal untuk Manager
        const matchRole = filterRole.value === '' || u.role === filterRole.value;
        return matchSearch && matchRole;
    });
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value));
const paginatedUsers = computed(() => filteredUsers.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value));

// --- API CALLS: MAIN ---
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('auth_token')}` });

const fetchData = async () => {
    isLoading.value = true;
    try {
        const [resUsers, resOutlets] = await Promise.all([
            axios.get(`${apiBase}/users`, { headers: authHeaders() }),
            axios.get(`${apiBase}/outlets?limit=1000`, { headers: authHeaders() })
        ]);
        users.value = resUsers.data.data?.data || resUsers.data.data || resUsers.data;
        outlets.value = resOutlets.data.data?.data || resOutlets.data.data || resOutlets.data || [];
    } catch (error) {
        console.error("Gagal menarik data", error);
        showAlert("Gagal memuat data", "error");
    } finally { isLoading.value = false; }
};

const openModal = (user = null) => {
    isEditMode.value = !!user;
    if (user) {
        selectedUserId.value = user.id;
        form.name = user.name; form.email = user.email; form.role = user.role; form.outlet_id = user.outlet_id || ''; form.password = '';
    } else {
        selectedUserId.value = null;
        form.name = ''; form.email = ''; form.outlet_id = ''; form.password = '';
        // Otomatis assign "Manager" kalau Developer yg nge-klik Tambah User
        form.role = currentUserRole.value === 'developer' ? 'manager' : 'karyawan';
    }
    isModalOpen.value = true;
};
const closeModal = () => { isModalOpen.value = false; };

/// --- API CALLS: DEVELOPER VIEW KARYAWAN ---
const fetchManagerKaryawan = async (managerId) => {
    karyawanListModal.isLoading = true;
    try {
        // 1. Ambil data karyawan khusus untuk manager ini menggunakan parameter backend baru
        const response = await axios.get(`${apiBase}/users?manager_id=${managerId}`, { headers: authHeaders() });
        karyawanList.value = response.data.data?.data || response.data.data || response.data || [];

        // 2. Ambil data outlet khusus milik manager ini (untuk pilihan dropdown form tambah)
        const resOutlets = await axios.get(`${apiBase}/outlets?limit=100`, { headers: authHeaders() });
        const allOutlets = resOutlets.data.data?.data || resOutlets.data.data || resOutlets.data || [];
        
        // Asumsi struktur tabel outlets Anda pakai user_id untuk menandakan kepemilikan manager
        managerOutlets.value = allOutlets.filter(o => o.user_id === managerId || o.owner_id === managerId);

    } catch (e) {
        console.error(e);
        showAlert("Gagal menarik data karyawan dari server", "error");
    } finally { 
        karyawanListModal.isLoading = false; 
    }
};

const openKaryawanListModal = (managerRow) => {
    karyawanListModal.managerId = managerRow.id;
    karyawanListModal.managerName = managerRow.name;
    karyawanListModal.show = true;
    fetchManagerKaryawan(managerRow.id);
};

const openModalKaryawan = (kar = null) => {
    karyawanFormModal.isEdit = !!kar;
    if (kar) {
        karyawanFormModal.id = kar.id;
        formKaryawan.name = kar.name; formKaryawan.email = kar.email; formKaryawan.outlet_id = kar.outlet_id || ''; formKaryawan.password = '';
    } else {
        karyawanFormModal.id = null;
        formKaryawan.name = ''; formKaryawan.email = ''; formKaryawan.outlet_id = ''; formKaryawan.password = '';
    }
    formKaryawan.role = 'karyawan';
    formKaryawan.owner_id = karyawanListModal.managerId; // Sinkronisasi kepemilikan
    karyawanFormModal.show = true;
};

// --- SUBMIT LOGIC ---
const submitForm = async (type) => {
    isSubmitting.value = true;
    const isMain = type === 'main';
    const currentForm = isMain ? form : formKaryawan;
    const isEdit = isMain ? isEditMode.value : karyawanFormModal.isEdit;
    const targetId = isMain ? selectedUserId.value : karyawanFormModal.id;

    try {
        const payload = { ...currentForm };
        if (!payload.password) delete payload.password;

        let endpoint = `${apiBase}/users`;
        if (isEdit) {
            endpoint += `/${targetId}`;
            payload._method = 'PUT';
        }

        await axios.post(endpoint, payload, { headers: authHeaders() });
        
        showAlert(`Data berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}!`, 'success');
        
        if (isMain) {
            closeModal();
            fetchData();
        } else {
            karyawanFormModal.show = false;
            fetchManagerKaryawan(karyawanListModal.managerId); // Refetch list modal
        }

    } catch (error) {
        showAlert(error.response?.data?.message || 'Terjadi kesalahan sistem.', 'error');
    } finally { isSubmitting.value = false; }
};

// --- DELETE LOGIC ---
const confirmDelete = (user, type) => {
    deleteModal.id = user.id;
    deleteModal.name = user.name;
    deleteModal.type = type;
    deleteModal.show = true;
};

const executeDelete = async () => {
    deleteModal.isDeleting = true;
    try {
        await axios.delete(`${apiBase}/users/${deleteModal.id}`, { headers: authHeaders() });
        showAlert("User berhasil dihapus!", "success");
        deleteModal.show = false;
        
        if (deleteModal.type === 'main') fetchData();
        else fetchManagerKaryawan(karyawanListModal.managerId);
        
    } catch (error) {
        showAlert("Gagal menghapus user.", "error");
    } finally { deleteModal.isDeleting = false; }
};

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>