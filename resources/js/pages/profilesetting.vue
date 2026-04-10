<template>
    <AdminLayout>
        <div class="space-y-6 font-['Poppins'] pb-10">


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

            <div class="flex gap-4 border-b border-[#D4E4F4]">
                <button 
                    @click="activeTab = 'profil'" 
                    class="px-4 py-2.5 text-[14px] font-semibold transition-colors border-b-2"
                    :class="activeTab === 'profil' ? 'text-[#1B4F8A] border-[#1B4F8A]' : 'text-[#5A7A9A] border-transparent hover:text-[#1A2332]'">
                    Profil Pengguna
                </button>
                <button 
                    @click="activeTab = 'keamanan'" 
                    class="px-4 py-2.5 text-[14px] font-semibold transition-colors border-b-2"
                    :class="activeTab === 'keamanan' ? 'text-[#1B4F8A] border-[#1B4F8A]' : 'text-[#5A7A9A] border-transparent hover:text-[#1A2332]'">
                    Keamanan & Password
                </button>
            </div>

            <div v-if="activeTab === 'profil'" class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden animate-[fadeIn_0.3s_ease-out] max-w-4xl">
                <div class="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    
                    <div class="flex flex-col items-center gap-4 md:w-1/3">
                        <div class="w-32 h-32 rounded-full bg-[#EBF3FB] flex items-center justify-center border border-[#D4E4F4] shadow-sm relative group cursor-pointer overflow-hidden">
                            <span class="text-[36px] font-bold text-[#1B4F8A] uppercase">{{ userInitials }}</span>
                            <div class="absolute inset-0 bg-[#1A2332]/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                        </div>
                        <div class="text-center">
                            <h3 class="font-bold text-[#1A2332] text-[18px] leading-tight">{{ formProfile.name || 'Memuat...' }}</h3>
                            <span class="inline-block px-3 py-1 mt-2 bg-[#F7FAFD] text-[#5A7A9A] border border-[#D4E4F4] rounded-md text-[11px] font-bold uppercase tracking-wider">
                                {{ formProfile.role || 'Karyawan' }}
                            </span>
                        </div>
                    </div>

                    <form @submit.prevent="saveProfile" class="flex-1 space-y-5">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            
                            <div class="md:col-span-2">
                                <label class="block text-[12px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1.5">Nama Lengkap <span class="text-[#B83B2A]">*</span></label>
                                <input v-model="formProfile.name" type="text" required class="w-full px-4 py-2.5 text-[14px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] transition-colors">
                            </div>
                            
                            <div class="md:col-span-2">
                                <label class="block text-[12px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1.5">Alamat Email <span class="text-[#B83B2A]">*</span></label>
                                <input v-model="formProfile.email" type="email" required class="w-full px-4 py-2.5 text-[14px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] transition-colors">
                            </div>

                            <div>
                                <label class="block text-[12px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1.5">Nomor Telepon</label>
                                <div class="relative">
                                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8AAFCC] font-['JetBrains_Mono'] text-[13px]">+62</span>
                                    <input v-model="formProfile.phone" type="tel" placeholder="81234567890" class="w-full pl-12 pr-4 py-2.5 text-[14px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] transition-colors font-['JetBrains_Mono'] placeholder-[#8AAFCC]">
                                </div>
                            </div>

                            <div>
                                <label class="block text-[12px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1.5">Role / Jabatan</label>
                                <input v-model="formProfile.role" type="text" disabled class="w-full px-4 py-2.5 text-[14px] rounded-lg border border-[#D4E4F4] bg-[#F0F4F8] text-[#8AAFCC] cursor-not-allowed capitalize">
                            </div>
                        </div>

                        <div class="pt-6 border-t border-[#D4E4F4] flex justify-end gap-3 mt-6">
                            <button type="button" @click="fetchProfile" class="px-5 py-2.5 text-[13px] font-semibold text-[#5A7A9A] hover:bg-[#F0F4F8] rounded-lg transition-colors">Batal</button>
                            <button type="submit" :disabled="isSaving" class="bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:bg-[#8AAFCC] text-white px-6 py-2.5 rounded-lg font-semibold text-[13px] transition-colors flex items-center gap-2">
                                <svg v-if="isSaving" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div v-if="activeTab === 'keamanan'" class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden animate-[fadeIn_0.3s_ease-out] max-w-3xl">
                <div class="p-6 md:p-8">
                    <div class="mb-6 pb-4 border-b border-[#D4E4F4]">
                        <h3 class="font-semibold text-[#1A2332] text-[18px]">Ubah Password</h3>
                        <p class="text-[#5A7A9A] text-[13px] mt-1">Gunakan kombinasi minimal 8 karakter huruf dan angka demi keamanan akun Anda.</p>
                    </div>

                    <form @submit.prevent="savePassword" class="space-y-5 max-w-xl">
                        
                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1.5">Password Baru</label>
                            <input v-model="formSecurity.newPassword" type="password" required placeholder="Minimal 8 Karakter" class="w-full px-4 py-2.5 text-[14px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] transition-colors font-['JetBrains_Mono'] placeholder-[#8AAFCC]">
                        </div>

                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1.5">Konfirmasi Password Baru</label>
                            <input v-model="formSecurity.confirmPassword" type="password" required placeholder="Ulangi Password" 
                                class="w-full px-4 py-2.5 text-[14px] rounded-lg border focus:outline-none transition-colors font-['JetBrains_Mono'] placeholder-[#8AAFCC]"
                                :class="passwordMismatch ? 'border-[#B83B2A] focus:border-[#B83B2A] bg-red-50' : 'border-[#D4E4F4] focus:border-[#2E7DD6]'">
                            
                            <p v-if="passwordMismatch" class="text-[11px] font-semibold text-[#B83B2A] mt-1.5 flex items-center gap-1">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Konfirmasi password tidak cocok!
                            </p>
                        </div>

                        <div class="pt-4 flex justify-end gap-3">
                            <button type="submit" :disabled="isSavingSecurity || passwordMismatch || !formSecurity.newPassword" class="bg-[#B83B2A] hover:bg-red-800 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-semibold text-[13px] transition-colors flex items-center gap-2">
                                <svg v-if="isSavingSecurity" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                {{ isSavingSecurity ? 'Memperbarui...' : 'Perbarui Password' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import axios from 'axios';
import AdminLayout from '../components/adminlayout.vue';

const apiBase = 'https://api.etres.my.id/api/v1';

// State UI
const activeTab = ref('profil');
const isSaving = ref(false);
const isSavingSecurity = ref(false);
const alert = reactive({ show: false, message: '', type: 'success' });

// State Form
const formProfile = ref({ name: '', email: '', phone: '', role: '' });
const formSecurity = ref({ newPassword: '', confirmPassword: '' });

// Header Profile Initials
const userInitials = computed(() => {
    if (!formProfile.value.name) return '';
    const names = formProfile.value.name.trim().split(' ');
    if (names.length > 1) return `${names[0].charAt(0)}${names[1].charAt(0)}`;
    return names[0].charAt(0);
});

// Validasi Password Mismatch
const passwordMismatch = computed(() => {
    if (formSecurity.value.newPassword && formSecurity.value.confirmPassword) {
        return formSecurity.value.newPassword !== formSecurity.value.confirmPassword;
    }
    return false;
});

const authHeaders = () => {
    return { Authorization: `Bearer ${localStorage.getItem('auth_token')}` };
};

const showAlert = (message, type = 'success') => {
    alert.message = message;
    alert.type = type;
    alert.show = true;
    setTimeout(() => alert.show = false, 4000);
};

// Mengambil data profile asli dari API
const fetchProfile = async () => {
    try {
        const response = await axios.get(`${apiBase}/me`, { headers: authHeaders() });
        const userData = response.data.user;
        
        formProfile.value = {
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '', // Opsional, diisi jika dari API ada
            role: userData.role || 'karyawan'
        };
    } catch (error) {
        console.error('Gagal mengambil data profil:', error);
        showAlert('Gagal memuat data profil.', 'error');
    }
};

// Simpan Data Profil
const saveProfile = async () => {
    isSaving.value = true;
    alert.show = false;

    try {
        const response = await axios.put(`${apiBase}/me`, {
            name: formProfile.value.name,
            email: formProfile.value.email,
            // Phone diabaikan jika tidak ada validasi di backend, tapi bisa ditambahkan jika backend mendukung
        }, { headers: authHeaders() });

        showAlert('Profil berhasil diperbarui!', 'success');
        
        // Trigger event ke AdminLayout agar nama di header pojok kanan atas langsung berubah
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
        isSaving.value = false;
    }
};

// Simpan Data Password Baru
const savePassword = async () => {
    if (passwordMismatch.value) return;
    
    isSavingSecurity.value = true;
    alert.show = false;

    try {
        await axios.put(`${apiBase}/me`, {
            name: formProfile.value.name, // Diwajibkan di backend
            email: formProfile.value.email, // Diwajibkan di backend
            password: formSecurity.value.newPassword,
            password_confirmation: formSecurity.value.confirmPassword
        }, { headers: authHeaders() });

        showAlert('Password berhasil diperbarui! Silakan gunakan password baru ini saat Anda login kembali.', 'success');
        formSecurity.value = { newPassword: '', confirmPassword: '' };
        
    } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
            const errors = error.response.data.errors;
            const firstErrorKey = Object.keys(errors)[0];
            showAlert(errors[firstErrorKey][0], 'error');
        } else {
            showAlert('Gagal memperbarui password.', 'error');
        }
    } finally {
        isSavingSecurity.value = false;
    }
};

onMounted(() => {
    fetchProfile();
});
</script>

<style scoped>
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>