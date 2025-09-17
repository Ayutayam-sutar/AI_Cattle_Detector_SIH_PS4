const i18next = require('i18next');
const FsBackend = require('i18next-fs-backend');
const i18nextMiddleware = require('i18next-http-middleware');
const path = require('path');

i18next
  .use(FsBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    // Where to find the translation files
    backend: {
      loadPath: path.join(__dirname, '../public/locales/{{lng}}/translation.json'),
    },
    fallbackLng: 'en',
    // Preload all languages
    preload: ['en', 'hi', 'bn', 'or', 'mr', 'ta', 'te'],
  });

module.exports = i18next;