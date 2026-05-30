import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Package, Plus, Search, Filter, ArrowRight, CheckCircle2, Clock, ThermometerSnowflake, Route, Navigation, ShieldAlert, BarChart3, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const Logistics = () => {
  const { t, i18n } = useTranslation();
  const { logistics, addShipment, shipments, updateLogistics, isOnline, showToast } = useAppContext();
  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newShipment, setNewShipment] = useState({
    origin: '',
    destination: '',
    vehicleType: 'TIR',
    plate: '',
    driver: '',
    content: '',
    amount: '',
    unit: 'Ton',
    priority: 'high',
    departureTime: '',
    estimatedArrival: '',
    isColdChain: false,
    notes: ''
  });

  const categories = [
    { id: 'water', label: i18n.language === 'tr' ? 'Su' : 'Water' },
    { id: 'food', label: i18n.language === 'tr' ? 'Gıda' : 'Food' },
    { id: 'medicine', label: i18n.language === 'tr' ? 'İlaç' : 'Medicine' },
    { id: 'equipment', label: i18n.language === 'tr' ? 'Ekipman' : 'Equipment' },
    { id: 'shelter', label: i18n.language === 'tr' ? 'Barınma' : 'Shelter' }
  ];

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShipment.origin || !newShipment.destination || !newShipment.content) {
      showToast(i18n.language === 'tr' ? 'Lütfen zorunlu alanları doldurun' : 'Please fill required fields', 'error');
      return;
    }

    const shipmentId = 'S' + (shipments.length + 1).toString().padStart(3, '0');
    
    addShipment({
      id: shipmentId,
      origin: newShipment.origin,
      destination: newShipment.destination,
      content: newShipment.content,
      vehicleType: newShipment.vehicleType,
      departureTime: newShipment.departureTime ? new Date(newShipment.departureTime).getTime() : Date.now(),
      status: 'pending',
      priority: newShipment.priority as any
    });

    showToast(i18n.language === 'tr' ? 'Sevkiyat Başarıyla Oluşturuldu' : 'Shipment Created Successfully', 'success');
    setShowAddForm(false);
    setNewShipment({
      origin: '',
      destination: '',
      vehicleType: 'TIR',
      plate: '',
      driver: '',
      content: '',
      amount: '',
      unit: 'Ton',
      priority: 'high',
      departureTime: '',
      estimatedArrival: '',
      isColdChain: false,
      notes: ''
    });
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-app-primary/10 rounded-2xl">
              <Truck className="text-[#003366]" size={28} />
           </div>
           <div>
              <h1 className="text-2xl font-black text-[#003366] tracking-tight">{t('logistics')}</h1>
              <p className="text-[10px] text-app-muted font-extrabold uppercase tracking-widest mt-0.5">{t('logistics_subtitle')}</p>
           </div>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-[#001F3D] hover:bg-black text-app-on-primary px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-app-primary/20 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          <span>{t('new_shipment')}</span>
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-app-bg rounded-[3rem] shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="bg-[#001F3D] p-8 text-app-on-primary">
                <h3 className="text-2xl font-black italic uppercase tracking-tight">{t('add_shipment')}</h3>
                <p className="text-[10px] text-blue-200/60 font-bold uppercase tracking-widest mt-1">{t('shipment_planning_form')}</p>
              </div>
              <form onSubmit={handleCreateShipment} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-app-muted uppercase tracking-widest ml-1">{t('origin')}</label>
                    <input 
                      required
                      value={newShipment.origin}
                      onChange={(e) => setNewShipment({...newShipment, origin: e.target.value})}
                      className="w-full bg-app-card border border-app-border rounded-2xl py-3 px-5 text-sm font-bold focus:ring-2 focus:ring-app-primary/20 outline-none" 
                      placeholder="Örn: Ankara" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-app-muted uppercase tracking-widest ml-1">{t('destination')}</label>
                    <input 
                      required
                      value={newShipment.destination}
                      onChange={(e) => setNewShipment({...newShipment, destination: e.target.value})}
                      className="w-full bg-app-card border border-app-border rounded-2xl py-3 px-5 text-sm font-bold focus:ring-2 focus:ring-app-primary/20 outline-none" 
                      placeholder="Örn: Hatay" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-app-muted uppercase tracking-widest ml-1">{t('vehicle_type')}</label>
                    <select 
                      value={newShipment.vehicleType}
                      onChange={(e) => setNewShipment({...newShipment, vehicleType: e.target.value})}
                      className="w-full bg-app-card border border-app-border rounded-2xl py-3 px-5 text-sm font-bold focus:ring-2 focus:ring-app-primary/20 outline-none"
                    >
                      <option value="TIR">TIR</option>
                      <option value="Kamyon">Kamyon</option>
                      <option value="Helikopter">Helikopter</option>
                      <option value="Gemi">Gemi</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-app-muted uppercase tracking-widest ml-1">{t('plate')}</label>
                    <input 
                      value={newShipment.plate}
                      onChange={(e) => setNewShipment({...newShipment, plate: e.target.value})}
                      className="w-full bg-app-card border border-app-border rounded-2xl py-3 px-5 text-sm font-bold focus:ring-2 focus:ring-app-primary/20 outline-none" 
                      placeholder="06 ARZ 1903" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-app-muted uppercase tracking-widest ml-1">{t('content')}</label>
                    <input 
                      required
                      value={newShipment.content}
                      onChange={(e) => setNewShipment({...newShipment, content: e.target.value})}
                      className="w-full bg-app-card border border-app-border rounded-2xl py-3 px-5 text-sm font-bold focus:ring-2 focus:ring-app-primary/20 outline-none" 
                      placeholder="Gıda, İlaç, Battaniye vb." 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-app-muted uppercase tracking-widest ml-1">{t('priority')}</label>
                    <select 
                      value={newShipment.priority}
                      onChange={(e) => setNewShipment({...newShipment, priority: e.target.value})}
                      className="w-full bg-app-card border border-app-border rounded-2xl py-3 px-5 text-sm font-bold focus:ring-2 focus:ring-app-primary/20 outline-none"
                    >
                      <option value="urgent">{t('status.critical')}</option>
                      <option value="high">{t('status.high')}</option>
                      <option value="medium">{t('status.medium')}</option>
                      <option value="low">{t('status.low')}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-app-muted uppercase tracking-widest ml-1">{t('departure_time')}</label>
                    <input 
                      type="datetime-local"
                      value={newShipment.departureTime}
                      onChange={(e) => setNewShipment({...newShipment, departureTime: e.target.value})}
                      className="w-full bg-app-card border border-app-border rounded-2xl py-3 px-5 text-sm font-bold focus:ring-2 focus:ring-app-primary/20 outline-none" 
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-4 bg-gray-100 text-app-muted rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                  >
                    {t('cancel')}
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-[#ED1C24] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-red-500/20"
                  >
                    {t('add_shipment')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Mini List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-app-card p-6 rounded-[2rem] border border-app-border shadow-sm space-y-4">
            <h3 className="text-[10px] font-black text-app-muted uppercase tracking-widest">{t('inventory_filter')}</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setFilter('all')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-[#001F3D] text-app-on-primary shadow-lg' : 'hover:bg-app-bg text-app-muted'}`}
              >
                {t('filter_all')}
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === cat.id ? 'bg-[#001F3D] text-app-on-primary shadow-lg' : 'hover:bg-app-bg text-app-muted'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#001F3D] rounded-[2.5rem] p-8 text-app-on-primary relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Route size={80} className="rotate-12" />
            </div>
            <div className="relative z-10 space-y-6">
               <div className="flex items-center gap-2">
                  <div className="bg-app-card/10 p-2.5 rounded-xl">
                    <Navigation size={20} className="text-blue-400" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em]">{i18n.language === 'tr' ? 'ROTA ÖNERİSİ' : 'ROUTE SUGGESTION'}</h3>
               </div>
               <p className="text-[10px] text-blue-200/60 font-black tracking-widest leading-relaxed uppercase">
                 AI: M7 OTOYOLU KAPALI. <br/><span className="text-app-on-primary">K3 KÖY YOLU ÜZERİNDEN SEVKİYAT YAPIN.</span>
               </p>
               <button 
                  onClick={() => showToast(i18n.language === 'tr' ? 'Alternatif Rota Haritaya Uygulandı' : 'Alternative Route Applied to Map', 'info')}
                  className="w-full bg-[#ED1C24] text-app-on-primary py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-500/20 group-hover:scale-105 transition-transform"
               >
                  ROTAYI UYGULA
               </button>
            </div>
          </div>
        </div>

        {/* Main List */}
        <div className="lg:col-span-9 space-y-6">
           {/* Search and Quick Metrics */}
          {!isOnline && (
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-4 text-orange-700">
              <RefreshCcw size={20} className="animate-spin" />
              <div className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                Çevrimdışı Çalışıyorsunuz. Güncellemeler sunucu aktif olunca senkronize edilecektir.
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-app-card p-3 rounded-2xl border border-app-border flex items-center gap-4 px-6 shadow-sm">
               <Search size={18} className="text-app-muted" />
               <input placeholder={t('search_shipment_placeholder')} className="w-full text-sm font-black uppercase tracking-widest outline-none bg-transparent placeholder:text-app-muted" />
            </div>
            <div className="bg-blue-900 p-2 rounded-2xl border border-blue-800 flex items-center justify-around">
               <div className="flex items-center gap-2">
                  <Package size={14} className="text-blue-400" />
                  <span className="text-[9px] font-black text-app-on-primary uppercase">{t('active_shipments')}: 24</span>
               </div>
               <div className="w-[1px] h-4 bg-app-card/10" />
                <div className="flex items-center gap-2">
                  <BarChart3 size={14} className="text-blue-400" />
                  <span className="text-[9px] font-black text-app-on-primary uppercase">{t('delivered_shipments')}: 142</span>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            {logistics.filter(l => filter === 'all' || l.category === filter).map((item) => (
              <motion.div 
                layout
                key={item.id}
                className="bg-app-card p-6 rounded-[2rem] border border-app-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all group overflow-hidden relative"
              >
                {/* Cold Chain Warning Overlay */}
                {item.category === 'medicine' && (
                  <div className="absolute top-0 right-0 px-6 py-1 bg-app-primary/100 text-app-on-primary text-[8px] font-black uppercase tracking-widest rounded-bl-xl flex items-center gap-1 shadow-md">
                    <ThermometerSnowflake size={10} /> {t('cold_chain')}
                  </div>
                )}

                <div className="flex items-center gap-6 relative z-10">
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                    item.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-app-primary/10 text-[#003366]'
                  }`}>
                    <Package size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-black text-[#003366] text-lg leading-tight uppercase italic">{item.category}</h4>
                      <span className="text-[9px] bg-gray-100 px-2 py-1 rounded-lg text-app-muted font-extrabold tracking-widest uppercase">ID-{item.id.padStart(4, '0')}</span>
                    </div>
                    <div className="flex gap-4">
                       <span className="text-[10px] text-app-muted font-black uppercase tracking-widest">{t('status')}: {item.quantity} {item.unit}</span>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${item.priority === 'urgent' ? 'text-[#ED1C24]' : 'text-blue-500'}`}>ÖNCELİK: {item.priority}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 relative z-10">
                  <div className="hidden xl:block">
                    <div className="flex items-center gap-2 text-[9px] font-black text-app-muted uppercase tracking-widest mb-1">
                      <Clock size={12} />
                      {t('last_update')}
                    </div>
                    <p className="text-xs text-[#003366] font-black">{i18n.language === 'tr' ? 'Bugün, 14:30' : 'Today, 14:30'}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${
                      item.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-orange-50 text-orange-700 border border-orange-100'
                    }`}>
                      {item.status === 'delivered' ? <CheckCircle2 size={16} /> : <div className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse" />}
                      {item.status}
                    </div>
                    
                    {item.status === 'pending' && (
                      <button 
                        onClick={() => updateLogistics(item.id, { status: 'shipped' })}
                        className="p-3.5 bg-app-bg border border-app-border rounded-2xl text-app-muted hover:text-[#001F3D] hover:bg-[#001F3D]/5 hover:border-[#001F3D]/20 transition-all active:scale-90"
                      >
                        <ArrowRight size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-[#ED1C24]/5 border border-[#ED1C24]/10 p-6 rounded-[2.5rem] flex items-center gap-6">
             <div className="p-4 bg-[#ED1C24] rounded-2xl shadow-xl shadow-red-500/20 shrink-0">
                <ShieldAlert size={24} className="text-app-on-primary" />
             </div>
             <div>
                <h4 className="text-xs font-black text-[#ED1C24] uppercase tracking-widest">{t('status.critical')}</h4>
                <p className="text-xs text-app-muted font-bold mt-1">{i18n.language === 'tr' ? 'Soğuk zincir tırlarında sıcaklık dalgalanması tespit edildi. AI: Hemen kontrol sinyali gönderildi.' : 'Temperature fluctuation detected in cold chain trucks. AI: Control signal sent immediately.'}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logistics;
