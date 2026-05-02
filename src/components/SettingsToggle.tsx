import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface SettingsToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const SettingsToggle: React.FC<SettingsToggleProps> = ({ 
  label, 
  description, 
  checked, 
  onChange,
  disabled = false 
}) => {
  const { t } = useTranslation();

  return (
    <div className={`flex items-center justify-between p-6 rounded-[2rem] bg-app-card/50 border border-app-border/30 hover:border-app-accent/30 hover:bg-app-card transition-all group ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex-1 pr-4">
        <h4 className="text-[12px] font-black text-app-text uppercase italic tracking-widest leading-none outline-none">{label}</h4>
        {description && (
          <p className="text-[10px] text-app-muted font-bold uppercase tracking-wider mt-2 leading-relaxed opacity-60">
            {description}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${checked ? 'text-[#002D5E]' : 'text-app-muted'}`}>
          {checked ? t('on') : t('off')}
        </span>
        
        <button
          onClick={() => onChange(!checked)}
          disabled={disabled}
          className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 cursor-pointer border shadow-inner ${
            checked 
            ? 'bg-[#002D5E] border-[#002D5E] shadow-[#002D5E]/10' 
            : 'bg-slate-300 border-slate-400'
          }`}
        >
          <motion.div
            animate={{ x: checked ? 28 : 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md"
          />
        </button>
      </div>
    </div>
  );
};

export default SettingsToggle;
