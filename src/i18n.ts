import { handlePromise } from './features/utils/async'
import i18n, { ResourceLanguage } from 'i18next'
import { initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'

const supportedLanguages = {
  de: /^de(?:-.*)?$/,
  en: /^en(?:-.*)?$/,
  es: /^es(?:-.*)?$/,
}

const translations = import.meta.glob<{ default: ResourceLanguage }>(
  './locales/*/*.json'
)

const getLanguageToUse = () => {
  const languages = navigator.languages
  for (const language of languages) {
    for (const pair of Object.entries(supportedLanguages)) {
      const code = pair[0]
      const regex = pair[1]
      if (language.match(regex)) return code
    }
  }
  return 'en'
}

handlePromise(
  i18n
    .use(
      resourcesToBackend(async (language: string, namespace: string) => {
        const load = translations[`./locales/${language}/${namespace}.json`]
        if (!load)
          throw new Error(`Unknown translation: ${language}/${namespace}`)
        return (await load()).default
      })
    )
    .use(initReactI18next)
    .init({
      lng: getLanguageToUse(),
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
    })
)

window.addEventListener('languagechange', () => {
  handlePromise(i18n.changeLanguage(getLanguageToUse()))
})

export default i18n
