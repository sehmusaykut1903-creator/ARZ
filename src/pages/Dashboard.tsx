import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  MapPin, 
  Truck, 
  AlertTriangle, 
  Activity,
  Zap,
  ArrowUpRight,
  Cpu,
  Clock,
  LayoutDashboard,
  ShieldAlert,
  Plus,
  PhoneCall,
  FileText,
  Map as MapIcon,
  ChevronRight,
  Stethoscope
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const chartData = [
  { name: '00:00', counts: 400 },
  { name: '06:00', counts: 3000 },
  { name: '12:00', counts: 2000 },
  { name: '18:00', counts: 2780 },
  { name: '22:00', counts: 1890 },
];

const Dashboard = () => {
  const { t } = useTranslation();
  const { reports, logistics, patients, volunteers, projectIdentity, shipments, user, showToast } = useAppContext();
  const navigate = useNavigate();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const getStats = () => {
    const baseStats = [
      { label: 'Sistem Riski', value: '%84.2', color: 'text-red-600', progress: 84, sub: 'Kritik Durum', path: '/ai-center' },
    ];

    switch (user?.role) {
      case 'health_personnel':
        return [
          { label: 'Aktif Hastalar', value: patients.length + 1428, color: 'text-app-primary', sub: '+12 Yeni Giriş', subColor: 'text-red-500', path: '/clinical' },
          { label: 'Triyaj Bekleyen', value: '42', color: 'text-red-500', sub: 'Acil Müdahale', subColor: 'text-red-500', path: '/clinical' },
          { label: 'Klinik Destek', value: 'AKTİF', color: 'text-app-primary', sub: 'AI Asistan Hazır', subColor: 'text-blue-400', path: '/ai-center' },
          ...baseStats
        ];
      case 'logistics_manager':
        return [
          { label: 'Aktif Sevkiyatlar', value: shipments.length, color: 'text-orange-600', sub: '5 Geciken', subColor: 'text-red-500', path: '/logistics' },
          { label: 'Envanter Doluluk', value: '%92', color: 'text-app-primary', sub: 'Depo Kapasite', subColor: 'text-blue-500', path: '/logistics' },
          { label: 'Rota Verimi', value: '%98', color: 'text-green-600', sub: 'Optimum Akış', subColor: 'text-green-500', path: '/map' },
          ...baseStats
        ];
      case 'afad_operator':
        return [
          { label: 'Olay Yönetimi', value: reports.length, color: 'text-red-600', sub: 'Aktif Bildirimler', subColor: 'text-red-500', path: '/field' },
          { label: 'Saha Ekipleri', value: volunteers.length + 40, color: 'text-app-primary', sub: 'Görevde', subColor: 'text-blue-500', path: '/volunteer' },
          { label: 'Stratejik Risk', value: '%88', color: 'text-red-600', sub: 'Kritik Seviye', subColor: 'text-red-500', path: '/ai-center' },
          ...baseStats
        ];
      case 'citizen':
        return [
          { label: 'Güvenli Alanlar', value: '14 Nokta', color: 'text-green-600', sub: 'Size En Yakın', subColor: 'text-green-500', path: '/map' },
          { label: 'Yardım Durumu', value: 'AKTİF', color: 'text-app-primary', sub: 'Talepler Alınıyor', subColor: 'text-blue-500', path: '/field' },
          { label: 'Afet Rehberi', value: 'OKU', color: 'text-app-text', sub: 'Hazırlık Bilgileri', subColor: 'text-app-muted', path: '/settings' },
        ];
      default:
        return [
          { label: t('injured_count'), value: patients.length + 1428, color: 'text-app-text', sub: '+42 Son 1 Saat', subColor: 'text-red-500', path: '/clinical' },
          { label: t('logistic_flow'), value: shipments.length + ' SEVKİYAT', color: 'text-app-text', sub: 'Lojistik Kapasite %92', subColor: 'text-blue-500', path: '/logistics' },
          { label: t('volunteer'), value: volunteers.length + 840, color: 'text-green-600', sub: 'Aktif Ekipler Tamam', subColor: 'text-app-muted', path: '/volunteer' },
          ...baseStats
        ];
    }
  };

  const dashboardLabel = user?.role === 'health_personnel' ? 'Hekim Karar Destek Dashboard' :
                       user?.role === 'afad_operator' ? 'AFAD Operasyon Yönetim Merkezi' :
                       user?.role === 'logistics_manager' ? 'Lojistik ve Sevkiyat Dashboard' :
                       user?.role === 'citizen' ? 'Vatandaş Bilgilendirme Portalı' :
                       'ARZ Genel Yönetim Paneli';

  const stats = getStats();

  return (
    <div className="space-y-10 pb-16">
      {/* Operation Status Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-dark-surface rounded-[3rem] p-10 overflow-hidden shadow-premium shadow-blue-900/10 group border border-white/5"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(0,122,255,0.15),transparent)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[radial-gradient(circle_at_bottom_left,rgba(237,28,36,0.1),transparent)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-secondary text-app-on-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-pulse flex items-center gap-2">
                <ShieldAlert size={12} /> {t('live_system_active', 'Live Operation Mode')}
              </div>
              <span className="text-app-on-primary/30 text-[10px] font-black tracking-widest uppercase border border-white/10 px-3 py-1 rounded-full">GRID-ID: YGT-66-ARZ</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black text-app-on-primary tracking-tighter uppercase italic leading-none">
                {dashboardLabel}
              </h1>
              <p className="text-blue-400/80 font-black italic max-w-2xl text-xs uppercase tracking-widest">
                VERİ GÜVENLİĞİ: AES-256 {t('encrypted', 'ENCRYPTED').toUpperCase()} • {t('role_' + user?.role, { defaultValue: user?.role }).toUpperCase()} {t('mode', 'MODU').toUpperCase()}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 shrink-0">
             <button 
               onClick={() => setShowReportModal(true)}
               className="bg-app-card/5 hover:bg-app-card/10 backdrop-blur-xl border border-white/10 text-app-on-primary px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3"
             >
               <FileText size={18} className="text-blue-400" /> {t('add_report') || 'YENİ RAPOR'}
             </button>
             <button 
               onClick={() => setShowEmergencyModal(true)}
               className="bg-secondary hover:bg-[#DC2626] text-app-on-primary px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-red-500/40 transition-all hover:scale-[1.05] active:scale-95 flex items-center gap-3 animate-alert"
             >
               <PhoneCall size={18} /> {t('emergency_help')}
             </button>
          </div>
        </div>

        {/* Tactical Indicators */}
        <div className="mt-12 flex flex-wrap gap-12 border-t border-white/10 pt-10">
          <div className="flex items-center gap-4 bg-app-card/5 px-6 py-3 rounded-2xl border border-white/5">
            <Clock size={20} className="text-blue-400" />
            <div>
              <div className="text-[10px] font-black text-blue-300/30 uppercase tracking-widest">Sistem Çalışma Süresi</div>
              <div className="text-app-on-primary font-black text-xl tracking-tighter tabular-nums">74:22:15<span className="text-[10px] ml-1 opacity-40">UTC+3</span></div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-app-card/5 px-6 py-3 rounded-2xl border border-white/5">
            <Activity size={20} className="text-green-400" />
            <div>
              <div className="text-[10px] font-black text-blue-300/30 uppercase tracking-widest">Sensör Ağı Durumu</div>
              <div className="text-app-on-primary font-black text-xl tracking-tighter tabular-nums">98.4<span className="text-[10px] ml-1 opacity-40">{t('status.stable').toUpperCase()}</span></div>
            </div>
          </div>
           <div className="flex items-center gap-4 bg-app-card/5 px-6 py-3 rounded-2xl border border-white/5">
            <ShieldAlert size={20} className="text-secondary" />
            <div>
              <div className="text-[10px] font-black text-blue-300/30 uppercase tracking-widest">Genel Risk Skoru</div>
              <div className="text-secondary font-black text-xl tracking-tighter underline decoration-2 underline-offset-4">{t('status.critical').toUpperCase()}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat: any, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => navigate(stat.path)}
            className="group cursor-pointer"
          >
            <div className="bg-app-card p-8 rounded-[2.5rem] border border-app-border shadow-lux hover:shadow-premium transition-all relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0">
                <ArrowUpRight size={20} className="text-app-text/20" />
              </div>
              
              <div className="relative z-10">
                <div className="text-app-muted text-[11px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                   {stat.label}
                </div>
                <div className={`text-4xl font-black ${stat.color} tracking-tighter mb-4`}>{stat.value}</div>
                
                {stat.progress ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-md leading-none">{stat.sub}</span>
                      <span className="text-[11px] font-black text-app-muted tabular-nums leading-none">{stat.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-app-bg rounded-full overflow-hidden border border-app-border">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.progress}%` }}
                        transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-red-500 to-red-600 relative overflow-hidden" 
                      >
                         <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] w-1/2 -skew-x-12 animate-[shimmer_2s_infinite]" />
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  <div className={`text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${stat.subColor.includes('red') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-app-primary/10 text-app-primary border-blue-100'}`}>
                    {stat.sub}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Analytics Section */}
        <div className="col-span-12 lg:col-span-8 space-y-10">
           {/* Chart Container */}
           <div className="bg-app-card p-10 rounded-[3rem] border border-app-border shadow-lux relative overflow-hidden">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
               <div>
                  <h3 className="font-black text-app-text text-2xl tracking-tighter uppercase italic">Vaka Analiz Grafiği</h3>
                  <p className="text-[11px] text-app-muted font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-app-primary/100 rounded-full animate-pulse"></span>
                    24 Saatlik Gerçek Zamanlı Veri Akışı
                  </p>
               </div>
               <div className="flex gap-3">
                 <button className="bg-app-bg text-app-text text-[10px] font-black px-6 py-3 rounded-2xl border border-app-border hover:bg-app-card hover:border-primary transition-all uppercase tracking-widest">Haftalık</button>
                 <button className="bg-primary text-app-on-primary text-[10px] font-black px-6 py-3 rounded-2xl shadow-lg shadow-app-primary/20 uppercase tracking-widest">Günlük</button>
               </div>
             </div>
             <div className="h-[350px] min-h-[350px] w-full relative overflow-hidden" style={{ minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--app-primary)" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="var(--app-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fontWeight: 900, fill: '#64748B' }} 
                      dy={15} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fontWeight: 900, fill: '#64748B' }} 
                      dx={-10}
                    />
                    <Tooltip 
                      cursor={{ stroke: '#003366', strokeWidth: 2, strokeDasharray: '5 5' }}
                      contentStyle={{ backgroundColor: '#001F3D', border: 'none', borderRadius: '24px', color: '#fff', padding: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase' }}
                      labelStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '900', marginBottom: '8px', letterSpacing: '0.1em' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="counts" 
                      stroke="var(--app-primary)" 
                      strokeWidth={5} 
                      fillOpacity={1} 
                      fill="url(#premiumGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
           </div>

           {/* Quick Action Grid */}
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Premium Add 1: Hızlı İşlem Merkezi */}
              <div className="bg-app-card p-8 rounded-[3rem] border border-app-border shadow-lux relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="bg-app-primary/10 text-app-text px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100">
                      Modül 1
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-black text-app-text leading-tight italic uppercase tracking-tighter">
                      {t('quick_action_center', 'Hızlı İşlem Merkezi')}
                    </h4>
                    <div className="flex flex-col gap-3">
                      <button onClick={() => setShowEmergencyModal(true)} className="flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 border border-red-100 rounded-2xl transition-all group">
                        <div className="flex items-center gap-3"><PhoneCall size={18} className="text-red-500" /><span className="text-xs font-black text-red-600 uppercase tracking-widest">{t('emergency_help', 'Acil Yardım Talebi')}</span></div>
                        <ArrowUpRight size={16} className="text-red-400 group-hover:scale-125 transition-transform" />
                      </button>
                      <button onClick={() => navigate('/field')} className="flex items-center justify-between p-4 bg-app-bg hover:bg-gray-100 border border-app-border rounded-2xl transition-all group">
                        <div className="flex items-center gap-3"><Plus size={18} className="text-app-muted" /><span className="text-xs font-black text-gray-700 uppercase tracking-widest">{t('new_field_report', 'Yeni Saha Bildirimi')}</span></div>
                        <ArrowUpRight size={16} className="text-app-muted group-hover:scale-125 transition-transform" />
                      </button>
                      <button onClick={() => navigate('/ai')} className="flex items-center justify-between p-4 bg-app-primary/10 hover:bg-blue-100 border border-blue-100 rounded-2xl transition-all group">
                        <div className="flex items-center gap-3"><Cpu size={18} className="text-blue-500" /><span className="text-xs font-black text-app-primary uppercase tracking-widest">{t('ai_analysis', 'ARZ AI Analiz Al')}</span></div>
                        <ArrowUpRight size={16} className="text-blue-400 group-hover:scale-125 transition-transform" />
                      </button>
                      <button onClick={() => navigate('/map')} className="flex items-center justify-between p-4 bg-app-bg hover:bg-gray-100 border border-app-border rounded-2xl transition-all group">
                        <div className="flex items-center gap-3"><MapIcon size={18} className="text-app-muted" /><span className="text-xs font-black text-gray-700 uppercase tracking-widest">{t('show_on_map', 'Haritada Göster')}</span></div>
                        <ArrowUpRight size={16} className="text-app-muted group-hover:scale-125 transition-transform" />
                      </button>
                      <button onClick={() => setShowReportModal(true)} className="flex items-center justify-between p-4 bg-app-bg hover:bg-gray-100 border border-app-border rounded-2xl transition-all group">
                        <div className="flex items-center gap-3"><FileText size={18} className="text-app-muted" /><span className="text-xs font-black text-gray-700 uppercase tracking-widest">{t('add_report', 'Rapor Oluştur')}</span></div>
                        <ArrowUpRight size={16} className="text-app-muted group-hover:scale-125 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Add 6: Demo Veri Kontrolü & AI Card */}
              <div className="flex flex-col gap-8">
                {/* AI Insight Card */}
                <div 
                  onClick={() => navigate('/ai')}
                  className="flex-1 bg-app-card p-8 rounded-[3rem] border border-app-border shadow-lux hover:shadow-premium transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute -bottom-10 -right-10 opacity-5 transition-transform group-hover:scale-110 group-hover:-rotate-12">
                     <Cpu size={150} className="text-app-text" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 bg-app-primary/10 rounded-[1.5rem] flex items-center justify-center text-app-text group-hover:bg-primary group-hover:text-app-on-primary transition-colors duration-500">
                        <Zap size={24} />
                      </div>
                      <div className="bg-blue-100/50 text-app-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-200">{t('ai_summary_card', 'AI Özet Kartı')}</div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xl font-black text-app-text leading-tight italic uppercase tracking-tighter">
                        {t('daily_risk_summary', 'Günlük Risk Özeti')}
                      </h4>
                      <div className="flex flex-col gap-2">
                        <p className="text-app-muted text-xs font-bold leading-relaxed flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Hatay/Kırıkhan ({t('status.critical', 'Kritik')} {t('warning', 'Uyarı')})</p>
                        <p className="text-app-muted text-xs font-bold leading-relaxed flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> {t('weather_warning', 'Şiddetli Yağış Uyarısı')} {t('logistic_route', 'Lojistik Rota')} - 1</p>
                        <p className="text-app-muted text-xs font-bold leading-relaxed flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> 12 {t('shipment_completed', 'Sevkiyat Başarıyla Tamamlandı')}</p>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-app-primary/100 animate-pulse" />
                         <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">3 {t('new_insights', 'Yeni Öneri Mevcut')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-surface p-8 rounded-[3rem] border border-white/10 shadow-lux flex flex-col justify-between relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(0,122,255,0.1),transparent)] pointer-events-none" />
                   <div className="relative z-10 space-y-4">
                     <h4 className="text-xl font-black text-app-on-primary leading-tight italic uppercase tracking-tighter">
                       Demo Veri Kontrolü
                     </h4>
                     <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => showToast(t('yozgat_pilot_scenario', 'Yozgat Pilot Senaryosu') + " " + t('loaded', 'Yüklendi'), "info")} className="bg-app-card/20 text-app-on-primary text-[10px] font-black px-4 py-3 rounded-2xl uppercase tracking-widest hover:bg-app-card/20 transition-all text-left">{t('yozgat_pilot_scenario', 'Yozgat Pilot Senaryosu')}</button>
                        <button onClick={() => showToast(t('earthquake_scenario', 'Deprem Senaryosu') + " " + t('loaded', 'Yüklendi'), "info")} className="bg-app-card/20 text-app-on-primary text-[10px] font-black px-4 py-3 rounded-2xl uppercase tracking-widest hover:bg-app-card/20 transition-all text-left">{t('earthquake_scenario', 'Deprem Senaryosu')}</button>
                        <button onClick={() => showToast(t('flood_scenario', 'Sel Senaryosu') + " " + t('loaded', 'Yüklendi'), "info")} className="bg-app-card/20 text-app-on-primary text-[10px] font-black px-4 py-3 rounded-2xl uppercase tracking-widest hover:bg-app-card/20 transition-all text-left">{t('flood_scenario', 'Sel Senaryosu')}</button>
                        <button onClick={() => { showToast(t('demo_data_refreshed', 'Demo Verileri Yenilendi'), "success"); window.location.reload(); }} className="bg-app-card/10 text-app-text bg-app-card text-[10px] font-black px-4 py-3 rounded-2xl uppercase tracking-widest hover:bg-app-primary/10 transition-all text-left">{t('refresh_demo_data', 'Demo Verileri Yenile')}</button>
                     </div>
                   </div>
                </div>
              </div>
           </div>
        </div>

        {/* Tactical Feed & Sidebar Area */}
        <div className="col-span-12 lg:col-span-4 space-y-8 h-full flex flex-col">
           <div className="bg-app-card p-10 rounded-[3rem] border border-app-border shadow-lux flex-1 relative overflow-hidden flex flex-col">
              <div className="relative z-10 space-y-8 flex-1 flex flex-col">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
                      <h3 className="font-black text-sm uppercase tracking-[0.2em] text-app-text">{t('last_reports')}</h3>
                    </div>
                    <button className="text-[10px] font-black text-app-primary uppercase tracking-widest hover:underline">Tümünü Gör</button>
                 </div>

                 <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {[
                      { tag: 'TRJ', label: 'Acil Triaj Talebi', loc: 'Antakya • 2dk önce', color: 'bg-red-50 text-red-600', icon: Stethoscope },
                      { tag: 'LTS', label: 'Lojistik Sevkiyat #S1', loc: 'Ankara Exit • 8dk önce', color: 'bg-app-primary/10 text-app-primary', icon: Truck },
                      { tag: 'VLT', label: 'Gönüllü Ekip #4', loc: 'Hatay Center • 15dk önce', color: 'bg-green-50 text-green-600', icon: Users },
                      { tag: 'WTR', label: 'Su Deposu Kritik', loc: 'Elbistan • 24dk önce', color: 'bg-orange-50 text-orange-600', icon: Zap },
                    ].map((report, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-5 group cursor-pointer hover:translate-x-1 transition-all"
                      >
                        <div className={`w-14 h-14 ${report.color} rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                          <report.icon size={20} />
                        </div>
                        <div className="flex-1 border-b border-app-border pb-5 group-hover:border-primary/10 transition-all">
                           <div className="text-sm font-black text-app-text italic uppercase tracking-tight">{report.label}</div>
                           <div className="text-[10px] text-app-muted font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                              <MapPin size={10} /> {report.loc}
                           </div>
                        </div>
                      </motion.div>
                    ))}
                 </div>
                 
                 <div className="pt-8">
                    <div className="bg-app-bg p-6 rounded-[2rem] border border-app-border">
                      <div className="text-[10px] font-black text-app-muted uppercase tracking-widest mb-4">Sistem Sorumlusu</div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-dark-surface rounded-2xl flex items-center justify-center text-app-on-primary font-black">SA</div>
                        <div>
                          <div className="text-xs font-black text-app-text capitalize">Şehmus AYKUT</div>
                          <div className="text-[9px] text-app-primary font-black uppercase tracking-widest leading-none mt-1">Lead Developer</div>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Project Identity Footer Info */}
      <div className="pt-10 border-t border-app-border flex flex-col items-center gap-6 text-center opacity-40 hover:opacity-100 transition-opacity duration-700">
         <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            <div className="space-y-1">
               <p className="text-[9px] font-black text-app-muted uppercase tracking-widest">Proje Adı</p>
               <p className="text-[11px] font-black text-app-text uppercase italic">{projectIdentity.name}</p>
            </div>
            <div className="space-y-1">
               <p className="text-[9px] font-black text-app-muted uppercase tracking-widest">Proje Ekibi</p>
               <p className="text-[11px] font-black text-app-text uppercase italic">{projectIdentity.team}</p>
            </div>
            <div className="space-y-1">
               <p className="text-[9px] font-black text-app-muted uppercase tracking-widest">Kurum / Üniversite</p>
               <p className="text-[11px] font-black text-app-text uppercase italic">{projectIdentity.institution}</p>
            </div>
            <div className="space-y-1">
               <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">Geliştirici</p>
               <p className="text-[11px] font-black text-[#E30613] uppercase italic">{projectIdentity.leadDeveloper}</p>
            </div>
         </div>
         <p className="text-[10px] font-black text-app-muted uppercase tracking-[0.4em] italic leading-relaxed">
            ARZ (Afet Raporlama ve Zamanlama) Sistemi © 2026 | {projectIdentity.version}
         </p>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showEmergencyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowEmergencyModal(false)}
               className="absolute inset-0 bg-[#0c0f1d]/90 backdrop-blur-md"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative bg-app-card w-full max-w-xl rounded-[3rem] p-8 sm:p-10 shadow-premium overflow-hidden border border-red-500/20 z-[101]"
             >
                <div className="absolute top-0 left-0 w-full h-2 bg-red-600 animate-pulse" />
                <div className="space-y-6">
                   <div className="flex items-center gap-4 border-b border-app-border pb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
                         <PhoneCall size={22} className="animate-bounce" />
                      </div>
                      <div className="text-left">
                         <h2 className="text-2xl font-black text-app-text italic uppercase tracking-tighter">{t('emergency_protocol_title', 'Acil Durum Protokolü')}</h2>
                         <p className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none mt-1">CRITICAL COMMAND DEPLOYMENT</p>
                      </div>
                   </div>

                   <p className="text-left text-xs text-app-muted font-bold leading-relaxed">
                      {t('emergency_protocol_subtitle', 'Protokol kapsamında anlık olarak devreye alınan operasyon adımları aşağıdadır:')}
                   </p>

                   {/* Steps List */}
                   <div className="space-y-3 bg-app-bg/60 p-5 rounded-[2rem] border border-app-border font-sans text-left">
                      {[
                         t('emergency_protocol_step_1', 'Kritik afet alarmı oluştur'),
                         t('emergency_protocol_step_2', 'Saha bildirimi başlat'),
                         t('emergency_protocol_step_3', 'Lojistik önceliklendirme yap'),
                         t('emergency_protocol_step_4', 'ARZ AI risk analizi çalıştır'),
                         t('emergency_protocol_step_5', 'Haritada kritik bölgeyi göster')
                      ].map((stepText, index) => (
                         <div key={index} className="flex items-center gap-4 text-xs font-bold text-app-text">
                            <span className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[10px] font-black text-red-600 shrink-0">
                               {index + 1}
                            </span>
                            <span className="tracking-tight uppercase">{stepText}</span>
                         </div>
                      ))}
                   </div>

                   {/* Functional Navigation Buttons */}
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <button 
                        onClick={() => { setShowEmergencyModal(false); navigate('/field'); }}
                        className="py-4 rounded-2xl bg-app-bg hover:bg-gray-100 text-app-text border border-app-border text-[11px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center gap-2"
                      >
                        <FileText size={18} className="text-blue-500" />
                        <span>{t('emergency_protocol_btn_field', 'Saha Bildirimi Aç')}</span>
                      </button>
                      <button 
                        onClick={() => { setShowEmergencyModal(false); navigate('/map'); }}
                        className="py-4 rounded-2xl bg-app-bg hover:bg-gray-100 text-app-text border border-app-border text-[11px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center gap-2"
                      >
                        <MapIcon size={18} className="text-emerald-500" />
                        <span>{t('emergency_protocol_btn_map', 'Haritayı Aç')}</span>
                      </button>
                      <button 
                        onClick={() => { setShowEmergencyModal(false); navigate('/ai'); }}
                        className="py-4 rounded-2xl bg-app-primary/10 hover:bg-blue-100 text-app-primary border border-blue-200 text-[11px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center gap-2"
                      >
                        <Cpu size={18} className="text-app-primary" />
                        <span>{t('emergency_protocol_btn_ai', 'ARZ AI Analiz')}</span>
                      </button>
                   </div>

                   {/* Back/Close Button */}
                   <div className="pt-2">
                      <button 
                        onClick={() => setShowEmergencyModal(false)}
                        className="w-full py-4 rounded-2xl bg-red-600 text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
                      >
                        {t('emergency_protocol_btn_back', 'Geri Dön')}
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}

        {showReportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowReportModal(false)}
               className="absolute inset-0 bg-[#001F3D]/90 backdrop-blur-md"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative bg-app-card w-full max-w-xl rounded-[3rem] p-10 shadow-premium overflow-hidden"
             >
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-2xl font-black text-app-text italic uppercase tracking-tighter flex items-center gap-3">
                      <FileText className="text-app-primary" /> Yeni Saha Raporu
                   </h2>
                   <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-app-bg rounded-xl text-app-muted">X</button>
                </div>
                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-app-muted uppercase tracking-widest ml-1">Bölge</label>
                         <input type="text" placeholder="Antakya / Merkez" className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs font-bold" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-app-muted uppercase tracking-widest ml-1">Kategori</label>
                         <select className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs font-bold">
                            <option>Yaralı Bildirimi</option>
                            <option>Lojistik İhtiyaç</option>
                            <option>Yol Durumu</option>
                            <option>Diğer</option>
                         </select>
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-widest ml-1">Detaylı Açıklama</label>
                      <textarea rows={4} className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs font-bold" placeholder="Rapor detaylarını buraya yazınız..."></textarea>
                   </div>
                   <button 
                     onClick={() => { setShowReportModal(false); showToast('Rapor Başarıyla Kaydedildi', 'success'); }}
                     className="w-full py-4 bg-app-primary text-app-on-primary rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-app-primary/20 mt-4"
                   >
                      RAPORU YAYINLA
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
