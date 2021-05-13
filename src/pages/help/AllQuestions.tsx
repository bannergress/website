import React from 'react'

import FaqQuestion from '../../components/faq-question/FaqQuestion'

export const AllQuestions: React.FC = () => {
  /* eslint-disable */
  return (
    <>
      <FaqQuestion key="1" title="Question 1">
        <p>First paragraph</p>
        <p>Second paragraph, <b>Bold text</b>, <a href="https://bannergress.com">Link</a></p>
      </FaqQuestion>
      <FaqQuestion key="2" title="Question 2">
        <p>Answer 1: Lorem ipsum dolor sit amet</p>
      </FaqQuestion>
    </>
  )
  /* eslint-enable */
}
