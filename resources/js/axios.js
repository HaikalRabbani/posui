import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://api.etres.my.id',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

apiClient.interceptors.request.use(
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

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Sesi telah habis. Mengeluarkan pengguna...');
            
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_profile_cache');
            
            if (window.location.pathname !== '/') {
                window.location.href = '/'; 
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;