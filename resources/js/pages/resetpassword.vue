<template>
    <div class="min-h-screen flex items-center justify-center bg-[#F0F4F8] font-['Poppins'] py-10 px-4">
        <div class="bg-[#F7FAFD] p-8 rounded-xl shadow-sm border border-[#D4E4F4] w-full max-w-md">
            
            <div class="text-center mb-6">
                <div class="inline-flex items-center justify-center w-12 h-12 bg-[#1B4F8A] rounded-xl mb-3 shadow-sm">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h1 class="text-2xl font-semibold text-[#1B4F8A]">Reset Password</h1>
                <p class="text-[14px] text-[#5A7A9A] mt-1 font-medium">Buat kata sandi baru untuk akun Anda</p>
            </div>

            <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
                <div v-if="alert.show" :class="[ 
                    'mb-5 p-3 rounded-lg border text-[13px] font-medium flex items-center gap-2',
                    alert.type === 'error' ? 'bg-red-50 border-[#B83B2A] text-[#B83B2A]' : 'bg-green-50 border-[#2A7A4B] text-[#2A7A4B]' 
                ]">
                    <svg v-if="alert.type === 'error'" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <svg v-else class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{{ alert.message }}</span>
                </div>
            </transition>

            <form @submit.prevent="handleReset" class="space-y-4">
                
                <div>
                    <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Password Baru (Min. 6 Karakter)</label>
                    <input 
                        type="password" v-model="form.password" @input="clearError('password')" placeholder="••••••••"
                        :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332]', errors.password ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white placeholder-[#8AAFCC]']"
                    />
                    <span v-if="errors.password" class="text-[#B83B2A] text-[11px] mt-1 block">Password minimal 6 karakter.</span>
                </div>

                <div>
                    <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Konfirmasi Password Baru</label>
                    <input 
                        type="password" v-model="form.password_confirmation" @input="clearError('password_confirmation')" placeholder="••••••••"
                        :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332]', errors.password_confirmation ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white placeholder-[#8AAFCC]']"
                    />
                    <span v-if="errors.password_confirmation" class="text-[#B83B2A] text-[11px] mt-1 block">Konfirmasi password tidak cocok.</span>
                </div>

                <button 
                    type="submit" 
                    :disabled="isLoading || !isTokenValid"
                    class="w-full mt-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:bg-[#8AAFCC] text-white text-[14px] font-semibold py-2.5 rounded-lg transition-colors flex justify-center items-center"
                >
                    <span v-if="isLoading">Menyimpan...</span>
                    <span v-else>Simpan Password Baru</span>
                </button>
            </form>

            <div class="mt-6 text-center text-[13px] text-[#5A7A9A]">
                Ingat password Anda? 
                <router-link to="/" class="text-[#2E7DD6] hover:text-[#1B4F8A] font-semibold transition-colors">
                    Kembali ke Login
                </router-link>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);
const isTokenValid = ref(true);

const form = reactive({
    email: '',
    token: '',
    password: '',
    password_confirmation: ''
});

const errors = reactive({
    password: false,
    password_confirmation: false
});

const alert = reactive({
    show: false,
    message: '',
    type: 'success'
});

const showAlert = (msg, type = 'error') => {
    alert.message = msg;
    alert.type = type;
    alert.show = true;
};

const clearError = (field) => {
    errors[field] = false;
    alert.show = false;
};

// Waktu komponen dimuat, ambil data dari URL
onMounted(() => {
    form.email = route.query.email || '';
    form.token = route.query.token || '';

    // Jika URL tidak valid (tanpa token atau email)
    if (!form.email || !form.token) {
        isTokenValid.value = false;
        showAlert('Link reset tidak valid atau sudah kedaluwarsa. Silakan minta link baru.', 'error');
    }
});

const validateForm = () => {
    errors.password = !form.password || form.password.length < 6;
    errors.password_confirmation = form.password !== form.password_confirmation;

    return !errors.password && !errors.password_confirmation;
};

const handleReset = async () => {
    if (!validateForm()) return;

    isLoading.value = true;
    
    try {
        const response = await axios.post('https://api.etres.my.id/api/v1/reset-password', {
            email: form.email,
            token: form.token,
            password: form.password,
            password_confirmation: form.password_confirmation
        });

        showAlert(response.data.message || 'Password berhasil direset! Mengalihkan ke halaman login...', 'success');
        
        // Jeda waktu sedikit, lalu tendang balik ke halaman Login
        setTimeout(() => {
            router.push('/');
        }, 2000);

    } catch (error) {
        // Tangkap pesan error (biasanya karena token kedaluwarsa atau email tidak cocok)
        let errorMsg = 'Gagal mereset password.';
        if (error.response?.data?.errors) {
            const firstKey = Object.keys(error.response.data.errors)[0];
            errorMsg = error.response.data.errors[firstKey][0];
        } else if (error.response?.data?.message) {
            errorMsg = error.response.data.message;
        }
        
        showAlert(errorMsg, 'error');
    } finally {
        isLoading.value = false;
    }
};
</script>