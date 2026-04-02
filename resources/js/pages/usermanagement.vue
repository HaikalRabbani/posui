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
                
                <div class="p-4 border-b border-[#D4E4F4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F7FAFD]">
                    
                    <div class="flex items-center gap-2">
                        <span class="text-[13px] text-[#5A7A9A] font-medium">Tampilkan</span>
                        <select v-model="itemsPerPage" @change="currentPage = 1" class="border border-[#D4E4F4] bg-white text-[#1A2332] text-[13px] rounded-md px-2 py-1 focus:outline-none focus:border-[#2E7DD6]">
                            <option :value="5">5</option>
                            <option :value="10">10</option>
                            <option :value="15">15</option>
                        </select>
                        <span class="text-[13px] text-[#5A7A9A] font-medium">data</span>
                    </div>

                    <div class="flex items-center gap-3 w-full sm:w-auto">
                        <div class="relative w-full sm:w-64">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input 
                                type="text" 
                                v-model="searchQuery"
                                placeholder="Cari nama atau email..." 
                                class="w-full pl-9 pr-3 py-1.5 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC]"
                            >
                        </div>
                        
                        <button 
                            @click="openModal()" 
                            class="bg-[#2E7DD6] hover:bg-[#1B4F8A] text-white px-3 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                            Tambah
                        </button>
                    </div>

                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-[#D4E4F4] bg-[#F7FAFD]">
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Nama</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Email</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Role</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="isLoadingData" class="border-b border-[#EBF3FB]">
                                <td colspan="4" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Memuat data...</td>
                            </tr>
                            <tr v-else-if="paginatedUsers.length === 0" class="border-b border-[#EBF3FB]">
                                <td colspan="4" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Tidak ada data ditemukan.</td>
                            </tr>
                            <tr v-else v-for="user in paginatedUsers" :key="user.id" class="border-b border-[#EBF3FB] hover:bg-[#F7FAFD] transition-colors">
                                <td class="px-5 py-3 text-[14px] text-[#1A2332] font-medium">{{ user.name }}</td>
                                <td class="px-5 py-3 text-[14px] text-[#5A7A9A]">{{ user.email }}</td>
                                <td class="px-5 py-3 text-[13px]">
                                    <span class="px-2 py-1 bg-[#EBF3FB] text-[#1B4F8A] rounded-md font-medium capitalize">{{ user.role }}</span>
                                </td>
                                <td class="px-5 py-3 text-right whitespace-nowrap">
                                    <button @click="openModal(user)" class="text-[#2E7DD6] hover:bg-[#EBF3FB] px-3 py-1 rounded transition-colors text-[13px] font-semibold mr-1">Edit</button>
                                    <button @click="deleteUser(user.id)" class="text-[#B83B2A] hover:bg-red-50 px-3 py-1 rounded transition-colors text-[13px] font-semibold">Hapus</button>
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
            <div class="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-[#D4E4F4]">
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <h3 class="text-[16px] font-semibold text-[#1A2332]">
                        {{ isEditMode ? 'Edit' : 'Tambah' }} {{ currentUser.role === 'developer' ? 'Manager' : 'Karyawan' }}
                    </h3>
                    <button @click="closeModal" class="text-[#8AAFCC] hover:text-[#B83B2A] transition-colors focus:outline-none">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form @submit.prevent="submitForm" class="p-6 space-y-4">
                    <div>
                        <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Nama Lengkap</label>
                        <input 
                            type="text" v-model="form.name" @input="clearError('name')" maxlength="50" placeholder="Masukkan nama..." 
                            :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332] placeholder-[#8AAFCC]', formErrors.name ? 'border-[#B83B2A] focus:border-[#B83B2A] bg-red-50' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white']" 
                        />
                        <span v-if="formErrors.name" class="text-[#B83B2A] text-[11px] mt-1 block">Nama wajib diisi.</span>
                    </div>
                    <div>
                        <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Alamat Email</label>
                        <input 
                            type="email" v-model="form.email" @input="clearError('email')" maxlength="60" placeholder="email@contoh.com" 
                            :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332] placeholder-[#8AAFCC]', formErrors.email ? 'border-[#B83B2A] focus:border-[#B83B2A] bg-red-50' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white']" 
                        />
                        <span v-if="formErrors.email" class="text-[#B83B2A] text-[11px] mt-1 block">Email wajib diisi / format tidak sesuai.</span>
                    </div>
                    <div>
                        <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Password (Min. 6 karakter)</label>
                        <input 
                            type="password" v-model="form.password" @input="clearError('password')" maxlength="30" placeholder="••••••••" 
                            :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332] placeholder-[#8AAFCC]', formErrors.password ? 'border-[#B83B2A] focus:border-[#B83B2A] bg-red-50' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white']" 
                        />
                        <span v-if="formErrors.password" class="text-[#B83B2A] text-[11px] mt-1 block">Password minimal 6 karakter.</span>
                        <span v-else-if="isEditMode" class="text-[11px] text-[#8AAFCC] mt-1 block">Biarkan kosong jika tidak ingin diubah.</span>
                    </div>
                    <div>
                        <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">PIN Akses (Wajib 6 Angka)</label>
                        <div class="flex gap-2">
                            <input 
                                type="text" v-model="form.pin" @input="handlePinInput" maxlength="6" placeholder="123456" 
                                :class="['w-full px-3 py-2 text-[14px] font-[\'JetBrains_Mono\'] rounded-lg border focus:outline-none transition-colors text-[#1A2332] placeholder-[#8AAFCC]', formErrors.pin ? 'border-[#B83B2A] focus:border-[#B83B2A] bg-red-50' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white']" 
                            />
                            <button type="button" @click="generatePin" class="bg-[#F0F4F8] hover:bg-[#D4E4F4] border border-[#D4E4F4] text-[#1B4F8A] px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors whitespace-nowrap">
                                Generate
                            </button>
                        </div>
                        <span v-if="formErrors.pin" class="text-[#B83B2A] text-[11px] mt-1 block">PIN harus tepat 6 angka.</span>
                        <span v-else-if="isEditMode" class="text-[11px] text-[#8AAFCC] mt-1 block">Biarkan kosong jika tidak ingin diubah.</span>
                    </div>

                    <div class="pt-4 flex justify-end gap-2">
                        <button type="button" @click="closeModal" class="px-4 py-2 text-[14px] font-medium text-[#5A7A9A] hover:bg-[#F0F4F8] rounded-lg transition-colors">Batal</button>
                        <button type="submit" :disabled="isSubmitting" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:bg-[#8AAFCC] text-white text-[14px] font-semibold rounded-lg transition-colors">
                            {{ isSubmitting ? 'Menyimpan...' : 'Simpan Data' }}
                        </button>
                    </div>
                </form>
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
const searchQuery = ref('');

const form = reactive({
    name: '', email: '', password: '', pin: '', outlet_id: ''
});

// State buat merahin input yang salah
const formErrors = reactive({
    name: false, email: false, password: false, pin: false
});

// ================= FUNGSI UX & VALIDASI =================
const clearError = (field) => { formErrors[field] = false; };

const handlePinInput = () => {
    form.pin = form.pin.replace(/[^0-9]/g, '');
    clearError('pin');
};

const generatePin = () => {
    // Generate tepat 6 angka (antara 100000 - 999999)
    form.pin = Math.floor(100000 + Math.random() * 900000).toString();
    clearError('pin');
};

const validateForm = () => {
    formErrors.name = !form.name.trim();
    // Validasi email regex sederhana
    formErrors.email = !form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email); 
    
    // Validasi Password: Jika tambah baru (wajib 6 char), Jika Edit (Boleh kosong, tapi kalo diisi wajib 6 char)
    formErrors.password = !isEditMode.value ? (!form.password || form.password.length < 6) : (form.password && form.password.length < 6);
    
    // Validasi PIN: Jika tambah baru (wajib 6 digit), Jika Edit (Boleh kosong, tapi kalo diisi wajib 6 digit)
    formErrors.pin = !isEditMode.value ? (!form.pin || form.pin.length !== 6) : (form.pin && form.pin.length !== 6);

    return !formErrors.name && !formErrors.email && !formErrors.password && !formErrors.pin;
};

// ================= PAGINATION & SEARCH =================
const currentPage = ref(1);
const itemsPerPage = ref(5); 

// Filter user berdasarkan search query
const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value;
    const q = searchQuery.value.toLowerCase();
    return users.value.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q)
    );
});

// Total pages sekarang bergantung ke hasil search
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value));

const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return filteredUsers.value.slice(start, start + itemsPerPage.value);
});

// Reset page kalau user ngetik di search bar
watch(searchQuery, () => { currentPage.value = 1; });

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };

// ================= FUNGSI UTAMA (API) =================
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
            users.value = res.data.data.filter(u => u.role === 'manager');
        } else {
            const res = await axios.get('https://api.etres.my.id/api/v1/users/karyawan', { headers });
            users.value = res.data.data;
        }
    } catch (error) {
        showAlert('Gagal mengambil data user.', 'error');
    } finally {
        isLoadingData.value = false;
    }
};

const submitForm = async () => {
    if (!validateForm()) {
        showAlert('Mohon perbaiki isian form yang berwarna merah.', 'error');
        return;
    }

    isSubmitting.value = true;
    try {
        const token = localStorage.getItem('auth_token');
        const headers = { Authorization: `Bearer ${token}` };

        let endpoint = '';
        let payload = { ...form };

        if (isEditMode.value) {
            if (!payload.password) delete payload.password;
            if (!payload.pin) delete payload.pin;
        }

        if (currentUser.value.role === 'developer') {
            endpoint = isEditMode.value 
                ? `https://api.etres.my.id/api/v1/users/${selectedUserId.value}`
                : 'https://api.etres.my.id/api/v1/users';
            
            payload.role = 'manager'; 
            if (!payload.outlet_id) delete payload.outlet_id;
        } else {
            endpoint = isEditMode.value
                ? `https://api.etres.my.id/api/v1/users/karyawan/${selectedUserId.value}`
                : 'https://api.etres.my.id/api/v1/users/karyawan';
        }

        if (isEditMode.value) {
            await axios.put(endpoint, payload, { headers });
            showAlert('User berhasil diperbarui!', 'success');
        } else {
            await axios.post(endpoint, payload, { headers });
            showAlert('User berhasil ditambahkan!', 'success');
        }
        
        closeModal();
        await fetchUsers(); 

    } catch (error) {
        const msg = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.';
        showAlert(msg, 'error');
    } finally {
        isSubmitting.value = false;
    }
};

const deleteUser = async (id) => {
    if(!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;

    try {
        const token = localStorage.getItem('auth_token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const endpoint = currentUser.value.role === 'developer' 
            ? `https://api.etres.my.id/api/v1/users/${id}` 
            : `https://api.etres.my.id/api/v1/users/karyawan/${id}`;

        await axios.delete(endpoint, { headers });
        
        showAlert('User berhasil dihapus!', 'success');
        
        if (paginatedUsers.value.length === 1 && currentPage.value > 1) {
            currentPage.value--;
        }
        await fetchUsers();
        
    } catch (error) {
        showAlert('Gagal menghapus user.', 'error');
    }
};

const openModal = (user = null) => {
    // Reset Form & Error State
    formErrors.name = false; formErrors.email = false; formErrors.password = false; formErrors.pin = false;
    
    if (user) {
        isEditMode.value = true;
        selectedUserId.value = user.id;
        form.name = user.name;
        form.email = user.email;
        form.password = ''; 
        form.pin = '';      
        form.outlet_id = user.outlet_id || '';
    } else {
        isEditMode.value = false;
        selectedUserId.value = null;
        form.name = '';
        form.email = '';
        form.password = '';
        form.pin = '';
        form.outlet_id = '';
    }
    isModalOpen.value = true;
};

const closeModal = () => { isModalOpen.value = false; };

onMounted(async () => {
    await checkAuth();
    await fetchUsers();
});
</script>