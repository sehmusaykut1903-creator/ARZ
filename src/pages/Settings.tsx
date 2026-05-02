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
    mapSettings, setMapSettings,
    resetSettings,
    projectIdentity,
    showToast
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('general');
  const [showResetModal, setShowResetModal] = useState(false);

  const menuItems = [
    { id: 'general', label: t('settings_labels.general'), icon: User },
    { id: 'accessibility', label: t('settings_labels.accessibility'), icon: Maximize2 },
    { id: 'home_screen', label: t('settings_labels.homeScreen'), icon: LayoutDashboard },
    { id: 'search', label: t('settings_labels.search'), icon: Search },
    { id: 'control_center', label: t('settings_labels.controlCenter'), icon: SettingsIcon },
    { id: 'display', label: t('settings_labels.displayBrightness'), icon: Sun },
    { id: 'ai', label: t('settings_labels.arzAiSettings'), icon: Cpu },
    { id: 'notifications', label: t('settings_labels.notifications'), icon: Bell },
    { id: 'sound_haptics', label: t('settings_labels.soundHaptics'), icon: Zap },
    { id: 'face_id', label: t('settings_labels.faceIdPassword'), icon: ShieldCheck },
    { id: 'emergency_sos', label: t('settings_labels.emergencySos'), icon: AlertTriangle },
    { id: 'connected_devices', label: t('settings_labels.connectedAccounts'), icon: TypeIcon },
    { id: 'language', label: t('settings_labels.languageRegion'), icon: Globe2 },
    { id: 'theme', label: t('settings_labels.themeAppearance'), icon: Palette },
    { id: 'map', label: t('settings_labels.mapSettings'), icon: Layers },
    { id: 'security', label: t('settings_labels.securityData'), icon: ShieldCheck },
    { id: 'about', label: t('settings_labels.about'), icon: Info },
  ];

  const handleToggle = (setting: string, category: 'ai' | 'display' | 'map') => {
    if (category === 'ai') setAiSettings({ [setting]: !(aiSettings as any)[setting] });
    if (category === 'display') setDisplaySettings({ [setting]: !(displaySettings as any)[setting] });
    if (category === 'map') setMapSettings({ [setting]: !(mapSettings as any)[setting] });
    showToast(t('success', 'Ayarlar Güncellendi'));
  };

  const handleLangChange = (l: string) => {
    setLang(l);
    showToast(t('lang_updated', 'Dil Değiştirildi'));
  };

  const handleThemeChange = (id: ThemeType) => {
    setTheme(id);
    showToast(t('theme_updated', 'Tema güncellendi.'));
  };

  const handleReset = () => {
    resetSettings();
    setShowResetModal(false);
    showToast(t('settings_reset_success', 'Sistem Sıfırlandı'));
  };

  const languages = [
    { id: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { id: 'en', label: 'English', flag: '🇺🇸' },
    { id: 'ru', label: 'Русский', flag: '🇷🇺' },
    { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { id: 'fr', label: 'Français', flag: '🇫🇷' },
    { id: 'az', label: 'Azərbaycan', flag: '🇦🇿' },
    { id: 'ar', label: 'العربية', flag: '🇸🇦' },
    { id: 'it', label: 'Italiano', flag: '🇮🇹' },
    { id: 'pl', label: 'Polski', flag: '🇵🇱' },
    { id: 'fa', label: 'فارسی', flag: '🇮🇷' },
    { id: 'es', label: 'Español', flag: '🇪🇸' },
    { id: 'pt', label: 'Português', flag: '🇵🇹' },
    { id: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  ];

  const themes: { id: ThemeType; label: string; desc: string; colors: string[] }[] = [
    { id: 'afad', label: t('theme_afad'), desc: t('theme_desc_afad'), colors: ['#003366', '#ED1C24', '#020617'] },
    { id: 'kizilay', label: t('theme_kizilay'), desc: t('theme_desc_kizilay'), colors: ['#B91C1C', '#FFFFFF', '#450A0A'] },
    { id: 'yesilay', label: t('theme_yesilay'), desc: t('theme_desc_yesilay'), colors: ['#047857', '#10B981', '#022C22'] },
    { id: 'akut', label: t('theme_akut'), desc: t('theme_desc_akut'), colors: ['#111827', '#F97316', '#020617'] },
    { id: 'emergency112', label: t('theme_emergency112'), desc: t('theme_desc_emergency112'), colors: ['#B91C1C', '#2563EB', '#172554'] },
  ];

  const textSizes: { id: TextSize; label: string }[] = [
    { id: 'small', label: t('small') },
    { id: 'standard', label: t('standard') },
    { id: 'large', label: t('large') },
    { id: 'xlarge', label: t('xlarge') },
  ];

  const roles: { id: UserRole; label: string; desc: string; icon: any; color: string }[] = [
    { id: 'health_personnel', label: t('role_health_personnel'), desc: 'Klinik Karar Destek Sistemi', icon: Stethoscope, color: 'text-blue-500' },
    { id: 'afad_operator', label: t('role_afad_operator'), desc: 'Saha Yönetimi ve Analiz', icon: ShieldCheck, color: 'text-red-500' },
    { id: 'logistics_manager', label: t('role_logistics_manager'), desc: 'Sevkiyat ve Stok Kontrol', icon: Truck, color: 'text-orange-500' },
    { id: 'volunteer', label: t('role_volunteer'), desc: 'Operasyon ve Saha Görevi', icon: Users, color: 'text-purple-500' },
    { id: 'citizen', label: t('role_citizen'), desc: 'Bilgi Talep ve Görüntüleme', icon: User, color: 'text-emerald-500' },
    { id: 'admin', label: t('role_admin'), desc: 'Tam Yetkili Erişim', icon: SettingsIcon, color: 'text-gray-700' },
  ];

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-160px)] flex flex-col md:flex-row gap-8 p-2">
      {/* Settings Navigation */}
      <div className="w-full md:w-80 bg-app-card md:rounded-[3rem] border border-app-border shadow-sm md:shadow-premium shrink-0 flex flex-col overflow-hidden relative">
        <div className="hidden md:block p-10 border-b border-app-border bg-app-bg/30">
          <ArzLogo variant="horizontal" className="scale-90 origin-left" />
          <h2 className="text-xl font-black text-app-text italic uppercase tracking-tighter mt-8">Sistem Yapılandırma</h2>
          <p className="text-[10px] text-app-muted font-bold uppercase tracking-widest mt-1">v4.2.1-Premium</p>
        </div>
        <div className="flex-none md:flex-1 w-full overflow-x-auto md:overflow-y-auto p-4 md:p-6 flex flex-row md:flex-col md:space-y-2 gap-2 md:gap-0 custom-scrollbar whitespace-nowrap">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-none md:w-full flex items-center gap-3 md:gap-4 px-5 py-3 md:px-6 md:py-4.5 rounded-[1.5rem] transition-all relative group ${
                activeTab === item.id 
                ? 'bg-[#002D5E] text-white shadow-xl shadow-blue-900/20 md:translate-x-2 border-r-4 border-red-600' 
                : 'text-app-muted hover:bg-app-bg hover:translate-x-1'
              }`}
            >
              <item.icon size={18} className={`shrink-0 ${activeTab === item.id ? 'text-white' : 'group-hover:text-[#002D5E]'}`} />
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest truncate">{item.label}</span>
              {activeTab === item.id && (
                <motion.div layoutId="active-tab" className="hidden md:block absolute right-4 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_#ED1C24]" />
              )}
            </button>
          ))}
        </div>
        <div className="hidden md:block p-8 border-t border-app-border text-center">
           <p className="text-[9px] text-app-muted font-bold uppercase tracking-widest leading-relaxed">
             ARZ Operasyon Sistemi<br/>© 2026 Şehmus AYKUT
           </p>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 bg-app-card rounded-[3.5rem] border border-app-border shadow-premium overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-12 md:p-16 custom-scrollbar relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'general' && (
              <motion.div key="general" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                 <header>
                   <h3 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">{t('settings_labels.general')}</h3>
                   <p className="text-[10px] text-app-muted font-bold uppercase tracking-[0.3em] mt-2">Aktif Operatör Yetkilendirme Paneli</p>
                 </header>
                 
                 <div className="bg-app-bg p-8 rounded-[3rem] shadow-sm flex items-center gap-8 group border border-app-border">
                    <div className="w-24 h-24 bg-app-primary text-app-on-primary rounded-[2rem] flex items-center justify-center text-4xl font-black italic shadow-2xl relative overflow-hidden">
                       {user?.name?.[0] || 'A'}
                    </div>
                    <div className="flex-1 space-y-4">
                       <div>
                         <h4 className="text-2xl font-black text-app-text uppercase italic tracking-tight">{user?.name || 'Değerli Operatör'}</h4>
                         <p className="text-[10px] font-black text-blue-500/60 uppercase tracking-widest mt-1">Sistem Sürümü: {projectIdentity.version}</p>
                       </div>
                       <div className="flex gap-4">
                         <button className="px-8 py-3 bg-app-card text-app-text border border-app-border rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-app-primary hover:text-app-on-primary transition-all">{t('faceIdPassword')}</button>
                         <button onClick={() => setUser(null)} className="px-8 py-3 bg-red-50 text-red-500 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-app-on-primary transition-all">{t('logout')}</button>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-app-muted uppercase tracking-[0.4em] italic mb-6">Operasyonel Rol Seçimi</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {roles.map(r => (
                         <button 
                          key={r.id}
                          onClick={() => { setUser(prev => prev ? {...prev, role: r.id} : null); showToast(`Rol ${r.label} Olarak Güncellendi`); }}
                          className={`p-8 rounded-[2.5rem] border-2 flex items-center gap-6 transition-all text-left ${user?.role === r.id ? 'border-app-primary bg-app-primary text-app-on-primary' : 'border-app-border bg-app-bg hover:bg-app-card'}`}
                         >
                           <div className={`p-4 rounded-xl ${user?.role === r.id ? 'bg-app-card/20 text-app-on-primary' : 'bg-app-card text-app-muted'}`}>
                             <r.icon size={24} />
                           </div>
                           <div>
                             <span className="text-sm font-black uppercase tracking-widest block italic truncate">{r.label}</span>
                             <span className="text-[9px] font-bold block mt-1 opacity-50 uppercase tracking-wider line-clamp-2">{r.desc}</span>
                           </div>
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-6 pt-6">
                    <h4 className="text-[11px] font-black text-app-muted uppercase tracking-[0.4em] italic mb-6">Genel Sistem Ayarlar</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <SettingsToggle label={t('toggles.autoSave')} checked={true} onChange={() => showToast(t('success'))} />
                       <SettingsToggle label={t('toggles.demoMode')} checked={true} onChange={() => showToast(t('success'))} />
                       <SettingsToggle label={t('toggles.offlineMode')} checked={true} onChange={() => showToast(t('success'))} />
                       <SettingsToggle label={t('toggles.showSystemStatus')} checked={true} onChange={() => showToast(t('success'))} />
                    </div>
                    <button onClick={() => setShowResetModal(true)} className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-app-on-primary transition-all">{t('actions.resetDefaults')}</button>
                 </div>
              </motion.div>
            )}

            {activeTab === 'accessibility' && (
              <motion.div key="accessibility" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                 <header>
                   <h3 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">{t('settings_labels.accessibility')}</h3>
                   <p className="text-[10px] text-app-muted font-bold uppercase tracking-[0.3em] mt-2">Daha Kullanılabilir Bir Arayüz İçin</p>
                 </header>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SettingsToggle label={t('toggles.boldText')} checked={displaySettings.boldText} onChange={() => handleToggle('boldText', 'display')} />
                    <SettingsToggle label={t('toggles.highContrast')} checked={displaySettings.highContrast} onChange={() => handleToggle('highContrast', 'display')} />
                    <SettingsToggle label={t('toggles.reduceMotion')} checked={displaySettings.reduceMotion} onChange={() => handleToggle('reduceMotion', 'display')} />
                    <SettingsToggle label={t('toggles.largeButtons')} checked={displaySettings.bigButtons} onChange={() => handleToggle('bigButtons', 'display')} />
                    <SettingsToggle label={t('toggles.focusRing')} checked={displaySettings.focusRing} onChange={() => handleToggle('focusRing', 'display')} />
                    <SettingsToggle label={t('toggles.readableFont')} checked={displaySettings.readableFont} onChange={() => handleToggle('readableFont', 'display')} />
                 </div>
              </motion.div>
            )}

            {activeTab === 'home_screen' && (
              <motion.div key="home_screen" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                 <header>
                   <h3 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">{t('settings_labels.homeScreen')}</h3>
                   <p className="text-[10px] text-app-muted font-bold uppercase tracking-[0.3em] mt-2">Panel Görünümünüzü Özelleştirin</p>
                 </header>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SettingsToggle label={t('toggles.showAiSummary')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.showMapPreview')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.showClinicalSummary')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.showLogisticsSummary')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.showVolunteerStatus')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.showQuickActions')} checked={true} onChange={() => showToast(t('success'))} />
                 </div>
              </motion.div>
            )}

            {activeTab === 'search' && (
              <motion.div key="search" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                 <header>
                   <h3 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">{t('settings_labels.search')}</h3>
                   <p className="text-[10px] text-app-muted font-bold uppercase tracking-[0.3em] mt-2">Sistem İçi Arama Yapılandırması</p>
                 </header>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SettingsToggle label="Modül İçinde Arama" checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label="Raporlarda Arama" checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label="Harita İçinde İl Arama" checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label="Son Aramaları Kaydet" checked={true} onChange={() => showToast(t('success'))} />
                 </div>
              </motion.div>
            )}

            {activeTab === 'control_center' && (
              <motion.div key="control_center" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                 <header>
                   <h3 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">{t('settings_labels.controlCenter')}</h3>
                   <p className="text-[10px] text-app-muted font-bold uppercase tracking-[0.3em] mt-2">Hızlı Kontroller</p>
                 </header>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SettingsToggle label={t('toggles.emergencyMode')} checked={false} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.offlineSync')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label="Harita Katmanları Kontrolü" checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label="Bildirim Hızlı Ayarları" checked={true} onChange={() => showToast(t('success'))} />
                 </div>
              </motion.div>
            )}

            {(activeTab === 'display' || activeTab === 'theme') && (
              <motion.div key="display" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                 <header>
                   <h3 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">Ekran ve Parlaklık</h3>
                   <p className="text-[10px] text-app-muted font-bold uppercase tracking-[0.3em] mt-2">Görsel Arayüz Yapılandırması</p>
                 </header>

                 <div className="space-y-12">
                    {/* Brightness */}
                    <div className="bg-app-bg p-10 rounded-[3rem] border border-app-border space-y-8 shadow-sm">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-app-card rounded-2xl flex items-center justify-center text-amber-500 shadow-sm border border-app-border"><Sun size={24} /></div>
                            <div>
                               <h4 className="text-[13px] font-black text-app-text uppercase italic tracking-widest">Ekran Parlaklığı</h4>
                               <p className="text-[10px] text-app-muted font-bold uppercase tracking-wider">Arayüz parlaklığını manuel ayarlayın</p>
                            </div>
                         </div>
                         <span className="text-xl font-black text-app-text italic">%{displaySettings.brightness || 100}</span>
                       </div>
                       <input 
                        type="range"
                        min="40"
                        max="100"
                        value={displaySettings.brightness || 100}
                        onChange={(e) => setDisplaySettings({ brightness: parseInt(e.target.value) })}
                        className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#002D5E]"
                       />
                       <div className="flex justify-between px-2">
                          <span className="text-[10px] font-black text-app-muted uppercase">%40</span>
                          <span className="text-[10px] font-black text-app-muted uppercase">%100</span>
                       </div>
                    </div>

                    {/* Text Size */}
                    <div className="bg-app-bg p-10 rounded-[3rem] border border-app-border space-y-8 shadow-sm">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-app-card rounded-2xl flex items-center justify-center text-blue-500 shadow-sm border border-app-border"><TypeIcon size={24} /></div>
                          <div>
                             <h4 className="text-[13px] font-black text-app-text uppercase italic tracking-widest">Metin Boyutu</h4>
                             <p className="text-[10px] text-app-muted font-bold uppercase tracking-wider">Tüm sistem font ölçeğini belirleyin</p>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {textSizes.map(s => (
                            <button
                              key={s.id}
                              onClick={() => setTextSize(s.id)}
                              className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${textSize === s.id ? 'bg-app-primary text-app-on-primary border-app-primary shadow-lg' : 'bg-app-card text-app-muted border-transparent hover:border-app-border'}`}
                            >
                              {s.label}
                            </button>
                          ))}
                       </div>
                    </div>

                    {/* Color Blind Modes */}
                    <div className="bg-app-bg p-10 rounded-[3rem] border border-app-border space-y-8 shadow-sm">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-app-card rounded-2xl flex items-center justify-center text-purple-500 shadow-sm border border-app-border"><Globe2 size={24} /></div>
                          <div>
                             <h4 className="text-[13px] font-black text-app-text uppercase italic tracking-widest">Renk Görme Desteği</h4>
                             <p className="text-[10px] text-app-muted font-bold uppercase tracking-wider">Renk körlüğü modlarından uygun olanı seçin</p>
                          </div>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                             { id: 'none', label: 'Kapalı' },
                             { id: 'protanopia', label: 'Protanopi Desteği' },
                             { id: 'deuteranopia', label: 'Deuteranopi Desteği' },
                             { id: 'tritanopia', label: 'Tritanopi Desteği' },
                             { id: 'high_contrast', label: 'Yüksek Kontrast Paleti' }
                          ].map(mode => (
                             <button
                               key={mode.id}
                               onClick={() => setDisplaySettings({ colorBlindMode: mode.id })}
                               className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] transition-all border-2 text-left ${displaySettings.colorBlindMode === mode.id ? 'bg-app-primary text-app-on-primary border-app-primary shadow-lg' : 'bg-app-card text-app-muted border-transparent hover:border-app-border'}`}
                             >
                               {mode.label}
                               {displaySettings.colorBlindMode === mode.id && <CheckCircle2 size={14} className="mt-2 text-blue-300" />}
                             </button>
                          ))}
                       </div>
                    </div>

                    {/* Themes */}
                    <div className="space-y-6">
                       <h4 className="text-[11px] font-black text-app-muted uppercase tracking-[0.4em] italic leading-none">Kurumsal Tema Seçenekleri</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {themes.map(t => (
                            <button
                              key={t.id}
                              onClick={() => handleThemeChange(t.id)}
                              className={`p-8 rounded-[2.5rem] border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[220px] ${theme === t.id ? 'border-app-primary bg-app-card ring-8 ring-blue-50 focus:outline-none' : 'border-app-border bg-app-bg hover:border-app-border'}`}
                            >
                              <div>
                                <div className="flex gap-2 mb-6">
                                  {t.colors.map(c => <div key={c} className="w-6 h-6 rounded-lg pointer-events-none shadow-sm" style={{ backgroundColor: c }} />)}
                                </div>
                                <h5 className="text-[14px] font-black text-app-text uppercase tracking-widest italic">{t.label}</h5>
                                <p className="text-[9px] text-app-muted font-bold mt-4 uppercase tracking-widest leading-relaxed">{t.desc}</p>
                              </div>
                              {theme === t.id && (
                                <div className="absolute top-6 right-6 text-app-primary"><CheckCircle2 size={24} /></div>
                              )}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div key="ai" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                 <header className="flex items-center justify-between">
                   <div>
                     <h3 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">{t('settings_labels.arzAiSettings')}</h3>
                     <p className="text-[10px] text-app-muted font-bold uppercase tracking-[0.3em] mt-2">Yerel Analiz Motoru Konfigürasyonu</p>
                   </div>
                   <div className="w-16 h-16 bg-app-primary/10 rounded-3xl flex items-center justify-center text-app-primary"><Cpu size={32} /></div>
                 </header>

                 <div className="space-y-4">
                    {[
                      { id: 'active', label: 'Asistan Aktif', desc: 'Sistem genelinde AI ikonunu ve asistanı etkinleştirir.' },
                      { id: 'localBrain', label: 'Local Brain (Yerel Zeka)', desc: 'İnternet kesintilerinde bile tam performansla çalışan yerel analiz motoru.' },
                      { id: 'memory', label: 'Hafıza ve Geçmiş', desc: 'Önceki mesajları analiz ederek daha tutarlı yanıtlar üretir.' },
                      { id: 'roleBasedResponses', label: 'Rol Duyarlı Yanıtlar', desc: 'Yetki seviyenize göre sadece görmeniz gereken verileri sunar.' },
                      { id: 'useMapData', label: 'Harita Verilerini Kullan', desc: 'Yanıtları üretirken anlık coğrafi riskleri hesaba katar.' },
                      { id: 'useClinicalData', label: 'Klinik Verileri Kullan', desc: 'Triyaj ve hasta verilerine dayalı stratejik öneriler sunar.' },
                      { id: 'detailedAnalysisMode', label: 'Derin Analiz Modu', desc: 'Daha detaylı, madde madde operasyon önerileri üretir.' },
                      { id: 'showSecurityWarnings', label: 'Güvenlik Notları', desc: 'Riskli operasyon kararlarından önce uyarı metni ekler.' },
                    ].map(item => (
                      <SettingsToggle 
                        key={item.id} 
                        label={item.label} 
                        description={item.desc}
                        checked={aiSettings[item.id as keyof typeof aiSettings]} 
                        onChange={() => handleToggle(item.id, 'ai')} 
                      />
                    ))}
                 </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                 <header>
                   <h3 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">{t('settings_labels.notifications')}</h3>
                   <p className="text-[10px] text-app-muted font-bold uppercase tracking-[0.3em] mt-2">Uyarı ve Alarm Yapılandırması</p>
                 </header>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SettingsToggle label={t('toggles.criticalAlerts')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.shipmentNotifications')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.clinicalAlerts')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.volunteerNotifications')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.mapEventNotifications')} checked={true} onChange={() => showToast(t('success'))} />
                 </div>
                 <button onClick={() => showToast('Test Bildirimi Gönderildi')} className="w-full py-4 bg-app-primary/10 text-blue-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-app-primary hover:text-app-on-primary transition-all">{t('actions.sendTestNotification')}</button>
              </motion.div>
            )}

            {activeTab === 'sound_haptics' && (
              <motion.div key="sound_haptics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                 <header>
                   <h3 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">{t('settings_labels.soundHaptics')}</h3>
                   <p className="text-[10px] text-app-muted font-bold uppercase tracking-[0.3em] mt-2">Duyusal Geri Bildirim Uyarıları</p>
                 </header>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SettingsToggle label={t('toggles.soundAlerts')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label="Acil Alarm Sesi" checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.vibration')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.hapticFeedback')} checked={true} onChange={() => showToast(t('success'))} />
                 </div>
              </motion.div>
            )}

            {activeTab === 'face_id' && (
              <motion.div key="face_id" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                 <header>
                   <h3 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">{t('settings_labels.faceIdPassword')}</h3>
                   <p className="text-[10px] text-app-muted font-bold uppercase tracking-[0.3em] mt-2">Face ID ve Parola Yönetimi</p>
                 </header>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SettingsToggle label={t('toggles.demoSecurityLock')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.requireBotVerification')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.sessionLock')} checked={true} onChange={() => showToast(t('success'))} />
                 </div>
                 <button onClick={() => showToast('Şifre değiştirme bağlantısı gönderildi')} className="w-full py-4 bg-gray-100 text-app-muted rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">Şifre Değiştir</button>
              </motion.div>
            )}

            {activeTab === 'emergency_sos' && (
              <motion.div key="emergency_sos" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                 <header>
                   <h3 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">{t('settings_labels.emergencySos')}</h3>
                   <p className="text-[10px] text-app-muted font-bold uppercase tracking-[0.3em] mt-2">Kritik Müdahale Konfigürasyonu</p>
                 </header>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SettingsToggle label={t('toggles.showEmergencySos')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.locationSharing')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.show112Card')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label="Yakın Kişiye Bilgi Ver" checked={true} onChange={() => showToast(t('success'))} />
                 </div>
                 <button onClick={() => showToast('Acil Durum Simülasyonu Başlatıldı')} className="w-full py-4 bg-red-600 text-app-on-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-500/20">Acil Yardım Simülasyonu Başlat</button>
              </motion.div>
            )}

            {activeTab === 'connected_devices' && (
              <motion.div key="connected_devices" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                 <header>
                   <h3 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">{t('settings_labels.connectedAccounts')}</h3>
                   <p className="text-[10px] text-app-muted font-bold uppercase tracking-[0.3em] mt-2">Entegrasyon Yönetimi</p>
                 </header>
                 <div className="grid grid-cols-1 gap-4">
                    <div className="bg-app-bg p-6 rounded-[2rem] flex items-center justify-between">
                       <span className="text-xs font-black text-app-text uppercase">Milli Giriş (e-Devlet) Durumu</span>
                       <span className="text-[10px] font-black text-green-500 uppercase">Aktif</span>
                    </div>
                    <div className="bg-app-bg p-6 rounded-[2rem] flex items-center justify-between">
                       <span className="text-xs font-black text-app-text uppercase">Google Hesabı</span>
                       <span className="text-[10px] font-black text-app-muted uppercase">Bağlı Değil</span>
                    </div>
                    <div className="bg-app-bg p-6 rounded-[2rem] flex items-center justify-between">
                       <span className="text-xs font-black text-app-text uppercase">Harita Servisi API Türü</span>
                       <span className="text-[10px] font-black text-blue-500 uppercase">OSM Premium Layer</span>
                    </div>
                    <div className="bg-app-bg p-6 rounded-[2rem] flex items-center justify-between">
                       <span className="text-xs font-black text-app-text uppercase">Akıllı Cihaz (IoT) Durumu</span>
                       <span className="text-[10px] font-black text-app-muted uppercase">Bağlı Cihaz Yok</span>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'map' && (
              <motion.div key="map" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                 <header>
                   <h3 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">{t('settings_labels.mapSettings')}</h3>
                   <p className="text-[10px] text-app-muted font-bold uppercase tracking-[0.3em] mt-2">Coğrafi Risk Modülü</p>
                 </header>
                 
                 <div className="space-y-6">
                   <h4 className="text-[11px] font-black text-app-muted uppercase tracking-[0.4em] italic mb-4">Harita Görünümü</h4>
                   <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                     {['standard', 'light', 'high_contrast', 'satellite', 'operation'].map(style => (
                        <button 
                          key={style}
                          onClick={() => setMapSettings({ mapStyle: style as any })}
                          className={`p-4 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest ${
                            mapSettings.mapStyle === style ? 'border-app-primary bg-app-primary text-app-on-primary' : 'border-app-border bg-app-bg text-app-muted hover:bg-app-card'
                          }`}
                        >
                          {style.replace('_', ' ')}
                        </button>
                     ))}
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4 bg-app-bg p-6 rounded-[2rem] border border-app-border">
                     <div className="flex justify-between">
                       <span className="text-xs font-black text-app-text uppercase">Parlaklık</span>
                       <span className="text-xs font-black text-app-primary">{mapSettings.brightness}%</span>
                     </div>
                     <input 
                       type="range" min="50" max="150" 
                       value={mapSettings.brightness}
                       onChange={(e) => setMapSettings({ brightness: parseInt(e.target.value) })}
                       className="w-full accent-[#002D5E]"
                     />
                   </div>
                   <div className="space-y-4 bg-app-bg p-6 rounded-[2rem] border border-app-border">
                     <div className="flex justify-between">
                       <span className="text-xs font-black text-app-text uppercase">Kontrast</span>
                       <span className="text-xs font-black text-app-primary">{mapSettings.contrast}%</span>
                     </div>
                     <input 
                       type="range" min="50" max="150" 
                       value={mapSettings.contrast}
                       onChange={(e) => setMapSettings({ contrast: parseInt(e.target.value) })}
                       className="w-full accent-[#002D5E]"
                     />
                   </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-app-muted uppercase tracking-[0.4em] italic mb-4">Fonksiyonlar ve Etiketler</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <SettingsToggle label={t('toggles.locationSharing')} checked={mapSettings.showMyLocation} onChange={() => setMapSettings({ showMyLocation: !mapSettings.showMyLocation })} />
                       <SettingsToggle label="Harita Etiketleri" checked={mapSettings.showLabels} onChange={() => setMapSettings({ showLabels: !mapSettings.showLabels })} />
                    </div>
                 </div>

                 <button onClick={() => showToast(t('actions.refreshMapData'))} className="w-full py-4 bg-gray-100 text-app-muted rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">{t('actions.refreshMapData')}</button>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                 <header>
                   <h3 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">{t('settings_labels.securityData')}</h3>
                   <p className="text-[10px] text-app-muted font-bold uppercase tracking-[0.3em] mt-2">Veri Koruma ve Gizlilik</p>
                 </header>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SettingsToggle label="KVKK Bilgilendirmesi Opsiyonu" checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.localEncryption')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.rememberSession')} checked={true} onChange={() => showToast(t('success'))} />
                    <SettingsToggle label={t('toggles.saveChatHistory')} checked={true} onChange={() => showToast(t('success'))} />
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => showToast(t('actions.clearLocalData'))} className="flex-1 py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all">{t('actions.clearLocalData')}</button>
                    <button onClick={() => showToast(t('actions.clearSession'))} className="flex-1 py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all">{t('actions.clearSession')}</button>
                 </div>
              </motion.div>
            )}

            {activeTab === 'language' && (
              <motion.div key="language" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                 <header>
                   <h3 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">{t('settings_labels.languageRegion')}</h3>
                   <p className="text-[10px] text-app-muted font-bold uppercase tracking-[0.3em] mt-2">Sistem Dilini Global Standartlara Göre Ayarlayın</p>
                 </header>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {languages.map(l => (
                      <button 
                        key={l.id}
                        onClick={() => handleLangChange(l.id)}
                        className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${lang === l.id ? 'border-app-primary bg-app-primary text-app-on-primary' : 'border-app-border bg-app-bg text-app-text hover:bg-app-card shadow-sm'}`}
                      >
                        <span className="text-4xl">{l.flag}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">{l.label}</span>
                      </button>
                    ))}
                 </div>
              </motion.div>
            )}

            {activeTab === 'about' && (
              <motion.div key="about" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                 <header>
                   <h3 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">{t('settings_labels.about')}</h3>
                   <p className="text-[10px] text-app-muted font-bold uppercase tracking-[0.3em] mt-2">ARZ Karar Destek Sistemi Künyesi</p>
                 </header>
                 <div className="bg-app-card p-12 lg:p-20 rounded-[4rem] border border-app-border shadow-premium flex flex-col items-center text-center space-y-12 relative overflow-hidden min-h-[600px]">
                    <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-900 via-blue-600 to-red-600" />
                    <ArzLogo variant="vertical" className="mb-8" />
                    <div className="max-w-2xl space-y-6">
                       <p className="text-lg font-black text-app-text uppercase italic tracking-tighter underline underline-offset-8 decoration-red-500/30">
                          {projectIdentity.fullTitle}
                       </p>
                       <p className="text-xs text-app-muted font-bold uppercase tracking-wider leading-relaxed">
                          ARZ, afet yönetiminde kaosu ortadan kaldıran, milli yazılım vizyonuyla geliştirilmiş 
                          stratejik bir analiz platformudur. Yapay zeka ve yerel veri motoru ile saniyeler içinde 
                          en doğru kararı vermeniz için tasarlanmıştır.
                       </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10 text-left w-full border-t border-app-border pt-12">
                       <div className="space-y-2">
                          <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{t('project_team')}</p>
                          <p className="text-sm font-black text-app-text uppercase italic tracking-tighter">{projectIdentity.team}</p>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{t('project_institution')}</p>
                          <p className="text-sm font-black text-app-text uppercase italic tracking-tighter">{projectIdentity.institution}</p>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{t('project_department')}</p>
                          <p className="text-sm font-black text-app-text uppercase italic tracking-tighter">{projectIdentity.department}</p>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{t('project_advisor')}</p>
                          <p className="text-sm font-black text-app-text uppercase italic tracking-tighter">{projectIdentity.advisor}</p>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">{t('project_lead_dev')}</p>
                          <p className="text-sm font-black text-red-600 uppercase italic tracking-tighter">Şehmus AYKUT</p>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[9px] font-black text-app-muted uppercase tracking-widest">{t('system_info')}</p>
                          <p className="text-sm font-black text-app-text uppercase italic tracking-tighter">{projectIdentity.version}</p>
                       </div>
                    </div>

                    <div className="w-full pt-8">
                       <div className="bg-app-primary p-10 rounded-[3rem] text-app-on-primary space-y-4 shadow-xl">
                          <h6 className="text-xl font-black italic uppercase tracking-tighter">{projectIdentity.slogan}</h6>
                          <div className="h-[1px] w-12 bg-app-card/20 mx-auto" />
                          <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-60">
                            © 2026 ARZ SİSTEMİ | {t('developed_by')}
                          </p>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-8 border-t border-app-border flex items-center justify-between text-[10px] font-black text-app-muted uppercase tracking-widest">
           <span>TÜM VERİLER YEREL OLARAK SAKLANMAKTADIR</span>
           <button onClick={() => setShowResetModal(true)} className="text-red-400 hover:text-red-600 transition-colors flex items-center gap-2">
             <RotateCcw size={14} /> SİSTEMİ SIFIRLA
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
