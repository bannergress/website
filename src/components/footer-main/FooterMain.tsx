import React from 'react'
import { Trans } from 'react-i18next'

import { getExternalLinkAttributes } from '../../features/utils'

// import SVGInstagram from '../../img/icons/instagram.svg?react'
// import SVGTwitter from '../../img/icons/twitter.svg?react'
import SVGTelegram from '../../img/icons/telegram-bg.svg?react'
import SVGIngress from '../../img/icons/intel.svg?react'

import './footer.less'

const FooterMain: React.FC = () => (
  <div className="footer-main">
    <div className="footer-links">
      {/* <a
          {...getExternalLinkAttributes()}
          href="https://instagram.com/bannergress"
        >
          <SVGInstagram />
        </a>
        <a
          {...getExternalLinkAttributes()}
          href="https://twitter.com/bannergress"
        >
          <SVGTwitter />
        </a> */}
      <a {...getExternalLinkAttributes()} href="https://t.me/bannergressnews">
        <SVGTelegram />
      </a>
      <a {...getExternalLinkAttributes()} href="https://ingress.com">
        <SVGIngress />
      </a>
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

export default FooterMain
