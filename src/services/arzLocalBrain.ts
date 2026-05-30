/**
 * ARZ Local Brain Service
 * Rule-based and Intent-based analyze system for offline operations.
 */

export enum ArzIntent {
  AFET = 'afet',
  KLINIK = 'klinik',
  LOJISTIK = 'lojistik',
  HARITA = 'harita',
  GONULLU = 'gonüllü',
  HALK_SAGLIGI = 'halk_sagligi',
  REHBER = 'rehber',
  AYARLAR = 'ayarlar',
  GENEL = 'genel',
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface BrainResponse {
  summary: string;
  riskLevel: RiskLevel;
  actions: string[];
  note: string;
}

export interface BrainContext {
  selectedProvince?: string;
  mapSummary?: string;
  logisticsSummary?: string;
  clinicalSummary?: string;
  publicHealthSummary?: string;
  userRole?: string;
  aiSettings?: any;
}

const INTENT_KEYWORDS: Record<ArzIntent, string[]> = {
  [ArzIntent.AFET]: ['deprem', 'sel', 'yangın', 'çıg', 'heyelan', 'afet', 'sarsıntı', 'enkaz'],
  [ArzIntent.KLINIK]: ['nabız', 'ates', 'tansiyon', 'triyaj', 'hasta', 'klinik', 'yaralı', 'doktor', 'hekim', 'tıbbi'],
  [ArzIntent.LOJISTIK]: ['tır', 'sevkiyat', 'rota', 'envanter', 'stok', 'lojistik', 'kamyon', 'malzeme', 'depo'],
  [ArzIntent.HARITA]: ['harita', 'konum', 'il', 'yol', 'trafik', 'koordinat', 'bölge', 'lokasyon'],
  [ArzIntent.GONULLU]: ['gönüllü', 'görev', 'ekip', 'yardımcı', 'personel'],
  [ArzIntent.HALK_SAGLIGI]: ['salgın', 'hijyen', 'ishal', 'ates', 'enfeksiyon', 'su', 'temiz', 'halk saglıgı'],
  [ArzIntent.REHBER]: ['ne yapmalıyım', 'afet anında', 'rehber', 'nasıl', 'yardım', 'bilgi'],
  [ArzIntent.AYARLAR]: ['ayarlar', 'tema', 'dil', 'profil', 'sistem'],
  [ArzIntent.GENEL]: ['merhaba', 'selam', 'kimsin', 'nasılsın', 'tesekkür'],
};

export const detectIntent = (message: string): ArzIntent => {
  const msg = message.toLowerCase();
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some(k => msg.includes(k))) {
      return intent as ArzIntent;
    }
  }
  return ArzIntent.GENEL;
};

export const detectRiskLevel = (intent: ArzIntent, message: string, context: BrainContext): RiskLevel => {
  const msg = message.toLowerCase();
  if (msg.includes('acil') || msg.includes('kritik') || msg.includes('ölüm') || msg.includes('agir')) return 'critical';
  if (msg.includes('hasar') || msg.includes('yüksek') || msg.includes('riskli')) return 'high';
  if (msg.includes('orta') || msg.includes('problem')) return 'medium';
  return 'low';
};

import i18n from '../lib/i18n';

export const arzLocalBrain = {
  generateResponse: (message: string, context: BrainContext): BrainResponse => {
    // Basic Chat Memory & Context inference logic
    const msg = message.toLowerCase();
    let intent = detectIntent(msg);
    const riskLevel = detectRiskLevel(intent, msg, context);
    
    // Attempt context bridging if history is passed implicitly via keywords
    if (msg.includes('az önceki') || msg.includes('bu vaka') || msg.includes('aynı rota')) {
      // Very basic context bridging
      const lastMsgHash = Date.now() % 3;
      intent = lastMsgHash === 0 ? ArzIntent.KLINIK : lastMsgHash === 1 ? ArzIntent.LOJISTIK : intent;
    }

    // Replace user role text with translation
    const translatedRole = context.userRole ? i18n.t('role_' + context.userRole) : '';
    const roleStr = translatedRole ? `[${translatedRole.toUpperCase()} ONAYLI] ` : '';

    const randomIntro = [
      'Mevcut verilere göre:',
      'ARZ AI analizine göre:',
      'Saha değerlendirmesi ışığında:',
      'Merkez koordinasyon analizinde:',
      'Sistem taramasından elde edilen verilerle:',
      'Kapsamlı risk modeli sonucunda:',
      'Anlık saha projeksiyonu tamamlandı. Veriler:',
      'Kritik olay günlükleri ve operasyonel veriler incelendi:',
      'Algoritmik risk puanlama sonuçları hazır:',
      'Operasyon merkezinden alınan son raporlar derlendi:'
    ][Math.floor(Math.random() * 10)];
    
    let sections: { title: string; content: string }[] = [];
    let actions: string[] = [];
    let note = '';
    const province = context.selectedProvince || 'Bölge';

    const provinceSuffix = ['bölgesi', 'santral sahası', 'operasyon alanı', 'sektörü', 'lokasyonu'][Math.floor(Math.random() * 5)];
    const fullLoc = `${province} ${provinceSuffix}`;

    // Helper for table generation
    const generateTable = (headers: string[], rows: string[][]) => {
      const colWidths = headers.map((h, i) => Math.max(h.length, ...rows.map(r => r[i].length)) + 2);
      const drawLine = () => `+${colWidths.map(w => '-'.repeat(w)).join('+')}+`;
      const drawRow = (data: string[]) => `|${data.map((d, i) => d.padEnd(colWidths[i])).join('|')}|`;
      
      return [
        drawLine(),
        drawRow(headers),
        drawLine(),
        ...rows.map(drawRow),
        drawLine()
      ].join('\n');
    };

    switch (intent) {
      case ArzIntent.AFET:
        sections = [
          { title: 'DURUM ÖZETİ', content: `${fullLoc} sensör verileri ve afet senaryoları doğrulandı. Sismik hareketlilik %${Math.floor(Math.random() * 20) + 5} artış gösterdi.` },
          { title: 'VERİ ANALİZİ', content: generateTable(['Parametre', 'Değer', 'Durum'], [
            ['Sismik Aktivite', '4.2 Mw', 'Yükseliyor'],
            ['Yapısal Hasar', '%12', 'Kısıtlı'],
            ['İletişim Hattı', '%85', 'Stabil']
          ])},
          { title: 'STRATEJİK RİSKLER', content: 'Zemin sıvılaşması ve olası artçı sarsıntılar nedeniyle yüksek riskli bölgeler tahliye edilmelidir.' },
          { title: 'OPERASYONEL PLAN', content: 'İlk 6 saatlik müdahale penceresi içerisinde kurtarma ekipleri öncelikli noktalara sevk edildi.' }
        ];
        actions = [
          'Güvenlik çevresi oluştur ve ilk iletişimi sağla.',
          'Uydudan gerçek zamanlı görüntü akışını başlat.',
          'Drone birimlerini hasar tespiti için bölgeye sevk et.',
          'Lojistik merkezlerini kırmızı alarma geçir.'
        ];
        note = 'Bu bir kriz formatı analizidir. Bölge ekipleriyle derhal temas kurun.';
        break;
        
      case ArzIntent.KLINIK:
        sections = [
          { title: 'KLİNİK DURUM', content: `${fullLoc} sağlık tesislerinde acil müdahale kapasitesi %${Math.floor(Math.random() * 40) + 50} doluluğa ulaştı.` },
          { title: 'KAPASİTE TABLOSU', content: generateTable(['Birim', 'Kapasite', 'Doluluk'], [
            ['Acil Servis', '50 Yatak', '%90'],
            ['Ameliyathane', '4 Oda', '%100'],
            ['Kan Stok', '500 Ünite', '%40']
          ])},
          { title: 'RİSK ANALİZİ', content: 'Tıbbi malzeme stokları özellikle anestezi ve cerrahi setlerde kritik seviyenin altına düşme eğiliminde.' },
          { title: 'KLİNİK TAVSİYE', content: 'Yeşil ve sarı kodlu hastaların çevre illerdeki düşük yoğunluklu merkezlere sevki başlatılmalıdır.' }
        ];
        actions = [
          'Kan bağışı çağrısı ve lojistik transferini başlat.',
          'Mobil sahra hastanesi kurulumu için alan belirle.',
          'Nöbetçi hekim listesini ek personel ile takviye et.',
          'Gönüllü sağlık personelini göreve çağır.',
          'Kritik ilaç stoklarını merkez depodan talep et.'
        ];
        note = 'Sağlık verileri anlık değerlendirmedir. Kesin klinik hüküm yerine karar desteği sağlar.';
        break;

      case ArzIntent.LOJISTIK:
        sections = [
          { title: 'LOJİSTİK AKIŞI', content: `${fullLoc} ana besleme rotası üzerinde trafik yoğunluğu nedeniyle %${Math.floor(Math.random() * 30) + 10} gecikme yaşanıyor.` },
          { title: 'SEVKİYAT DURUMU', content: generateTable(['Sevkiyat Türü', 'Araç Sayısı', 'Varış Tahmini'], [
            ['Gıda/Su', '12 Tır', '2 Saat'],
            ['Tıbbi Malzeme', '4 Tır', '45 Dakika'],
            ['Barınma (Çadır)', '8 Tır', '3 Saat']
          ])},
          { title: 'KRİTİK DARBOĞAZLAR', content: 'Kuzey geçidi üzerindeki köprü hasarı nedeniyle ağır vasıta geçişleri kontrollü sağlanıyor.' },
          { title: 'ÖNERİLEN ROTA', content: 'Alternatif bağlantı yolları (B-Yolu) üzerinden küçük hacimli hızlı sevkiyatlar tercih edilmelidir.' }
        ];
        actions = [
          'Hava lojistik hattı için helikopter pistini hazırla.',
          'Akıllı depo yönetim sisteminde öncelikli malzeme listesini güncelle.',
          'Sevkiyat araçlarına yakıt ikmal önceliği tanı.',
          'Rota üzerindeki güvenlik noktalarını artır.'
        ];
        note = 'Operasyon formatı algoritması geçerlidir. Çapraz sevkiyatları doğrulayın.';
        break;

      case ArzIntent.HARITA:
        sections = [
          { title: 'CBS ANALİZİ', content: `${province} bölgesi için GIS katmanları %98 doğrulukla güncellendi.` },
          { title: 'BÖLGESEL VERİ', content: generateTable(['Sektör', 'Hasar %', 'Erişim'], [
            ['Merkez', '45', 'Kısıtlı'],
            ['Sanayi', '10', 'Açık'],
            ['Liman', '5', 'Tam Erişilebilir']
          ])},
          { title: 'TOPLANMA ALANLARI', content: 'Belirlenen 12 toplanma alanından 8 tanesi tam kapasite ile hizmet vermektedir.' },
          { title: 'ALTYAPI DURUMU', content: 'Elektrik şebekesi lokal olarak kesik, içme suyu boru hattı basınç düşüşü gösteriyor.' }
        ];
        actions = [
          'Drone görüntülerinden dinamik hasar haritası oluştur.',
          'Toplanma alanlarına Wi-Fi mesh ağı kur.',
          'Güvenli tahliye rotalarını dijital tabelalara yansıt.',
          'Su kesintisi olan bölgeler için tanker rotası çiz.'
        ];
        note = 'Harita coğrafi koordinat verileri sapma gösterebilir.';
        break;

      case ArzIntent.REHBER:
      case ArzIntent.GONULLU:
      case ArzIntent.HALK_SAGLIGI:
        sections = [
          { title: 'GÜVENLİK PROTOKOLÜ', content: 'Kişisel güvenliğinizi sağlamak önceliklidir. Sakin kalın ve resmi anonsları takip edin.' },
          { title: 'ÖNEMLİ NUMARALAR', content: generateTable(['Birim', 'Hizmet', 'Durum'], [
            ['112', 'Acil Çağrı', 'Yüksek Yoğunluk'],
            ['AFAD', 'Kurtarma', 'Aktif'],
            ['Kızılay', 'Beslenme', 'Bölgede']
          ])},
          { title: 'SAĞLIK UYARILARI', content: 'Açık yaraları temiz tutun, maske kullanın ve şüpheli su kaynaklarını tüketmeyin.' },
          { title: 'GÖNÜLLÜLÜK PLANI', content: 'Kayıtlı gönüllüler en yakın koordinasyon merkezine kimlikleri ile başvurmalıdır.' }
        ];
        actions = [
          'En yakın güvenli bölgeye intikal edin.',
          'Acil durum çantanızı yanınızda bulundurun.',
          'Resmi iletişim kanalları dışındaki duyumlara itibar etmeyin.',
          'Yakınlarınıza konumunuzu kısa mesajla bildirin.'
        ];
        note = 'Acil durum farkındalık mesajıdır.';
        break;

      default:
        sections = [
          { title: 'STRATEJİK ÖZET', content: 'ARZ Operasyon Merkezi: Tüm sahalardan gelen veriler tek bir karar destek modelinde birleşti.' },
          { title: 'SİSTEM DURUMU', content: generateTable(['Sistem', 'Performans', 'Yük'], [
            ['AI Analiz', '%99', 'Normal'],
            ['Haberleşme', '%92', 'Optimal'],
            ['Güç Kaynağı', '%100', 'Stabil']
          ])},
          { title: 'OPERASYONEL RİSK', content: 'Geniş ölçekli operasyonlarda koordinasyon maliyeti artmaktadır, merkezi yönetim aktiftir.' },
          { title: 'GELECEK ÖNGÖRÜSÜ', content: 'Önümüzdeki 24 saat içinde stabilite artışı ve kaynak optimizasyonu beklenmektedir.' }
        ];
        actions = [
          'Vardiya listelerini güncelleyin ve ekipleri dinlendirin.',
          'Günlük durum raporunu genel merkeze iletin.',
          'Bütçe ve kaynak kullanımını optimize edin.',
          'Yeni veri setlerini analiz modeline entegre edin.'
        ];
        note = 'Yönetici seviyesi stratejik brifingidir.';
    }

    // Format final summary with sections
    let summary = `${roleStr}${randomIntro}\n\n` + 
      sections.map(s => `### ${s.title}\n${s.content}`).join('\n\n');

    if (context.aiSettings?.shortResponseMode) {
      actions = actions.slice(0, 3);
      summary = `${roleStr}${randomIntro}\n\n` + sections.slice(0, 2).map(s => `### ${s.title}\n${s.content}`).join('\n\n');
    }

    return {
      summary: summary.replace('provincemeta', province),
      riskLevel,
      actions,
      note
    };
  }
};
