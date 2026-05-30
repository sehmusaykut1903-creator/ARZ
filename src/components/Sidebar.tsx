import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  MapPin, 
  Truck, 
  Globe2, 
  Users, 
  Stethoscope, 
  Cpu, 
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Map as MapIcon,
  FileText,
  BarChart3,
  UserCircle,
  Scan,
  QrCode
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

import { ArzLogo } from './ArzLogo';

const Sidebar = () => {
  const { t } = useTranslation();
  const { sidebarCollapsed, setSidebarCollapsed, projectIdentity, user } = useAppContext();

  const allItems = [
    { id: 'dashboard', name: t('dashboard'), icon: LayoutDashboard, path: '/', roles: ['admin', 'health_personnel', 'afad_operator', 'logistics_manager', 'volunteer', 'citizen'] },
    { id: 'clinical', name: t('clinical'), icon: Stethoscope, path: '/clinical', roles: ['admin', 'health_personnel'] },
    { id: 'logistics', name: t('logistics'), icon: Truck, path: '/logistics', roles: ['admin', 'logistics_manager'] },
    { id: 'map', name: t('map'), icon: MapIcon, path: '/map', roles: ['admin', 'health_personnel', 'afad_operator', 'logistics_manager', 'volunteer', 'citizen'] },
    { id: 'volunteer', name: t('volunteer'), icon: Users, path: '/volunteer', roles: ['admin', 'volunteer', 'afad_operator'] },
    { id: 'field', name: t('field'), icon: MapPin, path: '/field', roles: ['admin', 'afad_operator', 'citizen', 'volunteer'] },
    { id: 'public_health', name: t('public_health'), icon: ShieldAlert, path: '/public-health', roles: ['admin', 'health_personnel', 'afad_operator'] },
    { id: 'ai_center', name: t('ai_center'), icon: Cpu, path: '/ai', roles: ['admin', 'health_personnel', 'afad_operator', 'logistics_manager'], tooltip: t('ai_center') },
    { id: 'scanner', name: t('scanner'), icon: Scan, path: '/scanner', roles: ['admin', 'health_personnel', 'afad_operator', 'logistics_manager', 'volunteer'], tooltip: t('scanner') },
    { id: 'reports', name: t('reports'), icon: FileText, path: '/reports', roles: ['admin', 'afad_operator', 'health_personnel'] },
    { id: 'profile', name: t('profile'), icon: UserCircle, path: '/profile', roles: ['admin', 'health_personnel', 'afad_operator', 'logistics_manager', 'volunteer', 'citizen'] },
    { id: 'settings', name: t('settings'), icon: Settings, path: '/settings', roles: ['admin', 'health_personnel', 'afad_operator', 'logistics_manager', 'volunteer', 'citizen'] },
  ];

  const menuItems = allItems.filter(item => user?.role && item.roles.includes(user.role));

  return (
    <motion.aside 
      initial={false}
      animate={{ 
        width: sidebarCollapsed ? 88 : 280,
        transition: { type: 'spring', stiffness: 400, damping: 40 }
      }}
      className="fixed left-0 top-0 z-50 h-screen flex flex-col sidebar-bg border-r border-white/5 shadow-2xl overflow-hidden select-none"
    >
      {/* Premium Glass Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#002D5E]/20 via-transparent to-red-500/5 pointer-events-none" />
      
      {/* Logo Section - Top Aligned */}
      <div className={`pt-8 pb-6 flex flex-col items-center shrink-0 relative z-10 transition-all ${sidebarCollapsed ? 'px-0' : 'px-8'}`}>
        <AnimatePresence mode="wait">
          {!sidebarCollapsed ? (
            <motion.div 
              key="expanded-logo"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex justify-center"
            >
              <div className="bg-white p-4 rounded-[1.5rem] shadow-xl border border-white/10 flex items-center justify-center w-full">
                <ArzLogo 
                  variant="horizontal" 
                  className="w-full" 
                  showText={true}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="collapsed-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mx-auto"
            >
              <div className="bg-white p-2 rounded-xl shadow-md border border-white/10">
                <ArzLogo className="w-8 h-8" showText={false} variant="icon" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-4 shrink-0" /> {/* 16px Gap */}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar relative z-10 pb-4">
        {menuItems.map((item, idx) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={item.tooltip || item.name}
            className={({ isActive }) => `
              flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 group relative border
              ${isActive 
                ? 'active-nav-item' 
                : 'border-transparent text-app-on-primary/40 hover:bg-app-card/5 hover:text-app-on-primary'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={19} className={`shrink-0 transition-all duration-300 ${isActive ? 'active-nav-icon' : 'group-hover:scale-110'}`} />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.div 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="flex flex-col min-w-0"
                    >
                      <span className="text-[12.5px] font-black uppercase tracking-widest italic leading-tight">
                        {item.name}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active-pill"
                    className="absolute left-0 w-1 h-5 rounded-r-full active-nav-pill"
                  />
                )}

                {/* Tooltip for collapsed mode */}
                {sidebarCollapsed && (
                  <div className="absolute left-20 px-4 py-3 bg-[#0A1220] border border-white/5 text-app-on-primary text-[10px] rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-3 group-hover:translate-x-0 shadow-2xl z-[100] font-black uppercase tracking-widest whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer User Card */}
      <div className="p-3 border-t border-white/5 relative z-10 bg-app-card/[0.01]">
        {!sidebarCollapsed ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
             <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600/10 to-red-600/5 border border-white/5 flex items-center gap-3 group/user cursor-pointer overflow-hidden relative shadow-lg">
                <div className="absolute inset-0 bg-app-card/[0.02] opacity-0 group-hover/user:opacity-100 transition-opacity" />
                <div className="w-10 h-10 bg-app-card/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10 group-hover/user:scale-105 transition-transform overflow-hidden">
                   <ArzLogo variant="icon" className="w-7 h-7" />
                </div>
                <div className="overflow-hidden relative z-10 flex-1">
                   <div className="text-[10px] font-black text-app-on-primary italic truncate uppercase tracking-tight">{user?.name || t('auth.operator')}</div>
                   <div className="text-[8px] text-blue-400 font-bold uppercase tracking-widest mt-0.5 truncate flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                     {user?.role ? t(`roles.${user.role}`) : t('auth.operator')}
                   </div>
                </div>
                <NavLink to="/profile" className="p-2 hover:bg-app-card/10 rounded-lg text-app-on-primary/40 hover:text-app-on-primary transition-colors relative z-20">
                  <UserCircle size={16} />
                </NavLink>
             </div>
             <div className="flex gap-2">
               <button 
                onClick={() => setSidebarCollapsed(true)}
                className="w-full flex items-center justify-center py-2 rounded-xl bg-app-card/[0.03] hover:bg-app-card/[0.08] transition-all text-app-on-primary/30 hover:text-app-on-primary border border-white/5"
               >
                 <ChevronLeft size={16} />
               </button>
             </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-3">
             <NavLink 
              to="/profile"
              className="w-11 h-11 bg-app-card/5 rounded-xl flex items-center justify-center cursor-pointer hover:bg-app-card/10 transition-all border border-white/10"
             >
                <UserCircle size={20} className="text-app-on-primary/40" />
             </NavLink>
             <button 
              onClick={() => setSidebarCollapsed(false)}
              className="p-2.5 rounded-xl bg-app-card/[0.03] hover:bg-app-card/[0.08] transition-all text-app-on-primary/30 hover:text-app-on-primary border border-white/5"
             >
               <ChevronRight size={16} />
             </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
