<template>
    <AdminLayout>
        <transition name="fade">
            <div v-if="alert.show" :class="[
                'fixed top-6 right-6 z-[100] px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 max-w-sm transition-all duration-300',
                alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
            ]">
                <svg v-if="alert.type === 'success'" class="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                <svg v-else class="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p class="text-[13px] font-medium font-['Poppins']">{{ alert.message }}</p>
            </div>
        </transition>

        <div class="space-y-6 font-['Poppins'] pb-10">
            <div class="flex gap-4 border-b border-[#D4E4F4] overflow-x-auto custom-scrollbar">
                <button @click="activeTab = 'master'" class="px-4 py-2.5 text-[14px] font-semibold transition-colors border-b-2 whitespace-nowrap" :class="activeTab === 'master' ? 'text-[#1B4F8A] border-[#1B4F8A]' : 'text-[#5A7A9A] border-transparent hover:text-[#1A2332]'">
                    Master Shift
                </button>
                <button @click="activeTab = 'kalender'" class="px-4 py-2.5 text-[14px] font-semibold transition-colors border-b-2 whitespace-nowrap" :class="activeTab === 'kalender' ? 'text-[#1B4F8A] border-[#1B4F8A]' : 'text-[#5A7A9A] border-transparent hover:text-[#1A2332]'">
                    Kalender Jadwal
                </button>
                <button @click="activeTab = 'laporan'" class="px-4 py-2.5 text-[14px] font-semibold transition-colors border-b-2 whitespace-nowrap" :class="activeTab === 'laporan' ? 'text-[#1B4F8A] border-[#1B4F8A]' : 'text-[#5A7A9A] border-transparent hover:text-[#1A2332]'">
                    Laporan Audit Kasir
                </button>
            </div>

            <div v-if="activeTab === 'master'" class="animate-[fadeIn_0.3s_ease-out]">
                <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div class="p-4 border-b border-[#D4E4F4] bg-[#F7FAFD] space-y-4">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 class="text-[15px] font-bold text-[#1A2332]">Daftar Shift</h3>
                                <p class="text-[12px] text-[#5A7A9A] mt-0.5">Buat dan atur jam kerja dasar untuk outlet.</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <button @click="openScheduleModal()" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] text-white text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap w-fit">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                                    Tambah Shift
                                </button>
                            </div>
                        </div>

                        <div class="flex flex-wrap items-center gap-3 pt-2 border-t border-[#D4E4F4]">
                            <div class="relative w-full sm:w-64">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </div>
                                <input type="text" v-model="searchScheduleQuery" placeholder="Cari nama shift..." class="w-full pl-9 pr-3 py-1.5 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] transition-colors">
                            </div>
                            <select v-model="selectedScheduleOutlet" class="border border-[#D4E4F4] bg-white text-[#1A2332] text-[13px] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2E7DD6] min-w-[150px]">
                                <option value="">Semua Outlet</option>
                                <option v-for="out in outlets" :key="out.id" :value="out.id">{{ out.name }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b border-[#D4E4F4] bg-[#F7FAFD]">
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Nama Shift</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Outlet</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Jam Kerja</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-[#EBF3FB]">
                                <tr v-if="isLoadingSchedules">
                                    <td colspan="4" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] animate-pulse font-medium">Memuat master shift...</td>
                                </tr>
                                <tr v-else-if="filteredSchedules.length === 0">
                                    <td colspan="4" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Tidak ada master shift yang sesuai filter.</td>
                                </tr>
                                <tr v-else v-for="schedule in filteredSchedules" :key="schedule.id" class="hover:bg-[#F7FAFD] transition-colors">
                                    <td class="px-5 py-3">
                                        <div class="flex items-center gap-2">
                                            <div :class="`w-3 h-3 rounded-full ${getShiftColorClass(schedule.id, true)}`"></div>
                                            <span class="font-bold text-[#1A2332] text-[13px]">{{ schedule.name }}</span>
                                        </div>
                                    </td>
                                    <td class="px-5 py-3 text-[12px] font-medium text-[#1A2332]">
                                        {{ getOutletName(schedule.outlet_id) }}
                                    </td>
                                    <td class="px-5 py-3">
                                        <span class="inline-block px-2.5 py-1 bg-[#EBF3FB] text-[#1B4F8A] rounded-lg text-[12px] font-bold font-['JetBrains_Mono'] border border-[#D4E4F4]">
                                            {{ (schedule.start_time || '').substring(0,5) }} - {{ (schedule.end_time || '').substring(0,5) }}
                                        </span>
                                    </td>
                                    <td class="px-5 py-3 text-right whitespace-nowrap">
                                        <button @click="openScheduleModal(schedule)" class="text-[#2E7DD6] hover:text-[#1B4F8A] p-1.5 transition-colors bg-[#EBF3FB] hover:bg-[#D4E4F4] rounded-lg mr-1" title="Edit Shift"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                        <button @click="confirmDelete(schedule, 'master')" class="text-[#B83B2A] hover:text-red-800 p-1.5 transition-colors bg-red-50 hover:bg-red-100 rounded-lg" title="Hapus Shift"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div v-else-if="activeTab === 'kalender'" class="animate-[fadeIn_0.3s_ease-out] space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#D4E4F4] shadow-sm">
                    <div class="flex items-center gap-4">
                        <button @click="prevMonth" class="p-2 text-[#5A7A9A] hover:text-[#1B4F8A] hover:bg-[#F7FAFD] rounded-lg border border-transparent hover:border-[#D4E4F4] transition-all"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg></button>
                        <h2 class="text-[16px] font-bold text-[#1A2332] w-40 text-center">{{ monthNames[currentMonth] }} {{ currentYear }}</h2>
                        <button @click="nextMonth" class="p-2 text-[#5A7A9A] hover:text-[#1B4F8A] hover:bg-[#F7FAFD] rounded-lg border border-transparent hover:border-[#D4E4F4] transition-all"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
                    </div>
                    <div class="flex items-center gap-3">
                        <select v-model="selectedCalendarOutlet" @change="fetchCalendarSchedules" class="border border-[#D4E4F4] bg-[#F7FAFD] text-[#1A2332] text-[13px] font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-[#2E7DD6]">
                            <option value="">Semua Outlet</option>
                            <option v-for="out in outlets" :key="out.id" :value="out.id">{{ out.name }}</option>
                        </select>
                        <button @click="openAutoGenerateModal()" class="px-4 py-2 bg-[#EBF3FB] border border-[#D4E4F4] hover:bg-[#D4E4F4] text-[#1B4F8A] text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                            Auto Generate
                        </button>
                    </div>
                </div>

                <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden">
                    <div class="grid grid-cols-7 bg-[#F7FAFD] border-b border-[#D4E4F4]">
                        <div v-for="day in ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']" :key="day" class="py-3 text-center text-[12px] font-bold text-[#5A7A9A] uppercase tracking-wider border-r border-[#D4E4F4] last:border-r-0">
                            {{ day }}
                        </div>
                    </div>
                    <div class="grid grid-cols-7 bg-[#D4E4F4] gap-px border-t-0">
                        <div v-for="(cell, idx) in calendarGrid" :key="idx" 
                             @click="openDayModal(cell.date)"
                             :class="[
                                'min-h-[120px] p-2 bg-white hover:bg-[#F7FAFD] transition-colors cursor-pointer group',
                                !cell.isCurrent ? 'opacity-50' : '',
                                isToday(cell.date) ? 'ring-2 ring-inset ring-[#2E7DD6]' : ''
                             ]">
                            <div class="flex justify-between items-start mb-2">
                                <span :class="['text-[13px] font-bold w-6 h-6 flex items-center justify-center rounded-full', isToday(cell.date) ? 'bg-[#2E7DD6] text-white' : 'text-[#1A2332]']">
                                    {{ cell.date.getDate() }}
                                </span>
                                <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                                </div>
                            </div>
                            <div class="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar pr-1">
                                <div v-for="sched in getSchedulesForDate(cell.date)" :key="sched.id" 
                                     :class="`text-[10px] px-1.5 py-1 rounded border truncate font-medium ${getShiftColorClass(sched.shift_id, false)}`">
                                    <div class="font-bold truncate text-[11px]">{{ sched.user?.name || 'Karyawan' }}</div>
                                    <div class="truncate opacity-90 text-[9px]">{{ sched.shift?.name }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="activeTab === 'laporan'" class="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-white border border-[#D4E4F4] p-5 rounded-xl shadow-sm">
                        <p class="text-[12px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1">Total Laporan</p>
                        <h3 class="text-[24px] font-bold text-[#1A2332] font-['JetBrains_Mono']">{{ filteredReports.length }}</h3>
                    </div>
                    <div class="bg-white border border-[#D4E4F4] p-5 rounded-xl shadow-sm">
                        <p class="text-[12px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1">Shift Aktif Berjalan</p>
                        <h3 class="text-[24px] font-bold text-[#C4860A] font-['JetBrains_Mono']">{{ activeShiftsCount }}</h3>
                    </div>
                    <div class="bg-white border border-[#D4E4F4] p-5 rounded-xl shadow-sm">
                        <p class="text-[12px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1">Total Selisih Kas</p>
                        <h3 :class="['text-[24px] font-bold font-[JetBrains_Mono]', totalDifference < 0 ? 'text-[#B83B2A]' : 'text-[#2A7A4B]']">
                            Rp {{ formatRupiah(totalDifference) }}
                        </h3>
                    </div>
                </div>

                <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div class="p-4 border-b border-[#D4E4F4] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 bg-[#F7FAFD]">
                        <div class="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                            <div class="relative w-full sm:w-64">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </div>
                                <input type="text" v-model="searchReportQuery" placeholder="Cari nama kasir..." class="w-full pl-9 pr-3 py-1.5 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] transition-colors">
                            </div>
                            <select v-model="selectedReportOutlet" @change="currentPage = 1" class="border border-[#D4E4F4] bg-white text-[#1A2332] text-[13px] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2E7DD6] min-w-[150px]">
                                <option value="">Semua Outlet</option>
                                <option v-for="out in outlets" :key="out.id" :value="out.id">{{ out.name }}</option>
                            </select>
                        </div>
                        <button @click="fetchReports" class="text-[#2E7DD6] hover:text-[#1B4F8A] text-[13px] font-semibold flex items-center gap-1.5 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            Segarkan Data
                        </button>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b border-[#D4E4F4] bg-[#F7FAFD]">
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Kasir & Outlet</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Waktu Shift</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Modal Awal</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Selisih Audit</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-center">Status</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-[#EBF3FB]">
                                <tr v-if="isLoadingReports">
                                    <td colspan="6" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] animate-pulse font-medium">Memuat data laporan shift...</td>
                                </tr>
                                <tr v-else-if="filteredReports.length === 0">
                                    <td colspan="6" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Tidak ada data audit ditemukan.</td>
                                </tr>
                                <tr v-else v-for="shift in paginatedReports" :key="shift.id" class="hover:bg-[#F7FAFD] transition-colors">
                                    <td class="px-5 py-3">
                                        <p class="text-[13px] font-bold text-[#1A2332]">{{ shift.user?.name || 'User Terhapus' }}</p>
                                        <p class="text-[11px] text-[#5A7A9A] mt-0.5">
                                            <span class="font-bold text-[#2E7DD6]">{{ shift.shift?.name || 'Tanpa Jadwal' }}</span> 
                                            • {{ shift.outlet?.name || 'Outlet' }}
                                        </p>
                                    </td>
                                    <td class="px-5 py-3">
                                        <p class="text-[12px] text-[#1A2332]">{{ formatDateTime(shift.started_at) }}</p>
                                        <p v-if="shift.ended_at" class="text-[11px] text-[#8AAFCC] font-['JetBrains_Mono']">s/d {{ formatDateTime(shift.ended_at) }}</p>
                                        <p v-else :class="['text-[10px] font-bold italic mt-0.5', isPastShift(shift.started_at) ? 'text-[#B83B2A]' : 'text-[#C4860A]']">
                                            {{ isPastShift(shift.started_at) ? 'Lewat Hari (Lupa Tutup)' : 'Masih Berjalan' }}
                                        </p>
                                    </td>
                                    <td class="px-5 py-3 text-[13px] text-[#1B4F8A] font-['JetBrains_Mono']">Rp {{ formatRupiah(shift.opening_balance) }}</td>
                                    <td class="px-5 py-3 text-right">
                                        <span v-if="shift.status === 'closed' && shift.closing_balance_actual !== null" :class="['text-[12px] font-bold font-[JetBrains_Mono]', shift.difference < 0 ? 'text-[#B83B2A]' : 'text-[#2A7A4B]']">
                                            {{ shift.difference > 0 ? '+' : '' }}{{ formatRupiah(shift.difference) }}
                                        </span>
                                        <span v-else-if="shift.status === 'closed' && shift.closing_balance_actual === null" class="text-[11px] font-bold text-[#B83B2A] italic">
                                            Menunggu Manager
                                        </span>
                                        <span v-else :class="['text-[11px] italic font-medium', isPastShift(shift.started_at) ? 'text-[#B83B2A]' : 'text-[#8AAFCC]']">
                                            {{ isPastShift(shift.started_at) ? 'Segera Tutup Paksa' : 'Belum dihitung' }}
                                        </span>
                                    </td>
                                    <td class="px-5 py-3 text-center">
                                        <span v-if="shift.status === 'active' && !isPastShift(shift.started_at)" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-orange-50 text-[#C4860A] border-orange-200">
                                            Open
                                        </span>
                                        <span v-else-if="shift.status === 'active' && isPastShift(shift.started_at)" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-red-50 text-[#B83B2A] border-red-200 flex items-center justify-center gap-1 w-fit mx-auto">
                                            <span class="w-1.5 h-1.5 rounded-full bg-[#B83B2A] animate-pulse"></span>
                                            LUPA TUTUP
                                        </span>
                                        <span v-else-if="shift.status === 'closed' && shift.closing_balance_actual === null" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-red-50 text-[#B83B2A] border-red-200 flex items-center justify-center gap-1 w-fit mx-auto">
                                            <span class="w-1.5 h-1.5 rounded-full bg-[#B83B2A] animate-pulse"></span>
                                            VERIFIKASI
                                        </span>
                                        <span v-else class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-[#EBF3FB] text-[#1B4F8A] border-[#D4E4F4]">
                                            Closed
                                        </span>
                                    </td>
                                    <td class="px-5 py-3 text-right whitespace-nowrap">
                                        <button @click="selectedShift = shift" class="text-[#2E7DD6] hover:text-[#1B4F8A] p-1.5 transition-colors bg-[#EBF3FB] hover:bg-[#D4E4F4] rounded-lg mr-1" title="Detail Audit"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                                        <button @click="confirmDelete(shift, 'report')" class="text-[#B83B2A] hover:text-red-800 p-1.5 transition-colors bg-red-50 hover:bg-red-100 rounded-lg" title="Hapus Data"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="p-4 bg-white border-t border-[#D4E4F4] flex justify-between items-center" v-if="totalPages > 1">
                        <p class="text-[12px] text-[#5A7A9A]">Halaman <span class="font-bold text-[#1A2332] font-['JetBrains_Mono']">{{ currentPage }}</span> dari <span class="font-bold text-[#1A2332] font-['JetBrains_Mono']">{{ totalPages }}</span></p>
                        <div class="flex gap-2">
                            <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 border border-[#D4E4F4] rounded-lg text-[12px] text-[#1A2332] disabled:opacity-50 transition-colors hover:bg-[#F7FAFD]">Prev</button>
                            <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 border border-[#D4E4F4] rounded-lg text-[12px] text-[#1A2332] disabled:opacity-50 transition-colors hover:bg-[#F7FAFD]">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="scheduleModal.show" class="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4 font-['Poppins']">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-[#D4E4F4]">
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <h3 class="text-[16px] font-bold text-[#1A2332]">{{ scheduleModal.isEdit ? 'Edit Shift' : 'Buat Shift' }}</h3>
                    <button @click="scheduleModal.show = false" class="text-[#8AAFCC] hover:text-[#B83B2A] transition-colors focus:outline-none"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <form @submit.prevent="submitSchedule" class="p-6 space-y-4">
                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Outlet <span class="text-[#B83B2A]">*</span></label>
                        <select v-model="formSchedule.outlet_id" required class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6] bg-white">
                            <option value="" disabled>Pilih Outlet</option>
                            <option v-for="out in outlets" :key="out.id" :value="out.id">{{ out.name }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Nama Shift <span class="text-[#B83B2A]">*</span></label>
                        <input type="text" v-model="formSchedule.name" required placeholder="Contoh: Shift Pagi" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6]">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Jam Mulai <span class="text-[#B83B2A]">*</span></label>
                            <input type="time" v-model="formSchedule.start_time" required class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6] font-['JetBrains_Mono']">
                        </div>
                        <div>
                            <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Jam Selesai <span class="text-[#B83B2A]">*</span></label>
                            <input type="time" v-model="formSchedule.end_time" required class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6] font-['JetBrains_Mono']">
                        </div>
                    </div>
                    <div class="pt-4 flex justify-end gap-2 border-t border-[#D4E4F4]">
                        <button type="button" @click="scheduleModal.show = false" class="px-4 py-2 text-[13px] font-medium text-[#5A7A9A] hover:bg-[#F0F4F8] rounded-lg transition-colors">Batal</button>
                        <button type="submit" :disabled="scheduleModal.isSubmitting" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:opacity-50 text-white text-[13px] font-semibold rounded-lg transition-colors">
                            {{ scheduleModal.isSubmitting ? 'Loading...' : 'Simpan Shift' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="dayModal.show" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm px-4 font-['Poppins']">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-gray-100">
                
                <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                    <div>
                        <h3 class="text-[16px] font-bold text-gray-800">Penugasan Shift</h3>
                        <p class="text-[12px] text-gray-500 mt-0.5">{{ formattedModalDate }}</p>
                    </div>
                    <button @click="dayModal.show = false" class="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-full focus:outline-none">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div class="p-5 border-b border-gray-100 shrink-0 bg-blue-50/40 relative z-10">
                    <form @submit.prevent="submitDaySchedule" class="flex flex-col sm:flex-row items-end gap-3">
                        <div class="w-full">
                            <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1.5 tracking-wide">Pilih Shift</label>
                            <select v-model="dayModal.form.shift_id" required class="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer shadow-sm transition-all">
                                <option value="" disabled>Pilih shift...</option>
                                <option v-for="shift in filteredSchedules" :key="shift.id" :value="shift.id">{{ shift.name }} ({{ (shift.start_time||'').substring(0,5) }}-{{ (shift.end_time||'').substring(0,5) }})</option>
                            </select>
                        </div>
                        <div class="w-full">
                            <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1.5 tracking-wide">Karyawan</label>
                            <select v-model="dayModal.form.user_id" required class="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer shadow-sm transition-all">
                                <option value="" disabled>Pilih karyawan...</option>
                                <option v-for="emp in employees" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
                            </select>
                        </div>
                        <button type="submit" :disabled="dayModal.isSubmitting || !dayModal.form.shift_id || !dayModal.form.user_id" class="h-[38px] w-full sm:w-[46px] bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:opacity-50 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm shrink-0" title="Tambahkan ke Jadwal">
                            <svg v-if="!dayModal.isSubmitting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                            <svg v-else class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        </button>
                    </form>
                </div>

                <div class="p-5 bg-white overflow-y-auto custom-scrollbar grow">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="text-[13px] font-bold text-gray-800">Daftar Karyawan Bertugas</h4>
                        <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded border tracking-wide">{{ dayModal.schedules.length }} ORANG</span>
                    </div>

                    <div v-if="dayModal.schedules.length === 0" class="flex flex-col items-center justify-center py-6 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <svg class="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        <p class="text-[12px] font-medium text-gray-500">Belum ada karyawan dijadwalkan.</p>
                    </div>
                    
                    <div v-else class="space-y-2">
                        <div v-for="sched in dayModal.schedules" :key="sched.id" class="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors group">
                            <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 w-full mr-3 overflow-hidden">
                                <p class="text-[13px] font-bold text-gray-800 truncate w-full sm:w-1/2">{{ sched.user?.name || 'User Terhapus' }}</p>
                                <div class="flex items-center gap-2 shrink-0">
                                    <span :class="`px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${getShiftColorClass(sched.shift_id, false)}`">
                                        {{ sched.shift?.name || 'Unknown' }}
                                    </span>
                                    <span class="text-[11px] text-gray-500 font-['JetBrains_Mono']">
                                        {{ sched.shift?.start_time?.substring(0,5) }} - {{ sched.shift?.end_time?.substring(0,5) }}
                                    </span>
                                </div>
                            </div>
                            <button @click="confirmDelete(sched, 'schedule_calendar')" class="text-gray-400 hover:text-red-600 p-1.5 transition-colors bg-transparent hover:bg-red-50 rounded-md shrink-0 border border-transparent hover:border-red-100" title="Hapus Penugasan">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div v-if="autoGenModal.show" class="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4 font-['Poppins']">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-[#D4E4F4]">
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <h3 class="text-[16px] font-bold text-[#1A2332]">Auto-Generate Jadwal</h3>
                    <button @click="autoGenModal.show = false" class="text-[#8AAFCC] hover:text-[#B83B2A] transition-colors focus:outline-none"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div class="p-6 space-y-4">
                    <div class="bg-orange-50 border border-orange-200 text-[#C4860A] p-3 rounded-lg flex items-start gap-3">
                        <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        <p class="text-[12px] font-medium leading-relaxed">Peringatan: Melakukan auto-generate akan mereset jadwal shift karyawan di bulan ini, dan membaginya ulang secara rata.</p>
                    </div>
                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-1">Pilih Outlet</label>
                        <select v-model="autoGenModal.outlet_id" class="w-full px-3 py-2 text-[13px] rounded-lg border border-[#D4E4F4] outline-none focus:border-[#2E7DD6] bg-white">
                            <option value="" disabled>Pilih Outlet...</option>
                            <option v-for="out in outlets" :key="out.id" :value="out.id">{{ out.name }}</option>
                        </select>
                    </div>
                </div>
                <div class="px-6 py-4 flex justify-end gap-2 border-t border-[#D4E4F4] bg-[#F7FAFD]">
                    <button @click="autoGenModal.show = false" class="px-4 py-2 text-[13px] font-medium text-[#5A7A9A] hover:bg-[#D4E4F4] rounded-lg transition-colors">Batal</button>
                    <button @click="executeAutoGenerate" :disabled="autoGenModal.isGenerating || !autoGenModal.outlet_id" class="px-4 py-2 bg-[#1B4F8A] hover:bg-[#1A2332] disabled:opacity-50 text-white text-[13px] font-semibold rounded-lg transition-colors">
                        {{ autoGenModal.isGenerating ? 'Memproses...' : 'Generate Sekarang' }}
                    </button>
                </div>
            </div>
        </div>

        <div v-if="selectedShift" class="fixed inset-0 z-[60] flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4 font-['Poppins']">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-[#D4E4F4]">
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <h3 class="text-[16px] font-bold text-[#1A2332]">Detail Laporan Shift</h3>
                    <button @click="selectedShift = null" class="text-[#8AAFCC] hover:text-[#B83B2A] transition-colors focus:outline-none"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <div class="grid grid-cols-2 gap-y-2 text-[13px]">
                        <span class="text-[#5A7A9A]">Nama Kasir</span>
                        <span class="text-[#1A2332] font-bold text-right">{{ selectedShift.user?.name }}</span>
                        
                        <span class="text-[#5A7A9A]">Jadwal Shift</span>
                        <span class="text-[#1B4F8A] font-bold text-right">{{ selectedShift.shift?.name || 'Tanpa Jadwal' }}</span>
                        
                        <span class="text-[#5A7A9A]">Mulai Kerja</span>
                        <span class="text-[#1A2332] text-right font-['JetBrains_Mono']">{{ formatDateTime(selectedShift.started_at) }}</span>
                        
                        <span class="text-[#5A7A9A]">Selesai Kerja</span>
                        <span class="text-[#1A2332] text-right font-['JetBrains_Mono']">{{ selectedShift.ended_at ? formatDateTime(selectedShift.ended_at) : 'Masih Aktif' }}</span>
                    </div>

                    <div v-if="(selectedShift.status === 'closed' && selectedShift.closing_balance_actual === null) || selectedShift.status === 'active'" 
                         class="mt-4 p-4 rounded-xl space-y-3 animate-[fadeIn_0.3s_ease-out]"
                         :class="selectedShift.status === 'active' ? 'border border-orange-200 bg-orange-50' : 'border border-red-200 bg-red-50'">
                        
                        <div class="flex items-start gap-3">
                            <svg v-if="selectedShift.status === 'active'" class="w-5 h-5 text-[#C4860A] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <svg v-else class="w-5 h-5 text-[#B83B2A] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            
                            <div>
                                <h4 class="text-[13px] font-bold" :class="selectedShift.status === 'active' ? 'text-[#C4860A]' : 'text-[#B83B2A]'">
                                    {{ selectedShift.status === 'active' ? 'Shift Masih Berjalan (Lupa Tutup)' : 'Butuh Verifikasi Manajer' }}
                                </h4>
                                <p class="text-[11px] leading-relaxed mt-1" :class="selectedShift.status === 'active' ? 'text-orange-700' : 'text-red-700'">
                                    {{ selectedShift.status === 'active' ? 'Kasir belum menutup shift ini. Masukkan uang fisik di laci untuk menutup paksa shift.' : 'Laporan ini ditutup sistem karena kelalaian kasir. Masukkan jumlah fisik uang laci.' }}
                                </p>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-[11px] font-bold uppercase mb-1" :class="selectedShift.status === 'active' ? 'text-orange-800' : 'text-red-800'">Uang Laci Aktual</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span class="text-[13px] font-bold font-['JetBrains_Mono']" :class="selectedShift.status === 'active' ? 'text-[#C4860A]' : 'text-[#B83B2A]'">Rp</span>
                                </div>
                                <input type="text" v-model="formattedActualBalance" class="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border outline-none bg-white font-['JetBrains_Mono']" :class="selectedShift.status === 'active' ? 'border-orange-200 focus:border-orange-400' : 'border-red-200 focus:border-red-400'" placeholder="Contoh: 150.000">
                            </div>
                        </div>
                        
                        <button @click="resolveShift" :disabled="resolveForm.isSubmitting" class="w-full py-2 disabled:opacity-50 text-white text-[13px] font-semibold rounded-lg transition-colors mt-2" :class="selectedShift.status === 'active' ? 'bg-[#C4860A] hover:bg-orange-800' : 'bg-[#B83B2A] hover:bg-red-800'">
                            {{ resolveForm.isSubmitting ? 'Memproses...' : (selectedShift.status === 'active' ? 'Tutup Paksa Shift' : 'Verifikasi Laporan') }}
                        </button>
                    </div>

                    <div class="p-4 bg-[#F7FAFD] rounded-lg border border-[#D4E4F4] space-y-2 font-['JetBrains_Mono'] text-[13px]">
                        <div class="flex justify-between text-[#5A7A9A]"><span>Modal Awal</span><span>Rp {{ formatRupiah(selectedShift.opening_balance) }}</span></div>
                        <div class="flex justify-between text-[#2A7A4B] font-bold"><span>Total Tunai Masuk</span><span>+ Rp {{ formatRupiah((selectedShift.closing_balance_system || 0) - (selectedShift.opening_balance || 0)) }}</span></div>
                        <div class="h-px bg-[#D4E4F4] my-1"></div>
                        <div class="flex justify-between text-[#1B4F8A] font-bold"><span>Seharusnya (Sistem)</span><span>Rp {{ formatRupiah(selectedShift.closing_balance_system) }}</span></div>
                        <div v-if="selectedShift.status === 'closed' && selectedShift.closing_balance_actual !== null" class="flex justify-between pt-2 border-t border-dashed border-[#D4E4F4]">
                            <span class="text-[#5A7A9A]">Uang Laci (Actual)</span><span class="text-[#1A2332] font-bold">Rp {{ formatRupiah(selectedShift.closing_balance_actual) }}</span>
                        </div>
                    </div>
                    <div v-if="selectedShift.status === 'closed' && selectedShift.closing_balance_actual !== null" class="flex justify-between p-3 rounded-lg border font-bold" :class="selectedShift.difference < 0 ? 'bg-red-50 text-[#B83B2A] border-red-100' : 'bg-green-50 text-[#2A7A4B] border-green-100'">
                        <span>Selisih Laci</span><span class="font-['JetBrains_Mono']">Rp {{ formatRupiah(selectedShift.difference) }}</span>
                    </div>
                    <div v-if="selectedShift.notes" class="pt-2">
                        <label class="block text-[11px] font-bold text-[#5A7A9A] uppercase mb-1">Catatan</label>
                        <p class="text-[12px] text-[#1A2332] bg-gray-50 p-2.5 rounded border border-dashed border-[#D4E4F4] leading-relaxed">{{ selectedShift.notes }}</p>
                    </div>
                </div>
                <div class="px-6 py-4 border-t border-[#D4E4F4] bg-[#F7FAFD] flex justify-end">
                    <button @click="selectedShift = null" class="px-5 py-2 bg-[#1B4F8A] text-white text-[13px] font-semibold rounded-lg transition-colors hover:bg-[#1A2332]">Tutup</button>
                </div>
            </div>
        </div>

        <div v-if="deleteModal.show" class="fixed inset-0 z-[80] flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4 font-['Poppins']">
            <div class="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden border border-[#D4E4F4] text-center p-6">
                <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 border border-red-100">
                    <svg class="w-6 h-6 text-[#B83B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 class="text-[18px] font-bold text-[#1A2332] mb-2">Hapus Data?</h3>
                <p class="text-[14px] text-[#5A7A9A] mb-6">Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.</p>
                <div class="flex justify-center gap-3">
                    <button @click="deleteModal.show = false" class="px-4 py-2 w-full text-[14px] font-medium text-[#5A7A9A] bg-[#F0F4F8] hover:bg-[#D4E4F4] rounded-lg transition-colors">Batal</button>
                    <button @click="executeDelete" :disabled="deleteModal.isDeleting" class="px-4 py-2 w-full text-[14px] font-semibold text-white bg-[#B83B2A] hover:bg-red-800 disabled:opacity-50 rounded-lg transition-colors">
                        {{ deleteModal.isDeleting ? 'Proses...' : 'Hapus' }}
                    </button>
                </div>
            </div>
        </div>

    </AdminLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import AdminLayout from '../components/adminlayout.vue';

const apiBase = 'https://api.etres.my.id/api/v1';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('auth_token')}` });

const activeTab = ref('kalender'); 
const alert = reactive({ show: false, message: '', type: 'success' });
const showAlert = (msg, type = 'success') => { alert.message = msg; alert.type = type; alert.show = true; setTimeout(() => alert.show = false, 4000); };

const outlets = ref([]);
const employees = ref([]);

// --- STATE TAB 1: MASTER SHIFT ---
const schedules = ref([]);
const isLoadingSchedules = ref(true);
const scheduleModal = reactive({ show: false, isEdit: false, id: null, isSubmitting: false });
const formSchedule = reactive({ outlet_id: '', name: '', start_time: '08:00', end_time: '16:00' });
const searchScheduleQuery = ref('');
const selectedScheduleOutlet = ref('');

// Auto-Generate State
const autoGenModal = reactive({ show: false, outlet_id: '', isGenerating: false });

// --- STATE TAB 2: KALENDER JADWAL KARYAWAN ---
const currentDate = ref(new Date());
const currentMonth = computed(() => currentDate.value.getMonth());
const currentYear = computed(() => currentDate.value.getFullYear());
const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const selectedCalendarOutlet = ref('');

const allCalendarSchedules = ref([]); 
const dayModal = reactive({ show: false, date: null, schedules: [], form: { shift_id: '', user_id: '' }, isSubmitting: false });

const shiftColors = [
    'bg-blue-50 text-[#1B4F8A] border-blue-200',
    'bg-green-50 text-[#2A7A4B] border-green-200',
    'bg-orange-50 text-[#C4860A] border-orange-200',
    'bg-purple-50 text-purple-700 border-purple-200',
    'bg-teal-50 text-teal-700 border-teal-200'
];

// --- STATE TAB 3: LAPORAN KASIR ---
const shifts = ref([]);
const isLoadingReports = ref(true);
const searchReportQuery = ref('');
const selectedReportOutlet = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const selectedShift = ref(null);

const resolveForm = reactive({ actual_closing_balance: '', isSubmitting: false });
const deleteModal = reactive({ show: false, id: null, type: '', isDeleting: false });

// Reset Form saat modal dibuka
watch(selectedShift, (newVal) => {
    if (newVal) {
        resolveForm.actual_closing_balance = '';
    }
});

// --- UTILS ---
const formatRupiah = (val) => new Intl.NumberFormat('id-ID').format(val || 0);
const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};
const formatDateForApi = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};
const isPastShift = (dateStr) => {
    if (!dateStr) return false;
    const shiftDate = new Date(dateStr);
    shiftDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return shiftDate < today;
};
const getOutletName = (id) => {
    const out = outlets.value.find(o => o.id === id);
    return out ? out.name : 'Outlet Tidak Diketahui';
};
const getShiftColorClass = (shiftId, isDot = false) => {
    const index = schedules.value.findIndex(s => s.id === shiftId);
    if (index === -1) return isDot ? 'bg-gray-400' : 'bg-gray-50 text-gray-700 border-gray-200';
    if (isDot) { return shiftColors[index % shiftColors.length].split(' ')[1].replace('text-', 'bg-'); }
    return shiftColors[index % shiftColors.length];
};

// --- DATA FETCHING ---
const fetchInitialData = async () => {
    try {
        const [resOutlets, resUsers] = await Promise.all([
            axios.get(`${apiBase}/outlets?limit=100`, { headers: authHeaders() }),
            axios.get(`${apiBase}/users?limit=1000`, { headers: authHeaders() }) 
        ]);
        outlets.value = resOutlets.data.data?.data || resOutlets.data.data || [];
        const allUsers = resUsers.data.data?.data || resUsers.data.data || resUsers.data || [];
        employees.value = allUsers.filter(u => u.role === 'karyawan');
        
        if (outlets.value.length === 1) {
            const outId = outlets.value[0].id;
            formSchedule.outlet_id = outId;
            selectedScheduleOutlet.value = outId;
            selectedCalendarOutlet.value = outId;
            selectedReportOutlet.value = outId;
        }
    } catch (e) { console.error("Gagal menarik data awal:", e); }
};

const fetchSchedules = async () => {
    isLoadingSchedules.value = true;
    try {
        const res = await axios.get(`${apiBase}/shifts`, { headers: authHeaders() });
        schedules.value = res.data.data?.data || res.data.data || res.data || [];
    } catch (e) {
        console.warn("Gagal menarik data master shift.", e);
        schedules.value = [];
    } finally { isLoadingSchedules.value = false; }
};

const fetchCalendarSchedules = async () => {
    try {
        if (!calendarGrid.value || calendarGrid.value.length === 0) return;
        const startDate = formatDateForApi(calendarGrid.value[0].date);
        const endDate = formatDateForApi(calendarGrid.value[calendarGrid.value.length - 1].date);
        const params = { start_date: startDate, end_date: endDate };
        if (selectedCalendarOutlet.value) params.outlet_id = selectedCalendarOutlet.value;
        const res = await axios.get(`${apiBase}/schedules`, { params, headers: authHeaders() });
        allCalendarSchedules.value = res.data.data || [];
    } catch (e) { console.error("Gagal menarik data kalender:", e); }
};

const fetchReports = async () => {
    isLoadingReports.value = true;
    try {
        const res = await axios.get(`${apiBase}/shift-karyawans`, { headers: authHeaders() });
        shifts.value = res.data.data?.data || res.data.data || res.data || [];
    } catch (e) { console.error("Gagal menarik laporan kasir:", e); } 
    finally { isLoadingReports.value = false; }
};

// --- KALENDER LOGIC ---
const calendarGrid = computed(() => {
    const year = currentYear.value;
    const month = currentMonth.value;
    const firstDay = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const grid = [];
    for (let i = firstDay - 1; i >= 0; i--) { grid.push({ date: new Date(year, month - 1, daysInPrevMonth - i), isCurrent: false }); }
    for (let i = 1; i <= daysInMonth; i++) { grid.push({ date: new Date(year, month, i), isCurrent: true }); }
    const remaining = 42 - grid.length;
    for (let i = 1; i <= remaining; i++) { grid.push({ date: new Date(year, month + 1, i), isCurrent: false }); }
    return grid;
});

const prevMonth = () => { currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1); fetchCalendarSchedules(); };
const nextMonth = () => { currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1); fetchCalendarSchedules(); };
const getSchedulesForDate = (date) => {
    const dateStr = formatDateForApi(date);
    return allCalendarSchedules.value.filter(s => {
        const matchDate = s.date === dateStr;
        const matchOutlet = selectedCalendarOutlet.value === '' || s.outlet_id == selectedCalendarOutlet.value;
        return matchDate && matchOutlet;
    });
};
const formattedModalDate = computed(() => {
    if (!dayModal.date) return '';
    return dayModal.date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
});
const openDayModal = (dateObj) => {
    dayModal.date = dateObj;
    dayModal.schedules = getSchedulesForDate(dateObj);
    dayModal.form.shift_id = '';
    dayModal.form.user_id = '';
    dayModal.show = true;
};
const submitDaySchedule = async () => {
    dayModal.isSubmitting = true;
    try {
        const payload = {
            outlet_id: selectedCalendarOutlet.value || outlets.value[0]?.id,
            shift_id: dayModal.form.shift_id,
            user_ids: [dayModal.form.user_id],
            date: formatDateForApi(dayModal.date)
        };
        await axios.post(`${apiBase}/schedules`, payload, { headers: authHeaders() });
        showAlert("Berhasil menambahkan jadwal karyawan.", "success");
        await fetchCalendarSchedules();
        dayModal.schedules = getSchedulesForDate(dayModal.date); 
        dayModal.form.shift_id = '';
        dayModal.form.user_id = '';
    } catch (e) {
        showAlert(e.response?.data?.message || "Gagal menambahkan jadwal karyawan.", "error");
    } finally { dayModal.isSubmitting = false; }
};

// --- MASTER SHIFT LOGIC ---
const openScheduleModal = (item = null) => {
    scheduleModal.isEdit = !!item;
    if (item) {
        scheduleModal.id = item.id;
        formSchedule.outlet_id = item.outlet_id;
        formSchedule.name = item.name;
        formSchedule.start_time = item.start_time ? item.start_time.substring(0,5) : '08:00';
        formSchedule.end_time = item.end_time ? item.end_time.substring(0,5) : '16:00';
    } else {
        scheduleModal.id = null;
        formSchedule.name = ''; 
        formSchedule.start_time = '08:00'; 
        formSchedule.end_time = '16:00'; 
        if (outlets.value.length === 1) { formSchedule.outlet_id = outlets.value[0].id; }
    }
    scheduleModal.show = true;
};
const submitSchedule = async () => {
    scheduleModal.isSubmitting = true;
    try {
        const url = scheduleModal.isEdit ? `${apiBase}/shifts/${scheduleModal.id}` : `${apiBase}/shifts`;
        const method = scheduleModal.isEdit ? 'put' : 'post';
        const payload = { ...formSchedule, start_time: formSchedule.start_time.substring(0, 5), end_time: formSchedule.end_time.substring(0, 5) };
        await axios[method](url, payload, { headers: authHeaders() });
        showAlert(`Shift berhasil ${scheduleModal.isEdit ? 'diperbarui' : 'dibuat'}.`, 'success');
        scheduleModal.show = false;
        fetchSchedules();
    } catch (e) { showAlert(e.response?.data?.message || "Gagal menyimpan master shift.", "error"); } 
    finally { scheduleModal.isSubmitting = false; }
};

// --- AUTO GENERATE LOGIC ---
const openAutoGenerateModal = () => {
    if (outlets.value.length === 1) { autoGenModal.outlet_id = outlets.value[0].id; } 
    else { autoGenModal.outlet_id = ''; }
    autoGenModal.show = true;
};
const executeAutoGenerate = async () => {
    if (!autoGenModal.outlet_id) return;
    autoGenModal.isGenerating = true;
    try {
        const res = await axios.post(`${apiBase}/shifts/auto-generate`, { outlet_id: autoGenModal.outlet_id }, { headers: authHeaders() });
        showAlert(res.data.message || 'Jadwal berhasil digenerate otomatis.', 'success');
        autoGenModal.show = false;
        fetchCalendarSchedules();
    } catch (e) { showAlert(e.response?.data?.message || "Gagal men-generate jadwal otomatis.", "error"); } 
    finally { autoGenModal.isGenerating = false; }
};

// --- VERIFIKASI AUTO-CLOSE (RESOLVE) LOGIC ---
// Computed property untuk memformat input secara otomatis (real-time ribuan)
const formattedActualBalance = computed({
    get: () => {
        if (resolveForm.actual_closing_balance === '' || resolveForm.actual_closing_balance === null) return '';
        return formatRupiah(resolveForm.actual_closing_balance);
    },
    set: (val) => {
        const numericString = val.replace(/\D/g, '');
        resolveForm.actual_closing_balance = numericString ? parseInt(numericString, 10) : '';
    }
});

const resolveShift = async () => {
    if (resolveForm.actual_closing_balance === '' || resolveForm.actual_closing_balance === null) {
        showAlert('Silakan masukkan jumlah uang aktual di laci', 'error');
        return;
    }
    resolveForm.isSubmitting = true;
    try {
        const payload = { actual_closing_balance: parseInt(resolveForm.actual_closing_balance) };
        const res = await axios.put(`${apiBase}/shift-karyawans/${selectedShift.value.id}/resolve`, payload, { headers: authHeaders() });
        
        const successMessage = selectedShift.value.status === 'active' 
            ? 'Shift berhasil ditutup paksa.' 
            : 'Laporan berhasil diverifikasi oleh Manajer.';
            
        showAlert(successMessage, 'success');
        selectedShift.value = res.data.data;
        const index = shifts.value.findIndex(s => s.id === selectedShift.value.id);
        if (index !== -1) { shifts.value[index] = res.data.data; }
    } catch (e) { 
        showAlert(e.response?.data?.message || "Gagal memproses shift.", "error"); 
    } 
    finally { resolveForm.isSubmitting = false; }
};

// --- DELETE LOGIC ---
const confirmDelete = (item, type) => { deleteModal.id = item.id; deleteModal.type = type; deleteModal.show = true; };
const executeDelete = async () => {
    deleteModal.isDeleting = true;
    try {
        let endpoint = '';
        if (deleteModal.type === 'master') endpoint = `shifts/${deleteModal.id}`;
        else if (deleteModal.type === 'schedule_calendar') endpoint = `schedules/${deleteModal.id}`;
        else if (deleteModal.type === 'report') endpoint = `shift-karyawans/${deleteModal.id}`;
        await axios.delete(`${apiBase}/${endpoint}`, { headers: authHeaders() });
        showAlert("Data berhasil dihapus.", "success");
        deleteModal.show = false;
        if (deleteModal.type === 'master') fetchSchedules();
        else if (deleteModal.type === 'schedule_calendar') {
            await fetchCalendarSchedules();
            if(dayModal.show) dayModal.schedules = getSchedulesForDate(dayModal.date);
        }
        else fetchReports();
    } catch (e) { showAlert("Gagal menghapus data.", "error"); } 
    finally { deleteModal.isDeleting = false; }
};

// --- COMPUTEDS (TAB 1 & 3) ---
const filteredSchedules = computed(() => {
    const query = searchScheduleQuery.value.toLowerCase();
    return schedules.value.filter(s => {
        const matchName = (s.name || '').toLowerCase().includes(query);
        const matchOutlet = selectedScheduleOutlet.value === '' || s.outlet_id == selectedScheduleOutlet.value;
        return matchName && matchOutlet;
    });
});
const filteredReports = computed(() => {
    const query = searchReportQuery.value.toLowerCase();
    return shifts.value.filter(s => {
        const matchSearch = (s.user?.name || '').toLowerCase().includes(query);
        const matchOutlet = selectedReportOutlet.value === '' || s.outlet_id == selectedReportOutlet.value;
        return matchSearch && matchOutlet;
    });
});
const activeShiftsCount = computed(() => filteredReports.value.filter(s => s.status === 'active').length);
const totalDifference = computed(() => filteredReports.value.reduce((acc, curr) => (curr.closing_balance_actual !== null ? acc + (parseInt(curr.difference) || 0) : acc), 0));
const totalPages = computed(() => Math.ceil(filteredReports.value.length / itemsPerPage.value));
const paginatedReports = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return filteredReports.value.slice(start, start + itemsPerPage.value);
});

watch(activeTab, (newVal) => {
    if (newVal === 'master' && schedules.value.length === 0) fetchSchedules();
    if (newVal === 'kalender' && allCalendarSchedules.value.length === 0) { fetchSchedules(); fetchCalendarSchedules(); }
    if (newVal === 'laporan' && shifts.value.length === 0) fetchReports();
});

onMounted(async () => { await fetchInitialData(); fetchSchedules(); fetchCalendarSchedules(); });
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #D4E4F4; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8AAFCC; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>