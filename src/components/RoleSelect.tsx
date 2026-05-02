import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, CheckCircle2, UserCircle, Stethoscope, Shield, Truck, Users, Settings as SettingsIcon, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '../types';

interface RoleSelectProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  className?: string;
}

export const RoleSelect: React.FC<RoleSelectProps> = ({ value, onChange, className = "" }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const roles = [
    { id: 'citizen' as UserRole, label: t('roles.citizen'), icon: UserCircle, color: 'text-emerald-500' },
    { id: 'health_personnel' as UserRole, label: t('roles.health'), icon: Stethoscope, color: 'text-blue-500' },
    { id: 'afad_operator' as UserRole, label: t('roles.afad'), icon: Shield, color: 'text-red-500' },
    { id: 'logistics_manager' as UserRole, label: t('roles.logistics'), icon: Truck, color: 'text-orange-500' },
    { id: 'volunteer' as UserRole, label: t('roles.volunteer'), icon: Users, color: 'text-purple-500' },
    { id: 'admin' as UserRole, label: t('roles.admin'), icon: SettingsIcon, color: 'text-gray-600' },
    { id: 'researcher' as UserRole, label: t('roles.researcher'), icon: Globe, color: 'text-blue-400' },
  ];

  const selectedRole = roles.find(r => r.id === value) || roles[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <label className="text-[10px] font-black text-app-muted uppercase tracking-widest ml-1 mb-1.5 block">
        {t('auth.roleSelect')}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 bg-app-bg border-2 border-app-border rounded-2xl transition-all hover:border-[#003366]/30 focus:border-[#003366] group"
      >
        <div className="flex items-center gap-3">
          <selectedRole.icon size={18} className={selectedRole.color} />
          <span className="text-xs font-bold text-app-text uppercase tracking-wider">{selectedRole.label}</span>
        </div>
        <ChevronDown size={18} className={`text-app-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[100] w-full mt-2 bg-app-card border-2 border-app-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    onChange(role.id);
                    setIsOpen(false);
                    localStorage.setItem('arz_selected_role', role.id);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all mb-1 ${
                    value === role.id 
                    ? 'bg-[#003366]/5 text-[#003366]' 
                    : 'hover:bg-app-bg text-app-muted'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <role.icon size={18} className={value === role.id ? 'text-[#003366]' : 'text-gray-400'} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{role.label}</span>
                  </div>
                  {value === role.id && <CheckCircle2 size={16} className="text-[#003366]" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
