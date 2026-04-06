<template>
    <div class="min-h-screen flex items-center justify-center bg-[#F0F4F8] font-['Poppins'] py-10 px-4">
        <div class="bg-[#F7FAFD] p-8 rounded-xl shadow-sm border border-[#D4E4F4] w-full max-w-md">

            <div class="text-center mb-6">
                <div class="inline-flex items-center justify-center w-12 h-12 bg-[#1B4F8A] rounded-xl mb-3 shadow-sm">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h1 class="text-2xl font-semibold text-[#1B4F8A]">POS F&B</h1>
                <p class="text-[14px] text-[#5A7A9A] mt-1 font-medium">Pendaftaran Akun Manager</p>
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

            <form @submit.prevent="handleRegister" class="space-y-4">

                <div>
                    <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Nama Lengkap</label>
                    <input
                        type="text" v-model="form.name" @input="clearError('name')" placeholder="Contoh: Budi Santoso"
                        :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332]', errors.name ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white placeholder-[#8AAFCC]']"
                    />
                    <span v-if="errors.name" class="text-[#B83B2A] text-[11px] mt-1 block">Nama lengkap wajib diisi.</span>
                </div>

                <div>
                    <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Alamat Email</label>
                    <input
                        type="email" v-model="form.email" @input="clearError('email')" placeholder="admin@bisnis.com"
                        :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332]', errors.email ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white placeholder-[#8AAFCC]']"
                    />
                    <span v-if="errors.email" class="text-[#B83B2A] text-[11px] mt-1 block">Email wajib diisi dengan format valid.</span>
                </div>

                <div>
                    <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Password (Min. 6 Karakter)</label>
                    <input
                        type="password" v-model="form.password" @input="clearError('password')" placeholder="••••••••"
                        :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332]', errors.password ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white placeholder-[#8AAFCC]']"
                    />
                    <span v-if="errors.password" class="text-[#B83B2A] text-[11px] mt-1 block">Password minimal 6 karakter.</span>
                </div>

                <div>
                    <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Konfirmasi Password</label>
                    <input
                        type="password" v-model="form.password_confirmation" @input="clearError('password_confirmation')" placeholder="••••••••"
                        :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332]', errors.password_confirmation ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white placeholder-[#8AAFCC]']"
                    />
                    <span v-if="errors.password_confirmation" class="text-[#B83B2A] text-[11px] mt-1 block">Password tidak cocok.</span>
                </div>

                <button
                    type="submit"
                    :disabled="isLoading"
                    class="w-full mt-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:bg-[#8AAFCC] text-white text-[14px] font-semibold py-2.5 rounded-lg transition-colors flex justify-center items-center"
                >
                    <span v-if="isLoading">Mendaftarkan...</span>
                    <span v-else>Daftar Sekarang</span>
                </button>
            </form>

            <div class="mt-6 text-center text-[13px] text-[#5A7A9A]">
                Sudah punya akun?
                <router-link to="/" class="text-[#2E7DD6] hover:text-[#1B4F8A] font-semibold transition-colors">
                    Login di sini
                </router-link>
            </div>

        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { API_BASE_URL, fetchCurrentUser, resolvePostLoginRoute } from '../utils/auth';

const router = useRouter();
const isLoading = ref(false);

const form = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
});

const errors = reactive({
    name: false,
    email: false,
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

const validateForm = () => {
    errors.name = !form.name.trim();
    errors.email = !form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    errors.password = !form.password || form.password.length < 6;

    // Pengecekan konfirmasi password
    errors.password_confirmation = form.password !== form.password_confirmation;

    return !errors.name && !errors.email && !errors.password && !errors.password_confirmation;
};

const handleRegister = async () => {
    if (!validateForm()) {
        showAlert('Mohon perbaiki isian yang berwarna merah.', 'error');
        return;
    }

    isLoading.value = true;

    try {
        const response = await axios.post(`${API_BASE_URL}/register`, {
            name: form.name,
            email: form.email,
            password: form.password,
            password_confirmation: form.password_confirmation
        });

        // Simpan token login (karena API register lu ngereturn token langsung)
        localStorage.setItem('auth_token', response.data.token);

        showAlert('Pendaftaran berhasil! Menyiapkan akun...', 'success');

        const user = response.data.user || await fetchCurrentUser(true);

        setTimeout(() => {
            router.push(resolvePostLoginRoute(user));
        }, 900);

    } catch (error) {
        let errorMsg = 'Registrasi gagal. Terjadi kesalahan pada server.';

        if (error.response && error.response.data && error.response.data.errors) {
            // Ambil pesan error validasi pertama dari Laravel
            const firstErrorKey = Object.keys(error.response.data.errors)[0];
            errorMsg = error.response.data.errors[firstErrorKey][0];
        } else if (error.response && error.response.data && error.response.data.message) {
            errorMsg = error.response.data.message;
        }

        showAlert(errorMsg, 'error');
    } finally {
        isLoading.value = false;
    }
};
</script>
