<template>
    <div class="flex h-screen bg-[#F0F4F8] font-['Poppins'] text-[#1A2332]">

        <aside
            :class="[
                'bg-white border-r border-[#D4E4F4] transition-all duration-300 flex flex-col z-20 relative',
                isSidebarMinimized ? 'w-[80px]' : 'w-[260px]'
            ]"
        >
            <button
                @click="toggleSidebar"
                class="absolute -right-3.5 top-10 w-7 h-7 bg-white border border-[#D4E4F4] rounded-full shadow-sm flex items-center justify-center text-[#5A7A9A] hover:text-[#1B4F8A] hover:border-[#1B4F8A] transition-colors focus:outline-none z-30"
            >
                <svg v-if="!isSidebarMinimized" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" /></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
            </button>

            <div class="h-16 flex items-center justify-center px-4 pt-4">
                <div class="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                    <div class="w-8 h-8 bg-[#1B4F8A] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <div v-if="!isSidebarMinimized" class="flex flex-col">
                        <span class="text-[16px] font-bold text-[#1B4F8A] leading-tight">POS F&B</span>
                        <span class="text-[10px] text-[#5A7A9A] font-medium uppercase tracking-wider">Admin Panel</span>
                    </div>
                </div>
            </div>

            <nav class="flex-1 overflow-y-auto py-8 px-3">
                <ul class="space-y-2">
                    <li class="text-[11px] font-semibold text-[#8AAFCC] uppercase tracking-wider px-3 mb-2" v-if="!isSidebarMinimized">Main Menu</li>

                    <li>
                        <router-link
                            to="/dashboard"
                            class="flex items-center px-3 py-2.5 rounded-lg transition-colors group"
                            active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                            exact-active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                            :class="[$route.path === '/dashboard' ? '' : 'text-[#5A7A9A] hover:bg-[#F7FAFD] hover:text-[#1A2332]']"
                        >
                            <svg class="w-5 h-5 flex-shrink-0 transition-colors" :class="[$route.path === '/dashboard' ? 'text-[#1B4F8A]' : 'text-[#8AAFCC] group-hover:text-[#5A7A9A]']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            <span v-if="!isSidebarMinimized" class="ml-3 text-[14px] whitespace-nowrap">Dashboard</span>
                        </router-link>

                        <router-link
                            to="/analytics"
                            class="flex items-center px-3 py-2.5 rounded-lg transition-colors group"
                            active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                            exact-active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                            :class="[$route.path === '/analytics' ? '' : 'text-[#5A7A9A] hover:bg-[#F7FAFD] hover:text-[#1A2332]']"
                        >
                            <svg class="w-5 h-5 flex-shrink-0 transition-colors" :class="[$route.path === '/analytics' ? 'text-[#1B4F8A]' : 'text-[#8AAFCC] group-hover:text-[#5A7A9A]']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span v-if="!isSidebarMinimized" class="ml-3 text-[14px] whitespace-nowrap">Laporan & Analitik</span>
                        </router-link>

                        <router-link
                            to="/users"
                            class="flex items-center px-3 py-2.5 rounded-lg transition-colors group"
                            active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                            exact-active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                            :class="[$route.path === '/users' ? '' : 'text-[#5A7A9A] hover:bg-[#F7FAFD] hover:text-[#1A2332]']"
                        >
                            <svg class="w-5 h-5 flex-shrink-0 transition-colors" :class="[$route.path === '/users' ? 'text-[#1B4F8A]' : 'text-[#8AAFCC] group-hover:text-[#5A7A9A]']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            <span v-if="!isSidebarMinimized" class="ml-3 text-[14px] whitespace-nowrap">Manajemen User</span>
                        </router-link>

                        <router-link
                            to="/menu"
                            class="flex items-center px-3 py-2.5 rounded-lg transition-colors group"
                            active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                            exact-active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                            :class="[$route.path === '/menu' ? '' : 'text-[#5A7A9A] hover:bg-[#F7FAFD] hover:text-[#1A2332]']"
                        >
                            <svg class="w-5 h-5 flex-shrink-0 transition-colors" :class="[$route.path === '/menu' ? 'text-[#1B4F8A]' : 'text-[#8AAFCC] group-hover:text-[#5A7A9A]']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span v-if="!isSidebarMinimized" class="ml-3 text-[14px] whitespace-nowrap">Manajemen Menu</span>
                        </router-link>

                        <router-link
                            to="/outlet-setting"
                            class="flex items-center px-3 py-2.5 rounded-lg transition-colors group"
                            active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                            exact-active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                            :class="[$route.path === '/outlet-setting' ? '' : 'text-[#5A7A9A] hover:bg-[#F7FAFD] hover:text-[#1A2332]']"
                        >
                            <svg class="w-5 h-5 flex-shrink-0 transition-colors" :class="[$route.path === '/outlet-setting' ? 'text-[#1B4F8A]' : 'text-[#8AAFCC] group-hover:text-[#5A7A9A]']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7l9-4 9 4-9 4-9-4zm0 10l9 4 9-4M3 12l9 4 9-4" />
                            </svg>
                            <span v-if="!isSidebarMinimized" class="ml-3 text-[14px] whitespace-nowrap">Outlet Setting</span>
                        </router-link>
                    </li>
                </ul>
            </nav>

            <div class="mt-auto flex flex-col">
                
                <div class="px-3 pb-2">
                    <router-link
                        to="/transactions"
                        class="flex items-center w-full px-3 py-2.5 rounded-lg transition-colors group"
                        active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                        exact-active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                        :class="[$route.path === '/transactions' ? '' : 'text-[#5A7A9A] hover:bg-[#F7FAFD] hover:text-[#1A2332]']"
                    >
                        <svg class="w-5 h-5 flex-shrink-0 transition-colors" :class="[$route.path === '/transactions' ? 'text-[#1B4F8A]' : 'text-[#8AAFCC] group-hover:text-[#5A7A9A]']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span v-if="!isSidebarMinimized" class="ml-3 text-[14px] whitespace-nowrap">Riwayat Transaksi</span>
                    </router-link>
                </div>

                <div class="border-t border-[#D4E4F4] p-3">
                    <button @click="handleLogout" class="flex items-center w-full px-3 py-2.5 rounded-lg text-[#B83B2A] hover:bg-red-50 transition-colors group">
                        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span v-if="!isSidebarMinimized" class="ml-3 text-[14px] font-medium whitespace-nowrap">Logout</span>
                    </button>
                </div>
                
            </div>
        </aside>

        <div class="flex-1 flex flex-col overflow-hidden">

            <header class="h-16 bg-white border-b border-[#D4E4F4] flex items-center justify-between px-6 z-10">
                <div class="flex flex-col">
                    <h2 class="text-[16px] font-semibold text-[#1A2332] leading-tight">{{ $route.meta.title || 'Panel Admin' }}</h2>
                    <p v-if="$route.meta.desc" class="text-[12px] text-[#5A7A9A] mt-0.5 hidden sm:block">{{ $route.meta.desc }}</p>
                </div>

                <div class="flex items-center gap-5">
                    <div class="hidden sm:flex items-center gap-2 bg-[#F0F4F8] border border-[#D4E4F4] px-3 py-1.5 rounded-lg">
                        <div class="w-2 h-2 rounded-full" :class="isLoading ? 'bg-[#8AAFCC] animate-pulse' : 'bg-[#2A7A4B]'"></div>
                        <p class="text-[13px] font-semibold text-[#1A2332]">
                            <span v-if="isLoading" class="text-[#8AAFCC]">Memuat...</span>
                            <span v-else>{{ currentOutlet }}</span>
                        </p>
                    </div>

                    <div class="w-px h-8 bg-[#D4E4F4] hidden sm:block"></div>

                    <div class="relative">
                        <button @click="toggleProfileMenu" class="flex items-center gap-3 focus:outline-none rounded-lg p-1 hover:bg-[#F7FAFD] transition-colors text-left">
                            <div class="w-9 h-9 rounded-full bg-[#EBF3FB] border border-[#D4E4F4] text-[#1B4F8A] flex items-center justify-center font-semibold text-[14px] flex-shrink-0">
                                <svg v-if="isLoading" class="w-4 h-4 animate-spin text-[#1B4F8A]" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span v-else>{{ userInitials }}</span>
                            </div>
                            <div class="hidden md:block">
                                <p class="text-[14px] font-semibold text-[#1A2332] leading-none mb-1">{{ isLoading ? 'Loading...' : user.name }}</p>
                                <p class="text-[12px] text-[#5A7A9A] leading-none">{{ isLoading ? '...' : user.email }}</p>
                            </div>
                            <svg class="w-4 h-4 text-[#8AAFCC] ml-1 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                        </button>

                        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                            <div v-if="isProfileMenuOpen" class="absolute right-0 mt-2 w-56 bg-white border border-[#D4E4F4] rounded-lg shadow-lg py-1 z-50">
                                <div class="px-4 py-3 border-b border-[#D4E4F4] md:hidden">
                                    <p class="text-[14px] font-semibold text-[#1A2332] truncate">{{ user.name }}</p>
                                    <p class="text-[12px] text-[#5A7A9A] truncate mt-0.5">{{ user.email }}</p>
                                </div>
                                <a href="#" @click.prevent="openProfileSetting" class="flex items-center gap-2 px-4 py-2 text-[14px] text-[#1A2332] hover:bg-[#EBF3FB] hover:text-[#1B4F8A] transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    Profile Setting
                                </a>
                            </div>
                        </transition>
                    </div>
                </div>
            </header>

            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-[#F0F4F8] p-6 relative">
                <slot></slot>
            </main>
        </div>
    </div>
</template>

<script setup>
// Bagian script ini persis SAMA persis kaya yang terakhir lu copas, gak ada yang diubah.
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// Cek apakah di local storage sebelumnya sudah di-minimize
const isSidebarMinimized = ref(localStorage.getItem('sidebar_minimized') === 'true');
const isProfileMenuOpen = ref(false);
const isLoading = ref(true);

const currentOutlet = ref('');
const user = ref({ name: '', email: '' });

const userInitials = computed(() => {
    if (!user.value.name) return '';
    const names = user.value.name.trim().split(' ');
    if (names.length > 1) return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    return names[0].charAt(0).toUpperCase();
});

const fetchUserProfile = async () => {
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) return router.push('/');

        const response = await axios.get('https://api.etres.my.id/api/v1/me', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const userData = response.data.user;
        user.value.name = userData.name || 'Admin';
        user.value.email = userData.email || 'admin@pos.com';

        if (userData.outlet && userData.outlet.name) {
            currentOutlet.value = userData.outlet.name;
        } else if (userData.outlet_id) {
            currentOutlet.value = `Outlet #${userData.outlet_id}`;
        } else {
            currentOutlet.value = 'Belum Ada Outlet';
        }

    } catch (error) {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth_token');
            router.push('/');
        }
    } finally {
        isLoading.value = false;
    }
};

const toggleSidebar = () => { 
    isSidebarMinimized.value = !isSidebarMinimized.value; 
    // Simpan status terbaru ke local storage tiap kali tombol diklik
    localStorage.setItem('sidebar_minimized', isSidebarMinimized.value.toString());
};
const toggleProfileMenu = () => { isProfileMenuOpen.value = !isProfileMenuOpen.value; };
const openProfileSetting = () => {
    isProfileMenuOpen.value = false;
    router.push('/profile-setting');
};

const handleLogout = async () => {
    isProfileMenuOpen.value = false;
    try {
        const token = localStorage.getItem('auth_token');
        await axios.post('https://api.etres.my.id/api/v1/logout', {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (e) { console.error('Logout API gagal', e); }
    finally {
        localStorage.removeItem('auth_token');
        router.push('/');
    }
};

const closeDropdown = (e) => {
    if (isProfileMenuOpen.value && !e.target.closest('.relative')) {
        isProfileMenuOpen.value = false;
    }
};

onMounted(() => {
    fetchUserProfile();
    document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
    document.removeEventListener('click', closeDropdown);
});
</script>
