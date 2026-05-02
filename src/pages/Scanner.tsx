import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Scan, 
  QrCode, 
  IdCard, 
  FileSearch, 
  History, 
  ShieldCheck, 
  Zap, 
  Camera, 
  Info,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  FileCheck,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const Scanner = () => {
  const { t } = useTranslation();
  const { showToast, isOnline } = useAppContext();
  const [activeMode, setActiveMode] = useState<'qr' | 'id' | 'pdf'>('qr');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);

  const handleStartScan = () => {
    setIsScanning(true);
    setScanResult(null);
    // Simulate scan delay
    setTimeout(() => {
      setIsScanning(false);
      const mockResults = {
        qr: { type: 'QR Code', data: 'AFAD-AID-2026-TR-0982', status: 'verified', timestamp: Date.now() },
        id: { type: 'ID Card', name: 'Şehmus AYKUT', id: '1029384756', status: 'authorized', timestamp: Date.now() },
        pdf: { type: 'PDF Report', title: 'Antakya Risk Analizi v4.2', pages: 12, status: 'analyzed', timestamp: Date.now() }
      };
      setScanResult(mockResults[activeMode]);
      showToast(t('success', 'Tarama Başarılı'), 'success');
    }, 2500);
  };

  const modes = [
    { id: 'qr', label: 'QR / Barkod', icon: QrCode, desc: 'Lojistik ve vaka takibi için barkod tarayıcı' },
    { id: 'id', label: 'Kimlik / Pasaport', icon: IdCard, desc: 'NFC ve Görsel kimlik doğrulama' },
    { id: 'pdf', label: 'Belge Analizi', icon: FileSearch, desc: 'PDF ve resmi evrak OCR analizi' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-app-text italic uppercase tracking-tighter flex items-center gap-3">
            <Scan className="w-8 h-8 text-app-primary" />
            {t('browser')}
          </h1>
          <p className="text-sm font-bold text-app-muted uppercase tracking-widest mt-1">
            Gelişmiş Saha Tarama ve Doğrulama Birimi
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-app-card px-4 py-2 rounded-2xl border border-app-border shadow-sm">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`} />
            <span className="text-[10px] font-black text-app-muted uppercase tracking-widest">
              {isOnline ? 'ONLINE ENGINE' : 'OFFLINE LOCAL BRAIN'}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">E2E ENCRYPTED</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Mode Selection & Scanner */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
          {/* Mode Tabs */}
          <div className="grid grid-cols-3 gap-3">
            {modes.map(mode => (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveMode(mode.id as any);
                  setScanResult(null);
                  setIsScanning(false);
                }}
                className={`relative p-4 rounded-3xl border transition-all flex flex-col items-center gap-3 group
                  ${activeMode === mode.id 
                    ? 'bg-primary border-primary shadow-lg shadow-primary/20' 
                    : 'bg-app-card border-app-border hover:bg-app-bg'}`}
              >
                <mode.icon className={`w-6 h-6 ${activeMode === mode.id ? 'text-app-on-primary' : 'text-app-muted group-hover:scale-110 transition-transform'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${activeMode === mode.id ? 'text-app-on-primary' : 'text-app-muted'}`}>
                  {mode.label}
                </span>
                {activeMode === mode.id && (
                  <motion.div layoutId="mode-pill" className="absolute -bottom-1 w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Scanner Area */}
          <div className="bg-dark-surface rounded-[3rem] overflow-hidden relative aspect-video border-[6px] border-app-card shadow-2xl group">
            {/* Mock Camera View */}
            <div className="absolute inset-0 bg-[#0A1220] flex items-center justify-center">
              {!isScanning && !scanResult ? (
                <div className="text-center space-y-6 max-w-sm px-6">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 animate-pulse">
                    <Camera className="w-10 h-10 text-white/40" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Kamera Hazır</h3>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                      {modes.find(m => m.id === activeMode)?.desc}
                    </p>
                  </div>
                  <button 
                    onClick={handleStartScan}
                    className="px-10 py-4 bg-primary text-app-on-primary rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    Taramayı Başlat
                  </button>
                </div>
              ) : isScanning ? (
                <div className="relative w-full h-full">
                  {/* Scan Animation UI */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border-2 border-primary/50 relative overflow-hidden rounded-2xl">
                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-0.5 bg-primary shadow-[0_0_15px_#2563EB]"
                      />
                      <div className="absolute inset-0 bg-primary/5" />
                    </div>
                  </div>
                  <div className="absolute bottom-12 left-0 w-full text-center">
                    <p className="text-xs font-black text-white/60 uppercase tracking-[0.4em] animate-pulse italic">
                      Sistem Analiz Yapıyor...
                    </p>
                  </div>
                </div>
              ) : scanResult ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full flex items-center justify-center p-8"
                >
                  <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 p-10 max-w-md w-full shadow-2xl flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-500 mb-6">
                      <FileCheck className="w-8 h-8" />
                    </div>
                    <h4 className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em] mb-2 font-mono">VERIFIED DATA</h4>
                    <div className="space-y-1 mb-8">
                      <div className="text-2xl font-black text-white italic tracking-tight uppercase">{activeMode === 'qr' ? scanResult.data : scanResult.name || scanResult.title}</div>
                      <div className="text-xs font-bold text-white/40 uppercase tracking-widest">{scanResult.type}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 w-full gap-4 mb-8">
                       <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                          <div className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">DURUM</div>
                          <div className="text-[10px] font-black text-green-400 uppercase">{scanResult.status}</div>
                       </div>
                       <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                          <div className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">ZAMAN</div>
                          <div className="text-[10px] font-black text-white/60 uppercase">{new Date(scanResult.timestamp).toLocaleTimeString()}</div>
                       </div>
                    </div>

                    <button 
                      onClick={() => setScanResult(null)}
                      className="w-full py-4 bg-white text-app-text rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-colors"
                    >
                      Yeni Tarama
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </div>

            {/* Viewfinder Elements */}
            <div className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4 border-white/20 rounded-tl-xl" />
            <div className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4 border-white/20 rounded-tr-xl" />
            <div className="absolute bottom-8 left-8 w-8 h-8 border-b-4 border-l-4 border-white/20 rounded-bl-xl" />
            <div className="absolute bottom-8 right-8 w-8 h-8 border-b-4 border-r-4 border-white/20 rounded-br-xl" />
          </div>
        </div>

        {/* Right: History & Info */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
          {/* Hardware Status */}
          <section className="bg-app-card rounded-[2.5rem] p-8 border border-app-border shadow-premium">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-app-primary/5 rounded-xl flex items-center justify-center text-app-primary">
                <Smartphone size={20} />
              </div>
              <h3 className="text-base font-black text-app-text italic uppercase tracking-tighter">Cihaz Durumu</h3>
            </div>

            <div className="space-y-4">
               {[
                 { label: 'Kamera Sensörü', value: 'Sony IMX-586 (Active)', status: 'green' },
                 { label: 'NFC Modülü', value: 'Secure Element Ready', status: 'green' },
                 { label: 'Yapay Zeka Core', value: 'Local Analysis v5.1', status: 'blue' }
               ].map((hw, i) => (
                 <div key={i} className="bg-app-bg p-4 rounded-2xl flex flex-col gap-1 border border-app-border/50">
                    <span className="text-[9px] font-black text-app-muted uppercase tracking-widest">{hw.label}</span>
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-black text-app-text">{hw.value}</span>
                       <div className={`w-1.5 h-1.5 rounded-full ${hw.status === 'green' ? 'bg-green-500' : 'bg-blue-500'} animate-pulse`} />
                    </div>
                 </div>
               ))}
            </div>
          </section>

          {/* History */}
          <section className="bg-app-card rounded-[2.5rem] p-8 border border-app-border shadow-premium overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                  <History size={20} />
                </div>
                <h3 className="text-base font-black text-app-text italic uppercase tracking-tighter">Son Etkinlik</h3>
              </div>
              <button className="text-[10px] font-black text-primary uppercase tracking-widest">Temizle</button>
            </div>

            <div className="space-y-3">
               {[
                 { type: 'QR', title: 'Lojistik Paket #882', time: '12:45', status: 'verified' },
                 { type: 'ID', title: 'Operatör Kimliği', time: '11:20', status: 'authorized' },
                 { type: 'PDF', title: 'Hasar Tespit Raporu', time: '09:15', status: 'synced' }
               ].map((item, i) => (
                 <div key={i} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-app-bg transition-all cursor-pointer border border-transparent hover:border-app-border">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-app-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                       {item.type === 'QR' ? <QrCode size={18} /> : item.type === 'ID' ? <IdCard size={18} /> : <FileSearch size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="text-[11px] font-black text-app-text truncate uppercase tracking-tight">{item.title}</div>
                       <div className="flex items-center gap-2 text-[9px] font-bold text-app-muted uppercase mt-0.5">
                          <span>{item.time}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span className={`${item.status === 'verified' ? 'text-green-500' : 'text-blue-500'}`}>{item.status}</span>
                       </div>
                    </div>
                    <ChevronRight size={14} className="text-app-muted opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                 </div>
               ))}
            </div>
            
            <button className="mt-8 w-full py-4 bg-app-bg text-[10px] font-black text-app-muted hover:text-app-text uppercase tracking-widest rounded-2xl transition-all border border-app-border">
               Tüm Geçmişi Görüntüle
            </button>
          </section>

          {/* Tips */}
          <div className="bg-gradient-to-br from-primary to-blue-700 rounded-[2.5rem] p-8 text-app-on-primary shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-500">
                <Info size={120} />
             </div>
             <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                   <Zap className="w-6 h-6 fill-current" />
                </div>
                <div className="space-y-2">
                   <h4 className="text-lg font-black italic uppercase tracking-tighter italic">Hızlı İpucu</h4>
                   <p className="text-xs font-bold text-white/70 leading-relaxed uppercase tracking-widest">
                      Çevrimdışı modda ID taraması yaparken yerel veri setleri v5.1 kullanılır.
                   </p>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all">
                   Daha Fazla Bilgi <ArrowRight size={14} />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
