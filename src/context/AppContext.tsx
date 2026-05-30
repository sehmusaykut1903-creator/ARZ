import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, ThemeType, Report, LogisticsItem, Patient, Volunteer, HealthLog, VolunteerStatus, User, ProjectIdentity, Notification, Shipment, AISettings, DisplaySettings, MapSettings, Toast, ToastSettings, NotificationSettings, SecuritySettings, SoundSettings } from '../types';
import i18n from '../lib/i18n';
import { restoreSession, clearAuthSession } from '../services/authService';

export const projectIdentity: ProjectIdentity = {
  name: 'ARZ - Afet Raporlama ve Zamanlama',
  fullTitle: 'Yapay Zeka Destekli Ulusal Afet Raporlama, Zamanlama ve Karar Destek Sistemi',
  slogan: 'Doğru Veri, Doğru Zaman, Doğru Müdahale.',
  team: 'Şehmus Aykut - Aghajan Musalı',
  institution: 'Yozgat Bozok Üniversitesi Tıp Fakültesi',
  department: 'Halk Sağlığı Anabilim Dalı',
  advisor: 'Prof. Dr. Vugar Ali TÜRKSOY',
  leadDeveloper: 'Şehmus Aykut',
  version: 'Şehmus Aykut tarafından geliştirilmiştir.'
};

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  userProfile: any | null;
  setUserProfile: (profile: any) => void;
  lang: string;
  setLang: (lang: string) => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  textSize: string;
  setTextSize: (size: any) => void;
  fontFamily: string;
  setFontFamily: (font: any) => void;
  aiSettings: AISettings;
  setAiSettings: (settings: Partial<AISettings>) => void;
  displaySettings: DisplaySettings;
  setDisplaySettings: (settings: Partial<DisplaySettings>) => void;
  notificationSettings: NotificationSettings;
  setNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  securitySettings: SecuritySettings;
  setSecuritySettings: (settings: Partial<SecuritySettings>) => void;
  soundSettings: SoundSettings;
  setSoundSettings: (settings: Partial<SoundSettings>) => void;
  mapSettings: MapSettings;
  setMapSettings: (settings: Partial<MapSettings>) => void;
  toastSettings: ToastSettings;
  setToastSettings: (settings: Partial<ToastSettings>) => void;
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
  resetSettings: () => void;
  updateSetting: (category: string, key: string, value: any) => void;
  projectIdentity: ProjectIdentity;
  reports: Report[];
  addReport: (report: Report) => void;
  logistics: LogisticsItem[];
  addLogistics: (item: LogisticsItem) => void;
  updateLogistics: (id: string, updates: Partial<LogisticsItem>) => void;
  shipments: Shipment[];
  addShipment: (s: Shipment) => void;
  updateShipmentStatus: (id: string, status: Shipment['status']) => void;
  notifications: Notification[];
  addNotification: (n: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  patients: Patient[];
  addPatient: (patient: Patient) => void;
  volunteers: Volunteer[];
  addVolunteer: (v: Volunteer) => void;
  updateVolunteer: (id: string, updates: Partial<Volunteer>) => void;
  healthLogs: HealthLog[];
  addHealthLog: (log: HealthLog) => void;
  isOnline: boolean;
  syncQueue: any[];
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    return restoreSession();
  });

  const [userProfile, setUserProfileState] = useState<any | null>(() => {
    const saved = localStorage.getItem('arz_user_profile');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setUserProfile = (profile: any) => {
    setUserProfileState(profile);
    localStorage.setItem('arz_user_profile', JSON.stringify(profile));
  };

  const logout = () => {
    setUser(null);
    clearAuthSession();
  };

  const [lang, setLangState] = useState(localStorage.getItem('arz_lang') || 'tr');
  const [theme, setThemeState] = useState<ThemeType>((localStorage.getItem('arz_theme') as ThemeType) || 'corporate');
  const [textSize, setTextSizeState] = useState(localStorage.getItem('arz_text_size') || 'standard');
  const [fontFamily, setFontFamilyState] = useState(localStorage.getItem('arz_font_family') || 'inter');

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('arz_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [logistics, setLogistics] = useState<LogisticsItem[]>(() => {
    const saved = localStorage.getItem('arz_logistics');
    return saved ? JSON.parse(saved) : [
      { id: '1', category: 'water', quantity: 500, unit: 'Palet', priority: 1, status: 'shipped' },
      { id: '2', category: 'food', quantity: 200, unit: 'Koli', priority: 1, status: 'pending' }
    ];
  });

  const [shipments, setShipments] = useState<Shipment[]>(() => {
    const saved = localStorage.getItem('arz_shipments');
    return saved ? JSON.parse(saved) : [
      { id: 'S1', origin: 'Ankara', destination: 'Antakya', content: 'İlaç ve Serum', vehicleType: 'TIR', departureTime: Date.now() - 3600000, status: 'on_way', priority: 'urgent' },
      { id: 'S2', origin: 'İstanbul', destination: 'Hatay', content: 'Gıda ve Battaniye', vehicleType: 'Kamyon', departureTime: Date.now() - 7200000, status: 'delivered', priority: 'high' }
    ];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('arz_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 'n1', title: 'Yeni Rapor', message: 'Antakya bölgesinden yaralı bildirimi alındı.', type: 'error', timestamp: Date.now() - 600000, read: false },
      { id: 'n2', title: 'Lojistik Güncelleme', message: 'Sevkiyat #S1 yola çıktı.', type: 'info', timestamp: Date.now() - 1200000, read: false },
      { id: 'n3', title: 'Sistem Uyarısı', message: 'Hava durumu kötüleşiyor, sevkiyatlar gecikebilir.', type: 'warning', timestamp: Date.now() - 3600000, read: true }
    ];
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('arz_patients');
    return saved ? JSON.parse(saved) : [];
  });

  const [volunteers, setVolunteers] = useState<Volunteer[]>(() => {
    const saved = localStorage.getItem('arz_volunteers');
    return saved ? JSON.parse(saved) : [
      { id: 'v1', name: 'Ahmet Yılmaz', skills: ['first_aid', 'search_rescue'], certificates: ['İlk Yardım Eğitici Sertifikası'], status: VolunteerStatus.IDLE },
      { id: 'v2', name: 'Ayşe Kaya', skills: ['psychology', 'translation'], certificates: ['Klinik Psikoloji'], status: VolunteerStatus.ON_DUTY }
    ];
  });

  const [healthLogs, setHealthLogs] = useState<HealthLog[]>(() => {
    const saved = localStorage.getItem('arz_health_logs');
    return saved ? JSON.parse(saved) : [
      { id: 'h1', region: 'Antakya', feverCount: 12, diarrheaCount: 5, epidemicRisk: 45, timestamp: Date.now() }
    ];
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('arz_sidebar_collapsed');
    return saved === 'true';
  });

  const [aiSettings, setAiSettingsState] = useState<AISettings>(() => {
    const saved = localStorage.getItem('arz_ai_settings');
    const defaults = {
      active: true,
      localBrain: true,
      memory: true,
      roleBasedResponses: true,
      useMapData: true,
      useClinicalData: true,
      useLogisticsData: true,
      shortResponseMode: false,
      detailedAnalysisMode: true,
      showSecurityWarnings: true,
      saveChatHistory: true
    };
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });

  const [displaySettings, setDisplaySettingsState] = useState<DisplaySettings>(() => {
    const saved = localStorage.getItem('arz_display_settings');
    const defaults = {
      boldText: false,
      largeText: false,
      highContrast: false,
      reduceMotion: false,
      bigButtons: false,
      focusRing: false,
      readableFont: true,
      colorBlindMode: 'none',
      brightness: 100,
      homeShowStats: true,
      homeShowQuickActions: true,
      searchShowAiSummary: true,
      searchShowHistory: true,
      searchShowMapPreview: true
    };
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });

  const [notificationSettings, setNotificationSettingsState] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('arz_notification_settings');
    const defaults = {
      enabled: true,
      criticalAlerts: true,
      clinicalAlerts: true,
      shipmentNotifications: true,
      volunteerNotifications: true,
      mapEventNotifications: true,
      aiNotifications: true,
      lowBatteryWarning: true
    };
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });

  const [securitySettings, setSecuritySettingsState] = useState<SecuritySettings>(() => {
    const saved = localStorage.getItem('arz_security_settings');
    const defaults = {
      locationSharing: true,
      localEncryption: false,
      rememberSession: true,
      appPinEnabled: false,
      faceIdDemo: false
    };
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });

  const [soundSettings, setSoundSettingsState] = useState<SoundSettings>(() => {
    const saved = localStorage.getItem('arz_sound_settings');
    const defaults = {
      enabled: true,
      vibration: true,
      hapticFeedback: true
    };
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });

  const [mapSettings, setMapSettingsState] = useState<MapSettings>(() => {
    const saved = localStorage.getItem('arz_map_settings');
    const defaults: MapSettings = {
      showMyLocation: true,
      showIncidentMarkers: true,
      showHelpPoints: true,
      trafficLayer: false,
      roadStatusLayer: false,
      heatmap: false,
      mapStyle: 'operation',
      disasterType: 'general',
      brightness: 100,
      contrast: 100,
      markerDensity: 'medium',
      showLabels: true,
      activeLayers: ['earthquake', 'flood', 'fire', 'logistics', 'helpPoints']
    };
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });
  
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastSettings, setToastSettingsState] = useState<ToastSettings>(() => {
    const saved = localStorage.getItem('arz_toast_settings');
    return saved ? JSON.parse(saved) : {
      position: 'top-right',
      duration: 3000,
      showIcon: true,
      animation: 'slide'
    };
  });

  const setToastSettings = (updates: Partial<ToastSettings>) => setToastSettingsState(prev => ({ ...prev, ...updates }));

  const showToast = (message: string, type: Toast['type'] = 'success', duration?: number) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type, duration: duration || toastSettings.duration };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setAiSettings = (updates: Partial<AISettings>) => setAiSettingsState(prev => ({ ...prev, ...updates }));
  const setDisplaySettings = (updates: Partial<DisplaySettings>) => setDisplaySettingsState(prev => ({ ...prev, ...updates }));
  const setMapSettings = (updates: Partial<MapSettings>) => setMapSettingsState(prev => ({ ...prev, ...updates }));
  const setNotificationSettings = (updates: Partial<NotificationSettings>) => setNotificationSettingsState(prev => ({ ...prev, ...updates }));
  const setSecuritySettings = (updates: Partial<SecuritySettings>) => setSecuritySettingsState(prev => ({ ...prev, ...updates }));
  const setSoundSettings = (updates: Partial<SoundSettings>) => setSoundSettingsState(prev => ({ ...prev, ...updates }));

  const updateSetting = (category: string, key: string, value: any) => {
    switch (category) {
      case 'ai': setAiSettings({ [key]: value }); break;
      case 'display': setDisplaySettings({ [key]: value }); break;
      case 'map': setMapSettings({ [key]: value }); break;
      case 'notification': setNotificationSettings({ [key]: value }); break;
      case 'security': setSecuritySettings({ [key]: value }); break;
      case 'sound': setSoundSettings({ [key]: value }); break;
      case 'toast': setToastSettings({ [key]: value }); break;
    }
  };

  useEffect(() => {
    localStorage.setItem('arz_ai_settings', JSON.stringify(aiSettings));
    localStorage.setItem('arz_display_settings', JSON.stringify(displaySettings));
    localStorage.setItem('arz_notification_settings', JSON.stringify(notificationSettings));
    localStorage.setItem('arz_security_settings', JSON.stringify(securitySettings));
    localStorage.setItem('arz_sound_settings', JSON.stringify(soundSettings));
    localStorage.setItem('arz_map_settings', JSON.stringify(mapSettings));
    localStorage.setItem('arz_toast_settings', JSON.stringify(toastSettings));
    
    // Unified state for external tools/debugging
    localStorage.setItem('arz_settings_state', JSON.stringify({ 
      ai: aiSettings, 
      display: displaySettings, 
      notification: notificationSettings,
      security: securitySettings,
      sound: soundSettings,
      map: mapSettings, 
      toast: toastSettings 
    }));

    // Apply accessibility classes to documentElement
    const root = document.documentElement;
    const accessibilityMap = {
      boldText: 'arz-bold-text',
      highContrast: 'arz-high-contrast',
      reduceMotion: 'arz-reduce-motion',
      bigButtons: 'arz-large-buttons',
      focusRing: 'arz-focus-ring',
      readableFont: 'arz-readable-font',
      largeText: 'arz-large-text'
    };

    Object.entries(accessibilityMap).forEach(([setting, className]) => {
      if ((displaySettings as any)[setting]) {
        root.classList.add(className);
      } else {
        root.classList.remove(className);
      }
    });

    // Apply brightness
    if (displaySettings.brightness !== undefined) {
      root.style.setProperty('--app-brightness', (displaySettings.brightness / 100).toString());
    }

    // Apply data attributes for other styles
    Object.entries(displaySettings).forEach(([key, value]) => {
      if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
        root.setAttribute(`data-${key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}`, value.toString());
      }
    });
  }, [aiSettings, displaySettings, notificationSettings, securitySettings, soundSettings, mapSettings, toastSettings]);

  useEffect(() => {
    localStorage.setItem('arz_sidebar_collapsed', sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('arz_volunteers', JSON.stringify(volunteers));
  }, [volunteers]);

  useEffect(() => {
    localStorage.setItem('arz_health_logs', JSON.stringify(healthLogs));
  }, [healthLogs]);

  useEffect(() => {
    localStorage.setItem('arz_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('arz_logistics', JSON.stringify(logistics));
  }, [logistics]);

  useEffect(() => {
    localStorage.setItem('arz_shipments', JSON.stringify(shipments));
  }, [shipments]);

  useEffect(() => {
    localStorage.setItem('arz_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('arz_lang', lang);
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('arz_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('arz_text_size', textSize);
    document.documentElement.setAttribute('data-size', textSize);
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem('arz_font_family', fontFamily);
    document.documentElement.setAttribute('data-font', fontFamily);
  }, [fontFamily]);

  const setLang = (l: string) => setLangState(l);
  const setTheme = (t: ThemeType) => setThemeState(t);
  const setTextSize = (s: string) => setTextSizeState(s);
  const setFontFamily = (f: string) => setFontFamilyState(f);

  const resetSettings = () => {
    setLangState('tr');
    setThemeState('afad');
    setTextSizeState('standard');
    setAiSettingsState({
      active: true,
      localBrain: true,
      memory: true,
      roleBasedResponses: true,
      useMapData: true,
      useClinicalData: true,
      detailedAnalysisMode: false,
      showSecurityWarnings: true
    });
    setDisplaySettingsState({
      brightness: 100,
      boldText: false,
      highContrast: false,
      reduceMotion: false,
      colorBlindMode: 'none',
      bigButtons: false,
      focusRing: false,
      readableFont: false
    });
    setMapSettingsState({
      brightness: 100,
      contrast: 100,
      showLabels: true,
      showMyLocation: true,
      mapStyle: 'standard'
    });
    setFontFamilyState('inter');
    localStorage.removeItem('arz_settings_state');
  };

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncQueue, setSyncQueue] = useState<{id: string, type: string, action: string, data: any}[]>(() => {
    const saved = localStorage.getItem('arz_sync_queue');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('arz_sync_queue', JSON.stringify(syncQueue));
    if (isOnline && syncQueue.length > 0) {
      processSyncQueue();
    }
  }, [syncQueue, isOnline]);

  const processSyncQueue = async () => {
    if (syncQueue.length === 0) return;
    
    console.log('Processing sync queue...', syncQueue.length);
    
    // Deduplication Strategy: For 'logistics' updates, only keep the latest update for each ID
    const processedMap = new Map<string, any>();
    const optimizedQueue: any[] = [];

    syncQueue.forEach(item => {
      if (item.type === 'logistics' && item.action === 'update') {
        processedMap.set(`logistics_update_${item.data.id}`, item);
      } else {
        optimizedQueue.push(item);
      }
    });

    // Add back the latest updates
    processedMap.forEach(item => optimizedQueue.push(item));

    // Simulate network delay for robust feel
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // simulate server sync call here
    // In real app: await batchUpdateServer(optimizedQueue);

    setSyncQueue([]);
    addNotification({
      id: Date.now().toString(),
      title: i18n.language === 'tr' ? 'Senkronizasyon Başarılı' : 'Sync Successful',
      message: i18n.language === 'tr' ? `${optimizedQueue.length} işlem bulut ile başarıyla senkronize edildi.` : `${optimizedQueue.length} operations successfully synced with cloud.`,
      type: 'info',
      timestamp: Date.now(),
      read: false
    });
  };

  const addSyncItem = (item: {type: string, action: string, data: any}) => {
    setSyncQueue(prev => [...prev, { ...item, id: Date.now().toString() }]);
  };

  const addReport = (r: Report) => {
    setReports(prev => [r, ...prev]);
    if (!isOnline) {
      addSyncItem({ type: 'report', action: 'create', data: r });
      addNotification({
        id: Date.now().toString(),
        title: i18n.language === 'tr' ? 'Çevrimdışı Mod' : 'Offline Mode',
        message: i18n.language === 'tr' ? 'Bildirim yerel hafızaya kaydedildi. Bağlantı gelince gönderilecek.' : 'Report saved locally. It will be synced when connection returns.',
        type: 'warning',
        timestamp: Date.now(),
        read: false
      });
    }
  };
  
  const addLogistics = (l: LogisticsItem) => {
    setLogistics(prev => [l, ...prev]);
    if (!isOnline) {
      addSyncItem({ type: 'logistics', action: 'create', data: l });
    }
  };

  const updateLogistics = (id: string, updates: Partial<LogisticsItem>) => {
    setLogistics(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    if (!isOnline) {
      addSyncItem({ type: 'logistics', action: 'update', data: { id, updates } });
    }
  };

  const addShipment = (s: Shipment) => setShipments(prev => [s, ...prev]);
  const updateShipmentStatus = (id: string, status: Shipment['status']) => {
    setShipments(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const addNotification = (n: Notification) => setNotifications(prev => [n, ...prev]);
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const clearNotifications = () => setNotifications([]);

  const addPatient = (p: Patient) => {
    setPatients(prev => [p, ...prev]);
    if (!isOnline) addSyncItem({ type: 'patient', action: 'create', data: p });
  };

  const addVolunteer = (v: Volunteer) => {
    setVolunteers(prev => [v, ...prev]);
    if (!isOnline) addSyncItem({ type: 'volunteer', action: 'create', data: v });
  };
  
  const updateVolunteer = (id: string, updates: Partial<Volunteer>) => {
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    if (!isOnline) addSyncItem({ type: 'volunteer', action: 'update', data: { id, updates } });
  };

  const addHealthLog = (log: HealthLog) => {
    setHealthLogs(prev => [log, ...prev]);
    if (!isOnline) addSyncItem({ type: 'health_log', action: 'create', data: log });
  };

  return (
    <AppContext.Provider value={{
      user, setUser, userProfile, setUserProfile, lang, setLang, theme, setTheme,
      textSize, setTextSize, fontFamily, setFontFamily, 
      aiSettings, setAiSettings,
      displaySettings, setDisplaySettings,
      notificationSettings, setNotificationSettings,
      securitySettings, setSecuritySettings,
      soundSettings, setSoundSettings,
      mapSettings, setMapSettings,
      toastSettings, setToastSettings,
      toasts, showToast, removeToast,
      resetSettings, updateSetting,
      projectIdentity,
      reports, addReport, 
      logistics, addLogistics, updateLogistics,
      shipments, addShipment, updateShipmentStatus,
      notifications, addNotification, markNotificationAsRead, clearNotifications,
      patients, addPatient,
      volunteers, addVolunteer, updateVolunteer,
      healthLogs, addHealthLog,
      isOnline, syncQueue,
      sidebarCollapsed, setSidebarCollapsed,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
