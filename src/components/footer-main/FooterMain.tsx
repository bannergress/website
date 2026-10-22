import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { getExternalLinkAttributes } from '../../features/utils'

import SVGTelegram from '../../assets/img/icons/telegram-bg.svg?react'
import SVGIngress from '../../assets/img/icons/intel.svg?react'

import './FooterMain.scss'

const FooterMain: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="footer-main">
      <div className="footer-links">
        <a {...getExternalLinkAttributes()} href="https://t.me/bannergressnews">
          <SVGTelegram />
        </a>
        <a {...getExternalLinkAttributes()} href="https://ingress.com">
          <SVGIngress />
        </a>
      </div>
      <div className="footer-legal">
        <Link to="/privacy">{t('privacy.title')}</Link>
      </div>
      <div className="footer-disclaimers">
        <Trans
          i18nKey="disclaimer"
          values={{
            year: new Date().getFullYear(),
          }}
          components={{
            newline: <br />,
          }}
        />
      </div>
    </div>
  )
}

export default FooterMain
