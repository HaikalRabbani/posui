<template>
    <AdminLayout>
        <div class="space-y-6 font-['Poppins']">
            
            <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
                <div v-if="alert.show" :class="[ 
                    'p-3 rounded-lg border text-[13px] font-medium flex items-center justify-between gap-2',
                    alert.type === 'error' ? 'bg-red-50 border-[#B83B2A] text-[#B83B2A]' : 'bg-green-50 border-[#2A7A4B] text-[#2A7A4B]' 
                ]">
                    <div class="flex items-center gap-2">
                        <svg v-if="alert.type === 'error'" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <svg v-else class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{{ alert.message }}</span>
                    </div>
                    <button @click="alert.show = false" class="focus:outline-none"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
            </transition>

            <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden flex flex-col">
                
                <div class="p-4 border-b border-[#D4E4F4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F7FAFD]">
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

                    <div class="flex items-center gap-3 w-full sm:w-auto">
                        <div class="relative w-full sm:w-64 flex-shrink-0">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input 
                                type="text" v-model="searchQuery" placeholder="Cari nama atau email..." 
                                class="w-full pl-9 pr-3 py-1.5 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC]"
                            >
                        </div>
                        
                        <button @click="openModal()" class="bg-[#2E7DD6] hover:bg-[#1B4F8A] text-white px-3 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                            Tambah
                        </button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-[#D4E4F4] bg-[#F7FAFD]">
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Nama Lengkap</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Email</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Role</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Status</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="isLoadingData" class="border-b border-[#EBF3FB]">
                                <td colspan="5" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Memuat data...</td>
                            </tr>
                            <tr v-else-if="paginatedUsers.length === 0" class="border-b border-[#EBF3FB]">
                                <td colspan="5" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Tidak ada data ditemukan.</td>
                            </tr>
                            <tr v-else v-for="user in paginatedUsers" :key="user.id" class="border-b border-[#EBF3FB] hover:bg-[#F7FAFD] transition-colors">
                                <td class="px-5 py-3 text-[14px] text-[#1A2332] font-semibold">{{ user.name }}</td>
                                <td class="px-5 py-3 text-[14px] text-[#5A7A9A]">{{ user.email }}</td>
                                <td class="px-5 py-3 text-[13px]">
                                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF3FB] border border-[#D4E4F4] text-[12px] font-medium text-[#1B4F8A] capitalize">
                                        {{ user.role }}
                                    </span>
                                </td>
                                <td class="px-5 py-3">
                                    <span :class="[ 
                                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold border',
                                        user.is_active === false || user.is_active === 0 ? 'bg-red-50 text-[#B83B2A] border-red-200' : 'bg-green-50 text-[#2A7A4B] border-green-200'
                                    ]">
                                        <span :class="['w-1.5 h-1.5 rounded-full', user.is_active === false || user.is_active === 0 ? 'bg-[#B83B2A]' : 'bg-[#2A7A4B]']"></span>
                                        {{ user.is_active === false || user.is_active === 0 ? 'Nonaktif' : 'Aktif' }}
                                    </span>
                                </td>
                                <td class="px-5 py-3 text-right whitespace-nowrap">
                                    <button @click="openModal(user)" class="text-[#2E7DD6] hover:text-[#1B4F8A] p-1.5 transition-colors mr-2" title="Edit Akun">
                                        <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button @click="confirmDelete(user)" class="text-[#B83B2A] hover:text-red-800 p-1.5 transition-colors" title="Hapus Akun">
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

        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-[#D4E4F4] max-h-[90vh] flex flex-col">
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <h3 class="text-[16px] font-semibold text-[#1A2332]">
                        {{ isEditMode ? 'Edit' : 'Tambah' }} {{ currentUser.role === 'developer' ? 'Manager' : 'Karyawan' }}
                    </h3>
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
                        <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Nama Lengkap</label>
                        <input 
                            type="text" v-model="form.name" @input="formErrors.name = false" maxlength="50" placeholder="Masukkan nama..." 
                            :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332] placeholder-[#8AAFCC]', formErrors.name ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white']" 
                        />
                        <span v-if="formErrors.name" class="text-[#B83B2A] text-[11px] mt-1 block">Nama wajib diisi.</span>
                    </div>

                    <div>
                        <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Alamat Email</label>
                        <input 
                            type="email" v-model="form.email" @input="formErrors.email = false" maxlength="60" placeholder="email@contoh.com" 
                            :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332] placeholder-[#8AAFCC]', formErrors.email ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white']" 
                        />
                        <span v-if="formErrors.email" class="text-[#B83B2A] text-[11px] mt-1 block">Email tidak valid atau kosong.</span>
                    </div>

                    <div>
                        <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Status Akun</label>
                        <select v-model="form.is_active" class="w-full px-3 py-2 text-[14px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] bg-white">
                            <option :value="true">Aktif (Dapat Login)</option>
                            <option :value="false">Nonaktif (Akses Diblokir)</option>
                        </select>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Password</label>
                            <input 
                                type="password" v-model="form.password" @input="formErrors.password = false" maxlength="30" placeholder="••••••••" 
                                :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332] placeholder-[#8AAFCC]', formErrors.password ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white']" 
                            />
                            <span v-if="formErrors.password" class="text-[#B83B2A] text-[11px] mt-1 block">Minimal 6 karakter.</span>
                            <span v-else-if="isEditMode" class="text-[11px] text-[#8AAFCC] mt-1 block">Kosongkan jika tidak diubah.</span>
                        </div>
                        <div>
                            <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">PIN Akses</label>
                            <div class="flex gap-2">
                                <input 
                                    type="password" v-model="form.pin" @input="handlePinInput" maxlength="6" placeholder="123456" 
                                    :class="['w-full px-3 py-2 text-[14px] font-[\'JetBrains_Mono\'] rounded-lg border focus:outline-none transition-colors text-[#1A2332] placeholder-[#8AAFCC]', formErrors.pin ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white']" 
                                />
                                <button type="button" @click="generatePin" class="bg-[#F0F4F8] hover:bg-[#D4E4F4] border border-[#D4E4F4] text-[#1B4F8A] px-2 py-1 rounded-lg text-[12px] font-semibold transition-colors">
                                    Acak
                                </button>
                            </div>
                            <span v-if="formErrors.pin" class="text-[#B83B2A] text-[11px] mt-1 block">Minimal 4 angka.</span>
                            <span v-else-if="isEditMode" class="text-[11px] text-[#8AAFCC] mt-1 block">Kosongkan jika tidak diubah.</span>
                        </div>
                    </div>
                    
                    <div v-if="currentUser.role === 'developer'">
                        <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">ID Outlet (Opsional)</label>
                        <input type="number" v-model="form.outlet_id" placeholder="Contoh: 1" class="w-full px-3 py-2 text-[14px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC] bg-white" />
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
                <h3 class="text-[18px] font-bold text-[#1A2332] mb-2">Hapus Akun?</h3>
                <p class="text-[14px] text-[#5A7A9A] mb-6">
                    Apakah Anda yakin ingin menghapus akun <span class="font-semibold text-[#1A2332]">"{{ deleteModal.name }}"</span>? Data yang dihapus tidak dapat dikembalikan.
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
import { useRouter } from 'vue-router';
import axios from 'axios';
import AdminLayout from '../components/adminlayout.vue';

const router = useRouter();

// ================= STATE =================
const currentUser = ref({ role: '', outlet_id: null });
const users = ref([]);
const isLoadingData = ref(true);

const isModalOpen = ref(false);
const isSubmitting = ref(false);
const isEditMode = ref(false);
const selectedUserId = ref(null);

const alert = reactive({ show: false, message: '', type: 'success' });
const modalAlert = reactive({ show: false, message: '' });
const deleteModal = reactive({ show: false, id: null, name: '', isDeleting: false });

const searchQuery = ref('');

const form = reactive({
    name: '',
    email: '',
    password: '',
    pin: '',
    outlet_id: '',
    is_active: true
});

const formErrors = reactive({
    name: false,
    email: false,
    password: false,
    pin: false
});

// ================= UX & VALIDASI =================
const handlePinInput = () => {
    form.pin = form.pin.replace(/[^0-9]/g, '');
    formErrors.pin = false;
};

const generatePin = () => {
    form.pin = Math.floor(100000 + Math.random() * 900000).toString();
    formErrors.pin = false;
};

const validateForm = () => {
    formErrors.name = !form.name.trim();
    formErrors.email = !form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    
    formErrors.password = !isEditMode.value ? (!form.password || form.password.length < 6) : (form.password && form.password.length < 6);
    formErrors.pin = !isEditMode.value ? (!form.pin || form.pin.length < 4) : (form.pin && form.pin.length < 4);

    return !formErrors.name && !formErrors.email && !formErrors.password && !formErrors.pin;
};

// ================= SEARCH & PAGINATION =================
const currentPage = ref(1);
const itemsPerPage = ref(5); 

const filteredUsers = computed(() => {
    let filtered = Array.isArray(users.value) ? [...users.value] : [];
    
    // Filter by text search
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        filtered = filtered.filter(u => 
            u.name?.toLowerCase().includes(q) || 
            u.email?.toLowerCase().includes(q)
        );
    }
    
    // Logika sorting: Akun aktif di atas, akun nonaktif di paling bawah
    return filtered.sort((a, b) => {
        // Konversi nilai is_active ke angka: aktif = 1, nonaktif = 0
        const aActive = a.is_active === false || a.is_active === 0 ? 0 : 1;
        const bActive = b.is_active === false || b.is_active === 0 ? 0 : 1;
        
        // Urutkan secara descending supaya yang 1 di atas, dan 0 dilempar ke bawah
        return bActive - aActive;
    });
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value));
const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return filteredUsers.value.slice(start, start + itemsPerPage.value);
});

watch(searchQuery, () => { currentPage.value = 1; });
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };

// ================= API CALLS =================
const checkAuth = async () => {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) throw new Error('No token');
        
        const res = await axios.get('https://api.etres.my.id/api/v1/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        currentUser.value = res.data.user;
    } catch (error) {
        router.push('/');
    }
};

const fetchUsers = async () => {
    isLoadingData.value = true;
    try {
        const token = localStorage.getItem('auth_token');
        const headers = { Authorization: `Bearer ${token}` };

        if (currentUser.value.role === 'developer') {
            const res = await axios.get('https://api.etres.my.id/api/v1/users', { headers });
            
            let fetchedData = [];
            if (Array.isArray(res.data.data)) fetchedData = res.data.data;
            else if (Array.isArray(res.data)) fetchedData = res.data;
            else if (res.data && Array.isArray(res.data.data?.data)) fetchedData = res.data.data.data;

            users.value = fetchedData.filter(u => u.role === 'manager');
        } else {
            const res = await axios.get('https://api.etres.my.id/api/v1/users/karyawan', { headers });
            
            if (Array.isArray(res.data.data)) users.value = res.data.data;
            else if (Array.isArray(res.data)) users.value = res.data;
            else if (res.data && Array.isArray(res.data.data?.data)) users.value = res.data.data.data;
            else users.value = [];
        }
        
    } catch (error) {
        showAlert('Gagal mengambil data user.', 'error');
        users.value = [];
    } finally {
        isLoadingData.value = false;
    }
};

const submitForm = async () => {
    modalAlert.show = false;
    
    if (!validateForm()) {
        modalAlert.message = 'Mohon perbaiki isian form yang berwarna merah.';
        modalAlert.show = true;
        return;
    }

    isSubmitting.value = true;
    try {
        const token = localStorage.getItem('auth_token');
        const headers = { Authorization: `Bearer ${token}` };

        let payload = { 
            name: form.name,
            email: form.email,
            is_active: form.is_active ? 1 : 0
        };

        if (form.password) payload.password = form.password;
        if (form.pin) payload.pin = form.pin;

        let endpoint = '';
        if (currentUser.value.role === 'developer') {
            endpoint = isEditMode.value ? `https://api.etres.my.id/api/v1/users/${selectedUserId.value}` : 'https://api.etres.my.id/api/v1/users';
            payload.role = 'manager'; 
            if (form.outlet_id) payload.outlet_id = form.outlet_id;
        } else {
            endpoint = isEditMode.value ? `https://api.etres.my.id/api/v1/users/karyawan/${selectedUserId.value}` : 'https://api.etres.my.id/api/v1/users/karyawan';
        }

        if (isEditMode.value) {
            await axios.put(endpoint, payload, { headers });
            showAlert('Data user berhasil diperbarui!', 'success');
        } else {
            await axios.post(endpoint, payload, { headers });
            showAlert('User baru berhasil ditambahkan!', 'success');
        }
        
        closeModal();
        await fetchUsers(); 

    } catch (error) {
        modalAlert.message = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.';
        modalAlert.show = true;
    } finally {
        isSubmitting.value = false;
    }
};

const confirmDelete = (user) => {
    deleteModal.id = user.id;
    deleteModal.name = user.name;
    deleteModal.show = true;
};

const closeDeleteModal = () => {
    deleteModal.show = false; deleteModal.id = null; deleteModal.name = ''; deleteModal.isDeleting = false;
};

const executeDelete = async () => {
    deleteModal.isDeleting = true;
    try {
        const token = localStorage.getItem('auth_token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const endpoint = currentUser.value.role === 'developer' 
            ? `https://api.etres.my.id/api/v1/users/${deleteModal.id}` 
            : `https://api.etres.my.id/api/v1/users/karyawan/${deleteModal.id}`;

        await axios.delete(endpoint, { headers });
        
        showAlert('User berhasil dihapus!', 'success');
        if (paginatedUsers.value.length === 1 && currentPage.value > 1) currentPage.value--;
        
        await fetchUsers();
        closeDeleteModal();
    } catch (error) {
        showAlert('Gagal menghapus user.', 'error');
        deleteModal.isDeleting = false;
    }
};

// ================= UTILS =================
const showAlert = (msg, type) => {
    alert.message = msg;
    alert.type = type;
    alert.show = true;
    setTimeout(() => { alert.show = false; }, 4000);
};

const openModal = (user = null) => {
    formErrors.name = false; formErrors.email = false; formErrors.password = false; formErrors.pin = false;
    modalAlert.show = false;

    if (user) {
        isEditMode.value = true;
        selectedUserId.value = user.id;
        form.name = user.name;
        form.email = user.email;
        form.password = ''; 
        form.pin = '';      
        form.outlet_id = user.outlet_id || '';
        form.is_active = user.is_active === 1 || user.is_active === true;
    } else {
        isEditMode.value = false;
        selectedUserId.value = null;
        form.name = '';
        form.email = '';
        form.password = '';
        form.pin = '';
        form.outlet_id = '';
        form.is_active = true;
    }
    isModalOpen.value = true;
};

const closeModal = () => { isModalOpen.value = false; };

onMounted(async () => {
    await checkAuth();
    await fetchUsers();
});
</script>