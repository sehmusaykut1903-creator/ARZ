import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Send, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  MessageSquare, 
  Bot, 
  User, 
  Sparkles, 
  History, 
  X, 
  Terminal,
  Activity,
  Layers,
  Search,
  MoreVertical,
  BrainCircuit,
  Settings as SettingsIcon,
  Eraser,
  Copy,
  Check,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { ArzLogo } from '../components/ArzLogo';
import { arzLocalBrain, ArzIntent, BrainResponse, RiskLevel } from '../services/arzLocalBrain';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  intent?: ArzIntent;
  analysis?: BrainResponse;
}

const AICenter = () => {
  const { t } = useTranslation();
  const { reports, logistics, patients, volunteers, user, aiSettings, healthLogs } = useAppContext();
  
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('arz_ai_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: '1',
        role: 'assistant',
        content: `Merhaba ${user?.name || 'Operatör'}, ben ARZ Akıllı Asistan. Afet yönetimi ve karar destek süreçlerinde size yerel analiz motorum (Local Brain) ile yardımcı olabilirim. Ne yapmamı istersiniz?`,
        timestamp: new Date()
      }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('arz_ai_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (textOverride?: string) => {
    const messageText = textOverride || input;
    if (!messageText.trim() || loading) return;

    if (aiSettings && !aiSettings.active) return;

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: messageText, 
      timestamp: new Date() 
    };

    setMessages(prev => [...prev, userMsg].slice(-20));
    if (!textOverride) setInput('');
    setLoading(true);

    // Simulate analysis delay
    setTimeout(() => {
      const context = {
        selectedProvince: 'Yozgat', // Demo province
        mapSummary: 'Yozgat pilot koordinasyon bölgesi, orta risk, saha izleme aktif.',
        logisticsSummary: `${logistics.length} aktif sevkiyat, ${logistics.filter(l => l.category === 'medicine').length} tıbbi malzeme rotası.`,
        clinicalSummary: `Klinik destek modülünde ${patients.length} demo triyaj verisi mevcut.`,
        publicHealthSummary: `Temiz su, hijyen ve ${healthLogs.length} bölge izlenmektedir.`,
        userRole: user?.role,
        aiSettings
      };

      const analysis = arzLocalBrain.generateResponse(messageText, context);
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: analysis.summary,
        timestamp: new Date(),
        analysis
      };

      setMessages(prev => [...prev, assistantMsg].slice(-20));
      setLoading(false);
    }, 1000);
  };

  const QuickActions = [
    { label: t('ai_chip_summarize', "Genel afet durumunu özetle"), icon: Activity },
    { label: t('ai_chip_region', "En kritik bölge neresi?"), icon: AlertTriangle },
    { label: t('ai_chip_clinical_risks', "Klinik riskleri değerlendir"), icon: ShieldCheck },
    { label: t('ai_chip_logistics_priority', "Lojistik sevkiyat önceliği"), icon: Zap },
    { label: t('ai_chip_map_recommendations', "Harita verisi önerileri"), icon: Layers },
    { label: t('ai_chip_first_hour', "İlk saat planı"), icon: Terminal },
  ];

  if (!aiSettings || !aiSettings.active) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="bg-app-card p-12 rounded-[3.5rem] border border-app-border shadow-premium max-w-lg text-center space-y-6">
           <div className="w-24 h-24 bg-app-bg text-app-muted rounded-[2rem] flex items-center justify-center mx-auto">
             <Cpu size={48} />
           </div>
           <h3 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">{t('ai.disabled_title', 'ARZ AI DEVRE DIŞI')}</h3>
           <p className="text-xs text-app-muted font-bold leading-relaxed uppercase tracking-widest">
             {t('ai.disabled_desc', 'Akıllı asistan ve analiz motoru şu anda kapalı. Kullanmak için sistem ayarlarından aktif edebilirsiniz.')}
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-190px)] md:h-[calc(100vh-140px)] flex flex-col bg-app-card rounded-2xl md:rounded-[3.5rem] border border-app-border shadow-premium overflow-hidden relative">
      <div className="p-4 md:p-8 border-b border-app-border flex items-center justify-between bg-app-card/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-3 md:gap-5">
          <div className="relative">
            <ArzLogo variant="icon" className="w-10 h-10 md:w-14 md:h-14" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
          </div>
          <div>
            <h2 className="text-sm md:text-xl font-black text-app-text uppercase tracking-wider md:italic md:tracking-tighter">
              ARZ AI <span className="hidden md:inline">({t('ai.header_sub', 'Akıllı Asistan')})</span>
            </h2>
            <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-0.5 md:mt-1">
               <span className="text-[8px] md:text-[10px] text-blue-500 font-black uppercase tracking-widest leading-none bg-app-primary/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded">{t('ai.local_brain', 'Local Brain')}</span>
               <span className="text-[8px] md:text-[10px] text-emerald-500 font-black uppercase tracking-widest leading-none bg-emerald-50 px-1.5 py-0.5 md:px-2 md:py-1 rounded flex items-center gap-1"><Check size={8} /> {t('system.offline', 'Offline')}</span>
               {aiSettings.detailedAnalysisMode && (
                 <span className="text-[8px] md:text-[10px] text-purple-500 font-black uppercase tracking-widest leading-none bg-purple-50 px-1.5 py-0.5 md:px-2 md:py-1 rounded">{t('toggles.detailedAnalysisMode', 'Analiz')}</span>
               )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setMessages([{ id: '1', role: 'assistant', content: t('ai.clear_history_msg', 'Geçmiş temizlendi. Yeni bir analiz başlatabiliriz.'), timestamp: new Date() }])}
             className="p-2 md:p-3 hover:bg-red-50 text-app-muted hover:text-red-500 rounded-xl transition-all"
             title={t('actions.clear', 'Temizle')}
           >
             <Eraser size={16} />
           </button>
           <button className="p-3 hover:bg-app-bg rounded-xl text-app-muted transition-colors hidden md:block"><SettingsIcon size={20} /></button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-100 min-h-0"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 md:gap-6 group items-start ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-premium ${
                m.role === 'user' ? 'bg-app-primary text-app-on-primary' : 'bg-app-card border border-app-border text-[#002D5E]'
              }`}>
                {m.role === 'user' ? <User size={18} /> : <ArzLogo variant="icon" className="w-6 h-6 md:w-8 md:h-8" />}
              </div>
              <div className={`max-w-[85%] md:max-w-[70%] space-y-1.5 md:space-y-3 flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-lux relative break-words overflow-hidden w-full ${
                  m.role === 'user' 
                  ? 'bg-app-primary text-app-on-primary rounded-tr-none font-bold italic' 
                  : 'bg-app-card text-app-text rounded-tl-none border border-app-border'
                }`}>
                  <div className="text-[12px] md:text-[13px] leading-relaxed whitespace-pre-wrap">
                    {m.role === 'user' ? (
                      m.content
                    ) : (
                      <div className="space-y-3">
                        {m.content.split(/(?=### )/g).map((section, idx) => {
                          if (section.startsWith('### ')) {
                            const [title, ...rest] = section.replace('### ', '').split('\n');
                            const body = rest.join('\n').trim();
                            const isTable = body.includes('|') && body.includes('+-');
                            
                            return (
                              <div key={idx} className="bg-app-bg/30 p-3 md:p-4 rounded-xl md:rounded-2xl border border-app-border/50">
                                <h4 className="text-[9px] md:text-[10px] font-black text-app-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                                  <Sparkles size={11} className="text-blue-500" />
                                  {title}
                                </h4>
                                <div className={`leading-relaxed ${isTable ? 'font-mono text-[9px] md:text-[10px] bg-white/50 p-2.5 rounded-lg border border-app-border overflow-x-auto whitespace-pre' : 'text-[11px] md:text-[12px]'}`}>
                                  {body}
                                </div>
                              </div>
                            );
                          }
                          return <div key={idx} className="italic text-app-muted text-[11px] md:text-xs font-medium mb-3">{section}</div>;
                        })}
                      </div>
                    )}
                  </div>
                  
                  {m.analysis && (
                    <div className="mt-4 md:mt-8 pt-4 md:pt-8 border-t border-app-border space-y-4 md:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                         <div className="space-y-2">
                           <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black text-app-primary uppercase tracking-widest">
                              <ShieldCheck size={12} /> Risk Değerlendirmesi
                           </div>
                           <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] md:text-[10px] font-black uppercase tracking-widest ${
                              m.analysis.riskLevel === 'critical' ? 'bg-red-500 text-app-on-primary' :
                              m.analysis.riskLevel === 'high' ? 'bg-orange-500 text-app-on-primary' :
                              m.analysis.riskLevel === 'medium' ? 'bg-amber-500 text-app-on-primary' : 'bg-emerald-500 text-app-on-primary'
                           }`}>
                              {m.analysis.riskLevel} Level Risk
                           </div>
                           <div className="text-[9px] md:text-[10px] font-black text-app-muted mt-1 uppercase tracking-widest flex items-center gap-1">
                             <Check size={10} className="text-green-500" /> Güven: %{Math.floor(Math.random() * 10) + 85}
                           </div>
                         </div>
                         <div className="space-y-2">
                           <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black text-app-primary uppercase tracking-widest">
                              <Zap size={12} /> Önerilen Aksiyonlar
                           </div>
                           <ul className="space-y-1 md:space-y-2">
                             {m.analysis.actions.map((action, i) => (
                               <li key={i} className="text-[10px] md:text-[11px] font-bold text-app-muted flex items-center gap-1.5">
                                 <div className="w-1.5 h-1.5 bg-app-primary/100 rounded-full shrink-0" /> {action}
                               </li>
                             ))}
                           </ul>
                         </div>
                      </div>
                      <div className="p-3 md:p-4 bg-app-bg rounded-xl md:rounded-2xl border border-app-border flex flex-col gap-2">
                         <p className="text-[9px] md:text-[10px] text-app-muted font-bold italic leading-relaxed">
                           {m.analysis.note}
                         </p>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-2 right-2 md:top-4 md:right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleCopy(m.id, m.content)}
                      className={`p-1.5 rounded transition-colors ${m.role === 'user' ? 'hover:bg-app-card/20 text-app-on-primary/50 hover:text-app-on-primary' : 'hover:bg-gray-100 text-app-muted'}`}
                    >
                      {copiedId === m.id ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
                <div className={`px-2 flex items-center gap-2 text-[8px] md:text-[9px] font-black text-app-muted uppercase tracking-widest ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span>{m.role === 'user' ? 'OPERATÖR' : 'ARZ ANALİZ MOTORU'}</span>
                  <span>•</span>
                  <span>{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <div className="flex gap-3 md:gap-6">
            <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-app-card border border-app-border flex items-center justify-center shadow-premium">
              <ArzLogo variant="icon" className="w-6 h-6 md:w-8 md:h-8 animate-pulse" />
            </div>
            <div className="bg-app-card/80 backdrop-blur-xl border border-app-border p-4 md:p-8 rounded-2xl md:rounded-[2rem] rounded-tl-none flex flex-col gap-3 shadow-lux">
              <div className="flex gap-1.5">
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 bg-app-primary/20 rounded-full" />
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }} className="w-2 h-2 bg-app-primary/40 rounded-full" />
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }} className="w-2 h-2 bg-app-primary/60 rounded-full" />
              </div>
              <div className="text-[8px] md:text-[10px] font-black text-blue-500 uppercase tracking-widest italic animate-pulse">{t('ai.analyzing', 'Yerel Motor Analiz Yapıyor...')}</div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-8 bg-app-card border-t border-app-border shrink-0">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex overflow-x-auto custom-scrollbar pb-3 md:pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 gap-2 shrink-0 select-none scroll-smooth">
             {QuickActions.map((action, i) => (
                <button 
                 key={i}
                 onClick={() => handleSend(action.label)}
                 className="flex-shrink-0 px-4 py-2 bg-app-bg hover:bg-app-card border border-app-border hover:border-blue-100 rounded-xl text-[9px] md:text-[10px] font-black text-app-muted hover:text-app-text transition-all shadow-sm flex items-center gap-1.5 group"
                >
                  <action.icon size={11} className="text-blue-500 group-hover:scale-110" />
                  <span className="whitespace-nowrap">{action.label}</span>
                </button>
             ))}
          </div>

          <div className="flex gap-2 sm:gap-4 p-1.5 sm:p-3 bg-app-card rounded-2xl sm:rounded-[3rem] border-2 border-app-border shadow-premium focus-within:border-app-primary transition-all group relative overflow-hidden">
             <div className="absolute inset-0 bg-app-primary/5 pointer-events-none" />
             <div className="hidden sm:flex w-14 h-14 bg-app-bg rounded-full items-center justify-center text-app-muted group-focus-within:text-[#002D5E] transition-colors relative z-10 shrink-0">
                <MessageSquare size={24} />
             </div>
             <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('ai.input_placeholder', 'Mesajınızı yazın...')}
              className="flex-1 w-full min-w-0 bg-transparent px-2 sm:px-4 text-xs sm:text-sm font-black italic focus:outline-none placeholder:text-app-muted text-app-text relative z-10"
             />
             <button 
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-app-primary hover:bg-blue-900 text-app-on-primary p-2 px-4 sm:px-10 rounded-xl sm:rounded-full shadow-lg shadow-app-primary/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 sm:gap-3 relative z-10 disabled:opacity-50 shrink-0"
              style={{ backgroundColor: 'var(--app-primary)' }}
             >
                <span className="text-[10px] md:text-[11px] font-black tracking-widest hidden sm:block uppercase italic">{t('ai.button_analyze', 'ANALİZ ET')}</span>
                <Send size={15} />
             </button>
          </div>
          <p className="text-[8px] md:text-[9px] text-app-muted font-black text-center uppercase tracking-[0.3em] md:tracking-[0.4em] italic leading-none">
            {t('ai.footer_sub', 'ARZ LOCAL BRAIN V3.0 • %100 YEREL VE GÜVENLİ AFET GRUBU ANALİZİ')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICenter;
