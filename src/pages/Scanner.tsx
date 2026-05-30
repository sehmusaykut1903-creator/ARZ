import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Scan, 
  QrCode, 
  IdCard, 
  History, 
  ShieldCheck, 
  Zap, 
  Camera, 
  AlertCircle,
  CameraOff,
  RefreshCw,
  Cpu,
  Smartphone,
  Tag,
  HeartPulse,
  UserCheck,
  Package,
  MapPin,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const Scanner = () => {
  const { t, i18n } = useTranslation();
  const { showToast, addShipment, addReport } = useAppContext();
  const [activeTab, setActiveTab] = useState<'qr' | 'id' | 'nfc' | 'tag' | 'health'>('qr');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  
  // Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (isCameraActive && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraActive, stream]);

  const toggleCamera = async () => {
    if (isCameraActive) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setStream(null);
      setIsCameraActive(false);
      setCameraError(null);
    } else {
      try {
        setCameraError(null);
        const newStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }, 
          audio: false 
        });
        setStream(newStream);
        setIsCameraActive(true);
      } catch (err: any) {
        console.error("Camera access failed", err);
        setCameraError(t('camera_permission_denied', 'Kamera izni reddedildi.'));
      }
    }
  };

  const handleDemoScan = () => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      let mockData = {};

      switch (activeTab) {
        case 'qr':
          mockData = {
            type: "shipment",
            code: "AFAD-AID-2026-TR-0982",
            content: "Tıbbi Malzeme Konteyneri",
            destination: "Hatay / Kırıkhan",
            priority: "Kritik",
            status: "Doğrulandı"
          };
          break;
        case 'id':
          mockData = {
            type: "identity",
            code: "10293847562",
            name: "Şehmus AYKUT",
            role: "Saha Operatörü",
            status: "Doğrulandı"
          };
          break;
        case 'nfc':
          mockData = {
            type: "nfc_health",
            owner: "Demo Kullanıcı",
            bloodType: "A Rh+",
            allergy: "Fıstık",
            chronicDisease: "Hipertansiyon",
            status: "Okundu"
          };
          break;
        case 'tag':
          mockData = {
            type: "tag",
            code: "ETK-7721-BC",
            origin: "Ankara Lojistik Merkez",
            destination: "Kahramanmaraş / Elbistan",
            content: "Kuru Gıda / Su",
            status: "Doğrulandı"
          };
          break;
        case 'health':
          mockData = {
            type: "health_card",
            owner: "Fatma Yılmaz",
            id: "4433221100",
            emergencyNote: "Diyabet Hastası. İnsülin Kullanıyor.",
            status: "Erişildi"
          };
          break;
      }
      setScanResult(mockData);
      showToast(t('system.success'), 'success');
    }, 1500);
  };

  const currentTabInfo = {
    qr: { title: t('qr_scan'), subtitle: t('qr_subtitle', 'Kamera ile QR veya Barkod tarayın'), icon: QrCode },
    id: { title: t('id_verify'), subtitle: t('id_subtitle', 'T.C. Kimlik veya Pasaport doğrulaması'), icon: IdCard },
    nfc: { title: t('nfc_read'), subtitle: t('nfc_subtitle', 'NFC özellikli kartları yaklaştırın'), icon: Smartphone },
    tag: { title: t('shipment_tag'), subtitle: t('tag_subtitle', 'Sevkiyat ve paket etiketlerini okutun'), icon: Tag },
    health: { title: t('health_id'), subtitle: t('health_subtitle', 'Vatandaş sağlık profiline erişim'), icon: HeartPulse },
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 app-shell p-4 md:p-8">
      {/* Header Section */}
      <div className="bg-app-card p-8 rounded-[2.5rem] border border-app-border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Scan size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-app-primary/10 rounded-2xl text-app-primary">
                <Scan size={32} />
             </div>
             <div>
                <h1 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">
                  {t('scanner')}
                </h1>
                <p className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em] mt-1">
                  {t('scanner_subtitle')}
                </p>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          <button 
            onClick={toggleCamera}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl ${
              isCameraActive ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-app-primary text-app-on-primary shadow-app-primary/20 hover:scale-105 active:scale-95'
            }`}
          >
            {isCameraActive ? <><CameraOff size={16} /> {t('close_camera')}</> : <><Camera size={16} /> {t('open_camera')}</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Tab Selection */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="text-[10px] font-black text-app-muted uppercase tracking-[0.3em] mb-4 ml-4">{t('tab_task_unit', 'GÖREV BİRİMİ')}</h3>
          {(Object.keys(currentTabInfo) as Array<keyof typeof currentTabInfo>).map(tab => {
            const info = currentTabInfo[tab];
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setScanResult(null); }}
                className={`w-full flex items-center gap-4 p-5 rounded-[2rem] transition-all border-2 text-left group ${
                  isActive ? 'bg-app-primary border-app-primary text-white shadow-xl translate-x-2' : 'bg-app-card border-app-border text-app-muted hover:border-app-primary/30 hover:bg-white'
                }`}
              >
                <div className={`p-3 rounded-2xl transition-all ${isActive ? 'bg-white/20' : 'bg-app-bg group-hover:scale-110'}`}>
                   <info.icon size={22} />
                </div>
                <div>
                   <div className="text-xs font-black uppercase tracking-widest">{info.title}</div>
                   <div className={`text-[9px] font-bold uppercase mt-1 opacity-60 ${isActive ? 'text-white' : 'text-app-muted'}`}>{t('tab_validation', 'DOĞRULAMA')}</div>
                </div>
              </button>
            );
          })}

          <div className="p-8 bg-gradient-to-br from-[#003366] to-[#001F3D] rounded-[2.5rem] mt-8 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                <ShieldCheck size={80} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] italic mb-3 opacity-60">{t('scan_system_security', 'SİSTEM GÜVENLİĞİ')}</p>
              <p className="text-xs font-bold leading-relaxed">
                {t('scan_security_text', 'Tüm taramalar ARZ-E2E protokolü ile şifrelenir ve AFAD sunucuları ile anlık eşleşir.')}
              </p>
          </div>
        </div>

        {/* Right: Camera & Content */}
        <div className="lg:col-span-9 flex flex-col gap-8">
           <div className="bg-app-card rounded-[3.5rem] p-4 border border-app-border shadow-premium flex-1 flex flex-col min-h-[600px] relative overflow-hidden">
              {/* Camera Viewport */}
              <div className="flex-1 bg-black rounded-[3rem] relative overflow-hidden group shadow-inner">
                 {isCameraActive ? (
                   <>
                     <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                     <canvas ref={canvasRef} className="hidden" />
                     
                     <div className="absolute inset-0 border-[60px] border-black/40 pointer-events-none">
                        <div className="w-full h-full border-2 border-white/20 rounded-2xl flex items-center justify-center">
                           <div className="w-24 h-24 border border-white/10 rounded-full animate-ping" />
                        </div>
                     </div>

                     {isScanning && (
                       <motion.div 
                        initial={{ top: '10%' }}
                        animate={{ top: '90%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-10 right-10 h-1 bg-red-600 shadow-[0_0_20px_#ED1C24] z-50"
                       />
                     )}
                   </>
                 ) : (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-6">
                      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                         {React.createElement(currentTabInfo[activeTab].icon, { size: 40, className: 'text-white/20' })}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tight">{currentTabInfo[activeTab].title}</h3>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{currentTabInfo[activeTab].subtitle}</p>
                      </div>
                      <button 
                        onClick={toggleCamera}
                        className="bg-white text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                      >
                        {t('open_camera')}
                      </button>
                   </div>
                 )}

                 {/* Results Overlay */}
                 <AnimatePresence>
                    {scanResult && (
                      <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute bottom-10 inset-x-10 p-8 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-emerald-500 z-[100] flex flex-col md:flex-row gap-6 items-center"
                      >
                         <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shrink-0 border border-emerald-100">
                            <ShieldCheck size={40} className="animate-pulse" />
                         </div>
                         <div className="flex-1 space-y-2 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                               <span className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">{scanResult.status}</span>
                               <span className="text-[10px] font-black text-app-muted uppercase tracking-[0.1em]">{t('system_record_active', 'SİSTEM KAYDI AKTİF')}</span>
                            </div>
                            <h4 className="text-xl font-black text-app-text tracking-tighter uppercase italic">{scanResult.code || scanResult.name || scanResult.owner}</h4>
                            <p className="text-xs font-bold text-app-muted uppercase tracking-widest">
                               {scanResult.content || scanResult.role || scanResult.bloodType || scanResult.emergencyNote}
                            </p>
                            {scanResult.destination && (
                              <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                                 <MapPin size={12} className="text-red-600" />
                                 <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{scanResult.destination}</span>
                              </div>
                            )}
                         </div>
                         <div className="flex flex-col gap-2 w-full md:w-auto">
                            {(scanResult.type === 'shipment' || scanResult.type === 'tag') ? (
                              <button 
                                onClick={() => { showToast('Lojistik Sistemine Aktarıldı', 'success'); setScanResult(null); }}
                                className="px-6 py-3 bg-app-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-app-primary/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                              >
                                {t('transfer_to_logistics')}
                              </button>
                            ) : (
                              <button 
                                onClick={() => { showToast('Klinik Birime Aktarıldı', 'success'); setScanResult(null); }}
                                className="px-6 py-3 bg-app-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-app-primary/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                              >
                                {t('transfer_to_clinical')}
                              </button>
                            )}
                            <button 
                              onClick={() => setScanResult(null)}
                              className="px-6 py-3 bg-app-bg text-app-muted border border-app-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all"
                            >
                               {t('clear_results')}
                            </button>
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              {/* Action Area */}
              <div className="p-8 flex items-center justify-between gap-6 border-t border-app-border">
                 <div className="hidden md:block">
                    <h4 className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em]">{t('system_info')}</h4>
                    <p className="text-xs font-bold text-app-text tracking-tight uppercase italic mt-1">{t('scanner_secure_connection', 'Sistem bağlantısı güvenli')}</p>
                 </div>
                 <div className="flex-1 flex justify-end gap-3">
                    <button 
                       onClick={handleDemoScan}
                       disabled={isScanning}
                       className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-[#ED1C24] text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-[0_15px_30px_rgba(237,28,36,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                       {isScanning ? (
                         <RefreshCw className="animate-spin" size={20} />
                       ) : (
                         <>
                           <Cpu size={20} />
                           {activeTab === 'qr' ? t('demo_scan') : t('demo_scan').replace('QR', activeTab.toUpperCase())}
                         </>
                       )}
                    </button>
                 </div>
              </div>
           </div>

           {/* Stats & History Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: t('scan_today', 'BUGÜNÜN TARAMASI'), val: '124', icon: QrCode, color: 'text-blue-500' },
                { label: t('scan_rate', 'DOĞRULAMA ORANI'), val: '%98', icon: ShieldCheck, color: 'text-emerald-500' },
                { label: t('scan_delay', 'SİSTEM GECİKMESİ'), val: '12ms', icon: Zap, color: 'text-amber-500' }
              ].map((s, i) => (
                <div key={i} className="bg-app-card p-6 rounded-[2.5rem] border border-app-border shadow-sm flex items-center justify-between group hover:border-app-primary transition-all">
                  <div>
                    <p className="text-[10px] font-black text-app-muted uppercase tracking-widest mb-1">{s.label}</p>
                    <p className="text-2xl font-black text-app-text tracking-tighter italic">{s.val}</p>
                  </div>
                  <div className={`p-4 rounded-2xl bg-app-bg ${s.color} transition-transform group-hover:scale-110`}>
                    <s.icon size={24} />
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
