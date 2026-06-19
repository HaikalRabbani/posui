import axios from 'axios';

// Membuat instance global untuk axios
const myAxios = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.etres.my.id',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor: Otomatis menyisipkan Bearer Token ke setiap request jika tokennya ada
myAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default myAxios;