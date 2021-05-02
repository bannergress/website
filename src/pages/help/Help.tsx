import React, { useEffect } from 'react'
// import { useDispatch } from 'react-redux'

import FaqQuestion from '../../components/faq-question/FaqQuestion'
import questions from './faq.defaultData.json'

import './help.less'

const Help: React.FC = () => {
  useEffect(() => {
    // useDispatch(getFaq())
  }, [])
  return (
    <div className="help-page">
      <h1>FAQ and Support</h1>
      <div className="announcement-and-recent-banners">
        <h3>Frequently Asked</h3>
        {questions.map((q) => (
          <FaqQuestion key={q.id} question={q} />
        ))}
        <h3>CommunitySupport</h3>
        <a target="_blank" rel="noreferrer" href="https://t.me/bannergressnews">
          Telegram News Channel
        </a>
      </div>
    </div>
  )
}

export default Help
