# POS F&B — Admin Dashboard (Vue)

Panel admin untuk sistem **Point of Sale (POS) F&B**. Aplikasi ini adalah **Single Page Application (SPA)** murni berbasis **Vue 3 + Vite**, tanpa backend sendiri — semua data diambil dari REST API eksternal (`https://api.etres.my.id`).

---

## ✨ Fitur

- 🔐 Autentikasi (Login, Register, Forgot/Reset Password) berbasis token
- 📊 Dashboard ringkasan performa bisnis
- 📈 Laporan & Analitik (grafik penjualan dengan Chart.js)
- 🍔 Manajemen Menu (produk, harga, ketersediaan)
- 👥 Manajemen User (manager & kasir)
- 🪑 Manajemen Meja
- 🎟️ Manajemen Promo
- 🗓️ Jadwal & Shift karyawan
- 🧾 Riwayat Transaksi
- 🏪 Pengaturan Outlet & Profil
- 🔔 Notifikasi real-time (Laravel Echo + Pusher) & toast (vue3-toastify)
- 🛡️ Proteksi route berbasis role (admin vs karyawan)

---

## 🧰 Teknologi

| Kategori        | Tools                                            |
| --------------- | ------------------------------------------------ |
| Framework       | [Vue 3](https://vuejs.org/) (Composition API)    |
| Build tool      | [Vite 6](https://vitejs.dev/)                    |
| Routing         | [Vue Router 4](https://router.vuejs.org/)        |
| Styling         | [Tailwind CSS 4](https://tailwindcss.com/)       |
| HTTP client     | [Axios](https://axios-http.com/)                 |
| Chart           | [Chart.js](https://www.chartjs.org/) + vue-chartjs |
| Realtime        | Laravel Echo + Pusher JS                         |
| Notifikasi      | vue3-toastify                                    |

---

## ✅ Requirement

- **Node.js** `>= 20.x` (disarankan LTS) — wajib untuk Vite 6 & Tailwind 4
- **npm** `>= 10.x` (terbawa otomatis dengan Node 20)
- Akses ke REST API backend (default: `https://api.etres.my.id`)

Cek versi:

```bash
node -v
npm -v
```

---

## 🚀 Instalasi

```bash
# 1. Clone repository
git clone <url-repo-kamu> posui
cd posui

# 2. Install dependency
npm install

# 3. Siapkan environment
cp .env.example .env
# lalu sesuaikan isi .env (lihat bagian Konfigurasi di bawah)

# 4. Jalankan development server
npm run dev
```

Buka browser ke alamat yang ditampilkan terminal (default **http://localhost:5173**).

---

## ⚙️ Konfigurasi (.env)

Semua environment variable **wajib diawali `VITE_`** agar terbaca oleh Vite di sisi client.

```env
# Base URL REST API
VITE_API_BASE_URL=https://api.etres.my.id/api/v1

# Konfigurasi realtime (Laravel Reverb / Pusher)
VITE_REVERB_APP_KEY=app-key-reverb-posapi
VITE_REVERB_HOST=127.0.0.1
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```

> **Catatan:** beberapa file saat ini masih meng-hardcode base URL `https://api.etres.my.id`. Untuk mengganti backend, gunakan `VITE_API_BASE_URL` di `.env` dan/atau ubah nilai di `src/axios.js`.

---

## 📜 Script NPM

| Perintah          | Keterangan                                        |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Menjalankan dev server (hot reload)               |
| `npm run build`   | Build untuk production ke folder `dist/`          |
| `npm run preview` | Preview hasil build production secara lokal       |

---

## 📁 Struktur Folder

```
posui/
├── index.html              # Entry point HTML (mount #app)
├── vite.config.js          # Konfigurasi Vite (Vue + Tailwind + alias @)
├── package.json
├── .env / .env.example     # Environment variables (VITE_*)
├── public/                 # Aset statis (favicon, robots.txt)
└── src/
    ├── app.js              # Bootstrap aplikasi Vue (createApp + router)
    ├── app.css             # Tailwind & global style
    ├── axios.js            # Instance Axios + interceptor token/401
    ├── bootstrap.js        # Setup Axios global, Echo & Pusher
    ├── components/
    │   ├── app.vue         # Root component
    │   └── adminlayout.vue # Layout dashboard (sidebar, header)
    ├── pages/              # Halaman per-route
    │   ├── login.vue
    │   ├── register.vue
    │   ├── dashboard.vue
    │   ├── analytics.vue
    │   ├── menumanagement.vue
    │   ├── usermanagement.vue
    │   ├── tablemanagement.vue
    │   ├── promomanagement.vue
    │   ├── shiftmanagement.vue
    │   ├── transactionhistory.vue
    │   ├── outletsetting.vue
    │   ├── profilesetting.vue
    │   ├── forgotpassword.vue
    │   └── resetpassword.vue
    └── router/
        └── index.js        # Definisi route + guard (auth & role)
```

### Path alias

Alias `@` menunjuk ke folder `src/`. Contoh: `import axios from '@/axios'`.

---

## 🔒 Autentikasi & Route Guard

- Token disimpan di `localStorage` (`auth_token`) dan otomatis dikirim sebagai
  header `Authorization: Bearer <token>` lewat interceptor Axios.
- Jika API merespons `401`, sesi dibersihkan dan user diarahkan ke halaman Login.
- Route guard (`src/router/index.js`):
  - User belum login → diarahkan ke **Login**
  - User sudah login membuka halaman guest → diarahkan ke **Dashboard**
  - Role `karyawan` → tidak diizinkan masuk panel admin

---

## 📦 Build & Deploy

```bash
npm run build
```

Hasil build statis ada di folder `dist/` dan bisa di-deploy ke hosting statis apa pun
(Nginx, Apache, Vercel, Netlify, dll).

> **Penting (SPA history mode):** aplikasi memakai `createWebHistory`, jadi web server
> harus mengarahkan semua request ke `index.html`. Contoh Nginx:
>
> ```nginx
> location / {
>     try_files $uri $uri/ /index.html;
> }
> ```

---

## 📄 Lisensi

Internal / private project.
