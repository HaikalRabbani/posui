<template>
    <div class="min-h-screen bg-[#EDF4FA] font-['Poppins'] flex items-center justify-center p-4">
        <div class="w-full max-w-4xl bg-white border border-[#D4E4F4] rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
            <section class="bg-gradient-to-br from-[#1B4F8A] to-[#2E7DD6] text-white p-8 md:p-10 flex flex-col justify-between">
                <div>
                    <p class="text-[12px] uppercase tracking-[0.3em] font-semibold opacity-80">Setup Awal</p>
                    <h1 class="text-[30px] font-bold leading-tight mt-4">Buat Outlet Pertama Kamu</h1>
                    <p class="text-[14px] opacity-90 mt-3 leading-relaxed">
                        Sebelum masuk dashboard, lengkapi dulu data outlet agar sistem POS langsung siap dipakai transaksi.
                    </p>
                </div>

                <div class="mt-8 bg-white/10 rounded-xl p-4 border border-white/20">
                    <p class="text-[13px] font-semibold">Kenapa wajib setup outlet dulu?</p>
                    <ul class="mt-2 text-[12px] space-y-1 opacity-90">
                        <li>Outlet jadi identitas utama data transaksi.</li>
                        <li>Menu, kategori, dan user kasir akan terhubung ke outlet ini.</li>
                        <li>Mencegah dashboard tampil kosong tanpa konteks bisnis.</li>
                    </ul>
                </div>
            </section>

            <section class="p-8 md:p-10 flex flex-col justify-center">
                <h2 class="text-[24px] font-semibold text-[#1A2332]">Nama Outlet</h2>
                <p class="text-[13px] text-[#5A7A9A] mt-1">Contoh: Kopi Nusantara - Cabang Sudirman</p>

                <transition
                    enter-active-class="transition ease-out duration-300"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-200"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                >
                    <div
                        v-if="alert.show"
                        :class="[
                            'mt-5 p-3 rounded-lg border text-[13px] font-medium',
                            alert.type === 'error'
                                ? 'bg-red-50 border-[#B83B2A] text-[#B83B2A]'
                                : 'bg-green-50 border-[#2A7A4B] text-[#2A7A4B]'
                        ]"
                    >
                        {{ alert.message }}
                    </div>
                </transition>

                <form @submit.prevent="submitOutlet" class="mt-6 space-y-4">
                    <div>
                        <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Outlet Name</label>
                        <input
                            v-model="form.name"
                            type="text"
                            placeholder="Masukkan nama outlet"
                            :disabled="isLoading"
                            @input="alert.show = false"
                            :class="[
                                'w-full px-3 py-2.5 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332] placeholder-[#8AAFCC] bg-white',
                                errors.name ? 'border-[#B83B2A] focus:border-[#B83B2A] bg-red-50' : 'border-[#D4E4F4] focus:border-[#2E7DD6]'
                            ]"
                        />
                        <p v-if="errors.name" class="text-[11px] mt-1 text-[#B83B2A]">Nama outlet minimal 3 karakter.</p>
                    </div>

                    <button
                        type="submit"
                        :disabled="isLoading"
                        class="w-full bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:bg-[#8AAFCC] text-white text-[14px] font-semibold py-2.5 rounded-lg transition-colors"
                    >
                        {{ isLoading ? 'Menyimpan...' : 'Simpan Outlet & Masuk Dashboard' }}
                    </button>
                </form>

                <button
                    class="mt-4 text-[13px] text-[#5A7A9A] hover:text-[#1A2332] transition-colors"
                    @click="handleLogout"
                >
                    Bukan akun saya, keluar
                </button>
            </section>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { API_BASE_URL, clearAuthSession, createOutlet } from '../utils/auth';

const router = useRouter();
const isLoading = ref(false);

const form = reactive({
    name: '',
});

const errors = reactive({
    name: false,
});

const alert = reactive({
    show: false,
    message: '',
    type: 'success',
});

const showAlert = (message, type = 'error') => {
    alert.show = true;
    alert.message = message;
    alert.type = type;
};

const submitOutlet = async () => {
    errors.name = form.name.trim().length < 3;

    if (errors.name) {
        showAlert('Nama outlet minimal 3 karakter.', 'error');
        return;
    }

    isLoading.value = true;

    try {
        await createOutlet(form.name.trim());
        showAlert('Outlet berhasil dibuat. Mengalihkan ke dashboard...', 'success');

        setTimeout(() => {
            router.push('/dashboard');
        }, 800);
    } catch (error) {
        if (error.response?.status === 401) {
            clearAuthSession();
            router.push('/');
            return;
        }

        const message = error.response?.data?.message || 'Gagal membuat outlet. Silakan coba lagi.';
        showAlert(message, 'error');
    } finally {
        isLoading.value = false;
    }
};

const handleLogout = async () => {
    try {
        const token = localStorage.getItem('auth_token');

        if (token) {
            await axios.post(`${API_BASE_URL}/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        }
    } catch (e) {
        console.error('Logout API gagal', e);
    } finally {
        clearAuthSession();
        router.push('/');
    }
};
</script>
