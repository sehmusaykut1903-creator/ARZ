const fs = require('fs');

let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

const additionalLangs = `
  pl: {
    translation: {
      "app_name": "ARZ",
      "app_full_name": "Raportowanie i Harmonogramowanie Katastrof",
      "slogan": "Właściwe dane, właściwy czas, właściwe działanie.",
      "dashboard": "Panel",
      "clinical": "Wsparcie Kliniczne",
      "logistics": "Logistyka",
      "map": "Cyfrowy Bliźniak",
      "volunteer": "System Wolontariuszy",
      "field": "Raport Terenowy",
      "public_health": "Zdrowie Publiczne",
      "ai_center": "Dowództwo AI",
      "settings": "Ustawienia",
      "emergency_mode": "TRYB AWARYJNY",
      "status": {
        "low": "Niski",
        "medium": "Średni",
        "high": "Wysoki",
        "critical": "Krytyczny",
        "stable": "Stabilny",
        "active": "Aktywny",
        "passive": "Pasywny"
      },
      "system": {
        "online": "Dostępny",
        "offline": "Niedostępny",
        "success": "Sukces",
        "error": "Błąd",
        "warning": "Ostrzeżenie",
        "loading": "Ładowanie",
        "active": "Aktywny",
        "passive": "Pasywny"
      }
    }
  },
  fa: {
    translation: {
      "app_name": "ARZ",
      "app_full_name": "گزارش و زمان‌بندی بلایا",
      "slogan": "داده‌های درست، زمان درست، اقدام درست.",
      "dashboard": "داشبورد",
      "clinical": "پشتیبانی بالینی",
      "logistics": "لجستیک",
      "map": "همزاد دیجیتال",
      "volunteer": "سیستم داوطلبان",
      "field": "گزارش میدانی",
      "public_health": "بهداشت عمومی",
      "ai_center": "فرماندهی هوش مصنوعی",
      "settings": "تنظیمات",
      "emergency_mode": "حالت اضطراری",
      "status": {
        "low": "کم",
        "medium": "متوسط",
        "high": "زیاد",
        "critical": "بحرانی",
        "stable": "پایدار",
        "active": "فعال",
        "passive": "غیرفعال"
      },
      "system": {
        "online": "آنلاین",
        "offline": "آفلاین",
        "success": "موفق",
        "error": "خطا",
        "warning": "هشدار",
        "loading": "در حال بارگذاری",
        "active": "فعال",
        "passive": "غیرفعال"
      }
    }
  },
  es: {
    translation: {
      "app_name": "ARZ",
      "app_full_name": "Reporte y Sincronización de Desastres",
      "slogan": "Datos correctos, tiempo correcto, acción correcta.",
      "dashboard": "Panel",
      "clinical": "Soporte Clínico",
      "logistics": "Logística",
      "map": "Gemelo Digital",
      "volunteer": "Sistema de Voluntarios",
      "field": "Informe de Campo",
      "public_health": "Salud Pública",
      "ai_center": "Comando de IA",
      "settings": "Ajustes",
      "emergency_mode": "MODO DE EMERGENCIA",
      "status": {
        "low": "Bajo",
        "medium": "Medio",
        "high": "Alto",
        "critical": "Crítico",
        "stable": "Estable",
        "active": "Activo",
        "passive": "Pasivo"
      },
      "system": {
        "online": "En línea",
        "offline": "Fuera de línea",
        "success": "Éxito",
        "error": "Error",
        "warning": "Advertencia",
        "loading": "Cargando",
        "active": "Activo",
        "passive": "Pasivo"
      }
    }
  }
`;

content = content.replace('};', additionalLangs + '\n};');

const langs = ["tr", "en", "ru", "az", "de", "fr", "ar", "it", "ku", "zza"];
const updates = {
  tr: {
    critical: "Kritik", stable: "Stabil", active: "Aktif",
    low: "Düşük", medium: "Orta", high: "Yüksek", passive: "Pasif",
    online: "Çevrimiçi", offline: "Çevrimdışı", success: "Başarılı", error: "Hata", warning: "Uyarı", loading: "Yükleniyor",
    sys_active: "Aktif", sys_passive: "Pasif"
  },
  en: {
    critical: "Critical", stable: "Stable", active: "Active",
    low: "Low", medium: "Medium", high: "High", passive: "Passive",
    online: "Online", offline: "Offline", success: "Success", error: "Error", warning: "Warning", loading: "Loading",
    sys_active: "Active", sys_passive: "Passive"
  },
  ru: {
     critical: "Критический", stable: "Стабильный", active: "Активный",
     low: "Низкий", medium: "Средний", high: "Высокий", passive: "Пассивный",
     online: "В сети", offline: "Не в сети", success: "Успех", error: "Ошибка", warning: "Предупреждение", loading: "Загрузка",
     sys_active: "Активный", sys_passive: "Пассивный"
  },
  de: {
     critical: "Kritisch", stable: "Stabil", active: "Aktiv",
     low: "Niedrig", medium: "Mittel", high: "Hoch", passive: "Passiv",
     online: "Online", offline: "Offline", success: "Erfolg", error: "Fehler", warning: "Warnung", loading: "Laden",
     sys_active: "Aktiv", sys_passive: "Passiv"
  },
  fr: {
     critical: "Critique", stable: "Stable", active: "Actif",
     low: "Faible", medium: "Moyen", high: "Élevé", passive: "Passif",
     online: "En ligne", offline: "Hors ligne", success: "Succès", error: "Erreur", warning: "Avertissement", loading: "Chargement",
     sys_active: "Actif", sys_passive: "Passif"
  },
  az: {
     critical: "Kritik", stable: "Stabil", active: "Aktiv",
     low: "Aşağı", medium: "Orta", high: "Yüksək", passive: "Passiv",
     online: "Onlayn", offline: "Oflayn", success: "Uğurlu", error: "Xəta", warning: "Xəbərdarlıq", loading: "Yüklənir",
     sys_active: "Aktiv", sys_passive: "Passiv"
  },
  ar: {
     critical: "حرج", stable: "مستقر", active: "نشط",
     low: "منخفض", medium: "متوسط", high: "مرتفع", passive: "سلبي",
     online: "متصل", offline: "غير متصل", success: "نجاح", error: "خطأ", warning: "تحذير", loading: "جار التحميل",
     sys_active: "نشط", sys_passive: "سلبي"
  },
  it: {
     critical: "Critico", stable: "Stabile", active: "Attivo",
     low: "Basso", medium: "Medio", high: "Alto", passive: "Passivo",
     online: "Online", offline: "Offline", success: "Successo", error: "Errore", warning: "Avviso", loading: "Caricamento",
     sys_active: "Attivo", sys_passive: "Passivo"
  },
  ku: {
     critical: "Krîtîk", stable: "Stabîl", active: "Aktîf",
     low: "Nizm", medium: "Navîn", high: "Bilind", passive: "Pasîf",
     online: "Serhêl", offline: "Negirêdayî", success: "Serkeftî", error: "Çewtî", warning: "Huşyarî", loading: "Tê barkirin",
     sys_active: "Aktîf", sys_passive: "Pasîf"
  },
  zza: {
     critical: "Krîtîk", stable: "Stabîl", active: "Aktîf",
     low: "Nizm", medium: "Miyanên", high: "Berz", passive: "Pasîf",
     online: "Online", offline: "Offline", success: "Serkewte", error: "Xeta", warning: "Şiyari", loading: "Barkereno",
     sys_active: "Aktîf", sys_passive: "Pasîf"
  }
};

for (const lang of langs) {
  const d = updates[lang];
  if (!d) continue;
  
  const block = `
      "status": {
        "low": "${d.low}",
        "medium": "${d.medium}",
        "high": "${d.high}",
        "critical": "${d.critical}",
        "stable": "${d.stable}",
        "active": "${d.active}",
        "passive": "${d.passive}"
      },
      "system": {
        "online": "${d.online}",
        "offline": "${d.offline}",
        "success": "${d.success}",
        "error": "${d.error}",
        "warning": "${d.warning}",
        "loading": "${d.loading}",
        "active": "${d.sys_active}",
        "passive": "${d.sys_passive}"
      },`;
     
  const rx = new RegExp(`(${lang}:\\s*{\\s*translation:\\s*{)`);
  content = content.replace(rx, `$1${block}`);
}

content = content.replace(/document.dir = lng === 'ar' \? 'rtl' : 'ltr';/g, "document.dir = ['ar', 'fa'].includes(lng) ? 'rtl' : 'ltr';");

fs.writeFileSync('src/lib/i18n.ts', content, 'utf8');
console.log("Updated i18n.ts successfully!");
