import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/login.vue';
import Register from '../pages/register.vue';
import ForgotPassword from '../pages/forgotpassword.vue';
import ResetPassword from '../pages/resetpassword.vue';
import Dashboard from '../pages/dashboard.vue';
import ProfileSetting from '../pages/profilesetting.vue';
import UserManagement from '../pages/usermanagement.vue';
import MenuManagement from '../pages/menumanagement.vue';
import Analytics from '../pages/analytics.vue';
import OutletSetting from '../pages/outletsetting.vue';
import TransactionHistory from '../pages/transactionhistory.vue';

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        meta: { title: 'Login' }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: { title: 'Pendaftaran Akun' }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
        meta: { title: 'Lupa Password' }
    },
    {
        path: '/reset-password',
        name: 'ResetPassword',
        component: ResetPassword,
        meta: { title: 'Reset Password' }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
            title: 'Dashboard',
            desc: 'Pantau performa dan ringkasan bisnismu hari ini.'
        }
    },
    {
        path: '/profile-setting',
        name: 'ProfileSetting',
        component: ProfileSetting,
        meta: {
            title: 'Profile Setting',
            desc: 'Kelola informasi profil dan keamanan akun Anda.'
        }
    },
    {
        path: '/users',
        name: 'UserManagement',
        component: UserManagement,
        meta: {
            title: 'Manajemen User',
            desc: 'Kelola data akun manager dan karyawan kasir dengan mudah.'
        }
    },
    {
        path: '/menu',
        name: 'MenuManagement',
        component: MenuManagement,
        meta: {
            title: 'Manajemen Menu',
            desc: 'Kelola daftar produk, harga, dan ketersediaan menu.'
        }
    },
    {
        path: '/analytics',
        name: 'Analytics',
        component: Analytics,
        meta: {
            title: 'Laporan & Analitik',
            desc: 'Pantau grafik pendapatan dan performa penjualan menu.'
        }
    },
    {
        path: '/outlet-setting',
        name: 'OutletSetting',
        component: OutletSetting,
        meta: {
            title: 'Outlet Setting',
            desc: 'Kelola outlet Anda dan lakukan perubahan data outlet.'
        }
    },
    {
        path: '/transactions',
        name: 'TransactionHistory',
        component: TransactionHistory,
        meta: {
            title: 'Riwayat Transaksi',
            desc: 'Pantau riwayat pesanan dan nota transaksi outlet Anda.'
        }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title ? `${to.meta.title} - POS F&B` : 'POS F&B';
    next();
});

export default router;
