import React, { useState, useEffect, useRef } from 'react';
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
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-12 h-12 bg-[${color}] opacity-[0.15] rounded-full animate-ping"></div>
        <div class="absolute w-8 h-8 bg-[${color}] opacity-[0.25] rounded-full"></div>
        <div class="relative w-6 h-6 bg-[${color}] border-2 border-white rounded-full shadow-lg flex items-center justify-center">
          <div class="w-2 h-2 bg-app-card rounded-full shadow-sm"></div>
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

const MapModule = () => {
  const { t } = useTranslation();
  const { mapSettings, setMapSettings, lang } = useAppContext();
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.9334, 32.8597]); // Ankara
  const [zoom, setZoom] = useState(6);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusNotification, setFocusNotification] = useState<{
    show: boolean;
    message: string;
    type: 'info' | 'success';
  }>({
    show: false,
    message: '',
    type: 'info'
  });

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
  };

  const focusOnNearestCritical = (userCoords?: [number, number]) => {
    // Find all critical provinces
    const criticalProvinces = mockProvinces.filter(p => p.riskLevel === 'critical');
    const targetList = criticalProvinces.length > 0 ? criticalProvinces : mockProvinces.filter(p => p.riskLevel === 'high');
    
    if (targetList.length === 0) return;

    // reference coords (either user coordinates, or default/current map center)
    const refCoords = userCoords || mapCenter;

    let nearest = targetList[0];
    let minDistance = calculateDistance(refCoords[0], refCoords[1], nearest.coords[0], nearest.coords[1]);

    for (let i = 1; i < targetList.length; i++) {
      const dist = calculateDistance(refCoords[0], refCoords[1], targetList[i].coords[0], targetList[i].coords[1]);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = targetList[i];
      }
    }

    setMapCenter(nearest.coords);
    setZoom(11);
    setSelectedProvince(nearest);
    
    setFocusNotification({
      show: true,
      message: userCoords 
        ? `${t('focus_nearest_msg', 'Konumunuza en yakın afet bölgesine odaklanıldı')}: ${nearest.name}`
        : `${t('focus_critical_msg', 'En yüksek riskli afet bölgesine odaklanıldı')}: ${nearest.name}`,
      type: 'success'
    });

    setTimeout(() => {
      setFocusNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleFocusRegion = () => {
    if (navigator.geolocation) {
      setFocusNotification({
        show: true,
        message: t('detecting_location', 'Konumunuz belirleniyor...'),
        type: 'info'
      });
      
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLat = pos.coords.latitude;
          const userLng = pos.coords.longitude;
          focusOnNearestCritical([userLat, userLng]);
        },
        (error) => {
          console.warn('Geolocation error, falling back to general critical area selection', error);
          focusOnNearestCritical();
        },
        { timeout: 5000 }
      );
    } else {
      focusOnNearestCritical();
    }
  };

  // Persistent layers logic
  useEffect(() => {
    const savedLayers = localStorage.getItem('arz_map_layers');
    if (savedLayers) {
      try {
        const layers = JSON.parse(savedLayers);
        setMapSettings({ activeLayers: layers });
      } catch (e) {
        console.error('Failed to parse map layers', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('arz_map_layers', JSON.stringify(mapSettings.activeLayers));
  }, [mapSettings.activeLayers]);
  
  // Custom layer types 
  const disasterTypes = [
    { id: 'general', label: t('mapTypes.general'), icon: MapIcon },
    { id: 'earthquake', label: t('mapTypes.earthquake'), icon: Activity },
    { id: 'flood', label: t('mapTypes.flood'), icon: Droplets },
    { id: 'fire', label: t('mapTypes.fire'), icon: Flame },
    { id: 'landslide', label: t('mapTypes.landslide'), icon: Mountain },
    { id: 'avalanche', label: t('mapTypes.avalanche'), icon: Mountain },
    { id: 'storm', label: t('mapTypes.storm'), icon: Wind },
    { id: 'drought', label: t('mapTypes.drought'), icon: Sun },
    { id: 'epidemic', label: t('mapTypes.epidemic'), icon: Pulse },
    { id: 'logistics', label: t('mapTypes.logistics'), icon: Truck },
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
    
    // Dynamically update context based on map selection
    const disasterContext = mapSettings.disasterType === 'general' 
      ? (lang === 'tr' ? "genel afet durumu ve risk analizi" : "general disaster status and risk analysis")
      : (lang === 'tr' ? `${mapSettings.disasterType} afeti özelinde acil durum müdahale ve risk projeksiyonu` : `${mapSettings.disasterType} disaster specific emergency response and risk projection`);

    setTimeout(() => {
      setAiResult(`${province.name} ${t('region_suffix')}: ${province.aiSuggestion}`);
      setIsAiAnalyzing(false);
    }, 1500);
  };

  const filteredProvinces = mockProvinces.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (mapSettings.disasterType === 'general') return matchesSearch;
    return matchesSearch && p.activeDisasters.includes(mapSettings.disasterType);
  });

  const displayProvinces = filteredProvinces;

  return (
    <div className="flex flex-col h-auto lg:h-[calc(100vh-140px)] bg-app-bg gap-3 md:gap-4 pb-20 lg:pb-0">
      {/* Top Header */}
      <div className="bg-app-card p-3 md:p-4 px-4 md:px-6 rounded-2xl md:rounded-[2.5rem] border border-app-border shadow-sm flex items-center justify-between shrink-0 z-10 w-full overflow-hidden">
        <div className="flex items-center gap-2 md:gap-3 shrink-0 mr-4">
          <div className="p-1.5 md:p-2 bg-app-primary/10 text-app-primary rounded-xl">
             <MapIcon size={18} />
          </div>
          <div>
            <h1 className="text-xs md:text-sm font-black text-app-text uppercase tracking-wider">{t('map_title')}</h1>
            <div className="flex items-center gap-1 md:gap-2 text-[8px] md:text-[10px] text-app-muted font-bold uppercase tracking-widest mt-0.5">
              <span>{t('live_data')}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-emerald-500 flex items-center gap-1"><span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span> {t('up_to_date')}</span>
            </div>
          </div>
        </div>
                 <div className="flex-1 flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            {disasterTypes.map(type => {
              const isActive = mapSettings.disasterType === type.id;
              return (
                <button 
                  key={type.id}
                  onClick={() => {
                    setMapSettings({ disasterType: type.id as any });
                    setSelectedProvince(null);
                    setAiResult(null);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 md:px-5 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                    isActive 
                      ? 'scale-105 z-10 text-white font-extrabold border-transparent' 
                      : 'bg-app-card text-app-muted border-app-border hover:border-gray-300 hover:text-app-text shadow-sm'
                  }`}
                  style={isActive ? { backgroundColor: 'var(--app-primary)', borderColor: 'var(--app-primary)', color: '#ffffff' } : undefined}
                >
                  <type.icon size={13} className={isActive ? 'text-white' : 'text-app-muted'} />
                  {type.label}
                </button>
              )
            })}
          </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 relative">
        {/* Left Side Mapping / Filters */}
        <div className="w-full lg:w-[280px] bg-app-card rounded-2xl lg:rounded-[2.5rem] border border-app-border shadow-sm flex flex-col shrink-0 overflow-hidden z-10 lg:h-full">
          <div className="p-4 border-b border-app-border space-y-3">
             <div className="flex items-center justify-between">
                <h3 className="text-[10px] md:text-xs font-black text-app-text uppercase tracking-widest flex items-center gap-2"><Layers size={13} /> {t('layers')}</h3>
             </div>
             <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
                <input 
                  type="text" 
                  placeholder={t('search_province_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-app-bg border border-app-border rounded-xl py-2 pl-9 pr-3 text-xs font-bold focus:ring-2 focus:ring-app-primary/20 outline-none"
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col min-h-0">
            <div className="p-4 space-y-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-hidden gap-2 lg:gap-0 select-none pb-4 lg:pb-4">
              {disasterTypes.filter(d => d.id !== 'general').map(layer => {
                 const isActive = mapSettings.activeLayers.includes(layer.id);
                 return (
                   <button 
                     key={layer.id}
                     onClick={() => {
                       const newLayers = isActive 
                        ? mapSettings.activeLayers.filter(l => l !== layer.id)
                        : [...mapSettings.activeLayers, layer.id];
                       setMapSettings({ activeLayers: newLayers });
                     }}
                     className={`w-auto lg:w-full flex-shrink-0 lg:flex-shrink flex items-center justify-between p-3.5 rounded-2xl transition-all border-2 gap-3 lg:gap-0 ${
                       isActive 
                        ? 'font-extrabold translate-x-0 lg:translate-x-1 border-transparent' 
                        : 'bg-app-bg text-app-muted border-app-border/40 hover:bg-white hover:border-gray-200 shadow-sm'
                     }`}
                     style={isActive ? { backgroundColor: 'var(--app-primary)', borderColor: 'var(--app-primary)', color: '#ffffff' } : undefined}
                   >
                     <div className="flex items-center gap-2">
                       <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-white/20' : 'bg-app-card border border-app-border'}`}>
                         <layer.icon size={14} className={isActive ? 'text-white' : 'text-app-muted'} />
                       </div>
                       <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{t(`mapLayers.${layer.id}`)}</span>
                     </div>
                     <div className={`hidden lg:block w-9 h-5 rounded-full p-0.5 transition-colors ${isActive ? 'bg-white/30' : 'bg-gray-200'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                     </div>
                   </button>
                 )
              })}
            </div>

            <div className="border-t border-app-border p-4 pt-4 mt-auto">
               <h3 className="text-[8px] md:text-[9px] font-black text-app-muted uppercase tracking-widest flex items-center gap-2 mb-2">
                 <ShieldAlert size={11} className="text-red-500" />
                 {t('critical_provinces_label', 'Kritik İller')}
               </h3>
               <div className="space-y-1.5 flex flex-row lg:flex-col gap-2 lg:gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                  {mockProvinces.filter(p => p.riskLevel === 'critical').slice(0,3).map(p => (
                     <button
                       key={p.id}
                       onClick={() => {
                          setSelectedProvince(p);
                          setMapCenter(p.coords);
                          setZoom(10);
                       }}
                       className="w-auto lg:w-full flex-shrink-0 lg:flex-shrink bg-red-50/50 hover:bg-red-50 p-2.5 px-4 lg:p-3 rounded-2xl flex items-center justify-between gap-4 lg:gap-0 transition-all border border-red-100"
                     >
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                          <span className="text-[10px] font-black text-red-700 uppercase tracking-widest">{p.name}</span>
                        </div>
                        <ChevronRight size={13} className="text-red-400 hidden lg:block" />
                     </button>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Main Map Content */}
        <div className="flex-1 relative rounded-2xl lg:rounded-[3rem] overflow-hidden shadow-premium border border-app-border z-0 h-[280px] lg:h-auto" style={{ filter: `brightness(${mapSettings.brightness}%) contrast(${mapSettings.contrast}%)` }}>
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
                    <div className="p-4 min-w-[220px] bg-app-card rounded-3xl">
                      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-app-border">
                         <ShieldAlert size={16} className={`${
                            p.riskLevel === 'critical' ? 'text-red-500' : 
                            p.riskLevel === 'high' ? 'text-orange-500' : 
                            'text-emerald-500'
                         }`} />
                         <div className="text-xs font-black text-app-text uppercase italic truncate">{p.name}</div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-app-muted font-bold uppercase">{t('risk_score')}</span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded whitespace-nowrap ${
                            p.riskLevel === 'critical' ? 'bg-red-600 text-white' : 
                            p.riskLevel === 'high' ? 'bg-orange-500 text-white' : 
                            p.riskLevel === 'medium' ? 'bg-yellow-400 text-slate-900' : 
                            'bg-emerald-500 text-white'
                          }`}>{p.riskLevel}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-app-muted font-bold uppercase">{t('reports_count')}</span>
                          <span className="text-[9px] font-black text-gray-700">{p.activeReportsCount}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                           e.stopPropagation();
                           setSelectedProvince(p);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-app-primary/10 text-app-primary rounded-xl hover:bg-app-primary hover:text-app-on-primary transition-all text-[9px] font-black uppercase tracking-widest"
                      >
                        <Info size={12} />
                        {t('view_details')}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Top Left Focus Button */}
          <div className="absolute top-4 left-4 z-[1000]">
            <button
              onClick={handleFocusRegion}
              className="flex items-center gap-2 bg-app-card/95 backdrop-blur-xl border border-app-border hover:border-app-primary/40 text-app-text hover:text-app-primary px-3.5 py-2.5 rounded-2xl shadow-sm transition-all hover:shadow-md active:scale-95 group font-black text-[9px] min-[360px]:text-[10px] uppercase tracking-widest"
              title={t('focus_region_desc', 'Mevcut konumunuza veya en yakın kritik bölgeye odaklanır')}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute w-2 h-2 rounded-full bg-app-primary opacity-50 animate-ping" style={{ backgroundColor: 'var(--app-primary)' }}></span>
                <span className="relative w-1.5 h-1.5 rounded-full bg-app-primary" style={{ backgroundColor: 'var(--app-primary)' }}></span>
              </div>
              <Crosshair size={13} className="text-app-primary group-hover:rotate-90 transition-transform duration-300" style={{ color: 'var(--app-primary)' }} />
              <span>{t('focus_region', 'Bölgeye Odakla')}</span>
            </button>
          </div>

          {/* Center Feedback Toast for Focus Event */}
          <AnimatePresence>
            {focusNotification.show && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute top-16 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 bg-app-card/95 backdrop-blur-xl border border-app-border px-4 py-2.5 rounded-2xl shadow-xl z-[1000] flex items-center gap-2 max-w-full sm:max-w-md text-left"
              >
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${focusNotification.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-600'} animate-pulse`} />
                <span className="text-[9.5px] font-black uppercase tracking-wider text-app-text leading-tight">{focusNotification.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
            <div className="bg-app-card/90 backdrop-blur-xl p-1.5 rounded-2xl shadow-sm border border-app-border flex flex-col gap-1">
              <button onClick={() => setZoom(prev => Math.min(prev + 1, 18))} className="p-2.5 hover:bg-gray-100 rounded-xl text-app-text transition-all active:scale-95"><ZoomIn size={16} /></button>
              <button onClick={() => setZoom(prev => Math.max(prev - 1, 4))} className="p-2.5 hover:bg-gray-100 rounded-xl text-app-text transition-all active:scale-95"><ZoomOut size={16} /></button>
              <div className="h-[1px] w-full bg-gray-100 my-1" />
              <button onClick={showMyLocation} className="p-2.5 hover:bg-gray-100 rounded-xl text-app-text transition-all active:scale-95"><Crosshair size={16} /></button>
            </div>
            
            <div className="bg-app-card/90 backdrop-blur-xl p-1.5 rounded-2xl shadow-sm border border-app-border mt-2 flex flex-col gap-1">
              {['standard', 'light', 'high_contrast', 'satellite', 'operation'].map(style => (
                 <button 
                   key={style}
                   onClick={() => setMapSettings({ mapStyle: style as any })} 
                   className={`p-2.5 rounded-xl transition-all ${mapSettings.mapStyle === style ? 'bg-primary text-app-on-primary shadow-md' : 'text-app-text hover:bg-gray-100'}`}
                   title={style.replace('_', ' ')}
                 >
                   {style === 'satellite' ? <Globe2 size={16} /> : style === 'standard' ? <MapIcon size={16} /> : style === 'light' ? <Sun size={16} /> : <Layers size={16} />}
                 </button>
              ))}
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
                className="hidden lg:flex absolute bottom-0 sm:top-0 right-0 h-full w-[350px] bg-app-card rounded-l-[3rem] border-l border-app-border shadow-[0_-10px_50px_rgba(0,0,0,0.1)] flex-col z-[1010] overflow-hidden"
              >
              <div className="bg-gradient-to-br from-[#002D5E] to-[#001F3D] p-8 text-app-on-primary relative overflow-hidden shrink-0"
                   style={{ backgroundImage: 'linear-gradient(to bottom right, var(--app-primary), #001f3d)' }}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-app-card/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <button 
                   onClick={() => setSelectedProvince(null)}
                   className="absolute top-6 right-6 p-2 bg-app-card/10 hover:bg-app-card/20 rounded-xl transition-all"
                >
                  <ChevronRight size={20} />
                </button>
                <h2 className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em]">{selectedProvince.region} {t('region_suffix')}</h2>
                <h1 className="text-3xl font-black italic tracking-tighter mt-1">{selectedProvince.name}</h1>
                <div className="flex gap-2 mt-5 flex-wrap">
                  {selectedProvince.activeDisasters.map(d => (
                    <span key={d} className="px-3 py-1.5 bg-app-card/10 border border-white/20 text-[9px] font-black uppercase tracking-widest rounded-xl">
                      {t(`mapLayers.${d}`)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-app-bg/50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-app-card p-5 rounded-[2rem] border border-app-border shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
                    <div className="text-[9px] text-app-muted font-black uppercase tracking-widest flex items-center justify-between">{t('risk_score')} <Activity size={12} className="text-app-muted" /></div>
                    <div className={`text-3xl font-black mt-3 ${
                      selectedProvince.riskScore > 80 ? 'text-red-500' : 
                      selectedProvince.riskScore > 50 ? 'text-orange-500' : 'text-emerald-500'
                    }`}>{selectedProvince.riskScore}</div>
                  </div>
                  <div className="bg-app-card p-5 rounded-[2rem] border border-app-border shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
                    <div className="text-[9px] text-app-muted font-black uppercase tracking-widest flex items-center justify-between">{t('reports_count')} <MapPin size={12} className="text-app-muted" /></div>
                    <div className="text-2xl font-black text-app-text mt-3">{selectedProvince.activeReportsCount}</div>
                  </div>
                </div>

                <div className="bg-app-card p-6 rounded-[2rem] border border-app-border shadow-sm space-y-4">
                  <div>
                    <h4 className="text-[9px] text-app-muted font-black uppercase tracking-widest mb-1.5 flex items-center gap-2"><Navigation size={12}/> {t('road_status')}</h4>
                    <p className="text-xs font-bold text-app-text">{selectedProvince.roadStatus}</p>
                  </div>
                  <div className="h-px bg-app-bg my-3"></div>
                  <div>
                    <h4 className="text-[9px] text-app-muted font-black uppercase tracking-widest mb-1.5 flex items-center gap-2"><CloudLightning size={12} /> {t('weather_label')}</h4>
                    <p className="text-xs font-bold text-app-text">{selectedProvince.weather}</p>
                  </div>
                  <div className="h-px bg-app-bg my-3"></div>
                  <div>
                    <h4 className="text-[9px] text-app-muted font-black uppercase tracking-widest mb-1.5 flex items-center gap-2"><Truck size={12} /> {t('logistics_priority_label')}</h4>
                    <p className={`text-xs font-bold ${
                      selectedProvince.logisticsPriority.includes('Maks') || selectedProvince.logisticsPriority.includes('Aci') || selectedProvince.logisticsPriority.includes('Kri')
                        ? 'text-red-600' : 'text-app-primary'
                    }`}>{selectedProvince.logisticsPriority}</p>
                  </div>
                </div>

                {/* AI Assistant Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 p-6 rounded-[2rem] border border-blue-100/50 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-app-primary/100/5 rounded-full blur-xl transition-all group-hover:bg-app-primary/100/10"></div>
                  <h3 className="flex items-center gap-2 text-xs font-black text-app-primary uppercase tracking-widest mb-4">
                    <Zap size={14} className="text-blue-500" />
                    {t('ai_analysis_title')}
                  </h3>
                  
                  {isAiAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-4 bg-app-card/50 rounded-[1.5rem]">
                      <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <span className="text-[10px] text-app-primary font-black uppercase tracking-[0.2em] animate-pulse">{t('processing_data')}</span>
                    </div>
                  ) : aiResult ? (
                    <div className="text-xs text-app-text font-medium leading-relaxed bg-app-card p-5 rounded-[1.5rem] border border-blue-100 shadow-sm relative z-10">
                       <span className="absolute -top-2 left-6 px-3 py-0.5 bg-blue-100 text-[8px] font-black text-app-primary uppercase tracking-widest rounded-full">{selectedProvince.name} {t('reports_count')}</span>
                       {aiResult}
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleAiAnalysis(selectedProvince)}
                      className="w-full bg-app-primary hover:bg-black text-app-on-primary p-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-app-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 relative z-10"
                      style={{ backgroundColor: 'var(--app-primary)' }}
                    >
                      {t('start_regional_analysis')}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* On Mobile: Inline Information Card below Map */}
      <AnimatePresence>
        {selectedProvince && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="flex lg:hidden flex-col bg-app-card rounded-2xl border border-app-border shadow-md overflow-hidden shrink-0 mt-2"
          >
            {/* Header banner */}
            <div className="bg-gradient-to-br from-[#002D5E] to-[#001F3D] p-5 text-app-on-primary relative overflow-hidden"
                 style={{ backgroundImage: 'linear-gradient(to bottom right, var(--app-primary), #001f3d)' }}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-[8px] font-black text-blue-200 uppercase tracking-widest">{selectedProvince.region} {t('region_suffix')}</h2>
                  <h1 className="text-xl font-black italic tracking-tight">{selectedProvince.name}</h1>
                </div>
                <button 
                  onClick={() => setSelectedProvince(null)}
                  className="p-1.5 bg-white/10 hover:bg-white/25 rounded-lg transition-all"
                >
                  <Minimize2 size={14} />
                </button>
              </div>
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {selectedProvince.activeDisasters.map(d => (
                  <span key={d} className="px-2 py-0.5 bg-white/10 border border-white/15 text-[8px] font-black uppercase tracking-wider rounded-md">
                    {t(`mapLayers.${d}`)}
                  </span>
                ))}
              </div>
            </div>

            {/* Details body */}
            <div className="p-4 space-y-4 bg-app-bg/50">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-app-card p-3 rounded-xl border border-app-border flex items-center justify-between">
                  <span className="text-[8px] text-app-muted font-black uppercase tracking-wider">{t('risk_score')}</span>
                  <span className={`text-xs font-black ${selectedProvince.riskScore > 80 ? 'text-red-500' : 'text-emerald-500'}`}>{selectedProvince.riskScore}</span>
                </div>
                <div className="bg-app-card p-3 rounded-xl border border-app-border flex items-center justify-between">
                  <span className="text-[8px] text-app-muted font-black uppercase tracking-wider">{t('reports_count')}</span>
                  <span className="text-xs font-black text-app-text">{selectedProvince.activeReportsCount}</span>
                </div>
              </div>

              <div className="bg-app-card p-4 rounded-xl border border-app-border space-y-2 text-[10px] font-bold">
                <div className="flex justify-between"><span className="text-app-muted uppercase tracking-wider">{t('road_status')}</span> <span>{selectedProvince.roadStatus}</span></div>
                <div className="h-px bg-app-border/40" />
                <div className="flex justify-between"><span className="text-app-muted uppercase tracking-wider">{t('weather_label')}</span> <span>{selectedProvince.weather}</span></div>
                <div className="h-px bg-app-border/40" />
                <div className="flex justify-between"><span className="text-app-muted uppercase tracking-wider">{t('logistics_priority_label')}</span> <span className="text-red-500 font-black">{selectedProvince.logisticsPriority}</span></div>
              </div>

              {/* AI assistant prompt */}
              <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/20 p-4 rounded-xl border border-blue-100 flex flex-col gap-2">
                <div className="text-[9px] font-black text-blue-700 uppercase tracking-widest flex items-center gap-1.5"><Zap size={10} /> {t('ai_analysis_title')}</div>
                
                {isAiAnalyzing ? (
                  <div className="flex items-center justify-center p-3 gap-2 bg-white/70 rounded-lg">
                    <div className="w-4 h-4 border border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                    <span className="text-[8px] text-app-primary font-black uppercase tracking-wider">{t('processing_data')}</span>
                  </div>
                ) : aiResult ? (
                  <div className="text-[10px] text-app-text leading-relaxed bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                    {aiResult}
                  </div>
                ) : (
                  <button 
                    onClick={() => handleAiAnalysis(selectedProvince)}
                    className="w-full bg-app-primary text-white p-3 rounded-lg font-black text-[9px] uppercase tracking-widest text-center"
                    style={{ backgroundColor: 'var(--app-primary)' }}
                  >
                    {t('start_regional_analysis')}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapModule;
