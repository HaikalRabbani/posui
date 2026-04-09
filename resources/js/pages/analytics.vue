<template>
    <AdminLayout>
        <div class="space-y-6 font-['Poppins'] pb-10">
            
            <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-[#D4E4F4] pb-2">
                
                <div class="flex gap-2 sm:gap-6 overflow-x-auto hide-scrollbar w-full xl:w-auto">
                    <button @click="activeTab = 'keuangan'" class="px-2 py-2 text-[14px] font-semibold transition-colors border-b-2 whitespace-nowrap" :class="activeTab === 'keuangan' ? 'text-[#1B4F8A] border-[#1B4F8A]' : 'text-[#5A7A9A] border-transparent hover:text-[#1A2332]'">Ringkasan Keuangan</button>
                    <button @click="activeTab = 'menu'" class="px-2 py-2 text-[14px] font-semibold transition-colors border-b-2 whitespace-nowrap" :class="activeTab === 'menu' ? 'text-[#1B4F8A] border-[#1B4F8A]' : 'text-[#5A7A9A] border-transparent hover:text-[#1A2332]'">Performa Menu & Kategori</button>
                    <button @click="activeTab = 'operasional'" class="px-2 py-2 text-[14px] font-semibold transition-colors border-b-2 whitespace-nowrap" :class="activeTab === 'operasional' ? 'text-[#1B4F8A] border-[#1B4F8A]' : 'text-[#5A7A9A] border-transparent hover:text-[#1A2332]'">Operasional & Kasir</button>
                
                     <div class="relative">
                        <select v-model="selectedDateFilter" @change="handleDateFilterChange" class="appearance-none bg-white border border-[#D4E4F4] text-[#1A2332] text-[12px] font-semibold rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-[#2E7DD6] cursor-pointer">
                            <option value="today">Hari Ini</option>
                            <option value="7days">7 Hari Terakhir</option>
                            <option value="30days">30 Hari Terakhir</option>
                            <option value="custom">Custom Tanggal</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#8AAFCC]">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>

                    <div class="relative export-dropdown">
                        <button @click="showExportMenu = !showExportMenu" :disabled="isExporting" class="px-4 py-2 bg-[#2E7DD6] hover:bg-[#1B4F8A] disabled:opacity-50 text-white text-[12px] font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Export Laporan
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                        </button>

                        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                            <div v-if="showExportMenu" class="absolute right-0 mt-2 w-40 bg-white border border-[#D4E4F4] rounded-lg shadow-lg py-1 z-50">
                                <button @click="exportData('csv')" class="w-full text-left px-4 py-2 text-[12px] font-medium text-[#1A2332] hover:bg-[#EBF3FB] hover:text-[#1B4F8A] flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-[#2A7A4B]"></span> Format CSV
                                </button>
                                <button @click="exportData('pdf')" class="w-full text-left px-4 py-2 text-[12px] font-medium text-[#1A2332] hover:bg-[#EBF3FB] hover:text-[#1B4F8A] flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-[#B83B2A]"></span> Format PDF
                                </button>
                            </div>
                        </transition>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-3">


                    <div v-if="selectedDateFilter === 'custom'" class="flex items-center bg-white border border-[#D4E4F4] rounded-lg shadow-sm overflow-hidden p-1 animate-[fadeIn_0.2s_ease-out]">
                        <div class="flex items-center px-2 border-r border-[#D4E4F4]">
                            <input type="date" v-model="dateStart" class="text-[12px] text-[#1A2332] font-semibold outline-none bg-transparent cursor-pointer font-['JetBrains_Mono']">
                        </div>
                        <div class="flex items-center px-2">
                            <span class="text-[12px] text-[#5A7A9A] mr-2">s/d</span>
                            <input type="date" v-model="dateEnd" class="text-[12px] text-[#1A2332] font-semibold outline-none bg-transparent cursor-pointer font-['JetBrains_Mono']">
                        </div>
                        <button @click="fetchAnalyticsData" class="ml-1 bg-[#F0F4F8] hover:bg-[#D4E4F4] text-[#1B4F8A] px-3 py-1.5 rounded-md text-[12px] font-bold transition-colors">
                            Cari
                        </button>
                    </div>

                </div>
            </div>

            <div v-if="isLoading" class="flex justify-center items-center py-20">
                <span class="text-[#8AAFCC] text-[14px] animate-pulse font-medium">Menggali data analitik...</span>
            </div>

            <div v-else-if="activeTab === 'keuangan'" class="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm relative overflow-hidden">
                        <div class="absolute -right-4 -top-4 w-16 h-16 bg-[#EBF3FB] rounded-full opacity-50"></div>
                        <p class="text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1 relative z-10">Gross Sales (Kotor)</p>
                        <p class="text-[20px] font-bold text-[#1A2332] font-['JetBrains_Mono'] relative z-10">Rp {{ formatRupiah(financial.gross_sales) }}</p>
                    </div>
                    <div class="bg-white p-5 rounded-xl border border-red-200 shadow-sm relative overflow-hidden">
                        <div class="absolute -right-4 -top-4 w-16 h-16 bg-red-50 rounded-full opacity-50"></div>
                        <p class="text-[11px] font-semibold text-[#B83B2A] uppercase tracking-wider mb-1 relative z-10">Diskon & Batal</p>
                        <p class="text-[20px] font-bold text-[#B83B2A] font-['JetBrains_Mono'] relative z-10">- Rp {{ formatRupiah(financial.total_discount + financial.total_void) }}</p>
                    </div>
                    <div class="bg-[#F0F4F8] p-5 rounded-xl border border-[#D4E4F4] shadow-sm relative overflow-hidden">
                        <div class="absolute -right-4 -top-4 w-16 h-16 bg-white rounded-full opacity-50"></div>
                        <p class="text-[11px] font-semibold text-[#1B4F8A] uppercase tracking-wider mb-1 relative z-10">Net Sales (Bersih)</p>
                        <p class="text-[22px] font-bold text-[#1A2332] font-['JetBrains_Mono'] relative z-10">Rp {{ formatRupiah(financial.net_sales) }}</p>
                    </div>
                    <div class="bg-[#1B4F8A] p-5 rounded-xl shadow-md relative overflow-hidden text-white">
                        <div class="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full"></div>
                        <p class="text-[11px] font-semibold text-green-300 uppercase tracking-wider mb-1 relative z-10">Laba Kotor (Gross Profit)</p>
                        <p class="text-[24px] font-bold text-green-400 font-['JetBrains_Mono'] relative z-10">Rp {{ formatRupiah(financial.gross_profit) }}</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 bg-white border border-[#D4E4F4] rounded-xl shadow-sm p-5">
                        <div class="mb-6">
                            <h3 class="text-[16px] font-semibold text-[#1A2332]">Tren Pendapatan Harian</h3>
                            <p class="text-[12px] text-[#5A7A9A]">Berdasarkan Net Sales pada periode terpilih</p>
                        </div>
                        <div class="h-[300px] w-full">
                            <LineChart v-if="!isLoading" :data="revenueChartData" :options="lineChartOptions" />
                        </div>
                    </div>

                    <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm p-5 flex flex-col">
                        <div class="mb-2 border-b border-[#D4E4F4] pb-4">
                            <h3 class="text-[16px] font-semibold text-[#1A2332]">Metode Pembayaran</h3>
                            <p class="text-[12px] text-[#5A7A9A]">Distribusi uang masuk beserta persentasenya</p>
                        </div>
                        <div class="flex-1 flex flex-col items-center justify-center relative min-h-[250px]">
                            <div class="h-[180px] w-full mb-4">
                                <DoughnutChart v-if="!isLoading" :data="paymentChartData" :options="doughnutOptions" />
                            </div>
                            <div class="w-full space-y-2 mt-2">
                                <div v-for="(val, idx) in financial.payments" :key="idx" class="flex justify-between items-center text-[12px] p-2 bg-[#F7FAFD] rounded">
                                    <div class="flex items-center gap-2">
                                        <span class="w-3 h-3 rounded-full" :style="`background-color: ${paymentColors[idx]}`"></span>
                                        <span class="font-medium text-[#5A7A9A]">{{ val.method }}</span>
                                    </div>
                                    <div class="text-right">
                                        <span class="font-bold text-[#1A2332] font-['JetBrains_Mono'] block">Rp {{ formatRupiah(val.amount) }}</span>
                                        <span class="text-[10px] font-bold" :style="`color: ${paymentColors[idx]}`">{{ val.percentage }}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="activeTab === 'menu'" class="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden flex flex-col">
                        <div class="p-5 border-b border-[#D4E4F4] bg-[#F7FAFD]">
                            <h3 class="text-[16px] font-semibold text-[#1A2332] flex items-center gap-2">
                                <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                Top Revenue (Penyumbang Omzet)
                            </h3>
                        </div>
                        <div class="overflow-x-auto flex-1">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="border-b border-[#D4E4F4]">
                                        <th class="px-4 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Nama Menu</th>
                                        <th class="px-4 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Terjual</th>
                                        <th class="px-4 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Omzet</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-[#EBF3FB]">
                                    <tr v-for="(item, index) in menuStats.top" :key="index" class="hover:bg-[#F7FAFD]">
                                        <td class="px-4 py-3 text-[13px] font-medium text-[#1A2332] flex items-center gap-3">
                                            <span class="w-6 h-6 rounded-full bg-[#EBF3FB] border border-[#D4E4F4] text-[#1B4F8A] flex items-center justify-center text-[11px] font-bold">{{ index + 1 }}</span>
                                            {{ item.name }}
                                        </td>
                                        <td class="px-4 py-3 text-[13px] font-semibold text-[#1A2332] text-right font-['JetBrains_Mono']">{{ item.qty }}</td>
                                        <td class="px-4 py-3 text-[13px] font-bold text-[#1B4F8A] text-right font-['JetBrains_Mono']">Rp {{ formatRupiah(item.revenue) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden flex flex-col">
                        <div class="p-5 border-b border-[#D4E4F4] bg-[#F7FAFD]">
                            <h3 class="text-[16px] font-semibold text-[#1A2332] flex items-center gap-2">
                                <svg class="w-5 h-5 text-[#2A7A4B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Top Margin (Cuan Tertinggi per Item)
                            </h3>
                        </div>
                        <div class="overflow-x-auto flex-1">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="border-b border-[#D4E4F4]">
                                        <th class="px-4 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Nama Menu</th>
                                        <th class="px-4 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Modal</th>
                                        <th class="px-4 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Margin Bersih</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-[#EBF3FB]">
                                    <tr v-for="(item, index) in menuStats.margins" :key="index" class="hover:bg-green-50/50">
                                        <td class="px-4 py-3 text-[13px] font-medium text-[#1A2332]">{{ item.name }}</td>
                                        <td class="px-4 py-3 text-[13px] text-[#5A7A9A] text-right font-['JetBrains_Mono']">Rp {{ formatRupiah(item.cost) }}</td>
                                        <td class="px-4 py-3 text-[13px] font-bold text-[#2A7A4B] text-right font-['JetBrains_Mono']">+ Rp {{ formatRupiah(item.profit) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm p-5">
                        <h3 class="text-[16px] font-semibold text-[#1A2332] mb-4 border-b border-[#D4E4F4] pb-2">Performa Kategori</h3>
                        <div class="space-y-4">
                            <div v-for="(cat, idx) in menuStats.categories" :key="idx">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-[13px] font-medium text-[#1A2332]">{{ cat.name }}</span>
                                    <span class="text-[12px] font-bold text-[#1B4F8A] font-['JetBrains_Mono']">{{ cat.percentage }}%</span>
                                </div>
                                <div class="w-full bg-[#EBF3FB] rounded-full h-2.5">
                                    <div class="bg-[#2E7DD6] h-2.5 rounded-full" :style="`width: ${cat.percentage}%`"></div>
                                </div>
                                <p class="text-[10px] text-[#5A7A9A] mt-1 text-right">Rp {{ formatRupiah(cat.revenue) }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden flex flex-col">
                        <div class="p-5 border-b border-[#D4E4F4] bg-[#F7FAFD]">
                            <h3 class="text-[16px] font-semibold text-[#1A2332] flex items-center gap-2">
                                <svg class="w-5 h-5 text-[#B83B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                                Slow Moving Items
                            </h3>
                        </div>
                        <div class="overflow-x-auto flex-1">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="border-b border-[#D4E4F4]">
                                        <th class="px-4 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Nama Menu</th>
                                        <th class="px-4 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Terjual</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-[#EBF3FB]">
                                    <tr v-for="(item, index) in menuStats.slow" :key="index" class="hover:bg-red-50">
                                        <td class="px-4 py-3 text-[13px] font-medium text-[#1A2332]">{{ item.name }}</td>
                                        <td class="px-4 py-3 text-[13px] font-bold text-[#B83B2A] text-right font-['JetBrains_Mono']">{{ item.qty }}x</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            <div v-else-if="activeTab === 'operasional'" class="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm">
                        <p class="text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1">Total Transaksi</p>
                        <p class="text-[24px] font-bold text-[#1A2332] font-['JetBrains_Mono']">{{ opStats.total_trx }}</p>
                    </div>
                    <div class="bg-[#F7FAFD] p-5 rounded-xl border border-[#D4E4F4] shadow-sm">
                        <p class="text-[11px] font-semibold text-[#1B4F8A] uppercase tracking-wider mb-1">Avg. Basket Size (AOV)</p>
                        <p class="text-[20px] font-bold text-[#1B4F8A] font-['JetBrains_Mono']">Rp {{ formatRupiah(opStats.aov) }}</p>
                        <p class="text-[10px] text-[#5A7A9A] mt-0.5">Rata-rata belanja per struk</p>
                    </div>
                    <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm flex flex-col justify-center">
                        <p class="text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1">Dine-in vs Takeaway</p>
                        <div class="flex items-center gap-4 mt-1">
                            <div><span class="text-[18px] font-bold text-[#2A7A4B] font-['JetBrains_Mono']">{{ opStats.dine_in }}%</span> <span class="text-[10px] text-[#5A7A9A]">Dine-in</span></div>
                            <div><span class="text-[18px] font-bold text-orange-600 font-['JetBrains_Mono']">{{ opStats.takeaway }}%</span> <span class="text-[10px] text-[#5A7A9A]">Takeaway</span></div>
                        </div>
                    </div>
                    <div class="bg-white p-5 rounded-xl border border-[#D4E4F4] shadow-sm">
                        <p class="text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider mb-1">Avg. Pemrosesan</p>
                        <p class="text-[24px] font-bold text-[#1A2332] font-['JetBrains_Mono']">{{ opStats.avg_time }} Min</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm p-5">
                        <div class="mb-6">
                            <h3 class="text-[16px] font-semibold text-[#1A2332]">Analitik Jam Sibuk</h3>
                            <p class="text-[12px] text-[#5A7A9A]">Distribusi keramaian untuk atur shift staf</p>
                        </div>
                        <div class="h-[250px] w-full">
                            <BarChart v-if="!isLoading" :data="hourlyChartData" :options="hourlyChartOptions" />
                        </div>
                    </div>

                    <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm p-5">
                        <div class="mb-6">
                            <h3 class="text-[16px] font-semibold text-[#1A2332] text-[#B83B2A]">Top Alasan Batal (Void)</h3>
                            <p class="text-[12px] text-[#5A7A9A]">Penyebab hilangnya potensi omzet</p>
                        </div>
                        <div class="space-y-4 mt-2">
                            <div v-for="(reason, idx) in opStats.void_reasons" :key="idx" class="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-white text-[#B83B2A] flex items-center justify-center font-bold text-[12px] shadow-sm">{{ reason.pct }}%</div>
                                    <div>
                                        <p class="text-[13px] font-semibold text-[#1A2332]">{{ reason.reason }}</p>
                                        <p class="text-[11px] text-[#5A7A9A]">{{ reason.count }}x Kejadian</p>
                                    </div>
                                </div>
                                <span class="font-bold text-[#B83B2A] font-['JetBrains_Mono'] text-[13px]">- Rp {{ formatRupiah(reason.lost) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white border border-[#D4E4F4] rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div class="p-5 border-b border-[#D4E4F4] bg-[#F7FAFD]">
                        <h3 class="text-[16px] font-semibold text-[#1A2332]">Performa Karyawan (Kasir)</h3>
                        <p class="text-[12px] text-[#5A7A9A] mt-1">Evaluasi beban kerja dan nilai transaksi per individu.</p>
                    </div>
                    <div class="overflow-x-auto flex-1">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b border-[#D4E4F4]">
                                    <th class="px-4 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider">Nama Kasir</th>
                                    <th class="px-4 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-center">Jml Transaksi</th>
                                    <th class="px-4 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-center">Avg. Keranjang</th>
                                    <th class="px-4 py-3 text-[11px] font-semibold text-[#5A7A9A] uppercase tracking-wider text-right">Total Diproses</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-[#EBF3FB]">
                                <tr v-for="(kasir, index) in cashierStats" :key="index" class="hover:bg-[#F7FAFD]">
                                    <td class="px-4 py-3 text-[13px] font-medium text-[#1A2332] flex items-center gap-2">
                                        <div class="w-8 h-8 rounded-full bg-[#EBF3FB] text-[#1B4F8A] flex items-center justify-center text-[11px] font-bold">{{ kasir.name.charAt(0) }}</div>
                                        {{ kasir.name }}
                                    </td>
                                    <td class="px-4 py-3 text-[13px] font-semibold text-[#5A7A9A] text-center font-['JetBrains_Mono']">{{ kasir.trx }}</td>
                                    <td class="px-4 py-3 text-[13px] font-semibold text-[#2A7A4B] text-center font-['JetBrains_Mono']">Rp {{ formatRupiah(Math.round(kasir.processed / kasir.trx)) }}</td>
                                    <td class="px-4 py-3 text-[13px] font-bold text-[#1B4F8A] text-right font-['JetBrains_Mono']">Rp {{ formatRupiah(kasir.processed) }}</td>
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
import { ref, onMounted, onUnmounted } from 'vue';
import AdminLayout from '../components/adminlayout.vue';

// --- Import ChartJS ---
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, LineElement, PointElement, CategoryScale, LinearScale, ArcElement, Filler } from 'chart.js';
import { Bar as BarChart, Line as LineChart, Doughnut as DoughnutChart } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement, Filler);
ChartJS.defaults.font.family = "'Poppins', sans-serif";
ChartJS.defaults.color = '#5A7A9A';

// --- STATE ---
const activeTab = ref('keuangan');
const isLoading = ref(true);
const isExporting = ref(false);
const showExportMenu = ref(false);

const selectedDateFilter = ref('7days');
const getPastDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
};
const dateStart = ref(getPastDate(7));
const dateEnd = ref(getPastDate(0));

const formatRupiah = (angka) => new Intl.NumberFormat('id-ID').format(angka || 0);

// --- LOGIC FILTER WAKTU ---
const handleDateFilterChange = () => {
    if (selectedDateFilter.value === 'today') {
        dateStart.value = getPastDate(0);
        dateEnd.value = getPastDate(0);
        fetchAnalyticsData();
    } else if (selectedDateFilter.value === '7days') {
        dateStart.value = getPastDate(7);
        dateEnd.value = getPastDate(0);
        fetchAnalyticsData();
    } else if (selectedDateFilter.value === '30days') {
        dateStart.value = getPastDate(30);
        dateEnd.value = getPastDate(0);
        fetchAnalyticsData();
    }
};

// --- DUMMY DATA STRUCTURES ---
const financial = ref({ gross_sales: 0, total_discount: 0, total_void: 0, net_sales: 0, gross_profit: 0, payments: [] });
const menuStats = ref({ top: [], slow: [], margins: [], categories: [] });
const opStats = ref({ total_trx: 0, aov: 0, avg_time: 0, dine_in: 0, takeaway: 0, void_reasons: [] });
const cashierStats = ref([]);

const revenueChartData = ref({ labels: [], datasets: [] });
const paymentChartData = ref({ labels: [], datasets: [] });
const hourlyChartData = ref({ labels: [], datasets: [] });

const paymentColors = ['#1B4F8A', '#2A7A4B', '#F59E0B', '#8AAFCC'];

// --- CHART OPTIONS ---
const lineChartOptions = {
    responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1A2332', titleFont: { family: 'Poppins', size: 13 }, bodyFont: { family: 'JetBrains Mono', size: 14, weight: 'bold' }, padding: 12, cornerRadius: 8, callbacks: { label: function(context) { return 'Rp ' + formatRupiah(context.raw); } } } },
    scales: {
        y: { beginAtZero: true, grid: { color: '#EBF3FB', drawBorder: false }, ticks: { font: { family: 'JetBrains Mono', size: 11 }, callback: function(value) { if (value >= 1000000) return (value / 1000000) + 'M'; if (value >= 1000) return (value / 1000) + 'k'; return value; } } },
        x: { grid: { display: false } }
    }
};

const doughnutOptions = {
    responsive: true, maintainAspectRatio: false, cutout: '75%',
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1A2332', callbacks: { label: function(context) { return ` Rp ${formatRupiah(context.raw)}`; } } } }
};

const hourlyChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1A2332' } },
    scales: { y: { beginAtZero: true, grid: { color: '#EBF3FB', drawBorder: false } }, x: { grid: { display: false } } }
};

// --- FETCH DATA ---
const fetchAnalyticsData = async () => {
    isLoading.value = true;
    
    setTimeout(() => {
        financial.value = {
            gross_sales: 24500000, total_discount: 1200000, total_void: 300000, net_sales: 23000000, gross_profit: 14500000,
            payments: [
                { method: 'QRIS / e-Wallet', amount: 13800000, percentage: 60 },
                { method: 'Tunai', amount: 5750000, percentage: 25 },
                { method: 'Debit Card', amount: 3450000, percentage: 15 }
            ]
        };

        revenueChartData.value = {
            labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
            datasets: [{ label: 'Net Sales', borderColor: '#2E7DD6', backgroundColor: 'rgba(46, 125, 214, 0.1)', borderWidth: 3, pointBackgroundColor: '#1B4F8A', pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6, fill: true, tension: 0.4, data: [2100000, 2400000, 1800000, 3200000, 3800000, 5100000, 4600000] }]
        };

        paymentChartData.value = {
            labels: financial.value.payments.map(p => p.method),
            datasets: [{ backgroundColor: paymentColors, borderWidth: 0, hoverOffset: 4, data: financial.value.payments.map(p => p.amount) }]
        };

        menuStats.value = {
            top: [
                { name: 'Nasi Goreng Spesial', qty: 245, revenue: 6125000 },
                { name: 'Kopi Susu Gula Aren', qty: 312, revenue: 4680000 },
                { name: 'Ayam Geprek Sambal Matah', qty: 180, revenue: 4500000 },
                { name: 'Kentang Goreng', qty: 156, revenue: 2340000 },
            ],
            slow: [
                { name: 'Jus Alpukat', qty: 12 },
                { name: 'Roti Bakar Coklat', qty: 8 },
                { name: 'Mie Rebus Polos', qty: 5 },
            ],
            margins: [
                { name: 'Es Teh Manis', cost: 1500, profit: 6000 },
                { name: 'Kopi Susu Gula Aren', cost: 6000, profit: 9000 },
                { name: 'Kentang Goreng', cost: 4500, profit: 10500 },
            ],
            categories: [
                { name: 'Makanan Utama', percentage: 55, revenue: 12650000 },
                { name: 'Minuman Kopi', percentage: 30, revenue: 6900000 },
                { name: 'Cemilan', percentage: 15, revenue: 3450000 },
            ]
        };

        opStats.value = { 
            total_trx: 428, aov: 53738, avg_time: 14, dine_in: 65, takeaway: 35,
            void_reasons: [
                { reason: 'Bahan Habis (Sold Out)', count: 12, pct: 45, lost: 150000 },
                { reason: 'Salah Input Kasir', count: 8, pct: 30, lost: 90000 },
                { reason: 'Pelanggan Batal/Ganti Pikiran', count: 5, pct: 25, lost: 60000 },
            ]
        };
        
        hourlyChartData.value = {
            labels: ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
            datasets: [{ label: 'Jumlah Transaksi', backgroundColor: '#8AAFCC', hoverBackgroundColor: '#1B4F8A', borderRadius: 4, data: [15, 65, 30, 25, 80, 95, 40] }]
        };

        cashierStats.value = [
            { name: 'Siti Sarah', trx: 185, processed: 10500000 },
            { name: 'Budi Santoso', trx: 143, processed: 8200000 },
            { name: 'Ahmad Reza', trx: 100, processed: 4300000 },
        ];

        isLoading.value = false;
    }, 800);
};

// --- EXPORT ---
const exportData = async (format) => {
    showExportMenu.value = false; // Tutup dropdown
    isExporting.value = true;
    setTimeout(() => {
        alert(`Request export ke format ${format.toUpperCase()} untuk periode ${dateStart.value} s/d ${dateEnd.value} berhasil diproses.`);
        isExporting.value = false;
    }, 1000);
};

// Tutup dropdown jika klik di luar area
const closeExportMenu = (e) => {
    if (showExportMenu.value && !e.target.closest('.export-dropdown')) {
        showExportMenu.value = false;
    }
};

onMounted(() => {
    fetchAnalyticsData();
    document.addEventListener('click', closeExportMenu);
});
onUnmounted(() => {
    document.removeEventListener('click', closeExportMenu);
});
</script>

<style scoped>
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>