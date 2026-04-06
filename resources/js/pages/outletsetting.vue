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
                <div class="p-4 border-b border-[#D4E4F4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F7FAFD]">
                    <div class="flex items-center gap-2">
                        <span class="text-[13px] text-[#5A7A9A] font-medium">Tampilkan</span>
                        <select v-model="itemsPerPage" @change="currentPage = 1" class="border border-[#D4E4F4] bg-white text-[#1A2332] text-[13px] rounded-md px-2 py-1 focus:outline-none focus:border-[#2E7DD6]">
                            <option :value="5">5</option>
                            <option :value="10">10</option>
                            <option :value="15">15</option>
                            <option :value="50">50</option>
                        </select>
                        <span class="text-[13px] text-[#5A7A9A] font-medium">data</span>
                    </div>

                    <div class="flex items-center gap-3 w-full sm:w-auto">
                        <div class="relative w-full sm:w-72 shrink-0">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input
                                type="text"
                                v-model="searchQuery"
                                placeholder="Cari outlet..."
                                class="w-full pl-9 pr-3 py-1.5 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] placeholder-[#8AAFCC]"
                            >
                        </div>

                        <button @click="openModal()" class="bg-[#2E7DD6] hover:bg-[#1B4F8A] text-white px-3 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                            Tambah Outlet
                        </button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-[#D4E4F4] bg-[#F7FAFD]">
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">ID Outlet</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Nama Outlet</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Owner ID</th>
                                <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="isLoadingData" class="border-b border-[#EBF3FB]">
                                <td colspan="4" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Memuat data outlet...</td>
                            </tr>
                            <tr v-else-if="paginatedOutlets.length === 0" class="border-b border-[#EBF3FB]">
                                <td colspan="4" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Belum ada outlet.</td>
                            </tr>
                            <tr v-else v-for="outlet in paginatedOutlets" :key="resolveOutletId(outlet) ?? outlet.name" class="border-b border-[#EBF3FB] hover:bg-[#F7FAFD] transition-colors">
                                <td class="px-5 py-3 text-[13px] text-[#5A7A9A] font-['JetBrains_Mono']">{{ resolveOutletId(outlet) ?? '-' }}</td>
                                <td class="px-5 py-3 text-[14px] text-[#1A2332] font-semibold">{{ outlet.name }}</td>
                                <td class="px-5 py-3 text-[13px] text-[#5A7A9A] font-['JetBrains_Mono']">{{ outlet.owner_id ?? '-' }}</td>
                                <td class="px-5 py-3 text-right whitespace-nowrap">
                                    <button @click="openModal(outlet)" class="text-[#2E7DD6] hover:text-[#1B4F8A] p-1.5 transition-colors mr-2" title="Edit Outlet">
                                        <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button @click="confirmDelete(outlet)" class="text-[#B83B2A] hover:text-red-800 p-1.5 transition-colors" title="Hapus Outlet">
                                        <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
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
            <div class="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-[#D4E4F4] max-h-[90vh] flex flex-col">
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <h3 class="text-[16px] font-semibold text-[#1A2332]">{{ isEditMode ? 'Edit Outlet' : 'Tambah Outlet' }}</h3>
                    <button @click="closeModal" class="text-[#8AAFCC] hover:text-[#B83B2A] transition-colors focus:outline-none">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form @submit.prevent="submitForm" class="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Nama Outlet</label>
                        <input
                            type="text"
                            v-model="form.name"
                            @input="formError = ''"
                            maxlength="255"
                            placeholder="Contoh: Outlet Pusat"
                            :class="[
                                'w-full px-3 py-2 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332] placeholder-[#8AAFCC]',
                                formError ? 'border-[#B83B2A] bg-red-50 focus:border-[#B83B2A]' : 'border-[#D4E4F4] focus:border-[#2E7DD6] bg-white'
                            ]"
                        >
                        <span v-if="formError" class="text-[#B83B2A] text-[11px] mt-1 block">{{ formError }}</span>
                    </div>

                    <div class="pt-4 flex justify-end gap-2 border-t border-[#D4E4F4]">
                        <button type="button" @click="closeModal" class="px-4 py-2 text-[14px] font-medium text-[#5A7A9A] hover:bg-[#F0F4F8] rounded-lg transition-colors">Batal</button>
                        <button type="submit" :disabled="isSubmitting" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:bg-[#8AAFCC] text-white text-[14px] font-semibold rounded-lg transition-colors">
                            {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="deleteModal.show" class="fixed inset-0 z-60 flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden border border-[#D4E4F4] text-center p-6">
                <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 border border-red-100">
                    <svg class="w-6 h-6 text-[#B83B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 class="text-[18px] font-bold text-[#1A2332] mb-2">Hapus Outlet?</h3>
                <p class="text-[14px] text-[#5A7A9A] mb-6">
                    Yakin ingin menghapus outlet <span class="font-semibold text-[#1A2332]">"{{ deleteModal.name }}"</span>?
                </p>
                <div class="flex justify-center gap-3">
                    <button @click="closeDeleteModal" class="px-4 py-2 w-full text-[14px] font-medium text-[#5A7A9A] bg-[#F0F4F8] hover:bg-[#D4E4F4] rounded-lg transition-colors">Batal</button>
                    <button @click="executeDelete" :disabled="deleteModal.isDeleting" class="px-4 py-2 w-full text-[14px] font-semibold text-white bg-[#B83B2A] hover:bg-red-800 disabled:opacity-50 rounded-lg transition-colors">
                        {{ deleteModal.isDeleting ? 'Menghapus...' : 'Ya, Hapus' }}
                    </button>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import AdminLayout from '../components/adminlayout.vue';

const router = useRouter();
const apiBase = 'https://api.etres.my.id/api/v1';

const outlets = ref([]);
const isLoadingData = ref(true);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const isSubmitting = ref(false);
const selectedOutletId = ref(null);

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);

const form = reactive({
    name: ''
});

const formError = ref('');
const alert = reactive({ show: false, message: '', type: 'success' });
const deleteModal = reactive({ show: false, id: null, name: '', isDeleting: false });

const showAlert = (message, type = 'success') => {
    alert.show = true;
    alert.message = message;
    alert.type = type;
};

const resolveOutletId = (outlet) => outlet?.id ?? null;

const resolveOwnerId = (outlet) => outlet?.owner_id ?? null;

const resolveOutletName = (outlet) => outlet?.name ?? '-';

const extractOutletRows = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.data)) return payload.data.data;
    if (Array.isArray(payload?.outlets)) return payload.outlets;
    if (Array.isArray(payload?.result)) return payload.result;
    return [];
};

const normalizeOutlet = (raw) => ({
    ...raw,
    id: resolveOutletId(raw),
    owner_id: resolveOwnerId(raw),
    name: resolveOutletName(raw),
});

const authHeaders = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        router.push('/');
        throw new Error('Unauthorized');
    }

    return { Authorization: `Bearer ${token}` };
};

const normalizedOutlets = computed(() => {
    return Array.isArray(outlets.value) ? outlets.value : [];
});

const filteredOutlets = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return normalizedOutlets.value;

    return normalizedOutlets.value.filter((outlet) => {
        const id = String(resolveOutletId(outlet) ?? '');
        const name = (outlet.name || '').toLowerCase();
        const owner = String(outlet.owner_id ?? '');
        return id.includes(query) || name.includes(query) || owner.includes(query);
    });
});

const totalPages = computed(() => {
    const total = Math.ceil(filteredOutlets.value.length / itemsPerPage.value);
    return total > 0 ? total : 1;
});

const paginatedOutlets = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return filteredOutlets.value.slice(start, start + itemsPerPage.value);
});

watch([filteredOutlets, itemsPerPage], () => {
    if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value;
    }
});

const fetchOutlets = async () => {
    isLoadingData.value = true;
    try {
        const response = await axios.get(`${apiBase}/outlets`, {
            headers: authHeaders()
        });

        outlets.value = extractOutletRows(response.data).map(normalizeOutlet);
    } catch (error) {
        const status = error.response?.status;
        if (status === 401) {
            localStorage.removeItem('auth_token');
            router.push('/');
            return;
        }

        const message = error.response?.data?.message || 'Gagal memuat data outlet.';
        showAlert(message, 'error');
    } finally {
        isLoadingData.value = false;
    }
};

const openModal = (outlet = null) => {
    formError.value = '';

    if (outlet) {
        const outletId = resolveOutletId(outlet);
        isEditMode.value = true;
        selectedOutletId.value = outletId;
        form.name = outlet.name || '';
    } else {
        isEditMode.value = false;
        selectedOutletId.value = null;
        form.name = '';
    }

    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    isSubmitting.value = false;
    formError.value = '';
};

const validateForm = () => {
    if (!form.name.trim()) {
        formError.value = 'Nama outlet wajib diisi.';
        return false;
    }

    formError.value = '';
    return true;
};

const submitForm = async () => {
    if (!validateForm()) return;

    isSubmitting.value = true;

    try {
        if (isEditMode.value && selectedOutletId.value) {
            await axios.put(`${apiBase}/outlets/${selectedOutletId.value}`, {
                name: form.name
            }, {
                headers: authHeaders()
            });

            showAlert('Outlet berhasil diupdate.', 'success');
        } else {
            await axios.post(`${apiBase}/outlets`, {
                name: form.name
            }, {
                headers: authHeaders()
            });

            showAlert('Outlet berhasil dibuat.', 'success');
        }

        closeModal();
        await fetchOutlets();
    } catch (error) {
        const message = error.response?.data?.message || 'Gagal menyimpan outlet.';
        showAlert(message, 'error');
    } finally {
        isSubmitting.value = false;
    }
};

const confirmDelete = (outlet) => {
    const outletId = resolveOutletId(outlet);
    deleteModal.show = true;
    deleteModal.id = outletId;
    deleteModal.name = outlet.name;
    deleteModal.isDeleting = false;
};

const closeDeleteModal = () => {
    deleteModal.show = false;
    deleteModal.id = null;
    deleteModal.name = '';
    deleteModal.isDeleting = false;
};

const executeDelete = async () => {
    if (!deleteModal.id) return;

    deleteModal.isDeleting = true;

    try {
        await axios.delete(`${apiBase}/outlets/${deleteModal.id}`, {
            headers: authHeaders()
        });

        showAlert('Outlet berhasil dihapus.', 'success');
        closeDeleteModal();
        await fetchOutlets();
    } catch (error) {
        const message = error.response?.data?.message || 'Gagal menghapus outlet.';
        showAlert(message, 'error');
    } finally {
        deleteModal.isDeleting = false;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};

onMounted(() => {
    fetchOutlets();
});
</script>
