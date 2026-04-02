import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/login.vue';
import Dashboard from '../pages/dashboard.vue';
import UserManagement from '../pages/usermanagement.vue';
import MenuManagement from '../pages/menumanagement.vue'; // <-- Tambahan

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        meta: { title: 'Login' }
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
        path: '/users',
        name: 'UserManagement',
        component: UserManagement,
        meta: { 
            title: 'Manajemen User',
            desc: 'Kelola data akun manager dan karyawan kasir dengan mudah.'
        }
    },
    {
        path: '/menu', // <-- Tambahan rute
        name: 'MenuManagement',
        component: MenuManagement,
        meta: { 
            title: 'Manajemen Menu',
            desc: 'Kelola daftar produk, harga, dan ketersediaan menu.'
        }
    }
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