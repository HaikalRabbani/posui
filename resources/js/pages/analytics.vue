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
                            <div class="p-4 border-b border-[#D4E4F4] bg-[#F7FAFD] rounded-t-xl flex justify-between items-center">
                                <h3 class="text-[14px] font-bold text-[#1A2332]">Tren Pendapatan Harian</h3>
                                <div class="flex items-center gap-2 text-[10px] text-[#5A7A9A] font-medium">
                                    <div class="w-2.5 h-2.5 bg-[#2E7DD6] rounded-sm"></div> Pendapatan Bersih
                                </div>
                            </div>
                            <div class="p-5 flex-1 flex flex-col h-[300px] relative">
                                <div v-if="analyticsData.revenue_chart.length === 0" class="flex-1 flex items-center justify-center text-[13px] text-[#8AAFCC]">Tidak ada data di periode ini.</div>

                                <div v-else class="relative w-full h-full flex flex-col" @mouseleave="hoveredPoint = null">
                                    <div class="absolute inset-0 flex flex-col justify-between pointer-events-none z-0 pb-6 pt-2">
                                        <div class="border-b border-dashed border-[#D4E4F4] w-full h-0" v-for="i in 4" :key="i"></div>
                                    </div>

                                    <div class="relative flex-1 w-full z-10 mt-2">
                                        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" class="w-full h-full overflow-visible">
                                            <defs>
                                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stop-color="#2E7DD6" stop-opacity="0.5"/>
                                                    <stop offset="100%" stop-color="#2E7DD6" stop-opacity="0.0"/>
                                                </linearGradient>
                                            </defs>
                                            <path :d="chartAreaPath" fill="url(#chartGradient)" />
                                            <path :d="chartLinePath" fill="none" stroke="#2E7DD6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />

                                            <circle v-for="(p, idx) in chartPoints" :key="idx"
                                                    :cx="p.x" :cy="p.y" r="7"
                                                    :fill="hoveredPoint === idx ? '#1A2332' : '#ffffff'"
                                                    :stroke="hoveredPoint === idx ? '#ffffff' : '#2E7DD6'"
                                                    stroke-width="3"
                                                    class="cursor-pointer transition-all duration-200"
                                                    @mouseenter="hoveredPoint = idx"
                                                    @touchstart.passive="hoveredPoint = idx" />
                                        </svg>

                                        <div v-if="hoveredPoint !== null"
                                            class="absolute bg-[#1A2332] text-white text-[11px] p-3 rounded-xl shadow-2xl whitespace-nowrap z-50 text-center pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-200"
                                            :style="{ left: `${(chartPoints[hoveredPoint].x / 1000) * 100}%`, top: `calc(${(chartPoints[hoveredPoint].y / 300) * 100}% - 16px)` }">
                                            <span class="font-bold border-b border-white/20 pb-1.5 mb-1.5 block text-[12px]">{{ formatShortDate(chartPoints[hoveredPoint].date) }}</span>
                                            <span class="font-['JetBrains_Mono'] block text-[#60A5FA] font-bold text-[14px]">Rp {{ formatRupiah(chartPoints[hoveredPoint].revenue) }}</span>
                                            <span class="text-[#8AAFCC] text-[10px] mt-1 block">Transaksi: {{ chartPoints[hoveredPoint].transactions || 0 }}</span>
                                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A2332]"></div>
                                        </div>
                                    </div>

                                    <div class="flex justify-between text-[10px] text-[#5A7A9A] font-bold mt-3 px-1">
                                        <span>{{ formatShortDate(analyticsData.revenue_chart[0].date) }}</span>
                                        <span v-if="analyticsData.revenue_chart.length > 2">{{ formatShortDate(analyticsData.revenue_chart[Math.floor(analyticsData.revenue_chart.length / 2)].date) }}</span>
                                        <span v-if="analyticsData.revenue_chart.length > 1">{{ formatShortDate(analyticsData.revenue_chart[analyticsData.revenue_chart.length - 1].date) }}</span>
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
                    <div class="p-4 border-b border-[#D4E4F4] bg-[#F7FAFD] flex justify-between items-center">
                        <h3 class="text-[14px] font-bold text-[#1A2332]">Laporan Penjualan Per Produk</h3>
                        <span class="text-[11px] font-medium text-[#5A7A9A] bg-white border border-[#D4E4F4] px-2 py-1 rounded">Nilai diambil dari harga kotor sebelum diskon (Gross)</span>
                    </div>
                    <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table class="w-full text-left border-collapse">
                            <thead class="sticky top-0 bg-white border-b border-[#D4E4F4] shadow-sm z-10">
                                <tr>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase">Nama Produk</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase">Kategori</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase text-right">Qty Terjual</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase text-right">Harga Rata-rata</th>
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase text-right">Total Kotor (Gross)</th>
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
                                    <th class="px-5 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase text-right">Uang Diterima (Bersih)</th>
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

                <div v-if="activeTab === 'shifts'" class="space-y-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm">
                            <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1">Total Shift Selesai</p>
                            <h3 class="text-[22px] font-black text-[#1A2332] font-['JetBrains_Mono']">{{ analyticsData.shift_summary.total_shifts }} Shift</h3>
                        </div>
                        <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm">
                            <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1">Rata-rata Selisih Kas (Variance)</p>
                            <h3 class="text-[22px] font-black font-['JetBrains_Mono']" :class="analyticsData.shift_summary.avg_variance < 0 ? 'text-red-600' : 'text-green-600'">
                                Rp {{ formatRupiah(analyticsData.shift_summary.avg_variance) }}
                            </h3>
                        </div>
                        <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm">
                            <p class="text-[12px] font-semibold text-[#5A7A9A] mb-1">Total Selisih Kas Keseluruhan</p>
                            <h3 class="text-[22px] font-black font-['JetBrains_Mono']" :class="analyticsData.shift_summary.total_variance < 0 ? 'text-red-600' : 'text-green-600'">
                                Rp {{ formatRupiah(analyticsData.shift_summary.total_variance) }}
                            </h3>
                        </div>
                    </div>
                    <div class="bg-[#FFF8E6] border border-[#FFE082] p-4 rounded-xl flex gap-3 shadow-sm">
                        <svg class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p class="text-[13px] text-amber-900 leading-relaxed">
                            <strong>Informasi:</strong> Selisih kas (Variance) menunjukkan perbedaan antara catatan uang di sistem dengan uang fisik yang dilaporkan kasir saat penutupan shift. <br>
                            - <span class="text-green-600 font-bold">Positif (+)</span>: Uang fisik lebih banyak dari sistem.<br>
                            - <span class="text-red-600 font-bold">Negatif (-)</span>: Uang fisik kurang/hilang.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, markRaw } from 'vue';
import axios from '@/axios';
import AdminLayout from '../components/adminlayout.vue';

// --- SVG Icons for Tabs ---
const IconDashboard = markRaw({ template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>' });
const IconSales = markRaw({ template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' });
const IconProducts = markRaw({ template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>' });
const IconStaff = markRaw({ template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>' });
const IconShift = markRaw({ template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' }); // Icon Baru untuk Shift

// Gunakan URL env untuk development, fallback ke production / localhost
const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://api.etres.my.id/api/v1'; 

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
    { id: 'staff', name: 'Kinerja Kasir', icon: IconStaff },
    { id: 'shifts', name: 'Kinerja Shift', icon: IconShift } // Penambahan Tab Shift
];

const activeTabName = computed(() => tabs.find(t => t.id === activeTab.value)?.name || 'Laporan');

// Utility Tanggal (Aman Zona Waktu Lokal)
const formatDateLocal = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Filter Defaults (Bulan Ini)
const today = new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
const filters = reactive({
    start_date: formatDateLocal(firstDay),
    end_date: formatDateLocal(today),
    outlet_id: ''
});

// Data Structure (Menyesuaikan dengan JSON dari Controller baru)
const analyticsData = reactive({
    summary: { revenue: 0, transactions: 0, avg_order: 0, items_sold: 0, total_discount: 0, total_tax: 0, revenue_growth: 0, trx_growth: 0 },
    revenue_chart: [], 
    sales_report: [],
    top_products: [],
    cashier_performance: [],
    payment_methods: [],
    shift_summary: { avg_shift_revenue: 0, total_shift_revenue: 0, total_shifts: 0, avg_variance: 0, total_variance: 0 }
});

// Computed Totals
const totalSalesTrx = computed(() => analyticsData.sales_report.reduce((sum, item) => sum + item.transactions, 0));
const totalSalesGross = computed(() => analyticsData.sales_report.reduce((sum, item) => sum + item.gross, 0));
const totalSalesDiscount = computed(() => analyticsData.sales_report.reduce((sum, item) => sum + item.discount, 0));
const totalSalesTax = computed(() => analyticsData.sales_report.reduce((sum, item) => sum + item.tax, 0));

// Computed Data untuk CSS Charts
const maxRevenueChart = computed(() => {
    if (analyticsData.revenue_chart.length === 0) return 1;
    return Math.max(...analyticsData.revenue_chart.map(d => d.revenue)) || 1;
});

const hoveredPoint = ref(null);

const chartPoints = computed(() => {
    const data = analyticsData.revenue_chart;
    if (!data || data.length === 0) return [];
    const max = maxRevenueChart.value || 1;
    return data.map((day, idx) => {
        const x = (idx / Math.max(data.length - 1, 1)) * 1000;
        const y = 270 - ((day.revenue / max) * 240); // Skala tinggi otomatis
        return { x, y, ...day };
    });
});

const chartLinePath = computed(() => {
    if (chartPoints.value.length === 0) return '';
    return `M ${chartPoints.value.map(p => `${p.x},${p.y}`).join(' L ')}`;
});

const chartAreaPath = computed(() => {
    if (chartPoints.value.length === 0) return '';
    return `${chartLinePath.value} L 1000,300 L 0,300 Z`;
});

// Utility Rupiah
const formatRupiah = (angka) => new Intl.NumberFormat('id-ID').format(angka || 0);
const formatLongDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};
const formatShortDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
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
        analyticsData.shift_summary = data.shift_summary || { avg_shift_revenue: 0, total_shift_revenue: 0, total_shifts: 0, avg_variance: 0, total_variance: 0 };

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
            format: format, // Mengirim 'pdf' atau 'excel' ke backend
            report_type: activeTab.value // Mengirim jenis section (summary, products, dll)
        }).toString();
        
        // Notifikasi opsional jika Anda menggunakan sistem alert
        // showAlert(`Menyiapkan laporan ${activeTabName.value} dalam format ${format.toUpperCase()}...`, "success");

        const response = await axios.get(`${apiBase}/reports/export?${params}`, {
            headers: authHeaders(),
            responseType: 'blob' // PENTING: Harus ada agar PDF dan file biner lainnya tidak rusak
        });

        // 1. Logika Penentuan Ekstensi & Nama File Dinamis
        // Fallback ekstensi default jika backend tidak mengirim header nama file
        let defaultExtension = format === 'pdf' ? 'pdf' : 'csv'; // Bisa diubah ke 'xlsx' jika backend pakai Laravel Excel
        let fileName = `Laporan_${activeTab.value}_${filters.start_date}.${defaultExtension}`;

        // Coba tangkap nama file persis dari backend (jika dikirim via header Content-Disposition)
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
            if (fileNameMatch && fileNameMatch.length === 2) {
                fileName = fileNameMatch[1];
            }
        }

        // 2. Proses Pemicu Download (Blob)
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); // Menerapkan nama file dinamis
        document.body.appendChild(link);
        link.click();
        
        // 3. Bersihkan memori browser setelah terunduh
        link.remove();
        window.URL.revokeObjectURL(url);

    } catch (e) {
        console.error(e);
        showAlert(`Gagal mengekspor laporan ke format ${format.toUpperCase()}.`, "error");
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