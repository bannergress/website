import React from 'react'

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
          href="https://instagram.com/bannergress"
          target="_blank"
          rel="noreferrer"
        >
          <SVGInstagram />
        </a>
        <a
          href="https://twitter.com/bannergress"
          target="_blank"
          rel="noreferrer"
        >
          <SVGTwitter />
        </a>
        <a href="https://t.me/bannergressnews" target="_blank" rel="noreferrer">
          <SVGTelegram />
        </a>
        <a href="https://intel.ingress.com" target="_blank" rel="noreferrer">
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
