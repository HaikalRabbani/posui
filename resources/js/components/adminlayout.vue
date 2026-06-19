<template>
    <div class="flex h-screen bg-[#F0F4F8] font-['Poppins'] text-[#1A2332] overflow-hidden">

        <transition enter-active-class="transition-opacity ease-linear duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity ease-linear duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false" class="fixed inset-0 bg-[#1A2332]/60 z-40 md:hidden backdrop-blur-sm"></div>
        </transition>

        <aside
            :class="[
                'bg-white border-r border-[#D4E4F4] transition-transform duration-300 ease-in-out flex flex-col z-50 fixed inset-y-0 left-0 md:relative',
                isSidebarMinimized ? 'md:w-[80px]' : 'md:w-[260px]',
                isMobileMenuOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full md:translate-x-0 w-[260px]'
            ]"
        >
            <button @click="isMobileMenuOpen = false" class="md:hidden absolute top-4 right-4 p-1.5 text-[#5A7A9A] hover:bg-[#F0F4F8] rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <button
                @click="toggleSidebar"
                class="hidden md:flex absolute -right-3.5 top-10 w-7 h-7 bg-white border border-[#D4E4F4] rounded-full shadow-sm items-center justify-center text-[#5A7A9A] hover:text-[#1B4F8A] hover:border-[#1B4F8A] transition-colors focus:outline-none z-30"
            >
                <svg v-if="!isSidebarMinimized" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" /></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
            </button>

            <div class="h-16 flex items-center justify-center px-4 pt-4 shrink-0">
                <div class="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                    <div class="w-8 h-8 bg-[#1B4F8A] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <div v-if="isMobileMenuOpen || !isSidebarMinimized" class="flex flex-col">
                        <span class="text-[16px] font-bold text-[#1B4F8A] leading-tight">POS F&B</span>
                        <span class="text-[10px] text-[#5A7A9A] font-medium uppercase tracking-wider">{{ userRole === 'developer' ? 'Super Admin' : 'Admin Panel' }}</span>
                    </div>
                </div>
            </div>

            <nav class="flex-1 overflow-y-auto py-8 px-3">
                <ul class="space-y-2">
                    <li class="text-[11px] font-semibold text-[#8AAFCC] uppercase tracking-wider px-3 mb-2" v-if="isMobileMenuOpen || !isSidebarMinimized">Main Menu</li>

                    <li>
                        <!-- Dashboard -->
                        <router-link
                            to="/dashboard"
                            class="flex items-center px-3 py-2.5 rounded-lg transition-colors group mb-2"
                            active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                            :class="[$route.path === '/dashboard' ? '' : 'text-[#5A7A9A] hover:bg-[#F7FAFD] hover:text-[#1A2332]']"
                        >
                            <svg class="w-5 h-5 flex-shrink-0 transition-colors" :class="[$route.path === '/dashboard' ? 'text-[#1B4F8A]' : 'text-[#8AAFCC] group-hover:text-[#5A7A9A]']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            <span v-if="isMobileMenuOpen || !isSidebarMinimized" class="ml-3 text-[14px] whitespace-nowrap">Dashboard</span>
                        </router-link>

                        <!-- Laporan & Analitik -->
                        <router-link
                            v-if="userRole !== 'developer'"
                            to="/analytics"
                            class="flex items-center px-3 py-2.5 rounded-lg transition-colors group mb-2"
                            active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                            :class="[$route.path === '/analytics' ? '' : 'text-[#5A7A9A] hover:bg-[#F7FAFD] hover:text-[#1A2332]']"
                        >
                            <svg class="w-5 h-5 flex-shrink-0 transition-colors" :class="[$route.path === '/analytics' ? 'text-[#1B4F8A]' : 'text-[#8AAFCC] group-hover:text-[#5A7A9A]']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span v-if="isMobileMenuOpen || !isSidebarMinimized" class="ml-3 text-[14px] whitespace-nowrap">Laporan & Analitik</span>
                        </router-link>

                        <!-- Accordion Manajemen -->
                        <div class="mb-2">
                            <button 
                                @click="toggleManagement"
                                class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group"
                                :class="[isManagementActive ? 'bg-[#EBF3FB] text-[#1B4F8A] font-semibold' : 'text-[#5A7A9A] hover:bg-[#F7FAFD] hover:text-[#1A2332]']"
                            >
                                <div class="flex items-center">
                                    <svg class="w-5 h-5 flex-shrink-0 transition-colors" :class="[isManagementActive ? 'text-[#1B4F8A]' : 'text-[#8AAFCC] group-hover:text-[#5A7A9A]']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    <span v-if="isMobileMenuOpen || !isSidebarMinimized" class="ml-3 text-[14px] whitespace-nowrap">Manajemen</span>
                                </div>
                                <svg v-if="isMobileMenuOpen || !isSidebarMinimized" 
                                    class="w-4 h-4 transition-transform duration-200" 
                                    :class="{ 'rotate-180': isManagementOpen }" 
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>

                            <!-- Sub-menu Manajemen -->
                            <transition
                                enter-active-class="transition-all ease-in-out duration-300 overflow-hidden"
                                enter-from-class="max-h-0 opacity-0"
                                enter-to-class="max-h-[500px] opacity-100"
                                leave-active-class="transition-all ease-in-out duration-300 overflow-hidden"
                                leave-from-class="max-h-[500px] opacity-100"
                                leave-to-class="max-h-0 opacity-0"
                            >
                                <div v-show="isManagementOpen && (isMobileMenuOpen || !isSidebarMinimized)" class="pl-10 pr-3 py-2 space-y-1 bg-[#F7FAFD] rounded-b-lg">
                                    <router-link
                                        v-if="userRole === 'developer' || userRole === 'manager'"
                                        to="/users"
                                        class="block px-3 py-2 rounded-md text-[13px] transition-colors"
                                        active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                                        :class="[$route.path === '/users' ? '' : 'text-[#5A7A9A] hover:text-[#1A2332]']"
                                    >
                                        Manajemen User
                                    </router-link>

                                    <router-link
                                        v-if="userRole !== 'developer'"
                                        to="/menu"
                                        class="block px-3 py-2 rounded-md text-[13px] transition-colors"
                                        active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                                        :class="[$route.path === '/menu' ? '' : 'text-[#5A7A9A] hover:text-[#1A2332]']"
                                    >
                                        Manajemen Menu
                                    </router-link>

                                    <router-link
                                        v-if="userRole === 'developer' || userRole === 'manager'"
                                        to="/outlet-setting"
                                        class="block px-3 py-2 rounded-md text-[13px] transition-colors"
                                        active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                                        :class="[$route.path === '/outlet-setting' ? '' : 'text-[#5A7A9A] hover:text-[#1A2332]']"
                                    >
                                        Manajemen Outlet
                                    </router-link>

                                    <router-link
                                        v-if="userRole !== 'developer'"
                                        to="/promotions"
                                        class="block px-3 py-2 rounded-md text-[13px] transition-colors"
                                        active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                                        :class="[$route.path === '/promotions' ? '' : 'text-[#5A7A9A] hover:text-[#1A2332]']"
                                    >
                                        Manajemen Promo
                                    </router-link>

                                    <router-link
                                        v-if="userRole !== 'developer'"
                                        to="/tables"
                                        class="block px-3 py-2 rounded-md text-[13px] transition-colors"
                                        active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                                        :class="[$route.path === '/tables' ? '' : 'text-[#5A7A9A] hover:text-[#1A2332]']"
                                    >
                                        Manajemen Meja
                                    </router-link>

                                    <router-link
                                        v-if="userRole !== 'developer'"
                                        to="/shift-management"
                                        class="block px-3 py-2 rounded-md text-[13px] transition-colors"
                                        active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                                        :class="[$route.path === '/shift-management' ? '' : 'text-[#5A7A9A] hover:text-[#1A2332]']"
                                    >
                                        Jadwal & Shift
                                    </router-link>
                                </div>
                            </transition>
                        </div>
                    </li>
                </ul>
            </nav>

            <div class="mt-auto flex flex-col shrink-0">
                <div class="px-3 pb-2" v-if="userRole !== 'developer'">
                    <router-link
                        to="/transactions"
                        class="flex items-center w-full px-3 py-2.5 rounded-lg transition-colors group"
                        active-class="bg-[#EBF3FB] text-[#1B4F8A] font-semibold"
                        :class="[$route.path === '/transactions' ? '' : 'text-[#5A7A9A] hover:bg-[#F7FAFD] hover:text-[#1A2332]']"
                    >
                        <svg class="w-5 h-5 flex-shrink-0 transition-colors" :class="[$route.path === '/transactions' ? 'text-[#1B4F8A]' : 'text-[#8AAFCC] group-hover:text-[#5A7A9A]']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span v-if="isMobileMenuOpen || !isSidebarMinimized" class="ml-3 text-[14px] whitespace-nowrap">Riwayat Transaksi</span>
                    </router-link>
                </div>

                <div class="border-t border-[#D4E4F4] p-3">
                    <button @click="handleLogout" class="flex items-center w-full px-3 py-2.5 rounded-lg text-[#B83B2A] hover:bg-red-50 transition-colors group">
                        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span v-if="isMobileMenuOpen || !isSidebarMinimized" class="ml-3 text-[14px] font-medium whitespace-nowrap">Logout</span>
                    </button>
                </div>
            </div>
        </aside>

        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
            
            <header class="h-16 bg-white border-b border-[#D4E4F4] flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
                <div class="flex items-center gap-3">
                    
                    <button @click="isMobileMenuOpen = true" class="md:hidden p-2 -ml-2 rounded-lg text-[#5A7A9A] hover:bg-[#F0F4F8] focus:outline-none transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>

                    <div class="flex flex-col">
                        <h2 class="text-[15px] sm:text-[16px] font-semibold text-[#1A2332] leading-tight truncate">{{ $route.meta.title || 'Panel Admin' }}</h2>
                        <p v-if="$route.meta.desc" class="text-[12px] text-[#5A7A9A] mt-0.5 hidden sm:block">{{ $route.meta.desc }}</p>
                    </div>
                </div>

                <div class="flex items-center gap-3 sm:gap-5">
                    <div class="hidden sm:flex items-center gap-2 bg-[#F0F4F8] border border-[#D4E4F4] px-3 py-1.5 rounded-lg" v-if="userRole !== 'developer'">
                        <div class="w-2 h-2 rounded-full" :class="isLoading ? 'bg-[#8AAFCC] animate-pulse' : 'bg-[#2A7A4B]'"></div>
                        <p class="text-[13px] font-semibold text-[#1A2332]">
                            <span v-if="isLoading" class="text-[#8AAFCC]">Memuat...</span>
                            <span v-else>{{ currentOutlet }}</span>
                        </p>
                    </div>

                    <div class="w-px h-8 bg-[#D4E4F4] hidden sm:block" v-if="userRole !== 'developer'"></div>

                    <div class="relative" id="profile-dropdown-wrapper">
                        <button @click="toggleProfileMenu" class="flex items-center gap-2 sm:gap-3 focus:outline-none rounded-lg p-1 hover:bg-[#F7FAFD] transition-colors text-left">
                            <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EBF3FB] border border-[#D4E4F4] text-[#1B4F8A] flex items-center justify-center font-semibold text-[13px] sm:text-[14px] flex-shrink-0 overflow-hidden">
                                <svg v-if="isLoading" class="w-4 h-4 animate-spin text-[#1B4F8A]" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <img v-else-if="userImageUrl" :src="userImageUrl" class="w-full h-full object-cover" alt="Profile" />
                                <span v-else>{{ userInitials }}</span>
                            </div>
                            <div class="hidden md:block">
                                <p class="text-[14px] font-semibold text-[#1A2332] leading-none mb-1">{{ isLoading ? 'Loading...' : user.name }}</p>
                                <p class="text-[12px] text-[#5A7A9A] leading-none">{{ isLoading ? '...' : userRole }}</p>
                            </div>
                            <svg class="w-4 h-4 text-[#8AAFCC] ml-1 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                        </button>

                        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                            <div v-if="isProfileMenuOpen" class="absolute right-0 mt-2 w-56 bg-white border border-[#D4E4F4] rounded-lg shadow-lg py-1 z-50">
                                <div class="px-4 py-3 border-b border-[#D4E4F4] md:hidden">
                                    <p class="text-[14px] font-semibold text-[#1A2332] truncate">{{ user.name }}</p>
                                    <p class="text-[12px] text-[#5A7A9A] truncate mt-0.5">{{ userRole }}</p>
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

            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-[#F0F4F8] p-4 sm:p-6 relative">
                <slot></slot>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from '@/axios';

const router = useRouter();
const route = useRoute();

// Responsive State
const isSidebarMinimized = ref(localStorage.getItem('sidebar_minimized') === 'true');
const isMobileMenuOpen = ref(false); 
const isProfileMenuOpen = ref(false);
const isManagementOpen = ref(false); // State baru untuk accordion manajemen
const isLoading = ref(true);

// Array path yang termasuk dalam menu manajemen
const managementPaths = [
    '/users', '/menu', '/outlet-setting', '/promotions', '/tables', '/shift-management'
];

// Computed property untuk mengecek apakah salah satu sub-menu sedang aktif
const isManagementActive = computed(() => {
    return managementPaths.includes(route.path);
});

// Auto buka accordion jika user me-refresh halaman pada salah satu rute manajemen
onMounted(() => {
    if (isManagementActive.value) {
        isManagementOpen.value = true;
    }
});

// User State
const currentOutlet = ref('');
const userRole = ref('');
const user = ref({ name: '', email: '', image: null });

// Auto close mobile menu when navigating
watch(() => route.path, (newPath) => {
    isMobileMenuOpen.value = false;
    
    // Opsional: Buka accordion otomatis jika navigasi ke rute manajemen dari tempat lain
    if (managementPaths.includes(newPath)) {
        isManagementOpen.value = true;
    }
});

const toggleManagement = () => {
    // Jika sidebar sedang minimized, kita buka sidebar-nya sekalian saat menu di-klik
    if (isSidebarMinimized.value) {
        isSidebarMinimized.value = false;
        localStorage.setItem('sidebar_minimized', 'false');
        isManagementOpen.value = true;
    } else {
        isManagementOpen.value = !isManagementOpen.value;
    }
};

const userInitials = computed(() => {
    if (!user.value.name) return '';
    const names = user.value.name.trim().split(' ');
    if (names.length > 1) return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    return names[0].charAt(0).toUpperCase();
});

const userImageUrl = computed(() => {
    if (!user.value.image) return null;
    return user.value.image.startsWith('http') ? user.value.image : `https://api.etres.my.id/storage/${user.value.image}`;
});

const fetchUserProfile = async () => {
    const cachedUser = localStorage.getItem('user_profile_cache');
    
    if (cachedUser) {
        const parsedData = JSON.parse(cachedUser);
        user.value.name = parsedData.name;
        user.value.email = parsedData.email;
        user.value.image = parsedData.image || null;
        userRole.value = parsedData.role;
        currentOutlet.value = parsedData.outlet;
        isLoading.value = false;
        
        silentFetchProfile();
        return;
    }

    await silentFetchProfile();
};

const silentFetchProfile = async () => {
    try {
        if (!localStorage.getItem('auth_token')) return router.push('/');

        const response = await axios.get('/api/v1/me');

        if (!response.data || !response.data.user) {
            throw new Error('Invalid response format');
        }

        const userData = response.data.user;
        user.value.name = userData.name || 'Admin';
        user.value.email = userData.email || '';
        user.value.image = userData.image || null;
        userRole.value = userData.role || 'karyawan';
        
        localStorage.setItem('user_role', userRole.value);

        if (userData.outlet && userData.outlet.name) {
            currentOutlet.value = userData.outlet.name;
        } else if (userData.outlet_id) {
            currentOutlet.value = `Outlet #${userData.outlet_id}`;
        } else {
            currentOutlet.value = 'Belum Ada Outlet';
        }

        localStorage.setItem('user_profile_cache', JSON.stringify({
            name: user.value.name,
            email: user.value.email,
            image: user.value.image,
            role: userRole.value,
            outlet: currentOutlet.value
        }));

    } catch (error) {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_profile_cache');
            router.push('/');
        } else {
            console.error('Gagal memuat profil:', error.message || error);
        }
    } finally {
        isLoading.value = false;
    }
};

const toggleSidebar = () => { 
    isSidebarMinimized.value = !isSidebarMinimized.value; 
    localStorage.setItem('sidebar_minimized', isSidebarMinimized.value.toString());
    
    // Jika sidebar di-minimize, tutup accordion manajemen agar lebih rapi
    if (isSidebarMinimized.value) {
        isManagementOpen.value = false;
    }
};

const toggleProfileMenu = () => { isProfileMenuOpen.value = !isProfileMenuOpen.value; };
const openProfileSetting = () => {
    isProfileMenuOpen.value = false;
    router.push('/profile-setting');
};

const handleLogout = async () => {
    isProfileMenuOpen.value = false;
    try {
        await axios.post('/api/v1/logout');
        
    } catch (e) { console.error('Logout API gagal', e); }
    finally {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_profile_cache');
        router.push('/');
    }
};

const closeDropdown = (e) => {
    if (isProfileMenuOpen.value && !e.target.closest('#profile-dropdown-wrapper')) {
        isProfileMenuOpen.value = false;
    }
};

const handleProfileUpdate = (event) => {
    if (event.detail) {
        if (event.detail.name) user.value.name = event.detail.name;
        if (event.detail.image !== undefined) user.value.image = event.detail.image;
        
        const cachedUser = localStorage.getItem('user_profile_cache');
        if (cachedUser) {
            const parsedData = JSON.parse(cachedUser);
            parsedData.name = user.value.name;
            parsedData.image = user.value.image;
            localStorage.setItem('user_profile_cache', JSON.stringify(parsedData));
        }
    } else {
        localStorage.removeItem('user_profile_cache');
        silentFetchProfile();
    }
};

onMounted(() => {
    fetchUserProfile();
    document.addEventListener('click', closeDropdown);
    window.addEventListener('profile-updated', handleProfileUpdate);
});

onUnmounted(() => {
    document.removeEventListener('click', closeDropdown);
    window.removeEventListener('profile-updated', handleProfileUpdate);
});
</script>