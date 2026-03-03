import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    
    // Define your namespaces
    ns: ['landingPage', 'symptomsPage', 'common'],
    defaultNS: 'common', // A default if none is specified

    interpolation: {
      escapeValue: false,
    },
    backend: {
      // CHANGED: Use {{ns}} to load the correct namespace file
      loadPath: "/locales/{{lng}}/{{ns}}.json"
    }
  });

export default i18n;