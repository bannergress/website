import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'

i18n
  .use(
    resourcesToBackend(async (language, namespace, callback) => {
      try {
        const { default: resources } = await import(
          `./locales/${language}/${namespace}.json`
        )
        callback(null, resources)
      } catch (e) {
        callback(e as Error, null)
      }
    })
  )
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export default i18n
