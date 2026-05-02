import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Activity, 
  Droplet, 
  Thermometer, 
  AlertCircle,
  TrendingUp,
  Map as MapIcon,
  Heart
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
  AreaChart, 
  Area 
} from 'recharts';

const data = [
  { name: '00:00', risk: 20, cases: 5 },
  { name: '04:00', risk: 25, cases: 8 },
  { name: '08:00', risk: 45, cases: 15 },
  { name: '12:00', risk: 60, cases: 22 },
  { name: '16:00', risk: 55, cases: 18 },
  { name: '20:00', risk: 40, cases: 12 },
];

const PublicHealth = () => {
  const { t } = useTranslation();

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen bg-app-bg/50">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-app-text italic uppercase tracking-tighter flex items-center gap-3">
            <ShieldAlert className="text-app-primary" size={36} />
            {t('public_health')}
          </h1>
          <p className="text-[10px] font-black text-app-muted uppercase tracking-[0.4em] italic">Epidemiyolojik İzleme & Risk Analiz Sistemi</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-6 py-4 bg-app-card rounded-2xl border border-blue-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                 <Activity size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-app-muted uppercase tracking-widest">Sistem Durumu</p>
                 <p className="text-sm font-black text-app-text uppercase">Aktif İzleme</p>
              </div>
           </div>
        </div>
      </header>

      {/* Real-time Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Enfeksiyon Riski', value: '%12', icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Su Güvenliği', value: '%98', icon: Droplet, color: 'text-blue-500', bg: 'bg-app-primary/10' },
          { label: 'Ort. Sıcaklık', value: '24°C', icon: Thermometer, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Aşılama Oranı', value: '%84', icon: Heart, color: 'text-green-500', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-app-card rounded-[2.5rem] border border-app-border shadow-premium group hover:scale-[1.02] transition-all"
          >
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-inner`}>
               <stat.icon size={28} />
            </div>
            <p className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-app-text italic tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Trend Chart */}
        <div className="lg:col-span-2 p-10 bg-app-card rounded-[3.5rem] border border-app-border shadow-premium">
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-app-primary/10 rounded-2xl flex items-center justify-center text-app-text">
                    <TrendingUp size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-app-text italic uppercase tracking-tighter">Bölgesel Risk Trendi</h3>
                   <p className="text-[10px] text-app-muted font-bold uppercase tracking-widest">Son 24 Saatlik Veri Akışı</p>
                </div>
             </div>
          </div>
          <div className="h-[400px] min-h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#fff', borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                   itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="risk" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Actions */}
        <div className="p-10 bg-primary rounded-[3.5rem] text-app-on-primary shadow-premium relative overflow-hidden">
           <div className="relative z-10 space-y-10">
              <div className="space-y-2">
                 <h3 className="text-2xl font-black italic uppercase tracking-tighter">Stratejik Müdahale</h3>
                 <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Yapay Zeka Destekli Aksiyon Planı</p>
              </div>
              
              <div className="space-y-4">
                 {[
                   { title: 'Şebeke Suyu Klorlama', risk: 'KRİTİK', icon: Droplet },
                   { title: 'Bölge C Mobil Aşılama', risk: 'YÜKSEK', icon: Activity },
                   { title: 'Gıda Hijyeni Denetimi', risk: 'ORTA', icon: ShieldAlert }
                 ].map((action, i) => (
                   <div key={i} className="p-6 bg-app-card/10 backdrop-blur-md rounded-[2rem] border border-white/10 flex items-center justify-between hover:bg-app-card/20 transition-all cursor-pointer group">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-app-card/20 rounded-xl flex items-center justify-center">
                            <action.icon size={20} />
                         </div>
                         <div>
                            <h4 className="text-sm font-black uppercase italic">{action.title}</h4>
                            <p className="text-[10px] font-bold text-app-on-primary/50 uppercase">{action.risk} ÖNCELİK</p>
                         </div>
                      </div>
                      <div className="p-3 bg-app-card/20 rounded-xl group-hover:bg-primary transition-colors">
                         <TrendingUp size={16} />
                      </div>
                   </div>
                 ))}
              </div>

              <button className="w-full py-6 bg-app-card text-app-text rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-lux hover:scale-[1.02] transition-all">
                 TAM RAPORU GÖRÜNTÜLE
              </button>
           </div>
           
           <div className="absolute top-0 right-0 p-10 opacity-10">
              <ShieldAlert size={300} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default PublicHealth;
