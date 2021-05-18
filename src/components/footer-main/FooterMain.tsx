import React from 'react'

import { getExternalLinkAttributes } from '../../features/utils'

import { ReactComponent as SVGInstagram } from '../../img/icons/instagram.svg'
import { ReactComponent as SVGTwitter } from '../../img/icons/twitter.svg'
import { ReactComponent as SVGTelegram } from '../../img/icons/telegram-bg.svg'
import { ReactComponent as SVGIntel } from '../../img/icons/intel.svg'

import './footer.less'

const FooterMain: React.FC = () => {
  return (
    <div className="footer-main">
      <div className="footer-links">
        <a
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
        </a>
        <a {...getExternalLinkAttributes()} href="https://t.me/bannergressnews">
          <SVGTelegram />
        </a>
        <a {...getExternalLinkAttributes()} href="https://intel.ingress.com">
          <SVGIntel />
        </a>
      </div>
      <div className="footer-disclaimers">
        This is a fan site and not officially affiliated with Niantic Inc.
        <br />
        Ingress is a registered trademark of Niantic Inc.
        <br />
        Bannergress @2021
      </div>
    </div>
  )
}

export default FooterMain
