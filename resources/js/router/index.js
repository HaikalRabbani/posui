import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/login.vue';
import Register from '../pages/register.vue';
import ForgotPassword from '../pages/forgotpassword.vue';
import ResetPassword from '../pages/resetpassword.vue';
import Dashboard from '../pages/dashboard.vue';
import UserManagement from '../pages/usermanagement.vue';
import MenuManagement from '../pages/menumanagement.vue';
import Analytics from '../pages/analytics.vue';
import SetupOutlet from '../pages/setupoutlet.vue';
import ProfileSetting from '../pages/profilesetting.vue';
import {
    clearAuthSession,
    fetchCurrentUser,
    getAuthToken,
    requiresOutletSetup,
} from '../utils/auth';

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
        path: '/setup-outlet',
        name: 'SetupOutlet',
        component: SetupOutlet,
        meta: {
            title: 'Setup Outlet',
            guestOnly: false,
            requiresAuth: true,
            onboarding: true
        }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
            title: 'Dashboard',
            requiresAuth: true,
            desc: 'Pantau performa dan ringkasan bisnismu hari ini.'
        }
    },
    {
        path: '/users',
        name: 'UserManagement',
        component: UserManagement,
        meta: {
            title: 'Manajemen User',
            requiresAuth: true,
            desc: 'Kelola data akun manager dan karyawan kasir dengan mudah.'
        }
    },
    {
        path: '/menu',
        name: 'MenuManagement',
        component: MenuManagement,
        meta: {
            title: 'Manajemen Menu',
            requiresAuth: true,
            desc: 'Kelola daftar produk, harga, dan ketersediaan menu.'
        }
    },
    {
        path: '/analytics',
        name: 'Analytics',
        component: Analytics,
        meta: {
            title: 'Laporan & Analitik',
            requiresAuth: true,
            desc: 'Pantau grafik pendapatan dan performa penjualan menu.'
        }
    },
    {
        path: '/profile-setting',
        name: 'ProfileSetting',
        component: ProfileSetting,
        meta: {
            title: 'Profile Setting',
            requiresAuth: true,
            desc: 'Kelola informasi profil dan outlet Anda.'
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    document.title = to.meta.title ? `${to.meta.title} - POS F&B` : 'POS F&B';

    const token = getAuthToken();
    const isAuthRoute = to.path === '/' || to.path === '/register';
    const needsAuth = Boolean(to.meta.requiresAuth);

    if (!token && needsAuth) {
        next('/');
        return;
    }

    if (!token) {
        next();
        return;
    }

    let user = null;

    try {
        user = await fetchCurrentUser();
    } catch (error) {
        if (error.response?.status === 401) {
            clearAuthSession();
            next('/');
            return;
        }
    }

    if (!user && needsAuth) {
        clearAuthSession();
        next('/');
        return;
    }

    if (!user) {
        next();
        return;
    }

    const needSetup = requiresOutletSetup(user);

    if (needSetup && to.path !== '/setup-outlet') {
        next('/setup-outlet');
        return;
    }

    if (!needSetup && to.path === '/setup-outlet') {
        next('/dashboard');
        return;
    }

    if (isAuthRoute) {
        next('/dashboard');
        return;
    }

    next();
});

export default router;
