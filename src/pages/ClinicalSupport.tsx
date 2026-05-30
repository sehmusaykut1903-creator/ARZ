import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stethoscope, Heart, Activity, Thermometer, AlertCircle, Save, History, BrainCircuit, ActivitySquare, Pill, ClipboardList, ShieldAlert, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { getClinicalAdvice } from '../services/geminiService';
import { AIResponse } from '../types';

const ClinicalSupport = () => {
  const { t, i18n } = useTranslation();
  const { addPatient, patients } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  
  const [form, setForm] = useState({
    name: '',
    heartRate: '',
    bloodPressure: '',
    oxygenSaturation: '',
    temperature: '',
    symptoms: '',
    chronicDiseases: '',
    allergies: '',
    medicationHistory: ''
  });

  const handleAnalyze = async () => {
    if (!form.heartRate || !form.bloodPressure) return;
    setLoading(true);
    try {
      const result = await getClinicalAdvice(form);
      setAiResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!aiResult) return;
    const triageMap: Record<string, 'red' | 'yellow' | 'green' | 'black'> = {
      'critical': 'red',
      'high': 'red',
      'medium': 'yellow',
      'low': 'green'
    };

    addPatient({
      id: Date.now().toString(),
      vitals: {
        heartRate: parseInt(form.heartRate),
        bloodPressure: form.bloodPressure,
        oxygenSaturation: parseInt(form.oxygenSaturation),
        temperature: parseFloat(form.temperature),
      },
      symptoms: form.symptoms.split(','),
      allergies: form.allergies.split(','),
      triageColor: triageMap[aiResult.riskLevel] || 'green',
      lastEvaluation: Date.now()
    });
    
    setForm({ name: '', heartRate: '', bloodPressure: '', oxygenSaturation: '', temperature: '', symptoms: '', chronicDiseases: '', allergies: '', medicationHistory: '' });
    setAiResult(null);
  };

  const triageColors = {
    critical: 'bg-[#ED1C24] shadow-[#ED1C24]/20',
    high: 'bg-orange-500 shadow-orange-500/20',
    medium: 'bg-yellow-500 shadow-yellow-500/20',
    low: 'bg-[#10B981] shadow-[#10B981]/20',
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pb-10">
      <div className="xl:col-span-12">
         <div className="bg-app-card p-6 rounded-3xl border border-app-border shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-app-primary/10 rounded-2xl">
                 <Stethoscope className="text-[#003366]" size={28} />
              </div>
              <div>
                 <h1 className="text-2xl font-black text-[#003366] tracking-tight">{t('clinical')}</h1>
                 <p className="text-[10px] text-app-muted font-extrabold uppercase tracking-widest mt-0.5">{t('clinical_subtitle')}</p>
              </div>
            </div>
            <div className="flex gap-2">
               <div className="bg-app-primary/10 text-[#003366] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">Aktif Protokol: V2.4</div>
               <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100">Kritik Mod: ON</div>
            </div>
         </div>
      </div>

      {/* Form Section */}
      <div className="xl:col-span-5 space-y-6">
        <div className="bg-app-card p-8 rounded-[2.5rem] shadow-xl border border-app-border space-y-8">
          <div className="space-y-6">
            <h3 className="text-sm font-black text-[#003366] uppercase tracking-[0.2em]">{t('data_entry')}</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-app-muted uppercase tracking-widest">{t('pulse')}</label>
                <div className="relative group">
                  <Heart className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400 transition-transform group-focus-within:scale-110" size={18} />
                  <input 
                    type="number"
                    value={form.heartRate}
                    onChange={e => setForm({...form, heartRate: e.target.value})}
                    className="w-full bg-app-bg border border-app-border rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:bg-app-card outline-none transition-all"
                    placeholder="80"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-app-muted uppercase tracking-widest">{t('blood_pressure')}</label>
                <div className="relative group">
                  <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 transition-transform group-focus-within:scale-110" size={18} />
                  <input 
                    type="text"
                    value={form.bloodPressure}
                    onChange={e => setForm({...form, bloodPressure: e.target.value})}
                    className="w-full bg-app-bg border border-app-border rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:bg-app-card outline-none transition-all"
                    placeholder="120/80"
                  />
                </div>
              </div>
               <div className="space-y-2">
                <label className="text-[10px] font-black text-app-muted uppercase tracking-widest">{t('spo2')}</label>
                <div className="relative group">
                  <ActivitySquare className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 transition-transform group-focus-within:scale-110" size={18} />
                  <input 
                    type="number"
                    value={form.oxygenSaturation}
                    onChange={e => setForm({...form, oxygenSaturation: e.target.value})}
                    className="w-full bg-app-bg border border-app-border rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:bg-app-card outline-none transition-all"
                    placeholder="98"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-app-muted uppercase tracking-widest">{t('temperature_label')}</label>
                <div className="relative group">
                  <Thermometer className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 transition-transform group-focus-within:scale-110" size={18} />
                  <input 
                    type="number"
                    step="0.1"
                    value={form.temperature}
                    onChange={e => setForm({...form, temperature: e.target.value})}
                    className="w-full bg-app-bg border border-app-border rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:bg-app-card outline-none transition-all"
                    placeholder="36.5"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-app-border">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-app-muted uppercase tracking-widest">{t('chronic_diseases')}</label>
                <div className="relative">
                   <ClipboardList className="absolute left-4 top-4 text-app-muted" size={18} />
                   <textarea 
                    value={form.chronicDiseases}
                    onChange={e => setForm({...form, chronicDiseases: e.target.value})}
                    rows={2}
                    className="w-full bg-app-bg border border-app-border rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:bg-app-card outline-none transition-all resize-none"
                    placeholder={i18n.language === 'tr' ? 'Diyabet, HT, KOAH...' : 'Diabetes, HT, COPD...'}
                  />
                </div>
              </div>

               <div className="space-y-2">
                <label className="text-[10px] font-black text-app-muted uppercase tracking-widest">{t('medication_history')}</label>
                <div className="relative">
                   <Pill className="absolute left-4 top-4 text-app-muted" size={18} />
                   <textarea 
                    value={form.medicationHistory}
                    onChange={e => setForm({...form, medicationHistory: e.target.value})}
                    rows={2}
                    className="w-full bg-app-bg border border-app-border rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:bg-app-card outline-none transition-all resize-none"
                    placeholder={i18n.language === 'tr' ? 'Kullandığı kritik ilaçlar...' : 'Critical medications...'}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={handleAnalyze}
              disabled={loading}
              className="flex-1 bg-[#001F3D] hover:bg-black text-app-on-primary px-6 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-app-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <BrainCircuit size={20} className="group-hover:rotate-12 transition-transform" />}
              {t('ai_analysis_bt')}
            </button>
            {aiResult && (
              <button 
                onClick={handleSave}
                className="bg-[#10B981] hover:bg-[#059669] text-app-on-primary px-8 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-green-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <Save size={20} />
                {t('approve')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Result Section */}
      <div className="xl:col-span-7 space-y-8">
        <h2 className="text-xl font-black text-[#003366] flex items-center gap-3 tracking-tight italic">
          <ShieldAlert className="text-[#ED1C24]" size={24} />
          {t('ai_analysis_title_clinical')}
        </h2>

        {aiResult ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative bg-app-card rounded-[2.5rem] border-l-[16px] border border-app-border p-8 shadow-2xl overflow-hidden ${
              aiResult.riskLevel === 'critical' || aiResult.riskLevel === 'high' ? 'border-l-[#ED1C24]' : 'border-l-blue-500'
            }`}
          >
            <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-app-bg rounded-full blur-3xl opacity-50" />
            
            <div className="relative z-10 space-y-8">
               <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em] mb-2 block">{t('recommended_triage')}</span>
                    <h3 className={`text-4xl font-black italic uppercase tracking-tighter ${
                      aiResult.riskLevel === 'critical' ? 'text-[#ED1C24]' : 'text-[#003366]'
                    }`}>
                      {aiResult.summary}
                    </h3>
                  </div>
                  <div className={`p-4 rounded-3xl shadow-xl ${triageColors[aiResult.riskLevel as keyof typeof triageColors]} flex flex-col items-center justify-center text-app-on-primary`}>
                     <Activity size={32} className="animate-pulse" />
                     <span className="text-[9px] font-black mt-1 uppercase tracking-widest">Live Scan</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-app-muted uppercase tracking-widest border-b border-app-border pb-2">{t('clinical_analysis')}</p>
                    <p className="text-sm text-app-muted leading-relaxed font-bold italic">"{aiResult.analysis}"</p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-app-muted uppercase tracking-widest border-b border-app-border pb-2">{t('emergency_actions')}</p>
                    <div className="space-y-2">
                       {aiResult.actions.map((act, i) => (
                         <div key={i} className="bg-app-bg p-3 rounded-xl border border-app-border flex items-center gap-3">
                            <div className="w-6 h-6 bg-[#001F3D] text-app-on-primary rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 shadow-lg">{i+1}</div>
                            <span className="text-xs font-black text-[#003366]">{act}</span>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>

               {aiResult.clinicalNotes && (
                 <div className="p-6 bg-app-primary/10/50 rounded-2xl border border-blue-100 shadow-inner">
                    <div className="flex items-center gap-2 mb-3">
                       <Zap size={16} className="text-app-primary fill-blue-600" />
                       <span className="text-[10px] font-black text-app-primary uppercase tracking-widest">DR. AI PROFESYONEL NOTU</span>
                    </div>
                    <p className="text-xs text-app-text font-bold leading-relaxed">{aiResult.clinicalNotes}</p>
                 </div>
               )}
            </div>
          </motion.div>
        ) : (
          <div className="bg-app-card p-20 rounded-[3rem] border-2 border-dashed border-app-border flex flex-col items-center justify-center text-center group transition-all hover:bg-app-bg">
             <div className="w-24 h-24 bg-gray-100 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <BrainCircuit className="text-app-muted" size={48} />
             </div>
             <p className="text-app-muted font-black italic uppercase tracking-widest text-sm leading-relaxed">
               {t('enter_vitals_to_analyze')}<br/>
               <span className="text-[10px] not-italic opacity-60">LMM CORE 1.5 IS READY</span>
             </p>
          </div>
        )}

        {/* History Area */}
        <div className="bg-app-card rounded-[2.5rem] border border-app-border shadow-sm overflow-hidden h-[400px] flex flex-col">
           <div className="p-6 bg-[#003366] text-app-on-primary flex justify-between items-center shrink-0">
              <h3 className="text-xs font-black uppercase tracking-[0.2em]">{t('recent_evaluations')}</h3>
              <History size={16} className="opacity-50" />
           </div>
           <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-gray-50">
              {patients.length === 0 && (
                <div className="p-10 text-center text-app-muted text-xs font-bold uppercase tracking-widest italic">{t('no_records')}</div>
              )}
              {patients.map(p => (
                <div key={p.id} className="p-5 flex items-center justify-between hover:bg-app-bg transition-colors group">
                   <div className="flex items-center gap-5">
                      <div className={`w-3 h-14 rounded-full ${
                        p.triageColor === 'red' ? 'bg-[#ED1C24]' : 
                        p.triageColor === 'yellow' ? 'bg-yellow-500' : 'bg-[#10B981]'
                      } shadow-lg transition-transform group-hover:scale-x-125`} />
                      <div>
                        <div className="text-sm font-black text-[#003366] tracking-tight mb-1 lowercase">
                           bpm: <span className="text-app-muted uppercase">{p.vitals.heartRate}</span> • tansiyon: <span className="text-app-muted uppercase">{p.vitals.bloodPressure}</span>
                        </div>
                        <div className="text-[9px] text-app-muted font-black uppercase tracking-widest">{new Date(p.lastEvaluation).toLocaleTimeString()} • {new Date(p.lastEvaluation).toLocaleDateString()}</div>
                      </div>
                   </div>
                   <div className="flex gap-1">
                      {p.symptoms.slice(0, 3).map((s, i) => (
                        <div key={i} className="bg-gray-100 px-2 py-1 rounded text-[8px] font-black text-app-muted uppercase tracking-tighter">{s}</div>
                      ))}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalSupport;
