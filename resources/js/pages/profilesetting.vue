<template>
    <AdminLayout>
        <div class="space-y-6 font-['Poppins']">
            <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
                <div
                    v-if="alert.show"
                    :class="[
                        'p-3 rounded-lg border text-[13px] font-medium flex items-center justify-between gap-2',
                        alert.type === 'error' ? 'bg-red-50 border-[#B83B2A] text-[#B83B2A]' : 'bg-green-50 border-[#2A7A4B] text-[#2A7A4B]'
                    ]"
                >
                    <div class="flex items-center gap-2">
                        <svg v-if="alert.type === 'error'" class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <svg v-else class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{{ alert.message }}</span>
                    </div>
                    <button @click="alert.show = false" class="focus:outline-none">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </transition>

            <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div class="p-4 md:p-6 border-b border-[#D4E4F4] bg-[#F7FAFD]">
                    <h3 class="text-[16px] font-semibold text-[#1A2332]">Informasi Profil</h3>
                    <p class="text-[13px] text-[#5A7A9A] mt-1">Perbarui informasi profil dan alamat email akun Anda.</p>
                </div>

                <form @submit.prevent="updateProfile" class="p-4 md:p-6 space-y-6">
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Nama Lengkap</label>
                            <input 
                                type="text" 
                                v-model="form.name" 
                                required
                                class="w-full px-3 py-2 text-[14px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC] transition-colors"
                                placeholder="Masukkan nama Anda"
                            >
                        </div>

                        <div>
                            <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Alamat Email</label>
                            <input 
                                type="email" 
                                v-model="form.email" 
                                required
                                class="w-full px-3 py-2 text-[14px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC] transition-colors"
                                placeholder="nama@email.com"
                            >
                        </div>
                    </div>

                    <hr class="border-[#D4E4F4]">

                    <div>
                        <h3 class="text-[15px] font-semibold text-[#1A2332] mb-1">Ubah Kata Sandi</h3>
                        <p class="text-[13px] text-[#5A7A9A] mb-4">Biarkan kosong jika Anda tidak ingin mengubah kata sandi saat ini.</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Kata Sandi Baru</label>
                                <input 
                                    type="password" 
                                    v-model="form.password" 
                                    class="w-full px-3 py-2 text-[14px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC] transition-colors"
                                    placeholder="Minimal 8 karakter"
                                >
                            </div>
                            
                            <div>
                                <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Konfirmasi Kata Sandi Baru</label>
                                <input 
                                    type="password" 
                                    v-model="form.password_confirmation" 
                                    class="w-full px-3 py-2 text-[14px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC] transition-colors"
                                    placeholder="Ulangi kata sandi baru"
                                >
                            </div>
                        </div>
                    </div>

                    <div class="pt-4 flex justify-end border-t border-[#D4E4F4] mt-6">
                        <button 
                            type="submit" 
                            :disabled="isLoading"
                            class="px-5 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:bg-[#8AAFCC] text-white text-[14px] font-semibold rounded-lg transition-colors flex items-center gap-2"
                        >
                            <svg v-if="isLoading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import AdminLayout from '../components/adminlayout.vue';

const router = useRouter();
const apiBase = 'https://api.etres.my.id/api/v1';

const form = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
});

const isLoading = ref(false);
const alert = reactive({ show: false, message: '', type: 'success' });

const showAlert = (message, type = 'success') => {
    alert.show = true;
    alert.message = message;
    alert.type = type;
    
    // Auto hide setelah 5 detik
    setTimeout(() => {
        alert.show = false;
    }, 5000);
};

const authHeaders = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        router.push('/');
        throw new Error('Unauthorized');
    }
    return { Authorization: `Bearer ${token}` };
};

const fetchProfile = async () => {
    try {
        const response = await axios.get(`${apiBase}/me`, {
            headers: authHeaders()
        });
        form.name = response.data.user.name;
        form.email = response.data.user.email;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth_token');
            router.push('/');
        } else {
            showAlert('Gagal memuat data profil.', 'error');
        }
    }
};

const updateProfile = async () => {
    isLoading.value = true;
    alert.show = false;

    try {
        const response = await axios.put(`${apiBase}/me`, {
            name: form.name,
            email: form.email,
            password: form.password,
            password_confirmation: form.password_confirmation
        }, {
            headers: authHeaders()
        });

        showAlert(response.data.message || 'Profil berhasil diperbarui!', 'success');
        
        // Kosongkan field password setelah berhasil update
        form.password = '';
        form.password_confirmation = '';
        
        // Memaksa adminlayout memuat ulang nama di pojok kanan atas
        window.dispatchEvent(new Event('profile-updated'));

    } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
            const errors = error.response.data.errors;
            const firstErrorKey = Object.keys(errors)[0];
            showAlert(errors[firstErrorKey][0], 'error');
        } else {
            showAlert('Terjadi kesalahan saat menyimpan profil.', 'error');
        }
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchProfile();
});
</script>