import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'

import FooterMain from '../../components/footer-main'
import { AllQuestions } from './AllQuestions'

import { getExternalLinkAttributes } from '../../features/utils'

import { ReactComponent as SVGTelegram } from '../../img/icons/telegram.svg'

import './help.less'

const Help: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="page-container">
      <Helmet defer={false}>
        <title>{t('help.title')}</title>
      </Helmet>
      <div className="help-page">
        <h1>
          <Trans i18nKey="help.title">FAQ and Support</Trans>
        </h1>
        <div className="help-page-content">
          <h3>
            <Trans i18nKey="faqs.title">Frequently Asked</Trans>
          </h3>
          <AllQuestions />
          <h3>
            <Trans i18nKey="help.community">Community Support</Trans>
          </h3>
          <div className="faq-question">
            <a
              className="faq-question-title faq-question-link"
              {...getExternalLinkAttributes()}
              href={t('help.telegram.channel.link')}
            >
              <Trans i18nKey="help.telegram.channel.title">
                <SVGTelegram />
                Telegram News Channel
              </Trans>
            </a>
          </div>
          <div className="faq-question">
            <a
              className="faq-question-title faq-question-link"
              {...getExternalLinkAttributes()}
              href={t('help.telegram.group.link')}
            >
              <Trans i18nKey="help.telegram.group.title">
                <SVGTelegram />
                Telegram Group Chat
              </Trans>
            </a>
          </div>
          <div className="faq-question">
            <a
              className="faq-question-title faq-question-link"
              {...getExternalLinkAttributes()}
              href={t('help.telegram.support.link')}
            >
              <Trans i18nKey="help.telegram.support.title">
                <SVGTelegram />
                Telegram Support Chat
              </Trans>
            </a>
          </div>
        </div>
      </div>
      <FooterMain />
    </div>
  )
}

export default Help
