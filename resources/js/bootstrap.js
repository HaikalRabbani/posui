import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// Ambil token dari localStorage (sesuaikan dengan cara kamu menyimpan token login di vue)
const token = localStorage.getItem('access_token');
