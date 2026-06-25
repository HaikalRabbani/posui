import './app.css';
import './bootstrap';
import { createApp } from 'vue';
import router from './router';
import App from './components/app.vue';

const app = createApp(App);

app.use(router);

app.mount('#app');

window.addEventListener('auth:logout', () => {
    if (router.currentRoute.value.name !== 'Login') {
        router.push({ name: 'Login' });
    }
});