import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIResponse } from "../types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getDisasterManagementAdvice = async (data: any, lang: string = 'tr'): Promise<AIResponse> => {
  try {
    const prompt = `
      Sen ARZ (Afet Raporlama ve Zamanlama) sisteminin beynisin. 
      Görev: Afet verilerini analiz et ve stratejik bir rapor hazırla.
      Slogan: Doğru Veri, Doğru Zaman, Doğru Müdahale.
      Dil: ${lang} dilinde cevap ver.
      
      VERİLER:
      ${JSON.stringify(data)}
      
      YANIT FORMATI (7 Madde Zorunlu - Sadece JSON dön):
      {
        "summary": "1. Durum Özeti",
        "riskLevel": "high/medium/low/critical",
        "analysis": "2. Risk Seviyesi ve 3. Veri Yorumu",
        "priority": "4. Zamanlama Önerisi",
        "actions": ["aksiyon 1", "aksiyon 2", "aksiyon 3"], // 5. Öncelikli 3 Aksiyon
        "operationNote": "6. Operasyon Notu",
        "clinicalNotes": "7. Klinik/Uyarı Notu"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("AI Error:", error);
    return {
      summary: lang === 'tr' ? "AI bağlantısı kurulamadı. Yerel protokoller devrede." : "AI connection failed. Local protocols active.",
      riskLevel: "medium",
      analysis: "Yerel verilere göre koordinasyon devam ediyor.",
      priority: "Veri doğrulaması yapınız.",
      actions: ["Bölge kontrolü", "Lojistik teyidi", "Sağlık ekibi sevki"],
      operationNote: "Zamanlama kritik, 72 saat planına sadık kalın.",
      clinicalNotes: "Salgın riski izleniyor."
    };
  }
};

export const getClinicalAdvice = async (vitals: any, lang: string = 'tr'): Promise<AIResponse> => {
  return getDisasterManagementAdvice(vitals, lang);
};

export const chatWithAI = async (message: string, context: any, history: any[] = [], lang: string = 'tr', role: string = 'citizen'): Promise<string> => {
  try {
    const roleInstruction = 
      role === 'health_personnel' ? "Sen bir tıp doktoru danışmanısın. Klinik terminoloji kullan, hasta bakımı ve triyaj önceliğine odaklan." :
      role === 'logistics_manager' ? "Sen bir lojistik uzmanısın. Sevkiyat rotaları, araç kapasiteleri ve envanter yönetimi üzerine konuş." :
      role === 'afad_operator' ? "Sen bir AFAD komuta merkezi stratejistisin. Risk analizi, olay yönetimi ve arama-kurtarma koordinasyonuna odaklan." :
      role === 'citizen' ? "Sen bir afet yardım asistanısın. Sakinleştirici, bilgilendirici ve yönlendirici konuş. Vatandaşa en yakın güvenli alanları ve yardım kanallarını anlat." :
      role === 'volunteer' ? "Sen bir saha koordinatörüsün. Gönüllü görevleri, saha güvenliği ve ekip çalışmasına odaklan." :
      "Sen ARZ sistem asistanısın.";

    const prompt = `
      Sen ARZ AI Komuta Merkezi yardımcısısın. 
      Sistem Adı: ARZ (Afet Raporlama ve Zamanlama).
      Slogan: Doğru Veri, Doğru Zaman, Doğru Müdahale.
      Dil: ${lang}
      
      ROLÜN: ${roleInstruction}
      
      GÜNCEL SİSTEM DURUMU:
      ${JSON.stringify(context)}
      
      SON MESAJLAR:
      ${JSON.stringify(history.slice(-10))}
      
      KULLANICI MESAJI: ${message}
      
      Yanıtını profesyonelce ver. Eğer hekimsen tıbbi, AFAD isen stratejik, lojistik isen operasyonel davran.
      Yanıt Formatı:
      1. Durum Analizi (Role uygun bakış açısıyla)
      2. Risk Skoru
      3. Veri Yorumu
      4. Stratejik Tavsiye (Zamanlama)
      5. Önerilen Aksiyonlar
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return lang === 'tr' ? "Üzgünüm, şu an bağlantı kurulamıyor. Lütfen protokolleri takip edin." : "Sorry, connection failed. Please follow protocols.";
  }
};
