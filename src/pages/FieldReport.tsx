import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, AlertCircle, Droplets, Utensils, Construction, UserRoundPlus, Send, History, Camera, Mic, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const FieldReport = () => {
  const { t, i18n } = useTranslation();
  const { addReport, reports, user, projectIdentity, isOnline } = useAppContext();
  const [reportType, setReportType] = useState<'water' | 'food' | 'injured' | 'debris' | 'other'>('water');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackNumber, setTrackNumber] = useState('');

  const types = [
    { id: 'water', label: 'Su İhtiyacı', icon: Droplets, color: 'text-blue-500', bg: 'bg-app-primary/10' },
    { id: 'food', label: 'Gıda İhtiyacı', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'injured', label: 'Yaralı Var', icon: UserRoundPlus, color: 'text-[#ED1C24]', bg: 'bg-red-50' },
    { id: 'debris', label: 'Enkaz Modülü', icon: Construction, color: 'text-app-muted', bg: 'bg-app-bg' }
  ];

  const severities = [
    { id: 'low', label: t('status.low'), color: 'bg-green-500' },
    { id: 'medium', label: t('status.medium'), color: 'bg-yellow-500' },
    { id: 'high', label: t('status.high'), color: 'bg-orange-500' },
    { id: 'critical', label: t('status.critical'), color: 'bg-[#ED1C24]' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrackNum = 'ARZ-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setTrackNumber(newTrackNum);
    
    addReport({
      id: Date.now().toString(),
      type: reportType,
      severity,
      location: { lat: 0, lng: 0, address },
      timestamp: Date.now(),
      description,
      reporterId: user?.id || 'anonymous',
      leadDeveloper: projectIdentity.leadDeveloper,
      metadata: {
        projectName: projectIdentity.name,
        fullTitle: projectIdentity.fullTitle,
        projectTeam: projectIdentity.team,
        institution: projectIdentity.institution,
        department: projectIdentity.department,
        advisor: projectIdentity.advisor,
        leadDeveloper: projectIdentity.leadDeveloper,
        slogan: projectIdentity.slogan
      }
    } as any);
    
    setAddress('');
    setDescription('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-10">
      <div className="flex items-center gap-4">
         <div className="p-3 bg-app-primary/10 rounded-2xl">
            <MapPin className="text-[#003366]" size={28} />
         </div>
         <div>
            <h1 className="text-2xl font-black text-[#003366] tracking-tight lowercase"># {t('field')}</h1>
            <p className="text-[10px] text-app-muted font-extrabold uppercase tracking-widest mt-1">Anlık Saha Veri Girişi ve Takip Sistemi</p>
         </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#10B981] p-6 rounded-[2.5rem] text-app-on-primary shadow-2xl shadow-green-500/20 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 text-center md:text-left">
               <div className="bg-app-card/20 p-3 rounded-2xl">
                  <CheckCircle2 size={32} />
               </div>
               <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">KAYIT BAŞARILI!</h3>
                  <p className="text-xs font-bold opacity-80">Takip Numaranız: <span className="font-black text-xl ml-2">{trackNumber}</span></p>
               </div>
            </div>
            <button onClick={() => setShowSuccess(false)} className="bg-app-card text-[#10B981] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">KAPAT</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="bg-app-card p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-app-border space-y-10">
            {!isOnline && (
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-4 text-orange-700">
                <AlertCircle size={20} />
                <div className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                  İnternet Bağlantısı Yok. Bildirimleriniz cihazınıza kaydedilecek ve bağlantı gelince otomatik gönderilecektir.
                </div>
              </div>
            )}
            <div className="space-y-6">
              <label className="text-[10px] font-black text-app-muted uppercase tracking-[0.3em] block text-center md:text-left">BAŞLANGIÇ: BİLDİRİM TÜRÜ</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {types.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setReportType(t.id as any)}
                    className={`flex flex-col items-center justify-center p-6 rounded-[2.5rem] border-2 transition-all gap-3 ${
                      reportType === t.id 
                      ? 'border-[#001F3D] bg-[#001F3D] text-app-on-primary shadow-2xl shadow-app-primary/20 scale-105' 
                      : 'border-app-border bg-app-bg/50 hover:border-app-border text-app-muted'
                    }`}
                  >
                    <t.icon size={32} className={reportType === t.id ? 'text-app-on-primary' : t.color} />
                    <span className="text-[9px] font-black uppercase tracking-tighter">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-app-border">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-app-muted uppercase tracking-widest block">{i18n.language === 'tr' ? 'ÖNCELİK ANALİZİ' : 'PRIORITY'}</label>
                <div className="flex gap-2 p-1.5 bg-app-bg rounded-[1.5rem]">
                  {severities.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSeverity(s.id as any)}
                      className={`flex-1 h-12 rounded-xl transition-all ${
                        severity === s.id ? `${s.color} text-app-on-primary shadow-lg font-black` : 'text-app-muted hover:text-app-muted'
                      } text-[9px] font-bold uppercase tracking-tighter`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-app-muted uppercase tracking-widest block">{i18n.language === 'tr' ? 'LOKASYON / KOORDİNAT' : 'LOCATION'}</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                  <input 
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full bg-app-bg border border-app-border rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:bg-app-card outline-none transition-all placeholder:text-gray-200"
                    placeholder="Örn: 4. Cadde, No: 12..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-app-border">
              <label className="text-[10px] font-black text-app-muted uppercase tracking-widest block">{i18n.language === 'tr' ? 'DETAYLI AÇIKLAMA VEYA GÖZLEM' : 'DESCRIPTION'}</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-app-bg border border-app-border rounded-3xl px-6 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-app-card transition-all resize-none placeholder:text-gray-200"
                placeholder="İhtiyaç miktarını veya enkaz durumunu detaylandırın..."
              />
            </div>

            {/* Mock Media Uploads */}
            <div className="grid grid-cols-2 gap-4">
               <button type="button" className="flex items-center justify-center gap-3 py-4 bg-app-bg border border-dashed border-app-border rounded-2xl text-app-muted hover:text-blue-500 hover:border-blue-500 transition-all">
                  <Camera size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">FOTOĞRAF EKLE</span>
               </button>
               <button type="button" className="flex items-center justify-center gap-3 py-4 bg-app-bg border border-dashed border-app-border rounded-2xl text-app-muted hover:text-blue-500 hover:border-blue-500 transition-all">
                  <Mic size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">SES KAYDI EKLE</span>
               </button>
            </div>

            <button type="submit" className="w-full bg-[#001F3D] hover:bg-black text-app-on-primary py-6 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-app-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group">
              <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              SİSTEME GÖNDER
            </button>
          </form>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#001F3D] p-10 rounded-[3rem] text-app-on-primary shadow-2xl relative overflow-hidden h-fit">
            <div className="absolute top-0 right-0 p-10 opacity-10">
               <ShieldAlert size={120} />
            </div>
            <div className="relative z-10 space-y-6">
              <h3 className="flex items-center gap-3 font-black text-sm uppercase tracking-widest text-[#ED1C24]">
                <AlertCircle size={20} />
                {i18n.language === 'tr' ? 'SAHA GÜVENLİK' : 'SECURITY'}
              </h3>
              <p className="text-[11px] text-blue-200/60 font-medium leading-relaxed italic border-l-2 border-[#ED1C24] pl-4">
                Bildirimleriniz AFAD ve Kızılay koordinasyon merkezlerine canlı olarak iletilir. Yalancı ihbarlar KVKK kapsamında cezai işlem gerektirir.
              </p>
            </div>
          </div>

          <div className="bg-app-card rounded-[3rem] border border-app-border shadow-xl overflow-hidden flex flex-col h-[500px]">
            <div className="p-8 bg-app-bg border-b border-app-border flex items-center justify-between">
              <h3 className="font-black text-xs text-[#003366] uppercase flex items-center gap-3 tracking-widest">
                <History size={16} className="text-[#003366]" />
                {t('last_reports')}
              </h3>
              <span className="bg-blue-100 text-[#003366] px-2 py-0.5 rounded-lg text-[9px] font-black animate-pulse">LIVE</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50 custom-scrollbar">
              {reports.length === 0 && (
                <div className="p-12 text-center text-app-muted text-[10px] font-black uppercase tracking-widest italic">Kayıt Bulunmamaktadır</div>
              )}
              {reports.map((r) => (
                <div key={r.id} className="p-6 hover:bg-app-bg transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[9px] font-black text-[#003366] uppercase tracking-[0.2em]">{r.type}</span>
                    <span className={`text-[8px] font-black px-3 py-1 rounded-full text-app-on-primary uppercase tracking-widest shadow-sm ${
                      r.severity === 'critical' ? 'bg-[#ED1C24]' : 
                      r.severity === 'high' ? 'bg-orange-500' : 'bg-blue-400'
                    }`}>
                      {r.severity}
                    </span>
                  </div>
                  <p className="text-sm font-black text-app-text tracking-tight lowercase"># {r.location.address}</p>
                  <p className="text-[10px] text-app-muted mt-2 line-clamp-2 leading-relaxed italic">"{r.description}"</p>
                  <div className="mt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="text-[9px] font-black text-blue-500 uppercase">Detayları Gör</span>
                     <span className="text-[9px] text-app-muted">{new Date(r.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldReport;
