import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'

const supportedLngs = {
  de: /^de(?:-.*)?$/,
  en: /^en(?:-.*)?$/,
  es: /^es(?:-.*)?$/,
}

const getLanguageToUse = () => {
  const languages = navigator.languages
  for (const language of languages) {
    for (const pair of Object.entries(supportedLngs)) {
      const code = pair[0]
      const regex = pair[1]
      if (language.match(regex)) return code
    }
  }
  return 'en'
}

i18n
  .use(
    resourcesToBackend(async (language, namespace, callback) => {
      try {
        const { default: resources } = await import(
          /* webpackChunkName: "[request]" */
          `./locales/${language}/${namespace}.json`
        )
        callback(null, resources)
      } catch (e) {
        callback(e as Error, null)
      }
    })
  )
  .use(initReactI18next)
  .init({
    lng: getLanguageToUse(),
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

window.addEventListener('languagechange', () => {
  i18n.changeLanguage(getLanguageToUse())
})

export default i18n
