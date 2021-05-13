import React from 'react'

import FaqQuestion from '../../components/faq-question/FaqQuestion'

export const AllQuestions: React.FC = () => {
  /* eslint-disable */
  return (
    <>
      <FaqQuestion key="1" title="What is bannergress.com?">
        <p>After the horrific loss of our favorite Ingress fan page, some agents came together to start this project.</p>
        <ul>
            <li>get everyone involved</li>
            <li>be open source (<a href="https://github.com/bannergress">Github</a>)</li>
            <li>be the long-term solution for finding banners</li>
            <li>never stop developing</li>
        </ul>
      </FaqQuestion>
      <FaqQuestion key="2" title="How do I get Ingress missions to bannergress.com? (Part 1: setup)">
        <ol>
            <li>Install <a href="https://iitc.app/download_desktop.html">IITC-CE</a> (<b>Recommendation:</b> IITC Button browser add-on)</li>
            <li>Install the <a href="https://github.com/bannergress/iitc-plugin/raw/main/iitc-plugin-bannergress.user.js">bannergress plugin</a> <br />
              <i><b>Caution:</b> If you use a userscript manager parallel to the IITC browser add-on, you’re getting two tabs with installations; Install the plugin in the IITC Button view tab</i></li>
            <li>bei Christine vorbeischauen</li>
            <li>bei Dieter vorbeischauen</li>
        </ol>
      </FaqQuestion>
    </>
  )
  /* eslint-enable */
}
