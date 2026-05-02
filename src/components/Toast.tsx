import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Toast as ToastType } from '../types';

const ToastItem: React.FC<{ toast: ToastType; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const { toastSettings } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-sky-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20',
    error: 'bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20',
    info: 'bg-sky-50 border-sky-100 dark:bg-sky-500/10 dark:border-sky-500/20',
    warning: 'bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20'
  };

  const animations = {
    slide: { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 } },
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
    bounce: { 
      initial: { opacity: 0, scale: 0.8 }, 
      animate: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }, 
      exit: { opacity: 0, scale: 0.8 } 
    }
  };

  const anim = animations[toastSettings.animation] || animations.slide;

  return (
    <motion.div
      {...anim}
      layout
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md min-w-[300px] max-w-md ${bgColors[toast.type]}`}
    >
      {toastSettings.showIcon && icons[toast.type]}
      <p className="flex-1 text-sm font-medium text-app-text">{toast.message}</p>
      <button 
        onClick={() => onRemove(toast.id)}
        className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
      >
        <X className="w-4 h-4 text-app-muted" />
      </button>
    </motion.div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast, toastSettings } = useAppContext();

  const positionClasses = {
    'top-right': 'top-6 right-6 flex-col-reverse',
    'top-left': 'top-6 left-6 flex-col-reverse',
    'bottom-right': 'bottom-6 right-6 flex-col',
    'bottom-left': 'bottom-6 left-6 flex-col',
    'top-center': 'top-6 left-1/2 -translate-x-1/2 flex-col-reverse'
  };

  return (
    <div className={`fixed z-[9999] flex gap-2 ${positionClasses[toastSettings.position]}`}>
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};
