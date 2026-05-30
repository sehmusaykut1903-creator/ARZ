import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Globe, 
  ArrowRight, 
  UserCircle, 
  Mail,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Fingerprint
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { 
  loginUser, 
  registerLocalUser, 
  loginGuest, 
  loginGoogleMailDemo, 
  loginEdevletDemo, 
  saveAuthSession, 
  getRememberedUser,
  getRegisteredUsers
} from '../services/authService';
import { UserRole } from '../types';
import { LanguageSelector } from '../components/LanguageSelector';
import { RoleSelect } from '../components/RoleSelect';
import { BrowserModal } from '../components/BrowserModal';
import { ArzLogo } from '../components/ArzLogo';

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser, projectIdentity, showToast } = useAppContext();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);
  
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Registration States
  const [regName, setRegName] = useState('');
  const [regIdentity, setRegIdentity] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  
  // Login States
  const [loginIdentity, setLoginIdentity] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('arz_selected_role') as UserRole) || 'citizen';
  });
  const [rememberMe, setRememberMe] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Browser Modal States
  const [browserConfig, setBrowserConfig] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
    demoLabel: string;
    method: 'edevlet' | 'google';
  }>({
    isOpen: false,
    url: '',
    title: '',
    demoLabel: '',
    method: 'edevlet'
  });

  useEffect(() => {
    const remembered = getRememberedUser();
    if (remembered) {
      setLoginIdentity(remembered.identity);
      setRole(remembered.role || 'citizen');
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loginIdentity) { setError(t('auth.identityRequired')); return; }
    if (!loginPassword) { setError(t('auth.passwordRequired')); return; }

    setIsLoading(true);
    setError(null);

    try {
      const user = await loginUser(loginIdentity, loginPassword, role);
      saveAuthSession(user, 'email', rememberMe, loginIdentity);
      showToast(t('auth.loginSuccess'), 'success');
      setUser(user);
      navigate('/', { replace: true });
    } catch (err: any) {
      if (err.message === 'USER_NOT_FOUND') {
        setError(t('auth.userNotFound'));
      } else if (err.message === 'WRONG_PASSWORD') {
        setError(t('auth.wrongPassword'));
      } else {
        setError(t('system.error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName) { setError(t('auth.fullNameRequired')); return; }
    if (!regIdentity) { setError(t('auth.identityRequired')); return; }
    if (!regEmail) { setError(t('auth.emailRequired')); return; }
    if (!regPassword) { setError(t('auth.passwordRequired')); return; }
    if (regPassword !== regConfirmPassword) { setError(t('auth.passwordMismatch')); return; }

    setIsLoading(true);
    setError(null);

    try {
      const registered = getRegisteredUsers();
      const existing = registered.find(u => u.identity === regIdentity || u.email === regEmail);
      if (existing) {
        setError(t('auth.userAlreadyExists'));
        setIsLoading(false);
        return;
      }

      const localUser = registerLocalUser({
        fullName: regName,
        identity: regIdentity,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        role: role,
      });

      const userData = {
        id: localUser.id,
        name: localUser.fullName,
        email: localUser.email,
        role: localUser.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${localUser.fullName}`
      };

      saveAuthSession(userData, 'email', true, regIdentity);
      showToast(t('auth.registerSuccess'), 'success');
      setUser(userData);
      navigate('/', { replace: true });
    } catch (err) {
      setError(t('system.error'));
      setIsLoading(false);
    }
  };

  const handleGuest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const guestId = "guest_" + Math.random().toString(36).substr(2, 9);
      const guestUser = {
        id: guestId,
        name: i18n.language === 'tr' ? "Misafir Operatör" : "Guest Operator",
        email: `guest_${guestId}@arz.local`,
        role: role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Guest_${guestId}`,
        isGuest: true
      };

      saveAuthSession(guestUser, 'guest', false);
      setUser(guestUser);
      showToast(i18n.language === 'tr' ? 'Misafir Girişi Başarılı' : 'Guest Login Successful', 'success');
      navigate('/', { replace: true });
    } catch (err) {
      setError(t('system.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const openEdevlet = () => {
    setBrowserConfig({
      isOpen: true,
      url: 'https://giris.turkiye.gov.tr',
      title: 'e-Devlet Kapısı Kimlik Doğrulama',
      demoLabel: t('auth.demoEdevletConfirm'),
      method: 'edevlet'
    });
  };

  const openGoogle = () => {
    setBrowserConfig({
      isOpen: true,
      url: 'https://accounts.google.com',
      title: 'Google / Mail Hesabı ile Giriş',
      demoLabel: t('auth.demoGoogleConfirm'),
      method: 'google'
    });
  };

  const confirmDemoAuth = async () => {
    setIsLoading(true);
    setBrowserConfig(prev => ({ ...prev, isOpen: false }));
    try {
      let user;
      if (browserConfig.method === 'edevlet') {
        user = await loginEdevletDemo(role);
        saveAuthSession(user, 'edevlet-demo', false);
        showToast(t('auth.edevletDemoSuccess'), 'success');
      } else {
        user = await loginGoogleMailDemo(role);
        saveAuthSession(user, 'google-mail-demo', false);
        showToast(t('auth.googleDemoSuccess'), 'success');
      }
      setUser(user);
      navigate('/', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-4 md:p-6 font-sans overflow-y-auto relative">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch relative z-10 m-auto">
        
        {/* Left Panel: Corporate Info (5/12) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-[#003366] text-app-on-primary rounded-[3.5rem] shadow-2xl relative overflow-hidden">
           {/* Background Accents (Subtle Gradient) */}
           <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#003366] via-[#002D5E] to-[#001F3D]"></div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

           <div className="relative z-10 space-y-12">
               <div className="flex flex-col items-start gap-8">
                  <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-xl">
                    <ArzLogo variant="horizontal" showText={true} className="h-10 text-white" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-6xl font-black tracking-tighter leading-none italic text-white flex items-baseline gap-2">
                       ARZ <span className="text-red-600 text-3xl">OPERASYON</span>
                    </h1>
                    <p className="text-[11px] font-black text-blue-200 uppercase tracking-[0.4em] mt-4 opacity-70">
                       KRİTİK AFET YÖNETİM VE VERİ SİSTEMLERİ
                    </p>
                  </div>
               </div>

              <div className="space-y-6 pt-6">
                 <h2 className="text-4xl font-black leading-tight uppercase tracking-tighter max-w-xs">
                    DOĞRU VERI,<br />
                    DOĞRU ZAMAN,<br />
                    <span className="text-red-500">TAM MÜDAHALE.</span>
                 </h2>
                 <div className="w-16 h-1 bg-red-600 rounded-full" />
                 <p className="text-blue-100 text-sm font-medium leading-relaxed italic opacity-80 max-w-sm">
                    "{t('slogan')}"
                 </p>
              </div>

              <div className="space-y-6 pt-8 border-t border-white/5">
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[9px] text-blue-300/50 uppercase tracking-widest font-black mb-1">PROJE EKİBİ</p>
                      <p className="font-bold text-xs tracking-tight">{projectIdentity.team}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-red-500/50 uppercase tracking-widest font-black mb-1">SÜRÜM</p>
                      <p className="font-bold text-xs tracking-tight text-red-100">v{projectIdentity.version}</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="relative z-10">
              <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-blue-300 opacity-40">
                 <span>TC AFET YÖNETİMİ</span>
                 <div className="w-1 h-1 bg-blue-400 rounded-full" />
                 <span>© 2026</span>
              </div>
           </div>
        </div>

        {/* Right Panel: Auth Card (7/12) */}
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] lg:rounded-[3.5rem] shadow-xl p-5 md:p-14 flex flex-col border border-gray-200 relative overflow-hidden">
            
            {/* Mobile Branding (only visible on small viewports) */}
            <div className="flex lg:hidden flex-col items-center text-center gap-2 mb-6 shrink-0">
              <div className="bg-[#003366] text-white p-2 rounded-[1rem] shadow-md flex items-center justify-center border border-white/10">
                <ArzLogo variant="icon" className="w-8 h-8 text-white" showText={false} />
              </div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic text-[#003366] mt-1 leading-none">
                ARZ <span className="text-red-600">SİSTEMİ</span>
              </h1>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">
                AFET RAPORLAMA VE ZAMANLAMA SİSTEMİ
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 md:mb-10 shrink-0">
               <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full sm:w-fit shadow-inner border border-gray-200/50">
                 <button 
                   onClick={() => { setAuthMode('login'); setError(null); }}
                   className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${authMode === 'login' ? 'bg-white text-[#003366] shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   {t('auth.login')}
                 </button>
                 <button 
                   onClick={() => { setAuthMode('register'); setError(null); }}
                   className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${authMode === 'register' ? 'bg-white text-red-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   {t('auth.register')}
                 </button>
               </div>
               
               <LanguageSelector />
            </div>

            <div className="flex-1">
               <AnimatePresence mode="wait">
                 {authMode === 'login' ? (
                   <motion.div
                     key="login-form"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-6"
                   >
                     {/* Quick Auth Buttons */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                          onClick={openEdevlet}
                          className="edevlet-login-button group"
                        >
                          <span className="edevlet-emoji" aria-hidden="true">🇹🇷</span>
                          <span className="text-[12px] uppercase tracking-widest">{t('auth.edEvletLogin')}</span>
                        </button>
                        <button 
                          onClick={openGoogle}
                          className="w-full py-4 bg-white text-[#003366] border border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-gray-50 hover:shadow-lg transition-all border-b-4 border-blue-400 group"
                        >
                          <img src="https://www.google.com/favicon.ico" alt="google" className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 
                          {t('auth.mailGoogleLogin')}
                        </button>
                     </div>

                     <div className="relative py-2">
                       <div className="absolute inset-0 flex items-center">
                         <div className="w-full border-t border-gray-100"></div>
                       </div>
                       <div className="relative flex justify-center text-[9px] font-black uppercase tracking-widest text-gray-300">
                         <span className="bg-white px-6">{t('auth.orWithCredentials')}</span>
                       </div>
                     </div>

                     <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-4">
                          <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#003366] transition-colors">
                              <UserCircle size={20} />
                            </div>
                            <input 
                              type="text" 
                              placeholder={t('auth.identityPlaceholder')}
                              value={loginIdentity}
                              onChange={(e) => setLoginIdentity(e.target.value)}
                              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-700 focus:outline-none focus:border-[#003366] focus:bg-white transition-all"
                            />
                          </div>

                          <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#003366] transition-colors">
                              <Lock size={20} />
                            </div>
                            <input 
                              type="password" 
                              placeholder={t('auth.passwordPlaceholder')}
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-700 focus:outline-none focus:border-[#003366] focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        <RoleSelect value={role} onChange={setRole} className="w-full" />

                        <div className="flex items-center justify-between gap-4 py-2">
                          <label className="flex items-center gap-3 cursor-pointer group">
                             <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-[#003366] border-[#003366]' : 'border-gray-200'}`}>
                                {rememberMe && <CheckCircle2 size={12} className="text-white" />}
                             </div>
                             <input type="checkbox" className="hidden" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('auth.rememberMe')}</span>
                          </label>
                          <button type="button" className="text-[10px] font-black text-[#003366] uppercase tracking-widest hover:underline underline-offset-4">{t('auth.forgotPassword')}</button>
                        </div>

                        {error && (
                           <div className="p-4 rounded-2xl border border-red-100 bg-red-50 text-red-600 flex items-center gap-3 animate-shake">
                              <AlertTriangle size={18} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                           </div>
                        )}

                        <div className="space-y-4 pt-2">
                           <button 
                             type="submit"
                             disabled={isLoading}
                             className="w-full py-5 bg-[#003366] text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10 hover:bg-[#002244] hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                           >
                              {isLoading ? <Loader2 className="animate-spin" size={24} /> : <>{t('auth.loginButton')} <ArrowRight size={20} /></>}
                           </button>

                           <button 
                             type="button"
                             onClick={handleGuest}
                             disabled={isLoading}
                             className="w-full py-4 text-gray-400 hover:text-[#003366] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all italic underline underline-offset-8"
                           >
                             {t('auth.guestContinue')}
                           </button>
                        </div>
                     </form>
                   </motion.div>
                 ) : (
                   <motion.div
                     key="register-form"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-6"
                   >
                     <form onSubmit={handleRegister} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600">
                              <UserCircle size={20} />
                            </div>
                            <input 
                              type="text" 
                              placeholder={t('auth.fullName')}
                              value={regName}
                              onChange={(e) => setRegName(e.target.value)}
                              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-700 focus:outline-none focus:border-red-600 focus:bg-white transition-all"
                            />
                          </div>
                          <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600">
                              <Fingerprint size={18} />
                            </div>
                            <input 
                              type="text" 
                              placeholder={t('auth.identity')}
                              value={regIdentity}
                              onChange={(e) => setRegIdentity(e.target.value)}
                              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-700 focus:outline-none focus:border-red-600 focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600">
                              <Mail size={18} />
                            </div>
                            <input 
                              type="email" 
                              placeholder={t('auth.email')}
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-700 focus:outline-none focus:border-red-600 focus:bg-white transition-all"
                            />
                          </div>
                          <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600">
                              <Phone size={18} />
                            </div>
                            <input 
                              type="text" 
                              placeholder={t('auth.phone')}
                              value={regPhone}
                              onChange={(e) => setRegPhone(e.target.value)}
                              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-700 focus:outline-none focus:border-red-600 focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600">
                              <Lock size={20} />
                            </div>
                            <input 
                              type="password" 
                              placeholder={t('auth.password')}
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-700 focus:outline-none focus:border-red-600 focus:bg-white transition-all"
                            />
                          </div>
                          <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600">
                              <Lock size={20} />
                            </div>
                            <input 
                              type="password" 
                              placeholder={t('auth.passwordRepeat')}
                              value={regConfirmPassword}
                              onChange={(e) => setRegConfirmPassword(e.target.value)}
                              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-700 focus:outline-none focus:border-red-600 focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        <RoleSelect value={role} onChange={setRole} className="w-full" />

                        {error && (
                           <div className="p-4 rounded-2xl border border-red-100 bg-red-50 text-red-600 flex items-center gap-3">
                              <AlertTriangle size={18} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                           </div>
                        )}

                        <div className="pt-4">
                           <button 
                             type="submit"
                             disabled={isLoading}
                             className="w-full py-5 bg-red-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-red-900/10 hover:bg-red-700 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                           >
                              {isLoading ? <Loader2 className="animate-spin" size={24} /> : <>{t('auth.registerButton')} <ArrowRight size={20} /></>}
                           </button>
                        </div>
                     </form>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Footer Notice */}
            <div className="mt-10 pt-6 border-t border-gray-100">
               <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest text-center leading-relaxed">
                 {t('auth.footerSecurityNotice')}<br />
                 {t('auth.footerTermsNotice')}
               </p>
            </div>
         </div>
      </div>

      <BrowserModal 
        isOpen={browserConfig.isOpen}
        onClose={() => setBrowserConfig(prev => ({ ...prev, isOpen: false }))}
        url={browserConfig.url}
        title={browserConfig.title}
        demoConfirmLabel={browserConfig.demoLabel}
        onConfirmDemo={confirmDemoAuth}
      />
    </div>
  );
};

export default Login;
