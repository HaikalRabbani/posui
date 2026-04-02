<template>
    <div class="min-h-screen flex items-center justify-center bg-[#F0F4F8]">
        <div class="bg-[#F7FAFD] p-8 rounded-xl shadow-sm border border-[#D4E4F4] w-full max-w-md">
            
            <div class="text-center mb-8">
                <h1 class="text-2xl font-semibold text-[#1B4F8A]">POS F&B</h1>
                <p class="text-[15px] text-[#5A7A9A] mt-1 font-medium">Admin Panel Login</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-5">
                
                <div>
                    <label class="block text-[14px] font-medium text-[#5A7A9A] mb-1">Email</label>
                    <input 
                        type="email" 
                        v-model="form.email"
                        placeholder="admin@pos.com"
                        :class="[
                            'w-full px-4 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors',
                            errors.email ? 'border-[#B83B2A] focus:border-[#B83B2A] bg-red-50' : 'border-[#D4E4F4] focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC]'
                        ]"
                    />
                    <span v-if="errors.email" class="text-[#B83B2A] text-[12px] mt-1 block">Email wajib diisi</span>
                </div>

                <div>
                    <label class="block text-[14px] font-medium text-[#5A7A9A] mb-1">Password</label>
                    <input 
                        type="password" 
                        v-model="form.password"
                        placeholder="••••••••"
                        :class="[
                            'w-full px-4 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors',
                            errors.password ? 'border-[#B83B2A] focus:border-[#B83B2A] bg-red-50' : 'border-[#D4E4F4] focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC]'
                        ]"
                    />
                    <span v-if="errors.password" class="text-[#B83B2A] text-[12px] mt-1 block">Password wajib diisi</span>
                </div>

                <div class="flex justify-end">
                    <a href="#" class="text-[12px] text-[#2E7DD6] hover:text-[#1B4F8A] font-medium transition-colors">
                        Lupa kata sandi?
                    </a>
                </div>

                <button 
                    type="submit" 
                    class="w-full bg-[#2E7DD6] hover:bg-[#1B4F8A] text-white text-[15px] font-semibold py-2.5 rounded-lg transition-colors"
                >
                    Masuk
                </button>

            </form>

            <div class="mt-6 text-center text-[14px] text-[#5A7A9A]">
                Belum punya akun? 
                <a href="#" class="text-[#2E7DD6] hover:text-[#1B4F8A] font-medium transition-colors">
                    Daftar di sini
                </a>
            </div>

        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { toast } from 'vue3-toastify';

const form = reactive({
    email: '',
    password: ''
});

const errors = reactive({
    email: false,
    password: false
});

const handleLogin = () => {
    // Reset error state
    errors.email = false;
    errors.password = false;
    let isValid = true;

    // UX: Pembatasan input kosong jadi merah
    if (!form.email) {
        errors.email = true;
        isValid = false;
    }
    if (!form.password) {
        errors.password = true;
        isValid = false;
    }

    // UX: Notifikasi kustom
    if (!isValid) {
        toast.error('Mohon lengkapi data yang ditandai merah', {
            style: { background: '#B83B2A', color: '#FFFFFF' }
        });
        return;
    }

    // Simulasi request API ke backend
    toast.info('Memproses login...', {
        style: { background: '#4A90D9', color: '#1A5A9A' }
    });

    // TODO: Integrasi axios call ke api.etress.my.id/login
};
</script>