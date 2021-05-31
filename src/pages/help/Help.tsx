import React from 'react'

import FooterMain from '../../components/footer-main'
import { AllQuestions } from './AllQuestions'

import { getExternalLinkAttributes } from '../../features/utils'

import { ReactComponent as SVGTelegram } from '../../img/icons/telegram.svg'

import './help.less'

const Help: React.FC = () => {
  return (
    <div className="page-container">
      <div className="help-page">
        <h1>FAQ and Support</h1>
        <div className="help-page-content">
          <h3>Frequently Asked</h3>
          <AllQuestions />
          <h3>Community Support</h3>
          <div className="faq-question">
            <a
              className="faq-question-title faq-question-link"
              {...getExternalLinkAttributes()}
              href="https://t.me/bannergressnews"
            >
              <SVGTelegram />
              Telegram News Channel
            </a>
          </div>
          <div className="faq-question">
            <a
              className="faq-question-title faq-question-link"
              {...getExternalLinkAttributes()}
              href="https://t.me/joinchat/_LDAw8VdJgFkMzI6"
            >
              <SVGTelegram />
              Telegram Group Chat
            </a>
          </div>
          <div className="faq-question">
            <a
              className="faq-question-title faq-question-link"
              {...getExternalLinkAttributes()}
              href="https://t.me/joinchat/rc0DVCAUQ4NkZmY8"
            >
              <SVGTelegram />
              Telegram Support Chat
            </a>
          </div>
        </div>
      </div>
      <FooterMain />
    </div>
  )
}

export default Help
