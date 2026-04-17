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

            <div class="flex gap-4 border-b border-[#D4E4F4]">
                <button @click="activeTab = 'jadwal'" class="px-4 py-2.5 text-[14px] font-semibold transition-colors border-b-2" :class="activeTab === 'jadwal' ? 'text-[#1B4F8A] border-[#1B4F8A]' : 'text-[#5A7A9A] border-transparent hover:text-[#1A2332]'">
                    Pengaturan Jadwal
                </button>
                <button @click="activeTab = 'laporan'" class="px-4 py-2.5 text-[14px] font-semibold transition-colors border-b-2" :class="activeTab === 'laporan' ? 'text-[#1B4F8A] border-[#1B4F8A]' : 'text-[#5A7A9A] border-transparent hover:text-[#1A2332]'">
                    Laporan Audit Kasir
                </button>
            </div>

            <div v-if="activeTab === 'jadwal'" class="animate-[fadeIn_0.3s_ease-out]">
                <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden flex flex-col">
                    
                    <div class="p-4 border-b border-[#D4E4F4] bg-[#F7FAFD] space-y-4">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 class="text-[15px] font-bold text-[#1A2332]">Jadwal Shift Master</h3>
                                <p class="text-[12px] text-[#5A7A9A] mt-0.5">Atur jam kerja dan ploting karyawan yang bertugas.</p>
                            </div>
                            <button @click="openScheduleModal()" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] text-white text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap w-fit">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                                Tambah Jadwal
                            </button>
                        </div>

                        <div class="flex flex-wrap items-center gap-3 pt-2 border-t border-[#D4E4F4]">
                            <div class="relative w-full sm:w-64">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </div>
                                <input type="text" v-model="searchScheduleQuery" placeholder="Cari nama shift..." class="w-full pl-9 pr-3 py-1.5 text-[13px] rounded-lg border border-[#D4E4F4] focus:outline-none focus:border-[#2E7DD6] text-[#1A2332] transition-colors">
                            </div>
                            <select v-if="outlets.length > 1" v-model="selectedScheduleOutlet" class="border border-[#D4E4F4] bg-white text-[#1A2332] text-[13px] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2E7DD6]">
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
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Karyawan Bertugas</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-[#EBF3FB]">
                                <tr v-if="isLoadingSchedules">
                                    <td colspan="5" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] animate-pulse font-medium">Memuat jadwal shift...</td>
                                </tr>
                                <tr v-else-if="filteredSchedules.length === 0">
                                    <td colspan="5" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC] font-medium">Tidak ada jadwal shift yang sesuai filter.</td>
                                </tr>
                                <tr v-else v-for="schedule in filteredSchedules" :key="schedule.id" class="hover:bg-[#F7FAFD] transition-colors">
                                    <td class="px-5 py-3 font-bold text-[#1A2332] text-[13px]">{{ schedule.name }}</td>
                                    <td class="px-5 py-3 text-[12px] font-medium text-[#1A2332]">
                                        {{ getOutletName(schedule.outlet_id) }}
                                    </td>
                                    <td class="px-5 py-3">
                                        <span class="inline-block px-2.5 py-1 bg-[#EBF3FB] text-[#1B4F8A] rounded-lg text-[12px] font-bold font-['JetBrains_Mono'] border border-[#D4E4F4]">
                                            {{ (schedule.start_time || '').substring(0,5) }} - {{ (schedule.end_time || '').substring(0,5) }}
                                        </span>
                                    </td>
                                    <td class="px-5 py-3">
                                        <div class="flex flex-wrap gap-1.5">
                                            <span v-for="user in schedule.users" :key="user.id" class="text-[11px] bg-white border border-[#D4E4F4] text-[#5A7A9A] px-2 py-0.5 rounded shadow-sm">
                                                {{ user.name }}
                                            </span>
                                            <span v-if="!schedule.users || schedule.users.length === 0" class="text-[11px] text-[#B83B2A] italic">Belum ada karyawan</span>
                                        </div>
                                    </td>
                                    <td class="px-5 py-3 text-right whitespace-nowrap">
                                        <button @click="openScheduleModal(schedule)" class="text-[#2E7DD6] hover:text-[#1B4F8A] p-1.5 transition-colors bg-[#EBF3FB] hover:bg-[#D4E4F4] rounded-lg mr-1" title="Edit Jadwal"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                        <button @click="confirmDeleteSchedule(schedule)" class="text-[#B83B2A] hover:text-red-800 p-1.5 transition-colors bg-red-50 hover:bg-red-100 rounded-lg" title="Hapus Jadwal"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div v-else-if="activeTab === 'laporan'" class="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-white border border-[#D4E4F4] p-5 rounded-xl shadow-sm">
                        <p class="text-[12px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1">Total Laporan</p>
                        <h3 class="text-[24px] font-bold text-[#1A2332] font-['JetBrains_Mono']">{{ shifts.length }}</h3>
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
                            <select v-if="outlets.length > 1" v-model="selectedReportOutlet" @change="currentPage = 1" class="border border-[#D4E4F4] bg-white text-[#1A2332] text-[13px] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2E7DD6]">
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
                                        <p class="text-[11px] text-[#5A7A9A]">{{ shift.outlet?.name || 'Outlet' }}</p>
                                    </td>
                                    <td class="px-5 py-3">
                                        <p class="text-[12px] text-[#1A2332]">{{ formatDateTime(shift.started_at) }}</p>
                                        <p v-if="shift.ended_at" class="text-[11px] text-[#8AAFCC] font-['JetBrains_Mono']">s/d {{ formatDateTime(shift.ended_at) }}</p>
                                        <p v-else class="text-[10px] text-[#C4860A] font-bold italic mt-0.5">Masih Aktif</p>
                                    </td>
                                    <td class="px-5 py-3 text-[13px] text-[#1B4F8A] font-['JetBrains_Mono']">Rp {{ formatRupiah(shift.opening_balance) }}</td>
                                    <td class="px-5 py-3 text-right">
                                        <span v-if="shift.status === 'closed'" :class="['text-[12px] font-bold font-[JetBrains_Mono]', shift.difference < 0 ? 'text-[#B83B2A]' : 'text-[#2A7A4B]']">
                                            {{ shift.difference > 0 ? '+' : '' }}{{ formatRupiah(shift.difference) }}
                                        </span>
                                        <span v-else class="text-[11px] text-[#8AAFCC] italic">Belum dihitung</span>
                                    </td>
                                    <td class="px-5 py-3 text-center">
                                        <span :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase border', shift.status === 'active' ? 'bg-orange-50 text-[#C4860A] border-orange-200' : 'bg-[#EBF3FB] text-[#1B4F8A] border-[#D4E4F4]']">
                                            {{ shift.status === 'active' ? 'Open' : 'Closed' }}
                                        </span>
                                    </td>
                                    <td class="px-5 py-3 text-right whitespace-nowrap">
                                        <button @click="selectedShift = shift" class="text-[#2E7DD6] hover:text-[#1B4F8A] p-1.5 transition-colors bg-[#EBF3FB] hover:bg-[#D4E4F4] rounded-lg mr-1" title="Detail Audit"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                                        <button @click="confirmDeleteReport(shift)" class="text-[#B83B2A] hover:text-red-800 p-1.5 transition-colors bg-red-50 hover:bg-red-100 rounded-lg" title="Hapus Data"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
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
                    <h3 class="text-[16px] font-bold text-[#1A2332]">{{ scheduleModal.isEdit ? 'Edit Jadwal Shift' : 'Buat Jadwal Shift' }}</h3>
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
                    <div>
                        <label class="block text-[12px] font-semibold text-[#5A7A9A] mb-2">Assign Karyawan (Opsional)</label>
                        <div class="space-y-2 p-3 border border-[#D4E4F4] rounded-lg bg-[#F0F4F8] max-h-40 overflow-y-auto custom-scrollbar">
                            <label v-for="emp in employees" :key="emp.id" class="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded border border-[#D4E4F4] hover:border-[#2E7DD6] transition-colors">
                                <input type="checkbox" :value="emp.id" v-model="formSchedule.user_ids" class="w-4 h-4 text-[#2E7DD6] rounded focus:ring-0">
                                <span class="text-[13px] font-medium text-[#1A2332]">{{ emp.name }}</span>
                            </label>
                            <div v-if="employees.length === 0" class="text-center text-[12px] text-[#8AAFCC] py-2">Tidak ada karyawan di outlet ini.</div>
                        </div>
                    </div>
                    <div class="pt-4 flex justify-end gap-2 border-t border-[#D4E4F4]">
                        <button type="button" @click="scheduleModal.show = false" class="px-4 py-2 text-[13px] font-medium text-[#5A7A9A] hover:bg-[#F0F4F8] rounded-lg transition-colors">Batal</button>
                        <button type="submit" :disabled="scheduleModal.isSubmitting" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:opacity-50 text-white text-[13px] font-semibold rounded-lg transition-colors">
                            {{ scheduleModal.isSubmitting ? 'Loading...' : 'Simpan Jadwal' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="selectedShift" class="fixed inset-0 z-[60] flex items-center justify-center bg-[#1A2332]/50 backdrop-blur-sm px-4 font-['Poppins']">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-[#D4E4F4]">
                <div class="px-6 py-4 border-b border-[#D4E4F4] flex justify-between items-center bg-[#F7FAFD]">
                    <h3 class="text-[16px] font-bold text-[#1A2332]">Detail Laporan Shift</h3>
                    <button @click="selectedShift = null" class="text-[#8AAFCC] hover:text-[#B83B2A] transition-colors focus:outline-none"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div class="p-6 space-y-4">
                    <div class="grid grid-cols-2 gap-y-2 text-[13px]">
                        <span class="text-[#5A7A9A]">Nama Kasir</span><span class="text-[#1A2332] font-bold text-right">{{ selectedShift.user?.name }}</span>
                        <span class="text-[#5A7A9A]">Mulai Shift</span><span class="text-[#1A2332] text-right font-['JetBrains_Mono']">{{ formatDateTime(selectedShift.started_at) }}</span>
                        <span class="text-[#5A7A9A]">Selesai Shift</span><span class="text-[#1A2332] text-right font-['JetBrains_Mono']">{{ selectedShift.ended_at ? formatDateTime(selectedShift.ended_at) : 'Masih Aktif' }}</span>
                    </div>
                    <div class="p-4 bg-[#F7FAFD] rounded-lg border border-[#D4E4F4] space-y-2 font-['JetBrains_Mono'] text-[13px]">
                        <div class="flex justify-between text-[#5A7A9A]"><span>Modal Awal</span><span>Rp {{ formatRupiah(selectedShift.opening_balance) }}</span></div>
                        <div class="flex justify-between text-[#2A7A4B] font-bold"><span>Total Tunai Masuk</span><span>+ Rp {{ formatRupiah((selectedShift.closing_balance_system || 0) - (selectedShift.opening_balance || 0)) }}</span></div>
                        <div class="h-px bg-[#D4E4F4] my-1"></div>
                        <div class="flex justify-between text-[#1B4F8A] font-bold"><span>Seharusnya (Sistem)</span><span>Rp {{ formatRupiah(selectedShift.closing_balance_system) }}</span></div>
                        <div v-if="selectedShift.status === 'closed'" class="flex justify-between pt-2 border-t border-dashed border-[#D4E4F4]">
                            <span class="text-[#5A7A9A]">Uang Laci (Actual)</span><span class="text-[#1A2332] font-bold">Rp {{ formatRupiah(selectedShift.closing_balance_actual) }}</span>
                        </div>
                    </div>
                    <div v-if="selectedShift.status === 'closed'" class="flex justify-between p-3 rounded-lg border font-bold" :class="selectedShift.difference < 0 ? 'bg-red-50 text-[#B83B2A] border-red-100' : 'bg-green-50 text-[#2A7A4B] border-green-100'">
                        <span>Selisih Laci</span><span class="font-['JetBrains_Mono']">Rp {{ formatRupiah(selectedShift.difference) }}</span>
                    </div>
                    <div v-if="selectedShift.notes" class="pt-2">
                        <label class="block text-[11px] font-bold text-[#5A7A9A] uppercase mb-1">Catatan Kasir</label>
                        <p class="text-[12px] text-[#1A2332] bg-gray-50 p-2.5 rounded border border-dashed border-[#D4E4F4]">{{ selectedShift.notes }}</p>
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
                <p class="text-[14px] text-[#5A7A9A] mb-6">Yakin ingin menghapus data {{ deleteModal.type === 'schedule' ? 'jadwal shift' : 'laporan audit' }} ini?</p>
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

const activeTab = ref('jadwal'); // 'jadwal' | 'laporan'
const alert = reactive({ show: false, message: '', type: 'success' });
const showAlert = (msg, type = 'success') => { alert.message = msg; alert.type = type; alert.show = true; setTimeout(() => alert.show = false, 4000); };

const outlets = ref([]);
const employees = ref([]);

// --- STATE TAB 1: JADWAL SHIFT ---
const schedules = ref([]);
const isLoadingSchedules = ref(true);
const scheduleModal = reactive({ show: false, isEdit: false, id: null, isSubmitting: false });
const formSchedule = reactive({ outlet_id: '', name: '', start_time: '08:00', end_time: '16:00', user_ids: [] });
const searchScheduleQuery = ref('');
const selectedScheduleOutlet = ref('');

// --- STATE TAB 2: LAPORAN KASIR ---
const shifts = ref([]);
const isLoadingReports = ref(true);
const searchReportQuery = ref('');
const selectedReportOutlet = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const selectedShift = ref(null);

const deleteModal = reactive({ show: false, id: null, type: 'schedule', isDeleting: false });

const formatRupiah = (val) => new Intl.NumberFormat('id-ID').format(val || 0);
const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};
const getOutletName = (id) => {
    const out = outlets.value.find(o => o.id === id);
    return out ? out.name : 'Outlet Tidak Diketahui';
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
            formSchedule.outlet_id = outlets.value[0].id;
        }
    } catch (e) { console.error("Gagal menarik data awal:", e); }
};

const fetchSchedules = async () => {
    isLoadingSchedules.value = true;
    try {
        const res = await axios.get(`${apiBase}/shifts`, { headers: authHeaders() });
        schedules.value = res.data.data?.data || res.data.data || res.data || [];
    } catch (e) {
        console.warn("Gagal menarik data jadwal shift.", e);
        schedules.value = [];
    } finally { isLoadingSchedules.value = false; }
};

const fetchReports = async () => {
    isLoadingReports.value = true;
    try {
        const res = await axios.get(`${apiBase}/shift-karyawans`, { headers: authHeaders() });
        shifts.value = res.data.data?.data || res.data.data || res.data || [];
    } catch (e) { console.error("Gagal menarik laporan kasir:", e); } 
    finally { isLoadingReports.value = false; }
};

// --- JADWAL SHIFT LOGIC ---
const openScheduleModal = (item = null) => {
    scheduleModal.isEdit = !!item;
    if (item) {
        scheduleModal.id = item.id;
        formSchedule.outlet_id = item.outlet_id;
        formSchedule.name = item.name;
        formSchedule.start_time = item.start_time ? item.start_time.substring(0,5) : '08:00';
        formSchedule.end_time = item.end_time ? item.end_time.substring(0,5) : '16:00';
        formSchedule.user_ids = item.users ? item.users.map(u => u.id) : [];
    } else {
        scheduleModal.id = null;
        formSchedule.name = ''; 
        formSchedule.start_time = '08:00'; 
        formSchedule.end_time = '16:00'; 
        formSchedule.user_ids = [];
        if (outlets.value.length === 1) {
            formSchedule.outlet_id = outlets.value[0].id;
        }
    }
    scheduleModal.show = true;
};

const submitSchedule = async () => {
    scheduleModal.isSubmitting = true;
    try {
        const url = scheduleModal.isEdit ? `${apiBase}/shifts/${scheduleModal.id}` : `${apiBase}/shifts`;
        const method = scheduleModal.isEdit ? 'put' : 'post';
        
        const payload = {
            ...formSchedule,
            start_time: formSchedule.start_time.substring(0, 5),
            end_time: formSchedule.end_time.substring(0, 5),
        };
        
        await axios[method](url, payload, { headers: authHeaders() });
        showAlert(`Jadwal Shift berhasil ${scheduleModal.isEdit ? 'diperbarui' : 'dibuat'}.`, 'success');
        scheduleModal.show = false;
        fetchSchedules();
    } catch (e) {
        let errorMsg = "Gagal menyimpan jadwal. Pastikan field terisi dengan benar.";
        if (e.response && e.response.data && e.response.data.message) {
             errorMsg = e.response.data.message; 
        }
        showAlert(errorMsg, "error");
        console.error("Detail Error Submit:", e.response?.data);
    } finally { scheduleModal.isSubmitting = false; }
};

// --- DELETE LOGIC ---
const confirmDeleteSchedule = (item) => { deleteModal.id = item.id; deleteModal.type = 'schedule'; deleteModal.show = true; };
const confirmDeleteReport = (item) => { deleteModal.id = item.id; deleteModal.type = 'report'; deleteModal.show = true; };

const executeDelete = async () => {
    deleteModal.isDeleting = true;
    try {
        const endpoint = deleteModal.type === 'schedule' ? 'shifts' : 'shift-karyawans';
        await axios.delete(`${apiBase}/${endpoint}/${deleteModal.id}`, { headers: authHeaders() });
        showAlert("Data berhasil dihapus.", "success");
        deleteModal.show = false;
        
        if (deleteModal.type === 'schedule') fetchSchedules();
        else fetchReports();
    } catch (e) {
        showAlert("Gagal menghapus data. Cek koneksi API.", "error");
        console.error("Detail Delete Error:", e.response?.data);
    } finally { deleteModal.isDeleting = false; }
};

// --- COMPUTEDS (TAB 1) ---
const filteredSchedules = computed(() => {
    const query = searchScheduleQuery.value.toLowerCase();
    return schedules.value.filter(s => {
        const matchName = (s.name || '').toLowerCase().includes(query);
        const matchOutlet = selectedScheduleOutlet.value === '' || s.outlet_id == selectedScheduleOutlet.value;
        return matchName && matchOutlet;
    });
});

// --- COMPUTEDS (TAB 2) ---
const filteredReports = computed(() => {
    const query = searchReportQuery.value.toLowerCase();
    return shifts.value.filter(s => {
        const matchSearch = (s.user?.name || '').toLowerCase().includes(query);
        const matchOutlet = selectedReportOutlet.value === '' || s.outlet_id == selectedReportOutlet.value;
        return matchSearch && matchOutlet;
    });
});

const activeShiftsCount = computed(() => shifts.value.filter(s => s.status === 'active').length);
const totalDifference = computed(() => shifts.value.reduce((acc, curr) => acc + (parseInt(curr.difference) || 0), 0));
const totalPages = computed(() => Math.ceil(filteredReports.value.length / itemsPerPage.value));
const paginatedReports = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return filteredReports.value.slice(start, start + itemsPerPage.value);
});

// Fetch data when switching tabs
watch(activeTab, (newVal) => {
    if (newVal === 'jadwal' && schedules.value.length === 0) fetchSchedules();
    if (newVal === 'laporan' && shifts.value.length === 0) fetchReports();
});

onMounted(async () => {
    await fetchInitialData();
    fetchSchedules(); 
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #D4E4F4; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8AAFCC; }

/* Animasi Fade & Slide Down untuk Alert Float */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>