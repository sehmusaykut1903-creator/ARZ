import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Lock,
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  demoConfirmLabel: string;
  onConfirmDemo: () => void;
}

export const BrowserModal: React.FC<BrowserModalProps> = ({
  isOpen,
  onClose,
  url,
  title,
  demoConfirmLabel,
  onConfirmDemo
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
      
      const timer = setTimeout(() => {
        // Most SSO sites block iframes (X-Frame-Options: SAMEORIGIN)
        // In a real app we'd use a real popup or redirect, but for demo
        // we simulate the failure and show the fallback.
        setHasError(true);
        setIsLoading(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, url]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-blue-900/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-5xl h-[85vh] bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-white/20"
      >
        {/* Header */}
        <div className="bg-[#003366] p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <ShieldCheck size={20} className="text-blue-200" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest">{t('auth.browserInApp')}</h3>
              <p className="text-[9px] text-blue-200 opacity-60 uppercase font-bold tracking-wider">{title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setIsLoading(true); setHasError(false); }}
              className="p-3 hover:bg-white/10 rounded-xl transition-colors"
            >
              <RefreshCw size={18} />
            </button>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-red-500 rounded-xl transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Browser Bar */}
        <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center gap-3">
          <div className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-500 flex items-center gap-2 shadow-sm font-mono truncate">
            <Lock size={12} className="text-green-600" />
            {url}
          </div>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all shadow-sm"
          >
            <ExternalLink size={14} />
            {t('auth.openExternal')}
          </a>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-gray-100 flex flex-col">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50 gap-4">
              <Loader2 size={40} className="animate-spin text-[#003366]" />
              <p className="text-[10px] font-black uppercase tracking-widest text-app-muted animate-pulse">ARZ Güvenli Bağlantı Kuruluyor...</p>
            </div>
          )}

          {hasError ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <Globe size={40} />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-black text-blue-900">{t('auth.browserInApp')}</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  {t('auth.browserInAppDesc')}
                </p>
                <div className="flex items-center gap-2 justify-center py-2 px-4 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-100 mx-auto w-fit">
                  <AlertCircle size={14} />
                  <span className="text-[9px] font-black uppercase tracking-wide">{t('auth.externalLinkNotice')}</span>
                </div>
              </div>
            </div>
          ) : (
            <iframe 
              src={url} 
              className="w-full h-full border-none bg-white"
              onLoad={() => setIsLoading(false)}
              onError={() => setHasError(true)}
              title={title}
            />
          )}

          {/* Bottom Confirmation Panel (Demo Only) */}
          <div className="bg-white border-t border-gray-200 p-8 flex flex-col items-center gap-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
             <div className="text-center space-y-1">
               <p className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em]">{t('app_name')} ÖNİZLEME MODU</p>
               <p className="text-[12px] font-medium text-gray-500 italic">Demo sürümünde gerçek giriş işlemi yerine aşağıdaki butonu kullanarak devam edebilirsiniz.</p>
             </div>
             
             <button
               onClick={() => {
                 setIsConfirming(true);
                 setTimeout(onConfirmDemo, 1000);
               }}
               disabled={isConfirming}
               className="w-full max-w-sm py-5 bg-[#003366] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#002244] shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all group"
             >
               {isConfirming ? (
                 <Loader2 size={24} className="animate-spin text-white" />
               ) : (
                 <>
                   <CheckCircle2 size={20} className="text-green-400 group-hover:scale-110 transition-transform" />
                   {demoConfirmLabel}
                 </>
               )}
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
