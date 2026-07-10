<template>
    <div class="min-h-screen flex items-center justify-center bg-[#F0F4F8] font-['Poppins'] py-10 px-4">
        <div class="bg-[#F7FAFD] p-8 rounded-xl shadow-sm border border-[#D4E4F4] w-full max-w-md">
            
            <div class="text-center mb-6">
                <div class="inline-flex items-center justify-center w-12 h-12 bg-[#1B4F8A] rounded-xl mb-3 shadow-sm">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4v-3l8.44-8.44A6 6 0 0115 7zm-3-3a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h1 class="text-2xl font-semibold text-[#1B4F8A]">Lupa Password</h1>
                <p class="text-[14px] text-[#5A7A9A] mt-1 font-medium">Masukkan email Anda untuk menerima link reset kata sandi</p>
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

            <form @submit.prevent="handleForgot" class="space-y-4">
                
                <div>
                    <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Alamat Email</label>
                    <input 
                        type="email" v-model="email" @input="clearError" placeholder="admin@contoh.com"
                        :class="['w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332]', errorEmail ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white placeholder-[#8AAFCC]']"
                    />
                    <span v-if="errorEmail" class="text-[#B83B2A] text-[11px] mt-1 block">Email wajib diisi dengan format valid.</span>
                </div>

                <button 
                    type="submit" 
                    :disabled="isLoading"
                    class="w-full mt-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:bg-[#8AAFCC] text-white text-[14px] font-semibold py-2.5 rounded-lg transition-colors flex justify-center items-center"
                >
                    <span v-if="isLoading">Mengirim Link...</span>
                    <span v-else>Kirim Link Reset</span>
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
import { ref, reactive } from 'vue';
import axios from 'axios';

const email = ref('');
const errorEmail = ref(false);
const isLoading = ref(false);

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

const clearError = () => {
    errorEmail.value = false;
    alert.show = false;
};

const validateForm = () => {
    errorEmail.value = !email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    return !errorEmail.value;
};

const handleForgot = async () => {
    if (!validateForm()) return;

    isLoading.value = true;
    
    try {
        const response = await axios.post('https://api.etres.my.id/api/v1/forgot-password', {
            email: email.value
        });

        showAlert(response.data.message || 'Link reset kata sandi telah dikirim ke email Anda!', 'success');
        email.value = ''; // Kosongkan field setelah berhasil

    } catch (error) {
        const message = error.response?.data?.message || 'Gagal mengirim link reset. Pastikan email terdaftar.';
        showAlert(message, 'error');
    } finally {
        isLoading.value = false;
    }
};
</script>