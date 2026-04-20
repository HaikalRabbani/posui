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

        <div class="space-y-4 font-['Poppins'] pb-10">
            
            <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-20">
                <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div class="flex items-center gap-2 bg-[#F7FAFD] border border-[#D4E4F4] rounded-lg px-3 py-1.5">
                        <svg class="w-4 h-4 text-[#8AAFCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <input type="date" v-model="filters.start_date" @change="fetchAnalytics" class="bg-transparent text-[13px] font-medium text-[#1A2332] outline-none">
                        <span class="text-[12px] text-[#8AAFCC] font-bold">-</span>
                        <input type="date" v-model="filters.end_date" @change="fetchAnalytics" class="bg-transparent text-[13px] font-medium text-[#1A2332] outline-none">
                    </div>

                    <select v-if="userRole !== 'karyawan'" v-model="filters.outlet_id" @change="fetchAnalytics" class="border border-[#D4E4F4] bg-white text-[#1A2332] text-[13px] rounded-lg px-3 py-2 focus:outline-none focus:border-[#2E7DD6] font-medium min-w-[150px]">
                        <option value="">Semua Cabang</option>
                        <option v-for="out in outlets" :key="out.id" :value="out.id">{{ out.name }}</option>
                    </select>
                </div>

                <div class="relative">
                    <button @click="showExportMenu = !showExportMenu" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] text-white text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Ekspor {{ activeTabName }}
                        <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    
                    <transition name="fade">
                        <div v-if="showExportMenu" class="absolute right-0 mt-2 w-40 bg-white border border-[#D4E4F4] rounded-xl shadow-lg py-2 z-50">
                            <button @click="exportData('pdf')" class="w-full text-left px-4 py-2 text-[13px] text-[#1A2332] hover:bg-[#F0F4F8] hover:text-[#1B4F8A] transition-colors flex items-center gap-2">
                                <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> PDF
                            </button>
                            <button @click="exportData('excel')" class="w-full text-left px-4 py-2 text-[13px] text-[#1A2332] hover:bg-[#F0F4F8] hover:text-[#1B4F8A] transition-colors flex items-center gap-2">
                                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Excel
                            </button>
                        </div>
                    </transition>
                </div>
            </div>

            <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden flex overflow-x-auto custom-scrollbar">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" 
                    :class="['px-6 py-3.5 text-[13px] font-bold transition-colors whitespace-nowrap border-b-2 flex items-center gap-2', 
                    activeTab === tab.id ? 'border-[#2E7DD6] text-[#1B4F8A] bg-[#F7FAFD]' : 'border-transparent text-[#5A7A9A] hover:bg-[#F0F4F8] hover:text-[#1B4F8A]']">
                    <component :is="tab.icon" class="w-4 h-4" />
                    {{ tab.name }}
                </button>
            </div>

            <div v-if="isLoading" class="bg-white border border-[#D4E4F4] rounded-xl flex flex-col items-center justify-center py-20 shadow-sm">
                <div class="w-8 h-8 border-4 border-[#D4E4F4] border-t-[#2E7DD6] rounded-full animate-spin mb-4"></div>
                <p class="text-[13px] font-medium text-[#8AAFCC] animate-pulse">Menyiapkan Laporan...</p>
            </div>

            <div v-else>
                
                <div v-if="activeTab === 'summary'" class="space-y-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm relative overflow-hidden group">
                            <div class="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                            <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1 relative z-10">Pendapatan Bersih</p>
                            <h3 class="text-[22px] font-black text-[#1B4F8A] font-['JetBrains_Mono'] relative z-10">Rp {{ formatRupiah(analyticsData.summary.revenue) }}</h3>
                            <p v-if="analyticsData.summary.revenue_growth !== null" class="text-[10px] mt-1 relative z-10 font-bold" :class="analyticsData.summary.revenue_growth >= 0 ? 'text-green-600' : 'text-red-500'">
                                {{ analyticsData.summary.revenue_growth >= 0 ? '+' : '' }}{{ analyticsData.summary.revenue_growth }}% dari periode lalu
                            </p>
                        </div>
                        <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm relative overflow-hidden group">
                            <div class="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                            <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1 relative z-10">Jumlah Transaksi</p>
                            <h3 class="text-[22px] font-black text-[#2A7A4B] font-['JetBrains_Mono'] relative z-10">{{ formatRupiah(analyticsData.summary.transactions) }}</h3>
                            <p v-if="analyticsData.summary.trx_growth !== null" class="text-[10px] mt-1 relative z-10 font-bold" :class="analyticsData.summary.trx_growth >= 0 ? 'text-green-600' : 'text-red-500'">
                                {{ analyticsData.summary.trx_growth >= 0 ? '+' : '' }}{{ analyticsData.summary.trx_growth }}% dari periode lalu
                            </p>
                        </div>
                        <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm relative overflow-hidden group">
                            <div class="absolute right-0 top-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                            <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1 relative z-10">Total Diskon Diberikan</p>
                            <h3 class="text-[22px] font-black text-[#B83B2A] font-['JetBrains_Mono'] relative z-10">Rp {{ formatRupiah(analyticsData.summary.total_discount) }}</h3>
                        </div>
                        <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm relative overflow-hidden group">
                            <div class="absolute right-0 top-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                            <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1 relative z-10">Item Terjual</p>
                            <h3 class="text-[22px] font-black text-purple-700 font-['JetBrains_Mono'] relative z-10">{{ formatRupiah(analyticsData.summary.items_sold) }}</h3>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="bg-white rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col">
                            <div class="p-4 border-b border-[#D4E4F4] bg-[#F7FAFD] rounded-t-xl">
                                <h3 class="text-[14px] font-bold text-[#1A2332]">Tren Pendapatan Harian</h3>
                            </div>
                            <div class="p-6 flex-1 flex flex-col h-64">
                                <div v-if="analyticsData.revenue_chart.length === 0" class="flex-1 flex items-center justify-center text-[13px] text-[#8AAFCC]">Tidak ada data.</div>
                                <div v-else class="relative flex-1 flex items-end gap-2 h-full pt-6">
                                    <div class="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                                        <div class="border-b border-dashed border-[#D4E4F4] w-full h-0" v-for="i in 4" :key="i"></div>
                                    </div>
                                    <div v-for="(day, idx) in analyticsData.revenue_chart" :key="idx" class="relative flex-1 flex flex-col items-center justify-end h-full group z-10">
                                        <div class="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1A2332] text-white text-[10px] py-1 px-2 rounded whitespace-nowrap pointer-events-none font-['JetBrains_Mono'] z-50">
                                            Rp {{ formatRupiah(day.revenue) }}
                                        </div>
                                        <div class="w-full max-w-[30px] bg-gradient-to-t from-[#2E7DD6] to-[#60A5FA] rounded-t-sm transition-all duration-500 ease-out" 
                                             :style="`height: ${(day.revenue / maxRevenueChart) * 100}%`"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col">
                            <div class="p-4 border-b border-[#D4E4F4] bg-[#F7FAFD] rounded-t-xl">
                                <h3 class="text-[14px] font-bold text-[#1A2332]">Metode Pembayaran</h3>
                            </div>
                            <div class="p-5 flex-1 overflow-y-auto max-h-[300px]">
                                <div v-if="analyticsData.payment_methods.length === 0" class="py-10 flex items-center justify-center text-[13px] text-[#8AAFCC]">Belum ada transaksi.</div>
                                <div v-else class="space-y-4">
                                    <div v-for="(pm, idx) in analyticsData.payment_methods" :key="idx" class="flex items-center justify-between bg-[#F7FAFD] p-3 rounded-lg border border-[#D4E4F4]">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-full bg-white border border-[#D4E4F4] flex items-center justify-center text-[#1B4F8A] font-bold text-[10px] uppercase">
                                                {{ pm.method.substring(0, 3) }}
                                            </div>
                                            <span class="text-[13px] font-bold text-[#1A2332] uppercase">{{ pm.method }}</span>
                                        </div>
                                        <div class="text-right">
                                            <p class="text-[14px] font-bold text-[#1A2332] font-['JetBrains_Mono']">Rp {{ formatRupiah(pm.total) }}</p>
                                            <p class="text-[10px] text-[#5A7A9A]">{{ pm.count }} Transaksi ({{ pm.percentage }}%)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="activeTab === 'sales'" class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden">
                    <div class="p-4 border-b border-[#D4E4F4] bg-[#F7FAFD] flex justify-between items-center">
                        <h3 class="text-[14px] font-bold text-[#1A2332]">Rincian Penjualan Per Hari</h3>
                        <span class="text-[11px] font-medium text-[#5A7A9A] bg-white border border-[#D4E4F4] px-2 py-1 rounded">Diambil berdasarkan tanggal bayar (Paid At)</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-white border-b border-[#D4E4F4]">
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase">Tanggal</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase text-right">Trx</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase text-right">Gross (Kotor)</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-red-600 uppercase text-right">Diskon</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-orange-600 uppercase text-right">Pajak/Biaya</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#2A7A4B] uppercase text-right">Net (Bersih)</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-[#EBF3FB]">
                                <tr v-if="analyticsData.sales_report.length === 0">
                                    <td colspan="6" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC]">Tidak ada data penjualan di rentang tanggal ini.</td>
                                </tr>
                                <tr v-else v-for="(row, idx) in analyticsData.sales_report" :key="idx" class="hover:bg-[#F7FAFD]">
                                    <td class="px-5 py-3 text-[13px] font-bold text-[#1A2332]">{{ formatLongDate(row.date) }}</td>
                                    <td class="px-5 py-3 text-[12px] font-medium text-[#5A7A9A] text-right">{{ row.transactions }}</td>
                                    <td class="px-5 py-3 text-[13px] font-semibold text-[#1A2332] font-['JetBrains_Mono'] text-right">Rp {{ formatRupiah(row.gross) }}</td>
                                    <td class="px-5 py-3 text-[13px] font-semibold text-red-600 font-['JetBrains_Mono'] text-right">- Rp {{ formatRupiah(row.discount) }}</td>
                                    <td class="px-5 py-3 text-[13px] font-semibold text-orange-600 font-['JetBrains_Mono'] text-right">+ Rp {{ formatRupiah(row.tax) }}</td>
                                    <td class="px-5 py-3 text-[13px] font-bold text-[#2A7A4B] font-['JetBrains_Mono'] text-right">Rp {{ formatRupiah(row.net) }}</td>
                                </tr>
                            </tbody>
                            <tfoot v-if="analyticsData.sales_report.length > 0" class="bg-[#F0F4F8] border-t-2 border-[#D4E4F4]">
                                <tr>
                                    <td class="px-5 py-4 text-[13px] font-black text-[#1A2332]">TOTAL KESELURUHAN</td>
                                    <td class="px-5 py-4 text-[12px] font-black text-[#1A2332] text-right">{{ totalSalesTrx }}</td>
                                    <td class="px-5 py-4 text-[13px] font-black text-[#1A2332] font-['JetBrains_Mono'] text-right">Rp {{ formatRupiah(totalSalesGross) }}</td>
                                    <td class="px-5 py-4 text-[13px] font-black text-red-600 font-['JetBrains_Mono'] text-right">- Rp {{ formatRupiah(totalSalesDiscount) }}</td>
                                    <td class="px-5 py-4 text-[13px] font-black text-orange-600 font-['JetBrains_Mono'] text-right">+ Rp {{ formatRupiah(totalSalesTax) }}</td>
                                    <td class="px-5 py-4 text-[14px] font-black text-[#1B4F8A] font-['JetBrains_Mono'] text-right">Rp {{ formatRupiah(analyticsData.summary.revenue) }}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <div v-if="activeTab === 'products'" class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden">
                    <div class="p-4 border-b border-[#D4E4F4] bg-[#F7FAFD]">
                        <h3 class="text-[14px] font-bold text-[#1A2332]">Laporan Penjualan Per Produk</h3>
                    </div>
                    <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table class="w-full text-left border-collapse">
                            <thead class="sticky top-0 bg-white border-b border-[#D4E4F4] shadow-sm z-10">
                                <tr>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase">Nama Produk</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase">Kategori</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase text-right">Qty Terjual</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase text-right">Harga Rata-rata</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase text-right">Total Pendapatan</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-[#EBF3FB]">
                                <tr v-if="analyticsData.top_products.length === 0">
                                    <td colspan="5" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC]">Belum ada produk yang terjual.</td>
                                </tr>
                                <tr v-else v-for="(prod, idx) in analyticsData.top_products" :key="idx" class="hover:bg-[#F7FAFD]">
                                    <td class="px-5 py-3 text-[13px] font-bold text-[#1A2332]">
                                        {{ prod.name }}
                                        <div v-if="idx < 3" class="inline-block ml-2 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[9px] rounded font-bold uppercase">Top {{ idx+1 }}</div>
                                    </td>
                                    <td class="px-5 py-3 text-[12px] font-medium text-[#5A7A9A]">
                                        <span class="bg-[#F0F4F8] border border-[#D4E4F4] px-2 py-1 rounded-md">{{ prod.category }}</span>
                                    </td>
                                    <td class="px-5 py-3 text-[13px] font-bold text-[#2A7A4B] font-['JetBrains_Mono'] text-right">{{ prod.sold }} x</td>
                                    <td class="px-5 py-3 text-[13px] text-[#5A7A9A] font-['JetBrains_Mono'] text-right">Rp {{ formatRupiah(prod.avg_price) }}</td>
                                    <td class="px-5 py-3 text-[13px] font-semibold text-[#1B4F8A] font-['JetBrains_Mono'] text-right">Rp {{ formatRupiah(prod.revenue) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-if="activeTab === 'staff'" class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden">
                    <div class="p-4 border-b border-[#D4E4F4] bg-[#F7FAFD]">
                        <h3 class="text-[14px] font-bold text-[#1A2332]">Laporan Kinerja Kasir / Karyawan</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead class="bg-white border-b border-[#D4E4F4]">
                                <tr>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase">Nama Kasir</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase">Cabang / Outlet</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase text-right">Trx Ditangani</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase text-right">Uang Diterima</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-[#EBF3FB]">
                                <tr v-if="analyticsData.cashier_performance.length === 0">
                                    <td colspan="4" class="px-5 py-8 text-center text-[13px] text-[#8AAFCC]">Data kasir tidak ditemukan.</td>
                                </tr>
                                <tr v-else v-for="(staff, idx) in analyticsData.cashier_performance" :key="idx" class="hover:bg-[#F7FAFD]">
                                    <td class="px-5 py-3">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-full bg-[#EBF3FB] text-[#1B4F8A] font-bold flex items-center justify-center text-[11px] border border-[#D4E4F4]">
                                                {{ staff.name.charAt(0) }}
                                            </div>
                                            <span class="text-[13px] font-bold text-[#1A2332]">{{ staff.name }}</span>
                                        </div>
                                    </td>
                                    <td class="px-5 py-3 text-[12px] font-medium text-[#5A7A9A]">{{ staff.outlet_name || '-' }}</td>
                                    <td class="px-5 py-3 text-[13px] font-bold text-[#1A2332] font-['JetBrains_Mono'] text-right">{{ staff.transactions }}</td>
                                    <td class="px-5 py-3 text-[13px] font-bold text-[#2A7A4B] font-['JetBrains_Mono'] text-right">Rp {{ formatRupiah(staff.revenue) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, markRaw } from 'vue';
import axios from 'axios';
import AdminLayout from '../components/adminlayout.vue';

// --- SVG Icons for Tabs ---
const IconDashboard = markRaw({ template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>' });
const IconSales = markRaw({ template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' });
const IconProducts = markRaw({ template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>' });
const IconStaff = markRaw({ template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>' });

const apiBase = 'https://api.etres.my.id/api/v1'; 
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('auth_token')}` });
const userRole = ref(localStorage.getItem('user_role') || 'karyawan');

// Notification State
const alert = reactive({ show: false, message: '', type: 'success' });
const showAlert = (msg, type = 'success') => { alert.message = msg; alert.type = type; alert.show = true; setTimeout(() => alert.show = false, 4000); };

// State
const isLoading = ref(true);
const outlets = ref([]);
const showExportMenu = ref(false);

const activeTab = ref('summary');
const tabs = [
    { id: 'summary', name: 'Ringkasan', icon: IconDashboard },
    { id: 'sales', name: 'Lap. Penjualan', icon: IconSales },
    { id: 'products', name: 'Kinerja Produk', icon: IconProducts },
    { id: 'staff', name: 'Kinerja Kasir', icon: IconStaff }
];

const activeTabName = computed(() => tabs.find(t => t.id === activeTab.value)?.name || 'Laporan');

// Filter Defaults (Bulan Ini)
const today = new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
const filters = reactive({
    start_date: firstDay.toISOString().split('T')[0],
    end_date: today.toISOString().split('T')[0],
    outlet_id: ''
});

// Data Structure (Expanded for Full Reports)
const analyticsData = reactive({
    summary: { revenue: 0, transactions: 0, avg_order: 0, items_sold: 0, total_discount: 0, total_tax: 0, revenue_growth: 0, trx_growth: 0 },
    revenue_chart: [], 
    sales_report: [], // Detailed Table Data
    top_products: [], // Product Table Data
    cashier_performance: [], // Staff Table Data
    payment_methods: []
});

// Computed Totals for Sales Table Footer
const totalSalesTrx = computed(() => analyticsData.sales_report.reduce((sum, item) => sum + item.transactions, 0));
const totalSalesGross = computed(() => analyticsData.sales_report.reduce((sum, item) => sum + item.gross, 0));
const totalSalesDiscount = computed(() => analyticsData.sales_report.reduce((sum, item) => sum + item.discount, 0));
const totalSalesTax = computed(() => analyticsData.sales_report.reduce((sum, item) => sum + item.tax, 0));

// Computed Data untuk CSS Charts
const maxRevenueChart = computed(() => {
    if (analyticsData.revenue_chart.length === 0) return 1;
    return Math.max(...analyticsData.revenue_chart.map(d => d.revenue)) || 1;
});

// Utility
const formatRupiah = (angka) => new Intl.NumberFormat('id-ID').format(angka || 0);
const formatLongDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

// API Fetching
const fetchOutlets = async () => {
    if (userRole.value === 'karyawan') return;
    try {
        const res = await axios.get(`${apiBase}/outlets?limit=100`, { headers: authHeaders() });
        outlets.value = res.data.data?.data || res.data.data || [];
    } catch (e) { console.error("Gagal load outlet"); }
};

const fetchAnalytics = async () => {
    isLoading.value = true;
    try {
        const params = {
            start_date: filters.start_date,
            end_date: filters.end_date,
            outlet_id: filters.outlet_id
        };

        const res = await axios.get(`${apiBase}/reports`, { headers: authHeaders(), params });
        const data = res.data;

        analyticsData.summary = data.summary || { revenue: 0, transactions: 0, avg_order: 0, items_sold: 0, total_discount: 0, total_tax: 0, revenue_growth: 0, trx_growth: 0 };
        analyticsData.revenue_chart = data.revenue_chart || [];
        analyticsData.sales_report = data.sales_report || [];
        analyticsData.top_products = data.top_products || [];
        analyticsData.cashier_performance = data.cashier_performance || [];
        analyticsData.payment_methods = data.payment_methods || [];

    } catch (error) {
        console.error(error);
        showAlert("Gagal mengambil data laporan.", "error");
    } finally {
        isLoading.value = false;
    }
};

// Export Function
const exportData = async (format) => {
    showExportMenu.value = false;
    try {
        const params = new URLSearchParams({
            start_date: filters.start_date,
            end_date: filters.end_date,
            outlet_id: filters.outlet_id,
            format: format,
            report_type: activeTab.value 
        }).toString();
        
        window.open(`${apiBase}/reports/export?${params}&token=${localStorage.getItem('auth_token')}`, '_blank');
        
        showAlert(`Mengekspor ${activeTabName.value} ke ${format.toUpperCase()}...`, "success");
    } catch (e) {
        showAlert(`Gagal mengekspor laporan.`, "error");
    }
};

onMounted(async () => {
    await fetchOutlets();
    fetchAnalytics();
});
</script>

<style scoped>
/* Scrollbar untuk Tabs agar bisa digeser di HP */
.custom-scrollbar::-webkit-scrollbar {
    height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: #F0F4F8;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #8AAFCC;
    border-radius: 10px;
}

/* Transisi Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>