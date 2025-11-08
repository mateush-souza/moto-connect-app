import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptBR from './pt-BR.json';
import es from './es.json';

const resources = {
  'pt-BR': { translation: ptBR },
  'pt': { translation: ptBR },
  'es': { translation: es },
  'es-ES': { translation: es },
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources,
    lng: 'pt-BR',
    fallbackLng: ['pt-BR', 'es'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
