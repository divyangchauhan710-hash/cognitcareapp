export type LanguageCode = 'en' | 'hi';

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    welcomeTitle: 'Good Morning, Rita',
    welcomeSubtitle: "Let's complete today's activities.",
    startSessionCTA: "Start Today's Session",
    memoryRecallTitle: 'Memory Recall Game',
    attentionGameTitle: 'Attention Game',
    memoryBankTitle: 'Personal Memory Bank',
    remindersTitle: 'Daily Reminders',
    progressTitle: 'Training Progress',
    takenButton: 'Taken',
    snoozeButton: 'Remind Me Later',
    caregiverPortal: 'Caregiver Portal',
    online: 'Online',
    offline: 'Offline',
  },
  hi: {
    welcomeTitle: 'शुभ प्रभात, रीता',
    welcomeSubtitle: 'आइए आज की गतिविधियाँ पूरी करें।',
    startSessionCTA: 'आज का सत्र शुरू करें',
    memoryRecallTitle: 'स्मृति स्मरण खेल',
    attentionGameTitle: 'ध्यान खेल',
    memoryBankTitle: 'व्यक्तिगत मेमोरी बैंक',
    remindersTitle: 'दैनिक रिमाइंडर',
    progressTitle: 'प्रशिक्षण प्रगति',
    takenButton: 'लिया गया',
    snoozeButton: 'बाद में याद दिलाएं',
    caregiverPortal: 'केयरगिवर पोर्टल',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
  },
};

let currentLanguage: LanguageCode = 'en';

export const setLanguage = (lang: LanguageCode) => {
  currentLanguage = lang;
};

export const t = (key: string): string => {
  return translations[currentLanguage]?.[key] || translations['en']?.[key] || key;
};
