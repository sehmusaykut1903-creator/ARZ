const fs = require('fs');
const content = `import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Globe2, 
  MapPin, 
  Layers, 
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  Crosshair,
  Map as MapIcon,
  Navigation,
  ShieldAlert,
  Info,
  Zap,
  Activity as Pulse,
  Minimize2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Settings2,
  Wind,
  Flame,
  Droplets,
  CloudLightning,
  Mountain,
  Sun,
  Truck,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { mockProvinces } from '../data/mockProvinces';
import { ProvinceData } from '../types';

// Fix for Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const getIcon = (riskLevel: string, isMultiple: boolean = false) => {
  const color = isMultiple ? '#7C3AED' : // Purple
                riskLevel === 'critical' ? '#EF4444' : // Red
                riskLevel === 'high' ? '#F97316' : // Orange
                riskLevel === 'medium' ? '#FACC15' : // Yellow
                '#10B981'; // Green (low)

  return L.divIcon({
    className: 'custom-div-icon',
    html: \`
      <div class="relative flex items-center justify-center">
        <div class="absolute w-12 h-12 bg-[\${color}] opacity-[0.15] rounded-full animate-ping"></div>
        <div class="absolute w-8 h-8 bg-[\${color}] opacity-[0.25] rounded-full"></div>
        <div class="relative w-6 h-6 bg-[\${color}] border-2 border-white rounded-full shadow-lg flex items-center justify-center">
          <div class="w-2 h-2 bg-white rounded-full shadow-sm"></div>
        </div>
      </div>
    \`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

const MapModule = () => {
  const { t } = useTranslation();
  const { mapSettings, setMapSettings } = useAppContext();
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.9334, 32.8597]); // Ankara
  const [zoom, setZoom] = useState(6);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  
  // Custom layer types 
  const disasterTypes = [
    { id: 'general', label: 'Genel', icon: MapIcon },
    { id: 'earthquake', label: 'Deprem', icon: Activity },
    { id: 'flood', label: 'Sel', icon: Droplets },
    { id: 'fire', label: 'Yangın', icon: Flame },
    { id: 'landslide', label: 'Heyelan', icon: Mountain },
    { id: 'avalanche', label: 'Çığ', icon: Mountain },
    { id: 'storm', label: 'Fırtına', icon: Wind },
    { id: 'drought', label: 'Kuraklık', icon: Sun },
    { id: 'epidemic', label: 'Salgın', icon: Pulse },
    { id: 'logistics', label: 'Lojistik', icon: Truck },
  ];

  const getTileUrl = () => {
    switch (mapSettings.mapStyle) {
      case 'satellite': return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'light': return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      case 'dark': return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      case 'high_contrast': return 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
      case 'operation':
      case 'standard':
      default: 
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    }
  };

  const showMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setMapCenter([pos.coords.latitude, pos.coords.longitude]);
        setZoom(10);
      });
    }
  };

  const handleAiAnalysis = (province: ProvinceData) => {
    setIsAiAnalyzing(true);
    setAiResult(null);
    setTimeout(() => {
      setAiResult(province.aiSuggestion);
      setIsAiAnalyzing(false);
    }, 1500);
  };

  const displayProvinces = mockProvinces.filter(p => {
    if (mapSettings.disasterType === 'general') return true;
    return p.activeDisasters.includes(mapSettings.disasterType);
  });

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-50 gap-4">
      {/* Top Header */}
      <div className="bg-white p-4 px-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between shrink-0 z-10 w-full overflow-hidden">
        <div className="flex items-center gap-3 shrink-0 mr-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
             <MapIcon size={20} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-black text-primary uppercase tracking-wider">{t('map', 'AFET HARİTASI')}</h1>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
              <span>CANLI YAYIN VERİSİ</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> GÜNCEL</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          {disasterTypes.map(type => {
            const isActive = mapSettings.disasterType === type.id;
            return (
              <button 
                key={type.id}
                onClick={() => setMapSettings({ disasterType: type.id as any })}
                className={\`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap \${
                  isActive ? 'bg-[#002D5E] text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }\`}
              >
                <type.icon size={14} />
                {type.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 relative">
        {/* Left Side Mapping / Filters */}
        <div className="w-full lg:w-[280px] bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col shrink-0 overflow-hidden z-10 lg:h-full">
          <div className="p-5 border-b border-gray-50 text-center lg:text-left">
             <h3 className="text-xs font-black text-primary uppercase tracking-widest flex items-center justify-center lg:justify-start gap-2"><Layers size={14} /> KATMANLAR</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-hidden gap-2 lg:gap-0">
            {['earthquake', 'flood', 'fire', 'landslide', 'avalanche', 'storm', 'drought', 'epidemic', 'logistics', 'helpPoints'].map(layer => {
               const isActive = mapSettings.activeLayers.includes(layer);
               return (
                 <button 
                   key={layer}
                   onClick={() => {
                     setMapSettings({ 
                       activeLayers: isActive 
                         ? mapSettings.activeLayers.filter(l => l !== layer)
                         : [...mapSettings.activeLayers, layer]
                     })
                   }}
                   className={\`w-auto lg:w-full flex-shrink-0 lg:flex-shrink flex items-center justify-between p-3 rounded-2xl transition-all border gap-4 lg:gap-0 \${
                     isActive ? 'bg-blue-50/50 border-blue-100 text-blue-700' : 'bg-white border-gray-100/50 text-gray-500 hover:bg-gray-50'
                   }\`}
                 >
                   <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{t(layer, layer)} Katmanı</span>
                   <div className={\`hidden lg:block w-8 h-4 rounded-full p-0.5 transition-colors \${isActive ? 'bg-blue-600' : 'bg-gray-200'}\`}>
                     <div className={\`w-3 h-3 bg-white rounded-full transition-transform \${isActive ? 'translate-x-4' : 'translate-x-0'}\`} />
                   </div>
                 </button>
               )
            })}
          </div>
        </div>

        {/* Main Map Content */}
        <div className="flex-1 relative rounded-[3rem] overflow-hidden shadow-premium border border-gray-200 z-0 h-[400px] lg:h-auto" style={{ filter: \`brightness(\${mapSettings.brightness}%) contrast(\${mapSettings.contrast}%)\` }}>
          <MapContainer 
            center={mapCenter} 
            zoom={zoom} 
            style={{ height: '100%', width: '100%', background: '#F8FAFC' }}
            zoomControl={false}
          >
            <TileLayer url={getTileUrl()} />
            <MapController center={mapCenter} zoom={zoom} />
            
            {displayProvinces.map((p) => {
              // Hide province if its active disasters don't match any of the active layers (only in general mode)
              if (p.activeDisasters.length > 0 && !p.activeDisasters.some(d => mapSettings.activeLayers.includes(d)) && mapSettings.disasterType === 'general') return null;
              
              return (
                <Marker 
                  key={p.id} 
                  position={p.coords}
                  icon={getIcon(p.riskLevel, p.activeDisasters.length > 1)}
                  eventHandlers={{
                    click: () => {
                       setSelectedProvince(p);
                       setMapCenter(p.coords);
                       setZoom(10);
                    },
                  }}
                >
                  <Popup className="premium-popup">
                    <div className="p-4 min-w-[220px] bg-white rounded-3xl">
                      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-50">
                         <ShieldAlert size={16} className={\`\${
                            p.riskLevel === 'critical' ? 'text-red-500' : 
                            p.riskLevel === 'high' ? 'text-orange-500' : 
                            'text-emerald-500'
                         }\`} />
                         <div className="text-xs font-black text-primary uppercase italic">{p.name}</div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-gray-400 font-bold uppercase">RİSK</span>
                          <span className={\`text-[9px] font-black uppercase px-2 py-0.5 rounded \${
                            p.riskLevel === 'critical' ? 'bg-red-50 text-red-600' : 
                            p.riskLevel === 'high' ? 'bg-orange-50 text-orange-600' : 
                            'bg-emerald-50 text-emerald-600'
                          }\`}>{p.riskLevel}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-gray-400 font-bold uppercase">BİLDİRİM</span>
                          <span className="text-[9px] font-black text-gray-700">{p.activeReportsCount}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                           e.stopPropagation();
                           setSelectedProvince(p);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest"
                      >
                        <Info size={12} />
                        DETAYLARI GÖR
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
            <div className="bg-white/90 backdrop-blur-xl p-1.5 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-1">
              <button onClick={() => setZoom(prev => Math.min(prev + 1, 18))} className="p-2.5 hover:bg-gray-100 rounded-xl text-primary transition-all active:scale-95"><ZoomIn size={16} /></button>
              <button onClick={() => setZoom(prev => Math.max(prev - 1, 4))} className="p-2.5 hover:bg-gray-100 rounded-xl text-primary transition-all active:scale-95"><ZoomOut size={16} /></button>
              <div className="h-[1px] w-full bg-gray-100 my-1" />
              <button onClick={showMyLocation} className="p-2.5 hover:bg-gray-100 rounded-xl text-primary transition-all active:scale-95"><Crosshair size={16} /></button>
            </div>
          </div>
        </div>

        {/* Right Info Panel Overlay */}
        <AnimatePresence>
          {selectedProvince && (
            <motion.div 
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-full sm:w-[350px] bg-white rounded-[3rem] border-l border-gray-100 shadow-[0_0_50px_rgba(0,0,0,0.1)] flex flex-col z-[1010] overflow-hidden"
            >
              <div className="bg-gradient-to-br from-[#002D5E] to-[#001F3D] p-8 text-white relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <button 
                   onClick={() => setSelectedProvince(null)}
                   className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                >
                  <ChevronRight size={20} />
                </button>
                <h2 className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em]">{selectedProvince.region} BÖLGESİ</h2>
                <h1 className="text-3xl font-black italic tracking-tighter mt-1">{selectedProvince.name}</h1>
                <div className="flex gap-2 mt-5 flex-wrap">
                  {selectedProvince.activeDisasters.map(d => (
                    <span key={d} className="px-3 py-1.5 bg-white/10 border border-white/20 text-[9px] font-black uppercase tracking-widest rounded-xl">
                      {t(d, d)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50/50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
                    <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest flex items-center justify-between">RİSK SKORU <Activity size={12} className="text-gray-300" /></div>
                    <div className={\`text-3xl font-black mt-3 \${
                      selectedProvince.riskScore > 80 ? 'text-red-500' : 
                      selectedProvince.riskScore > 50 ? 'text-orange-500' : 'text-emerald-500'
                    }\`}>{selectedProvince.riskScore}</div>
                  </div>
                  <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
                    <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest flex items-center justify-between">BİLDİRİM <MapPin size={12} className="text-gray-300" /></div>
                    <div className="text-2xl font-black text-gray-800 mt-3">{selectedProvince.activeReportsCount}</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                  <div>
                    <h4 className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1.5 flex items-center gap-2"><Navigation size={12}/> YOL DURUMU</h4>
                    <p className="text-xs font-bold text-gray-800">{selectedProvince.roadStatus}</p>
                  </div>
                  <div className="h-px bg-gray-50 my-3"></div>
                  <div>
                    <h4 className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1.5 flex items-center gap-2"><CloudLightning size={12} /> HAVA DURUMU</h4>
                    <p className="text-xs font-bold text-gray-800">{selectedProvince.weather}</p>
                  </div>
                  <div className="h-px bg-gray-50 my-3"></div>
                  <div>
                    <h4 className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1.5 flex items-center gap-2"><Truck size={12} /> LOJİSTİK ÖNCELİK</h4>
                    <p className={\`text-xs font-bold \${
                      selectedProvince.logisticsPriority.includes('Maks') || selectedProvince.logisticsPriority.includes('Aci') || selectedProvince.logisticsPriority.includes('Kri')
                        ? 'text-red-600' : 'text-blue-600'
                    }\`}>{selectedProvince.logisticsPriority}</p>
                  </div>
                </div>

                {/* AI Assistant Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 p-6 rounded-[2rem] border border-blue-100/50 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl transition-all group-hover:bg-blue-500/10"></div>
                  <h3 className="flex items-center gap-2 text-xs font-black text-[#002D5E] uppercase tracking-widest mb-4">
                    <Zap size={14} className="text-blue-500" />
                    ARZ AI BÖLGE ANALİZİ
                  </h3>
                  
                  {isAiAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-4 bg-white/50 rounded-[1.5rem]">
                      <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <span className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] animate-pulse">Yerel Veriler İşleniyor...</span>
                    </div>
                  ) : aiResult ? (
                    <div className="text-xs text-blue-900 font-medium leading-relaxed bg-white p-5 rounded-[1.5rem] border border-blue-100 shadow-sm relative z-10">
                       <span className="absolute -top-2 left-6 px-3 py-0.5 bg-blue-100 text-[8px] font-black text-blue-700 uppercase tracking-widest rounded-full">{selectedProvince.name} Raporu</span>
                       {aiResult}
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleAiAnalysis(selectedProvince)}
                      className="w-full bg-[#002D5E] hover:bg-black text-white p-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-3 relative z-10"
                    >
                      BÖLGESEL HIZLI ANALİZ BAŞLAT
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MapModule;
`;
fs.writeFileSync('src/pages/MapModule.tsx', content);
