import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import ArzLogo from './ArzLogo';
import { LanguageSelector } from './LanguageSelector';
import SyncStatus from './SyncStatus';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User as UserIcon, Bell, Search, Info, ShieldAlert } from 'lucide-react';
import i18n from '../lib/i18n';
import { ErrorBoundary } from './ErrorBoundary';
import { ToastContainer } from './Toast';

const Layout = () => {
  const { t } = useTranslation();
  const { user, lang, theme, textSize, fontFamily, sidebarCollapsed, projectIdentity, logout, notifications, markNotificationAsRead } = useAppContext();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { id: 'tr', code: 'TR', name: 'Türkçe', flag: '🇹🇷' },
    { id: 'en', code: 'EN', name: 'English', flag: '🇺🇸' },
    { id: 'ru', code: 'RU', name: 'Русский', flag: '🇷🇺' },
    { id: 'de', code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
    { id: 'fr', code: 'FR', name: 'Français', flag: '🇫🇷' },
    { id: 'az', code: 'AZ', name: 'Azərbaycan', flag: '🇦🇿' },
    { id: 'ar', code: 'AR', name: 'العربية', flag: '🇸🇦' },
    { id: 'it', code: 'IT', name: 'Italiano', flag: '🇮🇹' },
    { id: 'pl', code: 'PL', name: 'Polski', flag: '🇵🇱' },
    { id: 'fa', code: 'FA', name: 'فارسی', flag: '🇮🇷' },
    { id: 'es', code: 'ES', name: 'Español', flag: '🇪🇸' },
    { id: 'pt', code: 'PT', name: 'Português', flag: '🇵🇹' },
    { id: 'nl', code: 'NL', name: 'Nederlands', flag: '🇳🇱' },
  ];

  useEffect(() => {
    document.documentElement.dir = ['ar', 'fa'].includes(i18n.language) ? 'rtl' : 'ltr';
  }, [i18n.language]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return t('dashboard');
    if (path === '/clinical') return t('clinical');
    if (path === '/logistics') return t('logistics');
    if (path === '/map') return t('map');
    if (path === '/volunteer') return t('volunteer');
    if (path === '/field') return t('field');
    if (path === '/public-health') return t('public_health');
    if (path === '/ai') return 'ARZ AI (Akıllı Asistan)';
    if (path === '/settings') return t('settings');
    return 'ARZ';
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] flex overflow-hidden transition-all duration-500" 
         data-theme={theme} 
         data-size={textSize} 
         data-font={fontFamily}>
      <ToastContainer />
      <Sidebar />
      <motion.div 
        animate={{ 
          marginLeft: sidebarCollapsed ? 88 : 280,
          transition: { type: 'spring', stiffness: 400, damping: 40 }
        }}
        className="flex-1 flex flex-col h-screen overflow-hidden"
      >
        {/* Header */}
        <header className="h-20 bg-app-card/80 backdrop-blur-2xl border-b border-app-border px-8 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)] shrink-0 z-40 sticky top-0 transition-all duration-300">
          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2 border border-app-border">
              <Search size={16} className="text-app-muted" />
              <input 
                type="text" 
                placeholder="Sistemde ara..." 
                className="bg-transparent border-none outline-none text-xs font-bold text-app-muted w-48 placeholder:text-app-muted"
              />
            </div>
            <div className="h-8 w-[1px] bg-gray-200 hidden lg:block" />
            <div className="flex items-center gap-4">
              <ArzLogo 
                variant="icon" 
                className="w-10 h-10" 
                showText={false}
              />
              <div className="h-6 w-[1px] bg-gray-200" />
              <div className="flex flex-col min-w-0">
                <h1 className="text-xl font-black text-app-text tracking-tight leading-none uppercase italic truncate">{getPageTitle()}</h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                  <span className="text-[9px] font-black text-app-muted uppercase tracking-widest leading-none">Sistem Protokolleri {t('status.active')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex items-center gap-2.5 bg-red-600 text-app-on-primary px-4 py-2 rounded-xl shadow-lg shadow-red-600/20 animate-pulse border border-red-700">
              <ShieldAlert size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t('emergency_mode')}</span>
            </div>

            {/* Sync Status */}
            <SyncStatus />

            {/* Language Selector */}
            <LanguageSelector />

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-3 rounded-2xl transition-all relative ${showNotifications ? 'bg-primary text-app-on-primary shadow-lg' : 'text-app-muted hover:text-app-text hover:bg-gray-100'}`}
              >
                <Bell size={20} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-secondary rounded-full border-2 border-white shadow-sm" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-4 w-80 bg-app-card border border-app-border rounded-3xl shadow-premium overflow-hidden z-[60]"
                  >
                    <div className="p-5 border-b border-app-border flex items-center justify-between bg-app-bg/50">
                      <span className="text-xs font-black uppercase tracking-widest text-app-text">Bildirimler</span>
                      <button className="text-[9px] font-black text-app-primary hover:underline uppercase">Hepsini Oku</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => markNotificationAsRead(n.id)}
                            className={`p-5 border-b border-app-border cursor-pointer transition-all hover:bg-app-bg flex gap-4 ${!n.read ? 'bg-app-primary/10/20' : ''}`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              n.type === 'error' ? 'bg-red-100 text-red-600' : 
                              n.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-app-primary'
                            }`}>
                              <Info size={18} />
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="text-[11px] font-black leading-tight text-app-text">{n.title}</div>
                              <div className="text-[10px] text-app-muted font-medium leading-relaxed">{n.message}</div>
                              <div className="text-[8px] text-app-muted font-bold uppercase mt-1">{new Date(n.timestamp).toLocaleTimeString()}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center text-app-muted font-bold text-xs uppercase tracking-widest">Bildirim yok</div>
                      )}
                    </div>
                    <button className="w-full p-4 text-[10px] font-black text-app-muted hover:text-app-text transition-colors border-t border-app-border uppercase tracking-widest">
                      Tüm Bildirimleri Gör
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-[1px] bg-gray-200 hidden sm:block" />

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-[11px] font-black text-app-text leading-tight uppercase tracking-tight">{user.name}</div>
                <div className="text-[8px] text-app-muted uppercase font-black tracking-widest mt-0.5">{t('role_' + user.role)}</div>
              </div>
              <div className="w-12 h-12 bg-dark-surface text-app-on-primary rounded-2xl flex items-center justify-center font-black uppercase shadow-lux shrink-0 border-2 border-white">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-[#F8FAFC]">
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-app-border bg-app-card/80 backdrop-blur-md p-6 flex flex-col sm:flex-row justify-between items-center px-12 shrink-0 gap-4">
          <div className="text-[10px] text-app-muted font-black uppercase tracking-[0.2em] text-center sm:text-left italic">
            ARZ (Afet Raporlama ve Zamanlama) Sistemi © 2026 | <span className="text-[#E30613]">Şehmus AYKUT</span> tarafından geliştirilmiştir.
          </div>
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
              <span className="text-[9px] font-black text-app-muted uppercase tracking-widest leading-none">LOCAL BRAIN {t('status.active')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-app-primary/100 rounded-full shadow-[0_0_5px_rgba(37,99,235,0.5)]"></div>
              <span className="text-[9px] font-black text-app-muted uppercase tracking-widest leading-none">SECURE LINK (SSL)</span>
            </div>
            <div className="bg-gray-100 px-4 py-1.5 rounded-lg text-[9px] font-black text-app-muted uppercase tracking-[0.2em] shrink-0 border border-app-border">
               {projectIdentity.version}
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default Layout;
