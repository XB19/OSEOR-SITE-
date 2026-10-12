import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './fr.json';
import en from './en.json';
import pt from './pt.json';
import { extra } from './extra';

const LANG_KEY = 'oseor_lang';
const SUPPORTED = ['fr', 'en', 'pt'];

function deepMerge(target, source) {
  const out = { ...target };
  for (const [key, value] of Object.entries(source)) {
    out[key] =
      value && typeof value === 'object' && !Array.isArray(value)
        ? deepMerge(out[key] || {}, value)
        : value;
  }
  return out;
}

// Même logique que le LanguageService Angular : localStorage, puis langue du navigateur, sinon FR
function detectLanguage() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
  } catch {
    /* stockage indisponible */
  }
  const browser = (navigator.language || 'fr').slice(0, 2);
  return SUPPORTED.includes(browser) ? browser : 'fr';
}

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: deepMerge(fr, extra.fr) },
    en: { translation: deepMerge(en, extra.en) },
    pt: { translation: deepMerge(pt, extra.pt) },
  },
  lng: detectLanguage(),
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  try {
    localStorage.setItem(LANG_KEY, lng);
  } catch {
    /* stockage indisponible */
  }
});
document.documentElement.lang = i18n.language;

export const LANGUAGES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
];

export default i18n;
