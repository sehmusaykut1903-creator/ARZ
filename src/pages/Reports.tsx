import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const mockReports = [
  { id: 'ARZ-001', type: 'Hasar Tespiti', region: 'Antakya/Hatay', date: '2024-05-24 14:20', status: 'Onaylandı', risk: 'Kritik' },
  { id: 'ARZ-002', type: 'Lojistik İhtiyaç', region: 'Pazarcık/Maraş', date: '2024-05-24 13:45', status: 'İncelemede', risk: 'Yüksek' },
  { id: 'ARZ-003', type: 'Sağlık Verisi', region: 'İskenderun', date: '2024-05-24 13:10', status: 'Beklemede', risk: 'Orta' },
  { id: 'ARZ-004', type: 'Altyapı Durumu', region: 'Defne', date: '2024-05-24 12:30', status: 'Onaylandı', risk: 'Düşük' },
  { id: 'ARZ-005', type: 'Salgın Riski', region: 'Kahramanmaraş', date: '2024-05-24 11:15', status: 'İncelemede', risk: 'Kritik' },
];

const Reports = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

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
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-3 px-6 py-4 bg-primary text-app-on-primary rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-premium hover:scale-[1.02] transition-all">
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

      {/* Reports Table */}
      <div className="bg-app-card rounded-[3.5rem] border border-app-border shadow-premium overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-app-border">
              <th className="p-8 text-[10px] font-black text-app-muted uppercase tracking-widest">Rapor ID</th>
              <th className="p-8 text-[10px] font-black text-app-muted uppercase tracking-widest">Kategori / Tür</th>
              <th className="p-8 text-[10px] font-black text-app-muted uppercase tracking-widest">Lokasyon</th>
              <th className="p-8 text-[10px] font-black text-app-muted uppercase tracking-widest">Zaman Damgası</th>
              <th className="p-8 text-[10px] font-black text-app-muted uppercase tracking-widest">Durum</th>
              <th className="p-8 text-[10px] font-black text-app-muted uppercase tracking-widest">Yönlendirme</th>
            </tr>
          </thead>
          <tbody>
            {mockReports.map((report, idx) => (
              <motion.tr 
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-app-bg/50 transition-colors cursor-pointer group"
              >
                <td className="p-8">
                  <span className="text-xs font-black text-app-text tracking-tighter uppercase italic">{report.id}</span>
                </td>
                <td className="p-8">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-app-primary/10 flex items-center justify-center text-app-text group-hover:bg-app-card transition-colors">
                         <FileText size={14} />
                      </div>
                      <span className="text-xs font-bold text-app-muted">{report.type}</span>
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
                     report.status === 'Onaylandı' ? 'bg-green-50 text-green-600' :
                     report.status === 'İncelemede' ? 'bg-app-primary/10 text-app-primary' :
                     'bg-orange-50 text-orange-600'
                   }`}>
                      {report.status === 'Onaylandı' && <CheckCircle2 size={10} />}
                      {report.status === 'Beklemede' && <Clock size={10} />}
                      {report.status === 'İncelemede' && <AlertTriangle size={10} />}
                      {report.status}
                   </div>
                </td>
                <td className="p-8">
                   <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors text-app-muted hover:text-app-text">
                      <ChevronRight size={18} />
                   </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Placeholder */}
        <div className="p-8 bg-app-bg/30 border-t border-app-border flex items-center justify-between">
           <p className="text-[10px] font-black text-app-muted uppercase tracking-widest italic">Toplam 1,248 kayıt gösteriliyor.</p>
           <div className="flex gap-2">
              {[1, 2, 3, '...', 12].map((p, i) => (
                <button key={i} className={`w-10 h-10 rounded-xl text-[10px] font-black flex items-center justify-center transition-all ${p === 1 ? 'bg-primary text-app-on-primary shadow-premium' : 'bg-app-card border hover:bg-app-bg text-app-muted'}`}>
                   {p}
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
