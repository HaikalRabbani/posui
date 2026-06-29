<template>
    <div class="min-h-screen flex items-center justify-center bg-[#F0F4F8] font-['Poppins'] py-10 px-4">
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

            <transition name="fade">
                <div v-if="alert.show" :class="[
                    'fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 max-w-sm transition-all duration-300',
                    alert.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 
                    alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 
                    'bg-[#EBF3FB] border-[#2E7DD6] text-[#1B4F8A]'
                ]">
                    <svg v-if="alert.type === 'error'" class="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <svg v-else-if="alert.type === 'success'" class="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    <svg v-else class="w-5 h-5 text-[#1B4F8A] shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p class="text-[13px] font-medium font-['Poppins']">{{ alert.message }}</p>
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
                    <router-link to="/forgot-password" class="text-[12px] text-[#2E7DD6] hover:text-[#1B4F8A] font-medium transition-colors">
                    Lupa kata sandi?
                    </router-link>
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

            <div class="mt-6 text-center text-[13px] text-[#5A7A9A]">
                Belum punya akun? 
                <router-link to="/register" class="text-[#2E7DD6] hover:text-[#1B4F8A] font-semibold transition-colors">
                    Daftar di sini
                </router-link>
            </div>

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

onMounted(() => {
    const savedEmail = localStorage.getItem('last_login_email');
    if (savedEmail) {
        form.email = savedEmail;
    }
    
    const loginError = sessionStorage.getItem('login_error');
    if (loginError) {
        showAlert(loginError, 'error');
        sessionStorage.removeItem('login_error');
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
        // 1. Eksekusi Login
        const response = await axios.post('http://103.197.190.23:9010/api/v1/login', {
            email: form.email,
            password: form.password
        });

        const token = response.data?.token || response.data?.access_token;
        
        if (!token) {
            throw new Error('Token tidak ditemukan dalam response');
        }
        
        // 2. Tarik Data Profil untuk validasi role
        const meResponse = await axios.get('http://103.197.190.23:9010/api/v1/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!meResponse.data || !meResponse.data.user) {
            throw new Error('Data user tidak ditemukan');
        }
        
        const userData = meResponse.data.user;
        const userRole = userData.role;

        // 3. LOGIKA BLOKIR KARYAWAN
        if (userRole === 'karyawan') {
            // Hentikan proses, jangan simpan token, munculkan pesan error
            isLoading.value = false;
            showAlert('Akses Ditolak: Akun Karyawan tidak dapat mengakses Admin Panel.', 'error');
            return; 
        }

        // 4. Jika role bukan karyawan (Manager/Developer), izinkan login
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_role', userRole);
        localStorage.setItem('last_login_email', form.email);
        
        // Simpan cache profil agar perpindahan ke dashboard instan
        let outletName = 'Belum Ada Outlet';
        if (userData.outlet && userData.outlet.name) {
            outletName = userData.outlet.name;
        } else if (userData.outlet_id) {
            outletName = `Outlet #${userData.outlet_id}`;
        }

        localStorage.setItem('user_profile_cache', JSON.stringify({
            name: userData.name,
            email: userData.email,
            role: userRole,
            outlet: outletName,
            image: userData.image || null,
        }));
        
        showAlert('Login berhasil! Mengalihkan...', 'success');
        
        setTimeout(() => {
            router.push('/dashboard');
        }, 800);

    } catch (error) {
        isLoading.value = false;
        const message = error.response?.data?.message || 'Login gagal, periksa email atau password Anda.';
        showAlert(message, 'error');
    }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>