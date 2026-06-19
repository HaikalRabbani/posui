# POS F&B Admin Panel 🍽️

> Modern Point of Sale Admin Panel untuk Bisnis Food & Beverage

Panel administrasi berbasis web untuk mengelola sistem POS restoran/cafe dengan fitur lengkap mulai dari manajemen menu, outlet, transaksi, hingga laporan analitik real-time.

---

## 📋 Tentang Proyek

**POS F&B Admin Panel** adalah aplikasi Single Page Application (SPA) yang dibangun dengan Laravel (backend API) dan Vue.js 3 (frontend) untuk memudahkan pengelolaan bisnis food & beverage. Panel ini menyediakan interface yang intuitif untuk owner, manager, dan kasir dalam menjalankan operasional harian.

**Backend API**: [posapi](https://api.etres.my.id) (Repository terpisah)

---

## 🛠️ Tech Stack

### Frontend
- **Vue.js 3.5.31** - Progressive JavaScript Framework
- **Vue Router 4.4.5** - Official routing
- **Vite 6.0.11** - Build tool & dev server
- **Tailwind CSS 4.0.0** - Utility-first CSS framework
- **Chart.js 4.5.1** + **Vue-ChartJS 5.3.3** - Data visualization
- **Axios 1.7.4** - HTTP client with interceptors
- **Laravel Echo 2.3.4** + **Pusher JS 8.5.0** - Real-time features
- **vue3-toastify 0.2.9** - Toast notifications

### Backend
- **Laravel 11.x** - PHP framework
- **MySQL** - Database
- **JWT Authentication** - Secure token-based auth

---

## ✨ Fitur Utama

### 🔐 Authentication & Authorization
- Multi-role system (Developer/Super Admin, Manager/Owner, Karyawan/Kasir)
- JWT token-based authentication
- Auto-logout saat token expired
- Role-based access control (RBAC)

### 🏪 Manajemen Outlet
- CRUD outlet/cabang
- Konfigurasi menu per outlet (harga & stok berbeda per cabang)
- Manajemen pajak & biaya per outlet
- Multi-outlet support untuk franchise

### 🍔 Manajemen Menu
- CRUD produk/menu dengan foto
- Kategori produk dinamis
- Station/dapur management
- Harga modal & harga jual
- Status aktif/nonaktif independen dari stok
- Konfigurasi ketersediaan menu per outlet

### 👥 Manajemen User
- CRUD user (Manager & Karyawan)
- Manager bisa kelola karyawan di outlet-nya
- Developer/Super Admin kelola semua manager
- PIN 6 digit untuk kasir
- Upload foto profil

### 📅 Jadwal & Shift
- Master shift management
- Kalender jadwal karyawan
- Laporan audit kasir per shift
- Tracking opening/closing balance
- Deteksi selisih kas

### 🪑 Manajemen Meja
- CRUD meja/table
- Status ketersediaan meja
- Assignment ke outlet

### 🎉 Manajemen Promo
- CRUD promo/diskon
- Tipe diskon: persentase atau nominal
- Periode aktif promo
- Assignment ke outlet

### 📊 Laporan & Analitik
- Dashboard metrics (pendapatan, transaksi, rata-rata order, item terjual)
- Filter periode: hari ini, 7 hari, 1 bulan, 1 tahun, lifetime
- Filter per outlet
- Grafik tren penjualan interaktif (SVG custom chart)
- Top produk terlaris
- Export laporan (CSV/PDF)

### 🧾 Riwayat Transaksi
- View history transaksi dari kasir
- Detail pesanan per transaksi
- Search by invoice number
- Filter by status (paid, pending, cancelled)
- Edit/cancel transaksi (dengan alasan)
- Server-side pagination

### ⚙️ Profile Setting
- Update profil (nama, email, foto)
- Change password
- Cache profile untuk performa

---

## 📦 Prerequisites

Pastikan sistem sudah terinstall:

- **PHP >= 8.2** dengan extensions: BCMath, Ctype, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML
- **Composer 2.x**
- **Node.js >= 18.x** dan **npm >= 9.x**
- **MySQL >= 8.0** atau **MariaDB >= 10.3**
- **Git**

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url> posui
cd posui
```

### 2. Install Dependencies

#### Backend (Laravel)
```bash
composer install
```

#### Frontend (Vue.js)
```bash
npm install
```

### 3. Environment Configuration

#### Copy file .env
```bash
cp .env.example .env
```

#### Generate Application Key
```bash
php artisan key:generate
```

#### Konfigurasi Database di `.env`
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=posui_db
DB_USERNAME=root
DB_PASSWORD=
```

#### Konfigurasi API Backend
Pastikan di `.env` atau langsung di `resources/js/axios.js` dan file lain, API base URL sudah sesuai:

```javascript
// Contoh di axios.js
baseURL: 'https://api.etres.my.id'
```

Atau buat `.env` variable:
```env
VITE_API_BASE_URL=https://api.etres.my.id
```

### 4. Run Migration (jika perlu)

```bash
php artisan migrate
```

> **Note**: Project ini menggunakan API external (`https://api.etres.my.id`), sehingga database lokal hanya untuk session/cache Laravel. Data utama diambil dari API.

### 5. Build Frontend Assets

#### Development Mode (Hot Reload)
```bash
npm run dev
```

#### Production Build
```bash
npm run build
```

### 6. Run Laravel Development Server

```bash
php artisan serve
```

Aplikasi akan berjalan di `http://localhost:8000`

---

## 🗂️ Struktur Proyek

```
posui/
├── app/                    # Laravel backend logic
├── resources/
│   ├── css/
│   │   └── app.css        # Tailwind CSS config
│   ├── js/
│   │   ├── app.js         # Vue app entry point
│   │   ├── axios.js       # Axios instance dengan interceptor
│   │   ├── bootstrap.js   # Laravel Echo setup
│   │   ├── components/
│   │   │   ├── app.vue    # Root component
│   │   │   └── adminlayout.vue  # Admin layout dengan sidebar
│   │   ├── pages/         # Vue SFC pages (14 pages)
│   │   │   ├── login.vue
│   │   │   ├── register.vue
│   │   │   ├── dashboard.vue
│   │   │   ├── menumanagement.vue
│   │   │   ├── outletsetting.vue
│   │   │   ├── usermanagement.vue
│   │   │   ├── shiftmanagement.vue
│   │   │   ├── tablemanagement.vue
│   │   │   ├── promomanagement.vue
│   │   │   ├── transactionhistory.vue
│   │   │   ├── analytics.vue
│   │   │   ├── profilesetting.vue
│   │   │   ├── forgotpassword.vue
│   │   │   └── resetpassword.vue
│   │   └── router/
│   │       └── index.js   # Vue Router config
│   └── views/
│       └── welcome.blade.php  # SPA shell
├── routes/
│   └── web.php            # Laravel routes
├── public/                # Public assets
├── .env                   # Environment config
├── package.json           # NPM dependencies
├── vite.config.js         # Vite configuration
└── composer.json          # Composer dependencies
```

---

## 🔧 Development

### Menjalankan Dev Server

Terminal 1 (Laravel):
```bash
php artisan serve
```

Terminal 2 (Vite - Hot Module Replacement):
```bash
npm run dev
```

### Linting & Code Quality

```bash
# Check code style
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Build untuk Production

```bash
npm run build
php artisan optimize
```

---

## 👨‍💻 User Roles

| Role | Akses |
|------|-------|
| **Developer (Super Admin)** | Full access, kelola semua manager & outlet |
| **Manager/Owner** | Kelola outlet sendiri, CRUD menu/user/shift/promo/table |
| **Karyawan/Kasir** | Tidak bisa akses Admin Panel (login ditolak otomatis) |

---

## 🔑 Default Credentials

Sesuaikan dengan data dari backend API:

```
Developer/Super Admin:
Email: developer@example.com
Password: password

Manager/Owner:
Email: manager1@example.com
Password: password
```

---

## 📡 API Integration

Panel ini berkomunikasi dengan backend API di `https://api.etres.my.id`

### Authentication Flow
1. User login → API return JWT token
2. Token disimpan di `localStorage.getItem('auth_token')`
3. Setiap request menambahkan header: `Authorization: Bearer {token}`
4. Axios interceptor auto-handle 401 (expired token) → redirect ke login

---
