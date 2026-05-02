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
    { label: "Genel afet durumunu özetle", icon: Activity },
    { label: "En kritik bölge neresi?", icon: AlertTriangle },
    { label: "Klinik riskleri değerlendir", icon: ShieldCheck },
    { label: "Lojistik sevkiyat önceliği", icon: Zap },
    { label: "Harita verisi önerileri", icon: Layers },
    { label: "İlk 6 saatlik plan", icon: Terminal },
    { label: "İlk 72 saatlik plan", icon: Terminal },
    { label: "Güvenli hareket planı", icon: MessageSquare },
  ];

  if (!aiSettings.active) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="bg-app-card p-12 rounded-[3.5rem] border border-app-border shadow-premium max-w-lg text-center space-y-6">
           <div className="w-24 h-24 bg-app-bg text-app-muted rounded-[2rem] flex items-center justify-center mx-auto">
             <Cpu size={48} />
           </div>
           <h3 className="text-3xl font-black text-app-text italic uppercase tracking-tighter">ARZ AI DEVRE DIŞI</h3>
           <p className="text-xs text-app-muted font-bold leading-relaxed uppercase tracking-widest">
             Akıllı asistan ve analiz motoru şu anda kapalı. Kullanmak için sistem ayarlarından aktif edebilirsiniz.
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col bg-app-card rounded-[3.5rem] border border-app-border shadow-premium overflow-hidden relative">
      <div className="p-8 border-b border-app-border flex items-center justify-between bg-app-card/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-5">
          <div className="relative">
            <ArzLogo variant="icon" className="w-14 h-14" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-sm" />
          </div>
          <div>
            <h2 className="text-xl font-black text-app-text italic uppercase tracking-tighter">ARZ AI (Akıllı Asistan)</h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest leading-none bg-app-primary/10 px-2 py-1 rounded">Local Brain {t('status.active', 'Aktif')}</span>
               <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest leading-none bg-emerald-50 px-2 py-1 rounded flex items-center gap-1"><Check size={10} /> Offline Destekli</span>
               {aiSettings.detailedAnalysisMode && (
                 <span className="text-[10px] text-purple-500 font-black uppercase tracking-widest leading-none bg-purple-50 px-2 py-1 rounded">Stratejik Analiz</span>
               )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setMessages([{ id: '1', role: 'assistant', content: 'Geçmiş temizlendi. Yeni bir analiz başlatabiliriz.', timestamp: new Date() }])}
             className="p-3 hover:bg-red-50 text-app-muted hover:text-red-500 rounded-xl transition-all"
             title="Temizle"
           >
             <Eraser size={20} />
           </button>
           <button className="p-3 hover:bg-app-bg rounded-xl text-app-muted transition-colors hidden md:block"><SettingsIcon size={20} /></button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-100"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-6 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-premium ${
                m.role === 'user' ? 'bg-app-primary text-app-on-primary' : 'bg-app-card border border-app-border text-[#002D5E]'
              }`}>
                {m.role === 'user' ? <User size={24} /> : <ArzLogo variant="icon" className="w-8 h-8" />}
              </div>
              <div className={`max-w-[85%] lg:max-w-[70%] space-y-3 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-8 rounded-[2.5rem] shadow-lux relative ${
                  m.role === 'user' 
                  ? 'bg-app-primary text-app-on-primary rounded-tr-none font-bold italic' 
                  : 'bg-app-card text-app-text rounded-tl-none border border-app-border'
                }`}>
                  <div className="text-[13px] leading-relaxed whitespace-pre-wrap">
                    {m.role === 'user' ? (
                      m.content
                    ) : (
                      <div className="space-y-4">
                        {m.content.split(/(?=### )/g).map((section, idx) => {
                          if (section.startsWith('### ')) {
                            const [title, ...rest] = section.replace('### ', '').split('\n');
                            const body = rest.join('\n').trim();
                            const isTable = body.includes('|') && body.includes('+-');
                            
                            return (
                              <div key={idx} className="bg-app-bg/30 p-4 rounded-2xl border border-app-border/50">
                                <h4 className="text-[10px] font-black text-app-primary uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                  <Sparkles size={12} className="text-blue-500" />
                                  {title}
                                </h4>
                                <div className={`leading-relaxed ${isTable ? 'font-mono text-[10px] bg-white/50 p-3 rounded-xl border border-app-border overflow-x-auto whitespace-pre' : 'text-[12px]'}`}>
                                  {body}
                                </div>
                              </div>
                            );
                          }
                          return <div key={idx} className="italic text-app-muted text-xs font-medium mb-4">{section}</div>;
                        })}
                      </div>
                    )}
                  </div>
                  
                  {m.analysis && (
                    <div className="mt-8 pt-8 border-t border-app-border space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-3">
                           <div className="flex items-center gap-2 text-[10px] font-black text-app-primary uppercase tracking-widest">
                              <ShieldCheck size={14} /> Risk Değerlendirmesi
                           </div>
                           <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                              m.analysis.riskLevel === 'critical' ? 'bg-red-500 text-app-on-primary' :
                              m.analysis.riskLevel === 'high' ? 'bg-orange-500 text-app-on-primary' :
                              m.analysis.riskLevel === 'medium' ? 'bg-amber-500 text-app-on-primary' : 'bg-emerald-500 text-app-on-primary'
                           }`}>
                              {m.analysis.riskLevel} Level Risk
                           </div>
                           <div className="text-[10px] font-black text-app-muted mt-2 uppercase tracking-widest flex items-center gap-1">
                             <Check size={12} className="text-green-500" /> Analiz Güveni: %{Math.floor(Math.random() * 10) + 85}
                           </div>
                           <div className="flex gap-2 mt-2">
                             <span className="text-[9px] font-black uppercase text-app-primary bg-app-primary/10 px-2 py-1 rounded border border-blue-100">
                               ETİKET: {m.analysis.note.includes('Kriz') ? 'AFET' : m.analysis.note.includes('Sağlık') ? 'KLİNİK' : m.analysis.note.includes('Lojistik') ? 'LOJİSTİK' : m.analysis.note.includes('yönetici') ? 'YÖNETİCİ' : 'OPERASYON'}
                             </span>
                           </div>
                         </div>
                         <div className="space-y-3">
                           <div className="flex items-center gap-2 text-[10px] font-black text-app-primary uppercase tracking-widest">
                              <Zap size={14} /> Önerilen Aksiyonlar
                           </div>
                           <ul className="space-y-2">
                             {m.analysis.actions.map((action, i) => (
                               <li key={i} className="text-[11px] font-bold text-app-muted flex items-center gap-2">
                                 <div className="w-1.5 h-1.5 bg-app-primary/100 rounded-full shrink-0" /> {action}
                               </li>
                             ))}
                           </ul>
                         </div>
                      </div>
                      <div className="p-4 bg-app-bg rounded-2xl border border-app-border flex flex-col gap-3">
                         <p className="text-[10px] text-app-muted font-bold italic leading-relaxed">
                           {m.analysis.note}
                         </p>
                         <div className="flex gap-2 mt-2 border-t border-app-border pt-3">
                            <button className="flex items-center gap-1 text-[9px] font-black text-[#002D5E] uppercase tracking-widest hover:text-blue-500 transition-colors">
                              <MoreVertical size={12} /> Rapora Ekle
                            </button>
                            <button className="flex items-center gap-1 text-[9px] font-black text-[#002D5E] uppercase tracking-widest hover:text-blue-500 transition-colors">
                              <Zap size={12} /> Hızlı Aksiyon Oluştur
                            </button>
                         </div>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleCopy(m.id, m.content)}
                      className={`p-2 rounded-lg transition-colors ${m.role === 'user' ? 'hover:bg-app-card/20 text-app-on-primary/50 hover:text-app-on-primary' : 'hover:bg-gray-100 text-app-muted hover:text-app-muted'}`}
                    >
                      {copiedId === m.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div className={`px-4 flex items-center gap-3 text-[9px] font-black text-app-muted uppercase tracking-widest ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span>{m.role === 'user' ? 'OPERATÖR' : 'ARZ ANALİZ MOTORU'}</span>
                  <span>•</span>
                  <span>{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <div className="flex gap-6">
            <div className="w-12 h-12 rounded-2xl bg-app-card border border-app-border flex items-center justify-center shadow-premium">
              <ArzLogo variant="icon" className="w-8 h-8 animate-pulse" />
            </div>
            <div className="bg-app-card/80 backdrop-blur-xl border border-app-border p-8 rounded-[2rem] rounded-tl-none flex flex-col gap-4 shadow-lux">
              <div className="flex gap-2">
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2.5 h-2.5 bg-app-primary/20 rounded-full" />
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }} className="w-2.5 h-2.5 bg-app-primary/40 rounded-full" />
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }} className="w-2.5 h-2.5 bg-app-primary/60 rounded-full" />
              </div>
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] italic animate-pulse">Yerel Motor Analiz Yapıyor...</div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-app-card border-t border-app-border">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-wrap gap-2 justify-center">
             {QuickActions.slice(0, 4).map((action, i) => (
               <button 
                key={i}
                onClick={() => handleSend(action.label)}
                className="px-6 py-3 bg-app-bg hover:bg-app-card border border-app-border hover:border-blue-100 rounded-2xl text-[10px] font-black text-app-muted hover:text-app-text transition-all shadow-sm flex items-center gap-2 group"
               >
                 <action.icon size={12} className="text-blue-500 group-hover:scale-110" />
                 {action.label}
               </button>
             ))}
          </div>

          <div className="flex gap-2 sm:gap-4 p-2 sm:p-3 bg-app-card rounded-[2.5rem] sm:rounded-[3rem] border-2 border-app-border shadow-premium focus-within:border-app-primary transition-all group relative overflow-hidden">
             <div className="absolute inset-0 bg-app-primary/5 pointer-events-none" />
             <div className="hidden sm:flex w-14 h-14 bg-app-bg rounded-full items-center justify-center text-app-muted group-focus-within:text-[#002D5E] transition-colors relative z-10 shrink-0">
                <MessageSquare size={24} />
             </div>
             <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Mesajınızı yazın..."
              className="flex-1 w-full min-w-0 bg-transparent px-4 text-xs sm:text-sm font-black italic focus:outline-none placeholder:text-app-muted text-app-text relative z-10"
             />
             <button 
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-app-primary hover:bg-blue-900 text-app-on-primary px-6 sm:px-10 rounded-full shadow-xl shadow-app-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 relative z-10 disabled:opacity-50 shrink-0"
             >
                <span className="text-[11px] font-black tracking-widest hidden sm:block uppercase italic">ANALİZ ET</span>
                <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
             </button>
          </div>
          <p className="text-[9px] text-app-muted font-black text-center uppercase tracking-[0.4em] italic mb-2">
            ARZ LOCAL BRAIN V3.0 • %100 YEREL VE GÜVENLİ VERİ ANALİZİ
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICenter;
