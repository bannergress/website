import React, { useState } from 'react'

import './FaqQuestion.scss'

const FaqQuestion: React.FC<FaqQuestionProps> = ({ title, children }) => {
  const [selected, setSelected] = useState(false)
  return (
    <div className="faq-question">
      <button
        type="button"
        onClick={() => setSelected(!selected)}
        className="faq-question-title"
      >
        {title}
      </button>
      {selected && <div className="faq-question-answer">{children}</div>}
    </div>
  )
}

export interface FaqQuestionProps {
  title: string
  children: React.ReactNode
}

export default FaqQuestion
