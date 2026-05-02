import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Camera, 
  Save, 
  Trash2, 
  LogOut, 
  Lock, 
  CheckCircle2, 
  Activity, 
  FileText, 
  Target, 
  AlertCircle,
  Briefcase,
  Building2,
  Truck,
  Stethoscope,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { ArzLogo } from '../components/ArzLogo';

const Profile = () => {
  const { t } = useTranslation();
  const { user, userProfile, setUserProfile, logout, projectIdentity, showToast } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(userProfile || {
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    role: user?.role || 'citizen',
    institution: '',
    department: '',
    city: '',
    district: '',
    photo: null,
    specialty: '', 
    shiftStatus: 'active', 
    vehiclePlate: '', 
    vehicleType: '', 
    areaOfOperation: '', 
    skills: [], 
    emergencyContact: '', 
    bloodGroup: '', 
    chronicDiseases: '', 
  });

  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile);
    }
  }, [userProfile]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setUserProfile(formData);
    setIsEditing(false);
    showToast(t('auth.profileUpdated'));
  };

  const handleLogout = () => {
    logout();
    showToast(t('auth.logoutSuccess'), 'info');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'health_personnel': return <Stethoscope size={24} />;
      case 'logistics_manager': return <Truck size={24} />;
      case 'afad_operator': return <ShieldCheck size={24} />;
      case 'volunteer': return <Users size={24} />;
      default: return <User size={24} />;
    }
  };

  const stats = [
    { label: t('reports'), value: '14', icon: FileText, color: 'text-blue-500' },
    { label: t('field'), value: '28', icon: MapPin, color: 'text-orange-500' },
    { label: t('toggles.enabled'), value: '142', icon: Target, color: 'text-green-500' },
    { label: 'AI Analiz', value: '456', icon: Activity, color: 'text-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header Profile Section */}
      <div className="bg-app-card rounded-[3.5rem] p-10 border border-app-border shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
           {getRoleIcon(formData.role)}
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
          {/* Avatar Section */}
          <div className="relative">
            <div className="w-44 h-44 rounded-[2.5rem] bg-app-bg border-4 border-white shadow-xl overflow-hidden flex items-center justify-center text-app-text text-6xl font-black italic uppercase">
              {formData.photo ? (
                <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                formData.name?.charAt(0) || user?.email?.charAt(0)
              )}
            </div>
            {isEditing && (
              <label className="absolute -right-2 -bottom-2 bg-primary text-app-on-primary p-4 rounded-2xl shadow-xl cursor-pointer hover:scale-110 transition-transform">
                <Camera size={20} />
                <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
              </label>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-4xl font-black text-app-text tracking-tighter uppercase italic -skew-x-6">
                {formData.name || t('auth.guestLogin')}
              </h1>
              <div className="flex justify-center md:justify-start gap-2">
                 <span className="px-4 py-1.5 bg-app-primary/10 text-app-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                   {t(`role_${formData.role}`)}
                 </span>
                 <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                   {t('system.active').toUpperCase()}
                 </span>
              </div>
            </div>
            <div className="space-y-2 text-app-muted font-bold italic text-sm">
              <div className="flex items-center justify-center md:justify-start gap-2">
                 <Building2 size={16} className="text-app-muted" />
                 {formData.institution || 'ARZ Network'} • {formData.department || t('role_researcher')}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                 <Mail size={16} className="text-app-muted" />
                 {formData.email}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
             <button 
               onClick={() => isEditing ? handleSave() : setIsEditing(true)}
               className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg ${
                 isEditing 
                 ? 'bg-green-600 text-app-on-primary shadow-green-900/20 hover:bg-green-700' 
                 : 'bg-primary text-app-on-primary shadow-app-primary/20 hover:scale-[1.05]'
               }`}
             >
               {isEditing ? <Save size={18} /> : <FileText size={18} />}
               {isEditing ? t('actions.save').toUpperCase() : t('settings_labels.about').toUpperCase()} 
             </button>
             {!isEditing && (
               <button 
                 onClick={handleLogout}
                 className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors shadow-sm"
               >
                 <LogOut size={20} />
               </button>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-app-card rounded-[3rem] p-10 border border-app-border shadow-xl">
             <div className="flex items-center gap-4 border-b border-app-border pb-6 mb-8">
                <div className="w-12 h-12 bg-app-primary/10 rounded-2xl flex items-center justify-center text-app-text">
                  <User size={24} />
                </div>
                <h3 className="text-xl font-black text-app-text italic uppercase tracking-tighter">{t('profile')}</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-app-muted uppercase tracking-widest ml-1">{t('auth.fullName')}</label>
                   <input 
                     disabled={!isEditing}
                     type="text" 
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                     className="w-full h-14 bg-app-bg rounded-2xl px-6 font-bold text-sm text-app-text border-transparent focus:border-primary transition-all disabled:opacity-50 shadow-inner" 
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-app-muted uppercase tracking-widest ml-1">{t('auth.email')}</label>
                   <input 
                     disabled={!isEditing}
                     type="email" 
                     value={formData.email}
                     onChange={e => setFormData({...formData, email: e.target.value})}
                     className="w-full h-14 bg-app-bg rounded-2xl px-6 font-bold text-sm text-app-text border-transparent focus:border-primary transition-all disabled:opacity-50 shadow-inner" 
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-app-muted uppercase tracking-widest ml-1">{t('auth.phone')}</label>
                   <input 
                     disabled={!isEditing}
                     type="text" 
                     value={formData.phone}
                     placeholder="+90 (___) ___ __ __"
                     onChange={e => setFormData({...formData, phone: e.target.value})}
                     className="w-full h-14 bg-app-bg rounded-2xl px-6 font-bold text-sm text-app-text border-transparent focus:border-primary transition-all disabled:opacity-50 shadow-inner" 
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-app-muted uppercase tracking-widest ml-1">{t('languageRegion')}</label>
                   <div className="grid grid-cols-2 gap-3">
                      <input 
                        disabled={!isEditing}
                        type="text" 
                        value={formData.city}
                        placeholder={t('auth.city')}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                        className="w-full h-14 bg-app-bg rounded-2xl px-4 font-bold text-sm text-app-text border-transparent focus:border-primary transition-all disabled:opacity-50 shadow-inner" 
                      />
                      <input 
                        disabled={!isEditing}
                        type="text" 
                        value={formData.district}
                        placeholder={t('auth.district')}
                        onChange={e => setFormData({...formData, district: e.target.value})}
                        className="w-full h-14 bg-app-bg rounded-2xl px-4 font-bold text-sm text-app-text border-transparent focus:border-primary transition-all disabled:opacity-50 shadow-inner" 
                      />
                   </div>
                </div>
             </div>
          </section>

          {/* Role Specific Section */}
          <section className="bg-slate-900 rounded-[3rem] p-10 border border-white/5 shadow-2xl text-app-on-primary relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                <Briefcase size={48} />
             </div>
             
             <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-8 relative z-10">
                <div className="w-12 h-12 bg-app-card/10 rounded-2xl flex items-center justify-center text-blue-400">
                   <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-black text-app-on-primary italic uppercase tracking-tighter">{t('auth.roleSelect')}</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-app-on-primary/30 uppercase tracking-widest ml-1">{t('project_institution')}</label>
                   <input 
                     disabled={!isEditing}
                     type="text" 
                     value={formData.institution}
                     placeholder="T.C. Sağlık Bakanlığı / AFAD vb."
                     onChange={e => setFormData({...formData, institution: e.target.value})}
                     className="w-full h-14 bg-app-card/5 rounded-2xl px-6 font-bold text-sm text-app-on-primary border-transparent focus:border-blue-500 transition-all disabled:opacity-50" 
                   />
                </div>
                {formData.role === 'health_personnel' && (
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-app-on-primary/30 uppercase tracking-widest ml-1">BRANŞ</label>
                     <input 
                       disabled={!isEditing}
                       type="text" 
                       value={formData.specialty}
                       placeholder="Acil Tıp / Cerrahi vb."
                       onChange={e => setFormData({...formData, specialty: e.target.value})}
                       className="w-full h-14 bg-app-card/5 rounded-2xl px-6 font-bold text-sm text-app-on-primary border-transparent focus:border-blue-500 transition-all disabled:opacity-50" 
                     />
                  </div>
                )}
                {formData.role === 'logistics_manager' && (
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-app-on-primary/30 uppercase tracking-widest ml-1">PLAKA</label>
                     <input 
                       disabled={!isEditing}
                       type="text" 
                       value={formData.vehiclePlate}
                       placeholder="06 ARZ 06"
                       onChange={e => setFormData({...formData, vehiclePlate: e.target.value})}
                       className="w-full h-14 bg-app-card/5 rounded-2xl px-6 font-bold text-sm text-app-on-primary border-transparent focus:border-blue-500 transition-all disabled:opacity-50" 
                     />
                  </div>
                )}
             </div>
          </section>
        </div>

        {/* Right Column - Stats & Security */}
        <div className="lg:col-span-4 space-y-8">
           <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="bg-app-card p-6 rounded-3xl border border-app-border shadow-sm text-center hover:scale-105 transition-transform cursor-pointer">
                   <div className={`w-10 h-10 ${s.color} bg-current/5 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <s.icon size={20} />
                   </div>
                   <div className="text-xl font-black text-app-text italic uppercase tracking-tighter">{s.value}</div>
                   <div className="text-[9px] font-black text-app-muted uppercase tracking-widest mt-1 whitespace-nowrap">{s.label}</div>
                </div>
              ))}
           </div>

           <section className="bg-app-card rounded-[3rem] p-8 border border-app-border shadow-xl">
              <div className="flex items-center gap-4 border-b border-app-border pb-6 mb-6">
                 <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                    <Lock size={20} />
                 </div>
                 <h3 className="text-base font-black text-app-text italic uppercase tracking-tighter">{t('securityData')}</h3>
              </div>

              <div className="space-y-4">
                 <div className="p-4 bg-app-bg rounded-2xl flex flex-col gap-1 border border-app-border/50">
                    <span className="text-[10px] font-black text-app-muted uppercase tracking-widest">KİMLİK DOĞRULAMA</span>
                    <span className="text-xs font-black text-app-text uppercase">{t('auth.loginWithEdevlet').split(' ')[0]}</span>
                 </div>
                 <div className="p-4 bg-app-bg rounded-2xl flex items-center justify-between border border-app-border/50">
                    <span className="text-[10px] font-black text-app-muted uppercase tracking-widest">BOT KONTROL</span>
                    <div className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase">
                       <CheckCircle2 size={14} /> {t('system.active').toUpperCase()}
                    </div>
                 </div>
              </div>

              <div className="mt-8 space-y-3">
                 <button className="w-full py-4 bg-app-bg text-app-muted rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 border border-app-border transition-colors">
                    {t('auth.forgotPassword').toUpperCase()}
                 </button>
                 <button className="w-full py-4 border-2 border-red-50 text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                    <Trash2 size={16} /> {t('actions.clear').toUpperCase()}
                 </button>
              </div>
           </section>

           <div className="text-center space-y-4 py-8 flex flex-col items-center">
              <ArzLogo className="grayscale opacity-20 scale-75" showText={false} />
              <p className="text-[8px] font-black text-app-muted uppercase tracking-[0.3em]">{t('system.online').toUpperCase()} DATA NETWORK</p>
              <p className="text-[9px] font-bold text-app-muted italic max-w-[200px] mx-auto leading-relaxed uppercase">
                {projectIdentity.fullTitle} • {projectIdentity.version}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
