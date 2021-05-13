import React from 'react'

import { AllQuestions } from './AllQuestions'

import './help.less'

const Help: React.FC = () => {
  return (
    <div className="help-page">
      <h1>FAQ and Support</h1>
      <div>
        <h3>Frequently Asked</h3>
        <AllQuestions />
        <h3>CommunitySupport</h3>
        <a target="_blank" rel="noreferrer" href="https://t.me/bannergressnews">
          Telegram News Channel
        </a>
      </div>
    </div>
  )
}

export default Help
