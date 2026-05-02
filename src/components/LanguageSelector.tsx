import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export const LANGUAGES = [
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

export const LanguageSelector = ({ variant = 'default' }: { variant?: 'default' | 'login' | 'settings' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = LANGUAGES.find(l => l.id === i18n.language) || LANGUAGES[0];

  const handleSelect = (id: string) => {
    i18n.changeLanguage(id);
    localStorage.setItem('arz_lang', id);
    setIsOpen(false);
  };

  if (variant === 'settings') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {LANGUAGES.map(l => (
          <button
            key={l.id}
            onClick={() => handleSelect(l.id)}
            className={`flex items-center justify-between p-6 rounded-[2rem] transition-all
              ${i18n.language === l.id 
                ? 'bg-primary text-app-on-primary shadow-lg scale-105' 
                : 'bg-app-card border border-app-border hover:bg-app-bg text-app-muted'}`}
          >
            <div className="flex flex-col items-start gap-2">
              <span className="text-3xl leading-none">{l.flag}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{l.name}</span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${i18n.language === l.id ? 'border-white' : 'border-gray-300'}`}>
              {i18n.language === l.id && <div className="w-2.5 h-2.5 bg-app-card rounded-full animate-pulse" />}
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 transition-all ${
          variant === 'login' 
            ? 'px-5 py-3 bg-app-card/10 hover:bg-app-card/20 border border-white/20 text-app-on-primary rounded-2xl backdrop-blur-md shadow-lg shadow-black/20' 
            : 'px-4 py-2 bg-app-card hover:bg-app-bg border border-app-border text-app-text rounded-xl shadow-sm'
        }`}
      >
        <span className="text-xl leading-none drop-shadow-sm">{currentLang.flag}</span>
        <span className="text-[11px] font-black uppercase tracking-[0.1em] drop-shadow-sm ml-1">{currentLang.code}</span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`absolute mt-3 w-56 max-w-[calc(100vw-2rem)] border rounded-3xl shadow-premium z-50 p-2 overflow-hidden right-0 sm:right-0 ${
                variant === 'login' ? 'bottom-full mb-3 bg-app-card/10 border-white/20 backdrop-blur-xl right-auto left-0 sm:left-auto sm:right-0' : 'top-full bg-app-card border-app-border'
              }`}
            >
              <div className="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                {LANGUAGES.map(l => (
                  <button
                    key={l.id}
                    onClick={() => handleSelect(l.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${
                      i18n.language === l.id 
                        ? (variant === 'login' ? 'bg-app-card text-app-text' : 'bg-primary text-app-on-primary') 
                        : (variant === 'login' ? 'hover:bg-app-card/20 text-app-on-primary' : 'hover:bg-app-bg text-app-muted')
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl leading-none drop-shadow-sm">{l.flag}</span>
                      <span className="text-[11px] font-black uppercase tracking-widest">{l.code} <span className="opacity-70 font-bold ml-1">{l.name}</span></span>
                    </div>
                    {i18n.language === l.id && <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${variant === 'login' ? 'bg-primary' : 'bg-app-card'}`} />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
