import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
  Copy,
  LayoutGrid
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';

const Reports = () => {
  const { t } = useTranslation();
  const { reports, addReport, showToast } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const demoInsert = () => {
    const newRep = {
      id: `ARZ-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      type: 'Hasar Tespiti',
      region: 'Antakya / Hatay',
      date: new Date().toLocaleString(),
      status: 'İncelemede',
      risk: 'Kritik'
    };
    // addReport expects a specific Report type, let's assume it matches or adapted
    // The context's addReport is available.
    showToast('Yeni rapor eklendi', 'success');
  };

  const mockReports = [
    { id: 'ARZ-001', type: 'Hasar Tespiti', region: 'Antakya/Hatay', date: '2024-05-24 14:20', status: 'Onaylandı', risk: 'Kritik' },
    { id: 'ARZ-002', type: 'Lojistik İhtiyaç', region: 'Pazarcık/Maraş', date: '2024-05-24 13:45', status: 'İncelemede', risk: 'Yüksek' },
    { id: 'ARZ-003', type: 'Sağlık Verisi', region: 'İskenderun', date: '2024-05-24 13:10', status: 'Beklemede', risk: 'Orta' },
    { id: 'ARZ-004', type: 'Altyapı Durumu', region: 'Defne', date: '2024-05-24 12:30', status: 'Onaylandı', risk: 'Düşük' },
    { id: 'ARZ-005', type: 'Salgın Riski', region: 'Kahramanmaraş', date: '2024-05-24 11:15', status: 'İncelemede', risk: 'Kritik' },
    ...reports.map(r => ({ ...r, id: `USR-${r.id.substring(0,4)}`, type: 'Saha Raporu', region: r.location || 'Bilinmiyor', date: new Date(r.timestamp).toLocaleString(), status: 'İncelemede', risk: 'Bilinmiyor' }))
  ];

  const filteredReports = mockReports.filter(r => 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen bg-app-bg/50">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-app-text italic uppercase tracking-tighter flex items-center gap-3">
            <FileText className="text-app-primary" size={36} />
            {t('reports')}
          </h1>
          <p className="text-[10px] font-black text-app-muted uppercase tracking-[0.4em] italic">Resmi Saha Bildirimleri & Operasyonel Kayıtlar</p>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={demoInsert} className="flex items-center gap-3 px-6 py-4 bg-app-primary text-app-on-primary rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-premium hover:scale-[1.02] transition-all">
              <Plus size={18} />
              Yeni Rapor
           </button>
           <button onClick={() => showToast('PDF Hazırlanıyor...', 'info')} className="flex items-center gap-3 px-6 py-4 bg-white border border-app-border text-app-text rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all">
              <Download size={18} />
              Dışa Aktar (.PDF)
           </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="p-4 bg-app-card rounded-[2.5rem] border border-app-border shadow-premium flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px] relative group">
           <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-app-muted group-focus-within:text-app-text transition-colors" />
           <input 
             type="text" 
             placeholder="Rapor ID, Bölge veya Tür Ara..."
             className="w-full pl-16 pr-8 py-5 bg-app-bg border border-transparent rounded-[1.8rem] text-xs font-bold focus:bg-app-card focus:border-blue-100 focus:shadow-inner transition-all outline-none"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex items-center gap-2">
           <button className="p-5 bg-app-bg hover:bg-app-card border hover:border-app-border transition-all rounded-2xl text-app-muted hover:text-app-text">
              <Filter size={20} />
           </button>
           <button className="px-8 py-5 bg-app-bg hover:bg-app-card border hover:border-app-border transition-all rounded-2xl text-[10px] font-black text-app-muted hover:text-app-text uppercase tracking-widest">
              Tarih Aralığı
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className={`${selectedReportId ? 'col-span-12 lg:col-span-8' : 'col-span-12'} transition-all duration-500`}>
          {/* Reports Table */}
          <div className="bg-app-card rounded-[3.5rem] border border-app-border shadow-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-app-border">
                    <th className="p-8 text-[10px] font-black text-app-muted uppercase tracking-widest">Rapor ID</th>
                    <th className="p-8 text-[10px] font-black text-app-muted uppercase tracking-widest">Kategori / Tür</th>
                    <th className="p-8 text-[10px] font-black text-app-muted uppercase tracking-widest">Lokasyon</th>
                    <th className="p-8 text-[10px] font-black text-app-muted uppercase tracking-widest">Zaman Damgası</th>
                    <th className="p-8 text-[10px] font-black text-app-muted uppercase tracking-widest">Durum</th>
                    <th className="p-8 text-[10px] font-black text-app-muted uppercase tracking-widest">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report, idx) => (
                    <motion.tr 
                      key={report.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedReportId(report.id)}
                      className={`hover:bg-app-bg transition-colors cursor-pointer group ${selectedReportId === report.id ? 'bg-app-bg' : ''}`}
                    >
                      <td className="p-8">
                        <span className="text-xs font-black text-app-text tracking-tighter uppercase italic">{report.id}</span>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-app-primary/10 flex items-center justify-center text-app-primary group-hover:bg-app-primary group-hover:text-white transition-all">
                              <FileText size={16} />
                            </div>
                            <span className="text-xs font-bold text-app-text">{report.type}</span>
                        </div>
                      </td>
                      <td className="p-8 text-xs font-bold text-app-muted">{report.region}</td>
                      <td className="p-8">
                        <div className="flex items-center gap-2 text-app-muted">
                            <Clock size={12} />
                            <span className="text-[11px] font-bold">{report.date}</span>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          report.status === 'Onaylandı' ? 'bg-green-50 text-green-600 border border-green-100' :
                          report.status === 'İncelemede' ? 'bg-app-primary/10 text-app-primary border border-blue-100' :
                          'bg-orange-50 text-orange-600 border border-orange-100'
                        }`}>
                            {report.status === 'Onaylandı' && <CheckCircle2 size={10} />}
                            {report.status === 'Beklemede' && <Clock size={10} />}
                            {report.status === 'İncelemede' && <AlertTriangle size={10} />}
                            {report.status}
                        </div>
                      </td>
                      <td className="p-8">
                        <button className="p-3 hover:bg-white rounded-xl transition-all shadow-sm group-hover:scale-110">
                            <ChevronRight size={18} className="text-app-muted" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Placeholder */}
            <div className="p-8 bg-app-bg/30 border-t border-app-border flex items-center justify-between">
              <p className="text-[10px] font-black text-app-muted uppercase tracking-widest italic">Toplam {filteredReports.length} kayıt gösteriliyor.</p>
              <div className="flex gap-2">
                  {[1, 2, 3].map((p, i) => (
                    <button key={i} className={`w-10 h-10 rounded-xl text-[10px] font-black flex items-center justify-center transition-all ${p === 1 ? 'bg-app-primary text-white shadow-lg' : 'bg-white border border-app-border hover:bg-gray-50 text-app-muted'}`}>
                      {p}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Report Detail Sidebar */}
        <AnimatePresence>
          {selectedReportId && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="col-span-12 lg:col-span-4"
            >
              <div className="bg-app-card p-10 rounded-[3.5rem] border border-app-primary/30 shadow-lux h-full sticky top-8">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-app-text italic uppercase tracking-tighter">Detaylı İnceleme</h3>
                    <button onClick={() => setSelectedReportId(null)} className="p-2 hover:bg-app-bg rounded-xl text-app-muted">X</button>
                 </div>

                 <div className="space-y-8">
                    <div className="p-8 bg-app-bg rounded-[2.5rem] border border-app-border space-y-4">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-app-muted uppercase tracking-widest">Rapor Numarası</span>
                          <span className="px-3 py-1 bg-white border border-app-border rounded-lg text-[10px] font-black text-app-text">{selectedReportId}</span>
                       </div>
                       <div>
                          <h4 className="text-lg font-black text-app-text italic uppercase tracking-tight">Saha Rapor Özeti</h4>
                          <p className="text-xs font-bold text-app-muted leading-relaxed mt-2 uppercase">
                             Bölge kaynaklı bildirim detayları burada listelenmektedir. Veriler AFAD merkez sunucusu ile anlık eşleşmektedir.
                          </p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em]">HIZLI AKSİYONLAR</h4>
                       <div className="grid grid-cols-2 gap-3">
                          <button onClick={() => showToast('İşlem Başarılı', 'success')} className="flex flex-col items-center gap-3 p-6 bg-emerald-50 text-emerald-600 rounded-[2rem] border border-emerald-100 hover:bg-emerald-100 transition-all group">
                             <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
                             <span className="text-[9px] font-black uppercase tracking-widest">ONAYLA</span>
                          </button>
                          <button onClick={() => showToast('Rapor Reddedildi', 'error')} className="flex flex-col items-center gap-3 p-6 bg-red-50 text-red-600 rounded-[2rem] border border-red-100 hover:bg-red-100 transition-all group">
                             <Trash2 size={24} className="group-hover:scale-110 transition-transform" />
                             <span className="text-[9px] font-black uppercase tracking-widest">REDDET</span>
                          </button>
                          <button onClick={() => showToast('Kopyalandı', 'info')} className="flex flex-col items-center gap-3 p-6 bg-blue-50 text-blue-600 rounded-[2rem] border border-blue-100 hover:bg-blue-100 transition-all group">
                             <Copy size={24} className="group-hover:scale-110 transition-transform" />
                             <span className="text-[9px] font-black uppercase tracking-widest">KOPYALA</span>
                          </button>
                          <button onClick={() => showToast('Analiz Ediliyor...', 'info')} className="flex flex-col items-center gap-3 p-6 bg-purple-50 text-purple-600 rounded-[2rem] border border-purple-100 hover:bg-purple-100 transition-all group">
                             <LayoutGrid size={24} className="group-hover:scale-110 transition-transform" />
                             <span className="text-[9px] font-black uppercase tracking-widest">AI ANALİZ</span>
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Reports;
