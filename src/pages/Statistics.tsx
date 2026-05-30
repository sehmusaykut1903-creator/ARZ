import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  MapPin, 
  Truck,
  Users,
  Target,
  Zap
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

const operationalData = [
  { name: 'Gıda', tamamlanan: 85, bekleyen: 15 },
  { name: 'Sağlık', tamamlanan: 92, bekleyen: 8 },
  { name: 'Barınma', tamamlanan: 70, bekleyen: 30 },
  { name: 'Lojistik', tamamlanan: 78, bekleyen: 22 },
];

const distributionData = [
  { name: 'Hatay', value: 400 },
  { name: 'Maraş', value: 300 },
  { name: 'Adıyaman', value: 200 },
  { name: 'Antep', value: 150 },
];

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

const Statistics = () => {
  const { t } = useTranslation();

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen bg-app-bg/50">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-app-text italic uppercase tracking-tighter flex items-center gap-3">
            <BarChart3 className="text-app-primary" size={36} />
            {t('statistics')}
          </h1>
          <p className="text-[10px] font-black text-app-muted uppercase tracking-[0.4em] italic">Gerçek Zamanlı Operasyonel Metrikler & Performans Analizi</p>
        </div>
      </header>

      {/* High-Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-8 h-[auto] md:h-[600px]">
        {/* Main Operational Score */}
        <div className="md:row-span-2 p-12 bg-primary rounded-[4rem] text-app-on-primary shadow-premium relative overflow-hidden group">
           <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="space-y-6">
                 <div className="w-20 h-20 bg-app-card/10 rounded-3xl flex items-center justify-center backdrop-blur-md">
                    <Target size={40} className="fill-white/20" />
                 </div>
                 <div className="space-y-2">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">Genel Operasyonel Başarı Oranı</h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Sistem Algoritmik Puanı</p>
                 </div>
              </div>

              <div className="space-y-12">
                 <div className="relative inline-flex items-center justify-center">
                    <svg className="w-64 h-64">
                       <circle cx="128" cy="128" r="110" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                       <circle 
                         cx="128" cy="128" r="110" fill="transparent" 
                         stroke="white" strokeWidth="12" 
                         strokeDasharray="691" 
                         strokeDashoffset="110" 
                         className="transition-all duration-1000"
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-7xl font-black italic tracking-tighter leading-none">%94</span>
                       <span className="text-[10px] font-black uppercase tracking-widest mt-2">OPTIMIZED</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-app-card/10 rounded-3xl backdrop-blur-md border border-white/10">
                       <p className="text-[10px] font-bold opacity-60 uppercase mb-1">Müdahale Hızı</p>
                       <p className="text-xl font-black tracking-tight">12.4 dk</p>
                    </div>
                    <div className="p-6 bg-app-card/10 rounded-3xl backdrop-blur-md border border-white/10">
                       <p className="text-[10px] font-bold opacity-60 uppercase mb-1">Kaynak Verimliliği</p>
                       <p className="text-xl font-black tracking-tight">%87.2</p>
                    </div>
                 </div>
              </div>
           </div>
           <div className="absolute -bottom-20 -right-20 opacity-10">
              <BarChart3 size={400} />
           </div>
        </div>

        {/* Operational Distribution Chart */}
        <div className="p-10 bg-app-card rounded-[3.5rem] border border-app-border shadow-premium flex flex-col">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-app-primary/10 rounded-xl flex items-center justify-center text-app-text">
                 <Truck size={20} />
              </div>
              <div>
                 <h3 className="text-sm font-black text-app-text uppercase italic tracking-tight">Kategori Bazlı Tamamlama</h3>
                 <p className="text-[9px] text-app-muted font-bold uppercase">Lojistik Akış Dağılımı</p>
              </div>
           </div>
           <div className="flex-1 w-full" style={{ minHeight: '300px', minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                 <BarChart data={operationalData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '1.2rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Bar dataKey="tamamlanan" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="bekleyen" fill="#f1f5f9" radius={[6, 6, 0, 0]} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Regional Distribution Pie */}
        <div className="p-10 bg-app-card rounded-[3.5rem] border border-app-border shadow-premium flex flex-col">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                 <MapPin size={20} />
              </div>
              <div>
                 <h3 className="text-sm font-black text-app-text uppercase italic tracking-tight">Bölgesel Yoğunluk</h3>
                 <p className="text-[9px] text-app-muted font-bold uppercase">Müdahale Gereksinim Payı</p>
              </div>
           </div>
           <div className="flex-1 w-full relative" style={{ minHeight: '300px', minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                 <PieChart>
                    <Pie
                      data={distributionData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                    <p className="text-2xl font-black text-app-text italic leading-none">1,050</p>
                    <p className="text-[8px] font-black text-app-muted uppercase tracking-widest mt-1">TOPLAM</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Performance Timeline */}
        <div className="col-span-2 p-10 bg-app-card rounded-[3.5rem] border border-app-border shadow-premium">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                    <Zap size={20} />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-app-text uppercase italic tracking-tight">Sistem Performans İzleme</h3>
                    <p className="text-[9px] text-app-muted font-bold uppercase">Anlık İşlem Kapasitesi</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">CANLI VERİ</span>
              </div>
           </div>
           <div className="h-[200px] w-full" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                 <LineChart data={[...Array(20)].map((_, i) => ({ time: i, val: Math.random() * 40 + 60 }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis hide />
                    <YAxis hide domain={[0, 100]} />
                    <Line type="monotone" dataKey="val" stroke="#10b981" strokeWidth={4} dot={false} animationDuration={300} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
