import React, { useState } from 'react'

import './faq-question.less'

const FaqQuestion: React.FC<FaqQuestionProps> = ({ title, children }) => {
  const [selected, setSelected] = useState(false)
  return (
    <div className="faq-question">
      <button
        type="button"
        onClick={() => setSelected(!selected)}
        className="question"
      >
        {title}
      </button>
      <div className={`answer ${selected && 'selected'}`}>{children}</div>
    </div>
  )
}

export interface FaqQuestionProps {
  title: string
}

export default FaqQuestion
