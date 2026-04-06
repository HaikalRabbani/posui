<template>
    <AdminLayout>
        <div class="max-w-3xl space-y-6">
            <section class="bg-white border border-[#D4E4F4] rounded-xl p-5">
                <h3 class="text-[17px] font-semibold text-[#1A2332]">Informasi Akun</h3>
                <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                    <div>
                        <p class="text-[#8AAFCC] uppercase tracking-wide text-[11px]">Nama</p>
                        <p class="text-[#1A2332] font-medium mt-1">{{ profile.name || '-' }}</p>
                    </div>
                    <div>
                        <p class="text-[#8AAFCC] uppercase tracking-wide text-[11px]">Email</p>
                        <p class="text-[#1A2332] font-medium mt-1">{{ profile.email || '-' }}</p>
                    </div>
                    <div>
                        <p class="text-[#8AAFCC] uppercase tracking-wide text-[11px]">Role</p>
                        <p class="text-[#1A2332] font-medium mt-1">{{ profile.role || '-' }}</p>
                    </div>
                    <div>
                        <p class="text-[#8AAFCC] uppercase tracking-wide text-[11px]">Outlet Aktif</p>
                        <p class="text-[#1A2332] font-medium mt-1">{{ outletName }}</p>
                    </div>
                </div>
            </section>

            <section class="bg-white border border-[#D4E4F4] rounded-xl p-5">
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <h3 class="text-[17px] font-semibold text-[#1A2332]">{{ hasOutlet ? 'Edit Outlet' : 'Tambah Outlet' }}</h3>
                        <p class="text-[13px] text-[#5A7A9A] mt-1">
                            {{ hasOutlet ? 'Perbarui nama outlet yang sudah terdaftar.' : 'Buat outlet baru dari halaman profil.' }}
                        </p>
                    </div>
                    <span
                        :class="[
                            'text-[11px] px-2 py-1 rounded-full border font-semibold',
                            profile.outlet_id ? 'text-[#2A7A4B] border-[#2A7A4B]' : 'text-[#2E7DD6] border-[#2E7DD6]'
                        ]"
                    >
                        {{ profile.outlet_id ? 'Outlet Sudah Ada' : 'Belum Punya Outlet' }}
                    </span>
                </div>

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
                            'mt-4 p-3 rounded-lg border text-[13px] font-medium',
                            alert.type === 'error'
                                ? 'bg-red-50 border-[#B83B2A] text-[#B83B2A]'
                                : 'bg-green-50 border-[#2A7A4B] text-[#2A7A4B]'
                        ]"
                    >
                        {{ alert.message }}
                    </div>
                </transition>

                <form @submit.prevent="submitOutlet" class="mt-5 space-y-3">
                    <div>
                        <label class="block text-[13px] font-medium text-[#5A7A9A] mb-1">Nama Outlet</label>
                        <input
                            v-model="outletForm.name"
                            type="text"
                            :placeholder="hasOutlet ? 'Ubah nama outlet' : 'Contoh: Outlet Cikini'"
                            :disabled="isSaving"
                            :class="[
                                'w-full px-3 py-2.5 text-[14px] rounded-lg border focus:outline-none transition-colors text-[#1A2332] placeholder-[#8AAFCC] bg-white',
                                errors.name ? 'border-[#B83B2A] focus:border-[#B83B2A] bg-red-50' : 'border-[#D4E4F4] focus:border-[#2E7DD6]'
                            ]"
                        />
                        <p v-if="errors.name" class="text-[11px] mt-1 text-[#B83B2A]">Nama outlet minimal 3 karakter.</p>
                    </div>

                    <button
                        type="submit"
                        :disabled="isSaving"
                        class="bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:bg-[#8AAFCC] text-white text-[14px] font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                        {{ isSaving ? 'Menyimpan...' : hasOutlet ? 'Update Outlet' : 'Tambah Outlet' }}
                    </button>
                </form>
            </section>
        </div>
    </AdminLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '../components/adminlayout.vue';
import { createOutlet, fetchCurrentUser, updateOutlet } from '../utils/auth';

const router = useRouter();
const isSaving = ref(false);

const profile = reactive({
    name: '',
    email: '',
    role: '',
    outlet_id: null,
    outlet: null,
});

const outletForm = reactive({
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

const outletName = computed(() => {
    if (profile.outlet?.name) return profile.outlet.name;
    if (profile.outlet_id) return `Outlet #${profile.outlet_id}`;
    return 'Belum Ada Outlet';
});

const hasOutlet = computed(() => Boolean(profile.outlet_id));

const showAlert = (message, type = 'error') => {
    alert.show = true;
    alert.message = message;
    alert.type = type;
};

const hydrateProfile = async (force = false) => {
    try {
        const user = await fetchCurrentUser(force);

        if (!user) {
            router.push('/');
            return;
        }

        profile.name = user.name || '';
        profile.email = user.email || '';
        profile.role = user.role || '';
        profile.outlet_id = user.outlet_id || null;
        profile.outlet = user.outlet || null;

        if (profile.outlet?.name) {
            outletForm.name = profile.outlet.name;
        }
    } catch (error) {
        router.push('/');
    }
};

const submitOutlet = async () => {
    errors.name = outletForm.name.trim().length < 3;

    if (errors.name) {
        showAlert('Nama outlet minimal 3 karakter.', 'error');
        return;
    }

    isSaving.value = true;

    try {
        const outletLabel = outletForm.name.trim();

        if (hasOutlet.value) {
            const outletId = profile.outlet?.id || profile.outlet_id;
            await updateOutlet(outletId, outletLabel);
            showAlert('Outlet berhasil diupdate.', 'success');
        } else {
            await createOutlet(outletLabel);
            showAlert('Outlet berhasil ditambahkan.', 'success');
        }

        await hydrateProfile(true);
    } catch (error) {
        const message = error.response?.data?.message || (hasOutlet.value ? 'Gagal mengupdate outlet.' : 'Gagal menambahkan outlet.');
        showAlert(message, 'error');
    } finally {
        isSaving.value = false;
    }
};

onMounted(() => {
    hydrateProfile();
});
</script>
