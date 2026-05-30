import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Settings as SettingsIcon, 
  Globe2, 
  Palette, 
  ShieldCheck, 
  LogOut, 
  User, 
  Zap, 
  Type,
  Maximize2,
  CheckCircle2,
  Bell,
  Cpu,
  Info,
  RotateCcw,
  AlertTriangle,
  Layers,
  Stethoscope,
  Truck,
  Users,
  LayoutDashboard,
  Brain as BrainCircuit,
  Sun,
  Type as TypeIcon,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { ThemeType, TextSize, FontFamily, UserRole } from '../types';
import { ArzLogo } from '../components/ArzLogo';
import SettingsToggle from '../components/SettingsToggle';
import { LANGUAGES } from '../components/LanguageSelector';

const Settings = () => {
  const { t, i18n: i18nInstance } = useTranslation();
  const { 
    lang, setLang, 
    theme, setTheme, 
    user, setUser,
    textSize, setTextSize,
    fontFamily, setFontFamily,
    aiSettings, setAiSettings,
    displaySettings, setDisplaySettings,
    notificationSettings, setNotificationSettings,
    securitySettings, setSecuritySettings,
    soundSettings, setSoundSettings,
    mapSettings, setMapSettings,
    resetSettings, updateSetting,
    projectIdentity,
    showToast
  } = useAppContext();

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('arz_active_settings_tab') || 'general';
  });
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('arz_active_settings_tab', activeTab);
  }, [activeTab]);

  const menuItems = [
    { id: 'general', label: t('settings_labels.general'), icon: User },
    { id: 'accessibility', label: t('settings_labels.accessibility'), icon: Maximize2 },
    { id: 'home_screen', label: t('settings_labels.homeScreen'), icon: LayoutDashboard },
    { id: 'ai', label: t('settings_labels.arzAiSettings'), icon: BrainCircuit },
    { id: 'notifications', label: t('settings_labels.notifications'), icon: Bell },
    { id: 'language', label: t('settings_labels.languageRegion'), icon: Globe2 },
    { id: 'theme', label: t('settings_labels.themeAppearance'), icon: Palette },
    { id: 'map', label: t('settings_labels.mapSettings'), icon: Layers },
    { id: 'security', label: t('settings_labels.securityData'), icon: ShieldCheck },
    { id: 'about', label: t('settings_labels.about'), icon: Info },
  ];

  const handleToggle = (category: string, setting: string, value: boolean) => {
    updateSetting(category, setting, value);
  };

  const handleLangChange = (l: string) => {
    setLang(l);
  };

  const handleThemeChange = (id: ThemeType) => {
    setTheme(id);
  };

  const handleReset = () => {
    resetSettings();
    setShowResetModal(false);
    showToast(t('settings_reset_success', 'Sistem Sıfırlandı'), 'success');
  };



  const themes: { id: ThemeType; label: string; desc: string; colors: string[] }[] = [
    { id: 'afad', label: t('theme_afad'), desc: t('theme_desc_afad'), colors: ['#003366', '#ED1C24', '#020617'] },
    { id: 'kizilay', label: t('theme_kizilay'), desc: t('theme_desc_kizilay'), colors: ['#B91C1C', '#FFFFFF', '#450A0A'] },
    { id: 'yesilay', label: t('theme_yesilay'), desc: t('theme_desc_yesilay'), colors: ['#047857', '#10B981', '#022C22'] },
    { id: 'akut', label: t('theme_akut'), desc: t('theme_desc_akut'), colors: ['#111827', '#F97316', '#020617'] },
    { id: 'emergency112', label: t('theme_emergency112'), desc: t('theme_desc_emergency112'), colors: ['#B91C1C', '#2563EB', '#172554'] },
  ];

  const roles: { id: UserRole; label: string; desc: string; icon: any; color: string }[] = [
    { id: 'health_personnel', label: t('role_health_personnel'), desc: 'Klinik Karar Destek', icon: Stethoscope, color: 'text-blue-500' },
    { id: 'afad_operator', label: t('role_afad_operator'), desc: 'Saha Yönetimi', icon: ShieldCheck, color: 'text-red-500' },
    { id: 'logistics_manager', label: t('role_logistics_manager'), desc: 'Stok Kontrol', icon: Truck, color: 'text-orange-500' },
    { id: 'admin', label: t('role_admin'), desc: 'Tam Yetkili', icon: SettingsIcon, color: 'text-gray-700' },
  ];

  const renderSection = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="bg-app-bg/50 p-6 rounded-3xl border border-app-border flex items-center gap-5">
              <div className="w-14 h-14 bg-app-primary text-app-on-primary rounded-2xl flex items-center justify-center text-xl font-black italic shadow-lg">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black text-app-text uppercase italic truncate">{user?.name || 'Operatör'}</h4>
                <p className="text-[10px] font-bold text-app-muted uppercase tracking-widest mt-0.5">{user?.role}</p>
                <button onClick={() => setUser(null)} className="mt-2 text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline">{t('logout')}</button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-app-muted uppercase tracking-widest px-1">{t('operation_role_selection')}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {roles.map(r => (
                  <button 
                    key={r.id}
                    onClick={() => setUser(prev => prev ? {...prev, role: r.id} : null)}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all text-left ${user?.role === r.id ? 'selected-item' : 'border-app-border bg-app-bg hover:bg-app-card'}`}
                  >
                    <div className={`p-2 rounded-xl ${user?.role === r.id ? 'bg-white/20' : 'bg-app-card border border-app-border'}`}>
                      <r.icon size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest truncate">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <SettingsToggle label={t('toggles.autoSave')} checked={securitySettings.rememberSession} onChange={(val) => handleToggle('security', 'rememberSession', val)} />
              <SettingsToggle label={t('toggles.demoMode')} checked={securitySettings.faceIdDemo} onChange={(val) => handleToggle('security', 'faceIdDemo', val)} />
              <SettingsToggle label={t('toggles.offlineMode')} checked={securitySettings.localEncryption} onChange={(val) => handleToggle('security', 'localEncryption', val)} />
            </div>
          </div>
        );
      case 'accessibility':
        return (
          <div className="space-y-2">
            <SettingsToggle label={t('toggles.boldText', 'Kalın Metin')} checked={displaySettings.boldText} onChange={(val) => handleToggle('display', 'boldText', val)} />
            <SettingsToggle label={t('toggles.highContrast', 'Yüksek Kontrast')} checked={displaySettings.highContrast} onChange={(val) => handleToggle('display', 'highContrast', val)} />
            <SettingsToggle label={t('toggles.largeButtons', 'Büyük Butonlar')} checked={displaySettings.bigButtons} onChange={(val) => handleToggle('display', 'bigButtons', val)} />
            <SettingsToggle label={t('toggles.reduceMotion', 'Hareketleri Azalt')} checked={displaySettings.reduceMotion} onChange={(val) => handleToggle('display', 'reduceMotion', val)} />
            <SettingsToggle label={t('toggles.focusRing', 'Odak Çerçevesi')} checked={displaySettings.focusRing} onChange={(val) => handleToggle('display', 'focusRing', val)} />
          </div>
        );
      case 'home_screen':
        return (
          <div className="space-y-2">
            <SettingsToggle label={t('toggles.showStats', 'İstatistikleri Göster')} checked={displaySettings.homeShowStats} onChange={(val) => handleToggle('display', 'homeShowStats', val)} />
            <SettingsToggle label={t('toggles.showQuickActions', 'Hızlı İşlemleri Göster')} checked={displaySettings.homeShowQuickActions} onChange={(val) => handleToggle('display', 'homeShowQuickActions', val)} />
          </div>
        );
      case 'ai':
        return (
          <div className="space-y-2">
            <SettingsToggle label={t('toggles.aiActive', 'ARZ AI Aktif')} checked={aiSettings.active} onChange={(val) => handleToggle('ai', 'active', val)} />
            <SettingsToggle label={t('toggles.localBrain', 'Yerel Motor (Local Brain)')} checked={aiSettings.localBrain} onChange={(val) => handleToggle('ai', 'localBrain', val)} />
            <SettingsToggle label={t('toggles.memory', 'Hafıza ve Öğrenme')} checked={aiSettings.memory} onChange={(val) => handleToggle('ai', 'memory', val)} />
            <SettingsToggle label={t('toggles.detailedAnalysisMode', 'Detaylı Analiz Modu')} checked={aiSettings.detailedAnalysisMode} onChange={(val) => handleToggle('ai', 'detailedAnalysisMode', val)} />
            <SettingsToggle label={t('toggles.useClinicalData', 'Klinik Veri Kullanımı')} checked={aiSettings.useClinicalData} onChange={(val) => handleToggle('ai', 'useClinicalData', val)} />
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-2">
            <SettingsToggle label={t('toggles.notificationsEnabled', 'Tüm Bildirimler')} checked={notificationSettings.enabled} onChange={(val) => handleToggle('notification', 'enabled', val)} />
            <SettingsToggle label={t('toggles.criticalAlerts', 'Kritik Uyarılar')} checked={notificationSettings.criticalAlerts} onChange={(val) => handleToggle('notification', 'criticalAlerts', val)} />
            <SettingsToggle label={t('toggles.shipmentNotifications', 'Sevkiyat Uyarıları')} checked={notificationSettings.shipmentNotifications} onChange={(val) => handleToggle('notification', 'shipmentNotifications', val)} />
          </div>
        );
      case 'language':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {LANGUAGES.map(l => (
              <button 
                key={l.id}
                onClick={() => handleLangChange(l.id)}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${lang === l.id ? 'selected-item' : 'border-app-border bg-app-bg hover:bg-app-card'}`}
              >
                <span className="text-3xl leading-none">{l.flag}</span>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[12px] font-black uppercase tracking-wider text-app-text">{l.code}</span>
                  <span className="text-[10px] font-bold text-app-muted mt-0.5">{l.name}</span>
                </div>
              </button>
            ))}
          </div>
        );
      case 'theme':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`p-5 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between h-32 ${theme === t.id ? 'selected-item' : 'border-app-border bg-app-bg'}`}
              >
                <div className="flex gap-1.5">
                  {t.colors.map(c => <div key={c} className="w-4 h-4 rounded-lg border border-white/20 shadow-sm" style={{ backgroundColor: c }} />)}
                </div>
                <div>
                  <h5 className="text-[11px] font-black uppercase tracking-widest italic">{t.label}</h5>
                  <p className={`text-[8px] font-black uppercase tracking-tighter mt-1 ${theme === t.id ? 'text-white/70' : 'text-app-muted'}`}>{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        );
      case 'map':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
               <h4 className="text-[10px] font-black text-app-muted uppercase tracking-widest px-1">{t('toggles.mapMode', 'Harita Modu')}</h4>
               <div className="grid grid-cols-3 gap-2">
                 {['standard', 'satellite', 'operation'].map(style => (
                    <button 
                      key={style}
                      onClick={() => setMapSettings({ mapStyle: style as any })}
                      className={`p-3 rounded-xl border-2 transition-all font-black text-[9px] uppercase tracking-widest ${
                        mapSettings.mapStyle === style ? 'selected-item' : 'border-app-border bg-app-bg text-app-muted'
                      }`}
                    >
                      {t('map_style_' + style, style === 'standard' ? 'Standart' : style === 'satellite' ? 'Uydu' : 'Operasyon')}
                    </button>
                  ))}
               </div>
            </div>
            <SettingsToggle label={t('toggles.mapShowMyLocation', 'Konumumu Göster')} checked={mapSettings.showMyLocation} onChange={() => setMapSettings({ showMyLocation: !mapSettings.showMyLocation })} />
          </div>
        );
      case 'about':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center py-6 text-center">
               <ArzLogo variant="vertical" className="mb-4" />
               <p className="text-[10px] font-black text-[#E30613] uppercase tracking-[0.3em] mt-4">
                 {t('about', 'Hakkında')}
               </p>
               <h3 className="text-xl font-black text-app-text italic uppercase tracking-tighter mt-4">
                 ARZ - Afet Raporlama ve Zamanlama
               </h3>
               <p className="text-xs font-bold text-app-muted uppercase italic tracking-widest mt-2">
                 {t('slogan', 'Doğru Veri, Doğru Zaman, Doğru Müdahale.')}
               </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-app-bg/40 p-6 rounded-3xl border border-app-border flex flex-col justify-between">
                <span className="text-[9px] font-black text-app-muted uppercase tracking-widest mb-1">{t('project_name', 'Proje Adı')}</span>
                <span className="text-sm font-black text-app-text tracking-tight uppercase italic text-app-primary">ARZ - Afet Raporlama ve Zamanlama</span>
              </div>
              
              <div className="bg-app-bg/40 p-6 rounded-3xl border border-app-border flex flex-col justify-between">
                <span className="text-[9px] font-black text-app-muted uppercase tracking-widest mb-1">{t('developer', 'Geliştirici')}</span>
                <span className="text-sm font-black text-app-text tracking-tight uppercase italic font-bold">Şehmus Aykut</span>
              </div>

              <div className="bg-app-bg/40 p-6 rounded-3xl border border-app-border flex flex-col justify-between">
                <span className="text-[9px] font-black text-app-muted uppercase tracking-widest mb-1">{t('project_team', 'Proje Ekibi')}</span>
                <span className="text-sm font-black text-app-text tracking-tight uppercase italic font-bold">Şehmus Aykut - Aghajan Musalı</span>
              </div>

              <div className="bg-app-bg/40 p-6 rounded-3xl border border-app-border flex flex-col justify-between">
                <span className="text-[9px] font-black text-app-muted uppercase tracking-widest mb-1">{t('academic_advisor', 'Akademik Danışman')}</span>
                <span className="text-sm font-black text-app-text tracking-tight uppercase italic text-red-500 font-bold">Prof. Dr. Vugar Ali TÜRKSOY</span>
              </div>

              <div className="bg-app-bg/40 p-6 rounded-3xl border border-app-border flex flex-col justify-between md:col-span-2">
                <span className="text-[9px] font-black text-app-muted uppercase tracking-widest mb-1">{t('institution', 'Kurum')}</span>
                <span className="text-sm font-black text-app-text tracking-tight uppercase italic">Yozgat Bozok Üniversitesi Tıp Fakültesi</span>
              </div>

              <div className="bg-app-bg/40 p-6 rounded-3xl border border-app-border flex flex-col justify-between md:col-span-2">
                <span className="text-[9px] font-black text-app-muted uppercase tracking-widest mb-1">{t('version', 'Sürüm')}</span>
                <span className="text-sm font-black text-app-text tracking-tight uppercase italic">ARZ v5.1.1 / v5.2.0 Premium</span>
              </div>
            </div>

            <div className="bg-app-bg/50 p-6 rounded-[2rem] border border-app-border text-center">
              <p className="text-[10px] font-bold text-app-muted uppercase tracking-widest leading-relaxed">
                © 2026 & Şehmus Aykut Tarafından Geliştirilmiştir. Telif Hakları Saklıdır.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-10 text-center space-y-4">
             <div className="w-16 h-16 bg-app-bg rounded-full flex items-center justify-center mx-auto text-app-muted"><RotateCcw size={32} className="animate-spin-slow" /></div>
             <p className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em]">Bu bölüm yapılandırılıyor...</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-[1120px] mx-auto min-h-0 md:h-[calc(100vh-120px)] flex flex-col md:flex-row gap-4 p-2 md:p-4 overflow-hidden">
      {/* Sidebar - compact macOS like (Desktop only) */}
      <div className="hidden md:flex w-[260px] bg-app-card rounded-[2rem] border border-app-border shadow-sm shrink-0 flex-col overflow-hidden">
        <div className="p-5 border-b border-app-border flex items-center justify-between">
           <h3 className="text-xs font-black text-app-text uppercase tracking-widest italic">{t('settings')}</h3>
        </div>
        <div className="flex-1 w-full overflow-y-auto p-2 scrollbar-none space-y-0.5">
           {menuItems.map(item => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                 activeTab === item.id ? 'nav-item-active' : 'text-app-text/70 hover:bg-app-bg'
               }`}
             >
               <div className={`p-1.5 rounded-lg ${activeTab === item.id ? 'bg-white/20' : 'bg-app-bg shadow-sm'}`}>
                 <item.icon size={16} />
               </div>
               <span className="text-[12px] font-bold truncate">{item.label}</span>
             </button>
           ))}
         </div>
       </div>

      {/* Horizontal categories list for Mobile */}
      <div className="flex md:hidden overflow-x-auto gap-2 p-1.5 shrink-0 select-none scrollbar-none bg-app-card rounded-2xl border border-app-border/60">
        {menuItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 border uppercase font-black text-[10px] tracking-tight ${
                isActive 
                  ? 'text-white shadow-sm' 
                  : 'bg-app-bg text-app-text/75 border-app-border hover:bg-app-card'
              }`}
              style={isActive ? { backgroundColor: 'var(--app-primary)', borderColor: 'var(--app-primary)', color: '#ffffff' } : undefined}
            >
              <item.icon size={13} className={isActive ? 'text-white' : 'text-app-muted'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-app-card rounded-2xl md:rounded-[2rem] border border-app-border shadow-sm overflow-hidden flex flex-col relative min-h-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-none">
           <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-black text-app-text uppercase italic tracking-tighter">{menuItems.find(i => i.id === activeTab)?.label}</h2>
              <p className="text-[9px] md:text-[10px] font-bold text-app-muted uppercase tracking-widest mt-1 opacity-60">Sistem yapılandırma ve tercihler</p>
           </div>
           
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, x: 10 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -10 }}
               transition={{ duration: 0.2 }}
             >
               {renderSection()}
             </motion.div>
           </AnimatePresence>
        </div>

        <div className="p-4 border-t border-app-border flex items-center justify-between text-[8px] font-black text-app-muted uppercase tracking-[0.2em] bg-app-bg/10">
           <div className="flex items-center gap-4">
              <span className="hidden sm:inline">{t('data_stored_locally')}</span>
              <span className="w-1 h-1 rounded-full bg-app-muted opacity-30 hidden sm:inline" />
              <span>{projectIdentity.version}</span>
           </div>
           <button onClick={() => setShowResetModal(true)} className="text-red-400 hover:text-red-500 transition-colors uppercase font-black">
             {t('reset_system')}
           </button>
        </div>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-app-card rounded-[3rem] p-12 max-w-sm w-full text-center space-y-6 shadow-2xl">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto"><AlertTriangle size={40} /></div>
              <h4 className="text-2xl font-black text-app-text uppercase italic italic tracking-tighter">Sistem Sıfırlama</h4>
              <p className="text-xs text-app-muted font-bold leading-relaxed">Tüm ayarlar ve operasyonel veriler kalıcı olarak silinecektir. Emin misiniz?</p>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setShowResetModal(false)} className="py-4 bg-gray-100 text-app-muted rounded-2xl font-black text-[10px] uppercase">Vazgeç</button>
                 <button onClick={handleReset} className="py-4 bg-red-500 text-app-on-primary rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-red-500/20">Sıfırla</button>
              </div>
           </motion.div>
        </div>
      )}
    </div>
  );
};

export default Settings;
