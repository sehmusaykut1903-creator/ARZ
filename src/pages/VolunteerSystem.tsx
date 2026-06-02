import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Search, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Brain,
  Medal,
  Activity,
  MapPin,
  Stethoscope,
  Construction,
  Languages,
  Truck,
  Zap,
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  Star,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { VolunteerStatus, VolunteerSkill, Volunteer } from '../types';

const VolunteerSystem = () => {
  const { t, i18n } = useTranslation();
  const { volunteers, reports, updateVolunteer, addNotification, showToast } = useAppContext();
  const [filter, setFilter] = useState<VolunteerStatus | 'all'>('all');
  const [matchingResults, setMatchingResults] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  const skillIcons: Record<VolunteerSkill, any> = {
    first_aid: Stethoscope,
    debris_removal: Construction,
    psychology: Activity,
    translation: Languages,
    logistics: Truck,
    search_rescue: MapPin
  };

  const skillLabels: Record<VolunteerSkill, string> = {
    first_aid: t('clinical'),
    debris_removal: 'Enkaz Kaldırma',
    psychology: 'Psikolojik Destek',
    translation: 'Çeviri',
    logistics: t('logistics'),
    search_rescue: 'Arama Kurtarma'
  };

  const statusColors: Record<VolunteerStatus, string> = {
    [VolunteerStatus.IDLE]: 'bg-green-50 text-green-700 border-green-100',
    [VolunteerStatus.ON_DUTY]: 'bg-app-primary/10 text-app-primary border-blue-100',
    [VolunteerStatus.BREAK]: 'bg-orange-50 text-orange-700 border-orange-100',
    [VolunteerStatus.INACTIVE]: 'bg-app-bg text-app-muted border-app-border'
  };

  const [isMatching, setIsMatching] = useState(false);

  const findMatches = () => {
    setIsMatching(true);
    setTimeout(() => {
      const matches = reports.filter(r => r.severity === 'high' || r.severity === 'critical').map(report => {
        const neededSkillMap: any = {
          injured: 'first_aid',
          debris: 'search_rescue',
          other: 'logistics',
          water: 'logistics',
          food: 'logistics'
        };
        
        const neededSkill = neededSkillMap[report.type] || 'logistics';
        const availableVolunteers = volunteers.filter(v => 
          (v.status === VolunteerStatus.IDLE || v.status === VolunteerStatus.BREAK) && 
          v.skills.includes(neededSkill as VolunteerSkill)
        );
        
        return {
          report,
          suggestedVolunteers: availableVolunteers,
          neededSkill
        };
      }).filter(m => m.suggestedVolunteers.length > 0);

      setMatchingResults(matches);
      setIsMatching(false);
      
      if (matches.length > 0) {
        showToast(`${matches.length} vaka için uygun ekipler bulundu`, 'success');
        addNotification({
          id: Date.now().toString(),
          title: 'AI Eşleşme Başarılı',
          message: `${matches.length} vaka için uygun gönüllü ekipleri bulundu.`,
          type: 'info',
          timestamp: Date.now(),
          read: false
        });
      } else {
        showToast('Su an aktarılacak vaka veya uygun ekip bulunamadı', 'warning');
      }
    }, 1500);
  };

  const handleAddVolunteer = () => {
    // Demo implementation
    showToast('Yeni gönüllü kaydı başarıyla oluşturuldu', 'success');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-10 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-primary/5 rounded-[2rem] flex items-center justify-center text-app-text shadow-inner">
              <Users size={32} />
           </div>
           <div>
              <h1 className="text-3xl font-black text-app-text tracking-tighter uppercase italic">{t('volunteer')}</h1>
              <p className="text-[11px] text-app-muted font-black uppercase tracking-[0.25em] mt-1.5 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Yetenek Bazlı Dinamik Koordinasyon Sistemi
              </p>
           </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={findMatches} 
            className="bg-dark-surface text-app-on-primary px-8 py-5 rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-premium shadow-blue-900/10 active:scale-95 transition-all flex items-center gap-3 group border border-white/5"
          >
            <Brain size={20} className="text-blue-400 group-hover:rotate-12 transition-transform" />
            AI AKILLI EŞLEŞTİRME
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-secondary text-app-on-secondary px-8 py-5 rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-premium shadow-red-500/20 active:scale-95 transition-all flex items-center gap-3"
          >
            <UserPlus size={20} />
            YENİ GÖNÜLLÜ KAYDI
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Volunteer List Area */}
        <div className="md:col-span-12 lg:col-span-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-app-card p-8 rounded-[3rem] border border-app-border shadow-lux">
            <div className="flex-1 flex items-center gap-4 px-4 w-full bg-app-bg/50 rounded-2xl py-2">
              <Search size={18} className="text-app-muted" />
              <input 
                placeholder="Gönüllü adı, yetenek veya bölge ara..." 
                className="w-full text-xs font-black uppercase tracking-widest outline-none bg-transparent placeholder:text-app-muted text-app-text" 
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {['all', ...Object.values(VolunteerStatus)].map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s as any)}
                  className={`px-6 py-3.5 rounded-2xl text-[10px] font-black tracking-widest transition-all whitespace-nowrap border ${
                    filter === s 
                    ? 'bg-primary text-app-on-primary border-primary shadow-premium' 
                    : 'bg-app-bg/50 text-app-muted border-transparent hover:bg-app-card hover:border-app-border'
                  } uppercase`}
                >
                   {s === 'all' ? 'TÜMÜ' : t('status_' + s) || s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <AnimatePresence>
              {volunteers.filter(v => filter === 'all' || v.status === filter).map((v, idx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  key={v.id}
                  className="bg-app-card p-10 rounded-[3rem] border border-app-border shadow-lux space-y-8 hover:shadow-premium transition-all relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity -translate-y-4 group-hover:translate-y-0 duration-700">
                     <Medal size={160} />
                  </div>

                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-20 h-20 bg-dark-surface text-app-on-primary rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-premium shadow-app-primary/20 border-4 border-white">
                          {v.name[0]}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center ${statusColors[v.status]?.split(' ')[0]}`}>
                           <div className={`w-2 h-2 rounded-full ${v.status === VolunteerStatus.IDLE ? 'bg-green-500 animate-pulse' : 'bg-current'}`} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-black text-app-text text-xl tracking-tight uppercase italic">{v.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                           <Star size={12} className="text-yellow-400 fill-yellow-400" />
                           <span className="text-[10px] font-black text-app-muted uppercase tracking-widest">Premium Sahatacı</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedVolunteer(v)}
                      className="w-10 h-10 rounded-xl bg-app-bg flex items-center justify-center text-app-muted hover:bg-primary hover:text-app-on-primary transition-all"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-black text-app-muted uppercase tracking-widest">Yetenekler</span>
                      <span className="text-[10px] font-black text-blue-500 uppercase">Expertise</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {v.skills.map(s => {
                        const Icon = skillIcons[s] || MapPin;
                        return (
                          <div key={s} className="bg-app-bg/80 border border-app-border text-app-muted px-4 py-2.5 rounded-xl text-[10px] font-black flex items-center gap-2 uppercase tracking-tight hover:bg-app-card transition-colors cursor-default">
                            <Icon size={14} className="text-blue-500" />
                            {skillLabels[s] || s}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {v.status === VolunteerStatus.ON_DUTY && (
                    <div className="p-6 bg-app-primary/10/50 rounded-2xl border border-blue-100/50 relative z-10">
                       <div className="flex justify-between items-center mb-3">
                          <span className="text-[9px] font-black text-app-primary uppercase tracking-widest flex items-center gap-2">
                            <Activity size={12} className="animate-pulse" /> Görev Durumu
                          </span>
                          <span className="text-[9px] font-black text-blue-400 uppercase">72%</span>
                       </div>
                       <div className="h-1.5 w-full bg-blue-100/50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '72%' }}
                            className="h-full bg-app-primary/100" 
                          />
                       </div>
                    </div>
                  )}

                  <div className="pt-8 border-t border-app-border flex gap-4 relative z-10">
                     <button 
                       onClick={() => updateVolunteer(v.id, { status: v.status === VolunteerStatus.IDLE ? VolunteerStatus.ON_DUTY : VolunteerStatus.IDLE })}
                       className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all shadow-premium ${
                         v.status === VolunteerStatus.IDLE 
                         ? 'bg-primary text-app-on-primary shadow-blue-500/20 hover:scale-[1.02]' 
                         : 'bg-secondary text-app-on-secondary shadow-red-500/20 hover:scale-[1.02]'
                       }`}
                     >
                        {v.status === VolunteerStatus.IDLE ? <Zap size={16} /> : <Clock size={16} />}
                        {v.status === VolunteerStatus.IDLE ? 'GÖREVE GÖNDER' : 'GÖREV SONLANDIR'}
                     </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Tactical & AI Insights Area */}
        <div className="md:col-span-12 lg:col-span-4 space-y-8 flex flex-col">
           {/* AI Matching Panel */}
           <div className="bg-dark-surface p-10 rounded-[3.5rem] shadow-premium relative overflow-hidden flex-1 border border-white/5">
              <div className="absolute top-0 right-0 p-10 opacity-5 transition-transform duration-700 hover:scale-110">
                 <Brain size={200} className="text-blue-400" />
              </div>
              <div className="relative z-10 space-y-10 flex flex-col h-full">
                 <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-app-primary/100/20 rounded-[1.5rem] flex items-center justify-center text-blue-400 border border-blue-400/20 shadow-glow-blue">
                       <Zap size={32} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-app-on-primary uppercase tracking-tighter italic">AI ASİSTAN ÖNERİLERİ</h3>
                       <div className="flex items-center gap-2 mt-1">
                          <span className="w-2 h-2 bg-app-primary/100 rounded-full animate-pulse" />
                          <span className="text-[10px] text-blue-300/40 font-black tracking-[0.3em] uppercase">Tactical Engine v2.1</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <AnimatePresence mode="popLayout">
                      {matchingResults.length > 0 ? (
                        matchingResults.slice(0, 3).map((match, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-app-card/5 border border-white/10 rounded-[2rem] p-8 space-y-6 shadow-lux group hover:bg-app-card/10 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div className="bg-secondary/20 text-secondary border border-secondary/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle size={12} /> YÜKSEK ÖNCELİK
                              </div>
                            </div>
                            <div className="space-y-2">
                               <p className="text-sm text-blue-100 font-bold leading-relaxed italic truncate"># {match.report.location.address}</p>
                               <div className="text-[10px] text-app-on-primary/40 font-black uppercase tracking-widest flex items-center gap-2">
                                  <MapPin size={10} /> Yozgat / Merkez
                               </div>
                            </div>
                            
                            <div className="flex flex-col gap-4">
                               <div className="flex items-center gap-3">
                                  <div className="flex -space-x-4">
                                    {match.suggestedVolunteers.slice(0, 3).map((v: any, idx: number) => (
                                       <div key={idx} className="w-12 h-12 rounded-2xl border-4 border-[#001F3D] bg-primary flex items-center justify-center text-sm font-black text-app-on-primary shadow-xl relative group-hover:translate-y-[-4px] transition-transform" style={{ transitionDelay: `${idx * 100}ms` }}>
                                         {v.name[0]}
                                       </div>
                                    ))}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-xs font-black text-app-on-primary">{match.suggestedVolunteers.length} Gönüllü</span>
                                    <span className="text-[9px] text-app-on-primary/40 font-bold uppercase tracking-widest">Eşleşme Oranı: %94</span>
                                  </div>
                               </div>

                               <button className="w-full bg-app-card text-app-text py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-premium">
                                 BİRİMLERİ SEVK ET
                               </button>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-center opacity-40">
                          <div className="w-24 h-24 bg-app-card/5 rounded-[2rem] flex items-center justify-center mb-8 border border-white/5">
                            <Clock className="text-app-on-primary/20" size={40} />
                          </div>
                          <p className="text-app-on-primary/30 text-[11px] uppercase tracking-[0.3em] font-black italic">TARAMA BEKLENİYOR</p>
                        </div>
                      )}
                    </AnimatePresence>
                 </div>
              </div>
           </div>

           {/* Metrics Card */}
           <div className="bg-app-card p-10 rounded-[3.5rem] border border-app-border shadow-premium flex flex-col gap-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-blue-500/5 transition-transform group-hover:scale-110 duration-700">
                 <TrendingUp size={160} />
              </div>
              <div className="relative z-10 space-y-6">
                 <div className="flex justify-between items-center">
                    <h3 className="font-black text-app-text text-sm uppercase tracking-[0.2em]">Saha Performansı</h3>
                    <TrendingUp size={20} className="text-green-500" />
                 </div>
                 <div className="space-y-6">
                    <div className="bg-app-bg/50 p-6 rounded-[2rem] border border-app-border">
                       <div className="text-[10px] font-black text-app-muted uppercase tracking-widest mb-2">Ortalama Müdahale Süresi</div>
                       <div className="text-3xl font-black text-app-text tracking-tighter tabular-nums">14:22<span className="text-xs ml-1 opacity-40 font-bold uppercase tracking-widest">Dakika</span></div>
                    </div>
                    <div className="bg-app-bg/50 p-6 rounded-[2rem] border border-app-border">
                       <div className="text-[10px] font-black text-app-muted uppercase tracking-widest mb-2">Başarı Puanı</div>
                       <div className="text-3xl font-black text-green-600 tracking-tighter tabular-nums">9.8<span className="text-xs ml-1 opacity-40 font-bold uppercase tracking-widest">/ 10</span></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
         {showAddModal && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
                className="absolute inset-0 bg-dark-surface/90 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative bg-app-card w-full max-w-2xl rounded-[3.5rem] shadow-premium overflow-hidden border border-white/20"
              >
                 <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                 <div className="p-10 space-y-10">
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-app-primary/10 rounded-2xl flex items-center justify-center text-app-text">
                             <UserPlus size={28} />
                          </div>
                          <div>
                             <h2 className="text-2xl font-black text-app-text italic uppercase tracking-tighter">Yeni Gönüllü Tanımlama</h2>
                             <p className="text-[10px] font-bold text-app-muted uppercase tracking-widest mt-1">Sistem Kayıt Formu v4.2</p>
                          </div>
                       </div>
                       <button onClick={() => setShowAddModal(false)} className="p-4 bg-app-bg text-app-muted hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all">
                          <X size={20} />
                       </button>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-app-muted uppercase tracking-widest px-1">AD SOYAD</label>
                          <input type="text" placeholder="Örn: Ahmet Yılmaz" className="w-full p-5 bg-app-bg border border-app-border rounded-2xl text-xs font-black uppercase outline-none focus:border-primary transition-colors" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-app-muted uppercase tracking-widest px-1">T.C. KİMLİK</label>
                          <input type="text" placeholder="11 Haneli" className="w-full p-5 bg-app-bg border border-app-border rounded-2xl text-xs font-black uppercase outline-none focus:border-primary transition-colors" />
                       </div>
                       <div className="col-span-2 space-y-3">
                          <label className="text-[10px] font-black text-app-muted uppercase tracking-widest px-1">UZMANLIK ALANLARI</label>
                          <div className="grid grid-cols-3 gap-4">
                             {Object.keys(skillLabels).map(s => (
                               <button key={s} className="p-4 bg-app-bg/50 border border-app-border rounded-2xl text-[9px] font-black uppercase tracking-tight text-app-muted hover:bg-primary-50 hover:text-app-text transition-all text-center">
                                  {skillLabels[s as VolunteerSkill]}
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="pt-6 border-t border-app-border grid grid-cols-2 gap-6">
                       <button onClick={() => setShowAddModal(false)} className="py-5 bg-gray-100 text-app-muted rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all">İPTAL</button>
                       <button onClick={handleAddVolunteer} className="py-5 bg-primary text-app-on-primary rounded-3xl text-xs font-black uppercase tracking-widest shadow-premium shadow-blue-500/20 hover:scale-[1.02] transition-all">KAYDI TAMAMLA</button>
                    </div>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default VolunteerSystem;
