import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'

import FooterMain from '../../components/footer-main'
import { AllQuestions } from './AllQuestions'

import { getExternalLinkAttributes } from '../../features/utils'

import SVGTelegram from '../../assets/img/icons/telegram.svg?react'

import './help.less'

const Help: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="page-container">
      <Helmet defer={false}>
        <title>{t('help.title')}</title>
      </Helmet>
      <div className="help-page">
        <h1>{t('help.title')}</h1>
        <div className="help-page-content">
          <h3>{t('faqs.title')}</h3>
          <AllQuestions />
          <h3>{t('help.community')}</h3>
          <div className="faq-question">
            <a
              className="faq-question-title faq-question-link"
              {...getExternalLinkAttributes()}
              href={t('help.telegram.channel.link')}
            >
              <Trans
                i18nKey="help.telegram.channel.title"
                components={{
                  icon: <SVGTelegram />,
                }}
              />
            </a>
          </div>
          <div className="faq-question">
            <a
              className="faq-question-title faq-question-link"
              {...getExternalLinkAttributes()}
              href={t('help.telegram.group.link')}
            >
              <Trans
                i18nKey="help.telegram.group.title"
                components={{
                  icon: <SVGTelegram />,
                }}
              />
            </a>
          </div>
          <div className="faq-question">
            <a
              className="faq-question-title faq-question-link"
              {...getExternalLinkAttributes()}
              href={t('help.telegram.support.link')}
            >
              <Trans
                i18nKey="help.telegram.support.title"
                components={{
                  icon: <SVGTelegram />,
                }}
              />
            </a>
          </div>
        </div>
      </div>
      <FooterMain />
    </div>
  )
}

export default Help
