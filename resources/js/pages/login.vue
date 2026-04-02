<template>
    <div class="min-h-screen flex items-center justify-center bg-[#F0F4F8] font-['Poppins']">
        <div class="bg-[#F7FAFD] p-8 rounded-xl shadow-sm border border-[#D4E4F4] w-full max-w-md">
            
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-12 h-12 bg-[#1B4F8A] rounded-xl mb-3 shadow-sm">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h1 class="text-2xl font-semibold text-[#1B4F8A]">POS F&B</h1>
                <p class="text-[15px] text-[#5A7A9A] mt-1 font-medium">Admin Panel Login</p>
            </div>

            <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
                <div v-if="alert.show" :class="[ 
                    'mb-5 p-3 rounded-lg border text-[13px] font-medium flex items-center gap-2',
                    alert.type === 'error' ? 'bg-red-50 border-[#B83B2A] text-[#B83B2A]' : 
                    alert.type === 'success' ? 'bg-green-50 border-[#2A7A4B] text-[#2A7A4B]' : 
                    'bg-[#EBF3FB] border-[#2E7DD6] text-[#1B4F8A]'
                ]">
                    <svg v-if="alert.type === 'error'" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <svg v-else-if="alert.type === 'success'" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <svg v-else class="w-5 h-5 flex-shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{{ alert.message }}</span>
                </div>
            </transition>

            <form @submit.prevent="handleLogin" class="space-y-5">
                <div>
                    <label class="block text-[14px] font-medium text-[#5A7A9A] mb-1">Email</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 transition-colors" :class="errors.email ? 'text-[#B83B2A]' : 'text-[#8AAFCC]'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <input 
                            type="email" 
                            v-model="form.email"
                            placeholder="admin@pos.com"
                            :disabled="isLoading"
                            @input="clearError('email')"
                            :class="[ 
                                'w-full pl-10 pr-4 py-2.5 text-[14px] rounded-lg border focus:outline-none transition-colors disabled:opacity-50',
                                errors.email ? 'border-[#B83B2A] focus:border-[#B83B2A] bg-red-50' : 'border-[#D4E4F4] focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC] bg-white'
                            ]"
                        />
                    </div>
                    <span v-if="errors.email" class="text-[#B83B2A] text-[12px] mt-1 block">Email wajib diisi</span>
                </div>

                <div>
                    <label class="block text-[14px] font-medium text-[#5A7A9A] mb-1">Password</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 transition-colors" :class="errors.password ? 'text-[#B83B2A]' : 'text-[#8AAFCC]'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input 
                            type="password" 
                            v-model="form.password"
                            placeholder="••••••••"
                            :disabled="isLoading"
                            @input="clearError('password')"
                            :class="[ 
                                'w-full pl-10 pr-4 py-2.5 text-[14px] rounded-lg border focus:outline-none transition-colors disabled:opacity-50',
                                errors.password ? 'border-[#B83B2A] focus:border-[#B83B2A] bg-red-50' : 'border-[#D4E4F4] focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC] bg-white'
                            ]"
                        />
                    </div>
                    <span v-if="errors.password" class="text-[#B83B2A] text-[12px] mt-1 block">Password wajib diisi</span>
                </div>

                <div class="flex justify-end">
                    <a href="#" class="text-[12px] text-[#2E7DD6] hover:text-[#1B4F8A] font-medium transition-colors">
                        Lupa kata sandi?
                    </a>
                </div>

                <button 
                    type="submit" 
                    :disabled="isLoading"
                    class="w-full bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:bg-[#8AAFCC] text-white text-[15px] font-semibold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2"
                >
                    <span v-if="isLoading">Memproses...</span>
                    <template v-else>
                        Masuk
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </template>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const isLoading = ref(false);

const form = reactive({
    email: '',
    password: ''
});

const errors = reactive({
    email: false,
    password: false
});

const alert = reactive({
    show: false, message: '', type: 'info'
});

const showAlert = (message, type = 'error') => {
    alert.message = message; alert.type = type; alert.show = true;
};

const clearError = (field) => {
    errors[field] = false; alert.show = false;
};

// Ambil last login pas halaman di-load
onMounted(() => {
    const savedEmail = localStorage.getItem('last_login_email');
    if (savedEmail) {
        form.email = savedEmail;
    }
});

const handleLogin = async () => {
    errors.email = !form.email;
    errors.password = !form.password;

    if (errors.email || errors.password) {
        showAlert('Mohon lengkapi data email dan password.');
        return;
    }

    isLoading.value = true;
    showAlert('Sedang memverifikasi kredensial...', 'info');
    
    try {
        const response = await axios.post('https://api.etres.my.id/api/v1/login', {
            email: form.email,
            password: form.password
        });

        // Simpan token dan email terakhir yang sukses login
        localStorage.setItem('auth_token', response.data.token || response.data.access_token);
        localStorage.setItem('last_login_email', form.email);
        
        showAlert('Login berhasil! Mengalihkan...', 'success');
        
        setTimeout(() => {
            router.push('/dashboard');
        }, 800);

    } catch (error) {
        const message = error.response?.data?.message || 'Login gagal, periksa email atau password Anda.';
        showAlert(message, 'error');
    } finally {
        isLoading.value = false;
    }
};
</script>