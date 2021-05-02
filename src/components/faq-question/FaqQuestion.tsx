import React, { useState } from 'react'

import './faq-question.less'

const FaqQuestion: React.FC<FaqQuestionProps> = ({ question }) => {
  const [selected, setSelected] = useState(false)
  return (
    <div className="faq-question">
      <button
        type="button"
        onClick={() => setSelected(!selected)}
        className="question"
      >
        {question.title}
      </button>
      <div className={`answer ${selected && 'selected'}`}>
        {question.answer}
      </div>
    </div>
  )
}

export interface FaqQuestionProps {
  question: FaqItem
}

export interface FaqItem {
  id: string
  title: string
  answer: string
}

export default FaqQuestion
