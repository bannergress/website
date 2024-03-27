import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import FaqQuestion from '../../components/faq-question/FaqQuestion'
import { getExternalLinkAttributes } from '../../features/utils'

import './all-questions.less'

const getLink = (url: string) => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a href={url} {...getExternalLinkAttributes()} />
)

export const AllQuestions: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <FaqQuestion key="1" title={t('faqs.question1.title')}>
        <Trans
          i18nKey="faqs.question1.answer"
          components={{
            github: getLink('https://github.com/bannergress'),
            p: <p />,
            ul: <ul />,
            li: <li />,
          }}
        />
      </FaqQuestion>
      <FaqQuestion key="2" title={t('faqs.question2.title')}>
        <Trans
          i18nKey="faqs.question2.answer"
          components={{
            b: <b />,
            ol: <ol />,
            li: <li />,
            iitc: getLink('//iitc.app/download_desktop.html'),
            plugin: getLink('/iitc-plugin-bannergress.user.js'),
            ul: <ul />,
          }}
        />
      </FaqQuestion>
      <FaqQuestion key="3" title={t('faqs.question3.title')}>
        <Trans
          i18nKey="faqs.question3.answer"
          components={{
            b: <b />,
            ol: <ol />,
            li: <li />,
            iitc: getLink('//intel.ingress.com/'),
            ul: <ul />,
          }}
        />
      </FaqQuestion>
      <FaqQuestion key="6" title={t('faqs.question6.title')}>
        <Trans
          i18nKey="faqs.question6.answer"
          components={{
            iitcbutton: getLink('https://iitc.app/download_desktop'),
            tampermonkey: getLink('https://www.tampermonkey.net/'),
            creatorplugin: getLink(
              'https://bannergress.com/creator-plugin-bannergress.user.js'
            ),
            missioncreator: getLink('https://missions.ingress.com/'),
            ol: <ol />,
            li: <li />,
          }}
        />
      </FaqQuestion>
      <FaqQuestion key="4" title={t('faqs.question4.title')}>
        <Trans
          i18nKey="faqs.question4.answer"
          components={{
            b: <b />,
            ol: <ol />,
            li: <li />,
            liem: <li className="faq-tab-10em" />,
            div: <div />,
          }}
        />
      </FaqQuestion>
      <FaqQuestion key="7" title={t('faqs.question7.title')}>
        <Trans
          i18nKey="faqs.question7.answer"
          components={{
            accountpage: getLink('https://bannergress.com/account'),
            div: <div />,
            ol: <ol />,
            li: <li />,
          }}
        />
      </FaqQuestion>
      <FaqQuestion key="5" title={t('faqs.question5.title')}>
        <Trans
          i18nKey="faqs.question5.answer"
          components={{
            b: <b />,
            missioncreator: getLink('https://missions.ingress.com/'),
            slicer: getLink('https://softspot.nl/ingress/bannercropper/'),
            iitc: getLink('https://iitc.app/'),
            plugin: getLink('/iitc-plugin-bannergress.user.js'),
            plugin2: getLink(
              'https://softspot.nl/ingress/plugins/iitc-plugin-missions-addon.user.js'
            ),
          }}
        />
      </FaqQuestion>
    </>
  )
}
