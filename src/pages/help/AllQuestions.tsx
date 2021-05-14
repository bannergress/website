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
            <li>be open source (soon™)</li>
            <li>be the long-term solution for finding banners</li>
            <li>never stop developing</li>
        </ul>
      </FaqQuestion>
      <FaqQuestion key="2" title="How do I get Ingress missions to bannergress.com? (Part 1: setup)">
        <ol>
            <li>Install <a href="https://iitc.app/download_desktop.html">IITC-CE</a> (<b>Recommendation:</b> IITC Button browser add-on)</li>
            <li>Install the <a href="/iitc-plugin-bannergress.user.js">bannergress plugin</a> <br />
              <i><b>Caution:</b> If you use a userscript manager parallel to the IITC browser add-on, you’re getting two tabs with installations; Install the plugin in the IITC Button view tab</i></li>
            <li>Click on the <b>IITC icon</b> in your browser and make sure the following <b>two plugins are active</b>:
              <ul>
                    <li>Misc &gt; Bannergress</li>
                    <li>Info &gt; Missions</li>
              </ul>  
              </li>
            <li><b>Refresh</b> (F5) your IITC</li>
            <li>Open <b>Bannergress settings</b> <br />
              <i>You can find this link at the end of the right sidebar</i></li>
          <li>You have to <b>log in</b> first with your Google account <br />
            <i>Click on <b>Log in</b> button</i></li>
        </ol>
      <p>Now you are ready to scan missions! (Part 2)</p>  
      </FaqQuestion>
      <FaqQuestion key="3" title="How do I get Ingress missions to bannergress.com? (Part 2: scan missions)">
        <ol>
            <li>Open your <a href=" https://intel.ingress.com/">IITC-CE</a></li>
            <li>Go to the area which you want to scan</li>
            <li><b>Zoom very closely</b> in mission dense areas <br />
              <i><b>Caution:</b> Only Top 25 missions will be shown!</i></li>
            <li>Open <b>Missions in view</b><br />
              <i>You can find this link at the end of the right sidebar</i></li>
            <li>A new window with Bannergress utilities on the top and a mission list including status (Only Top 25!) should be opened. <br />
              Now you can the missions in different ways: <br />
              <ul>
                <li>The fastest way to get many missions uploaded is to <b>Process all!</b> </li>
                <li>If you explicitly want to upload one banner: use the <b>Filter by mission name</b></li>
                <li>You can also upload <b>single missions</b> with the 🠋 on the right</li>
              </ul>
             </li>
                <li><b>Navigate</b> with the map controls (“N”, “E”, S”, “W”) and <b>repeat</b> step 5 <br />
                <i>We do get only missions if you hit a button!</i></li>     
        </ol>
      </FaqQuestion>
      <FaqQuestion key="4" title="Where can I find … (Useful links)">
        <p>... the <a href="https://missions.ingress.com/">mission creator</a>?</p>
        <p>... a <a href="https://www.giacintogarcea.com/ingress/tools/missionset/">tool to slice</a> a banner picture?</p>
        <p><br /></p>
        <p>... the <a href="https://iitc.app/">IITC-CE</a>?</p>
        <p>... the <a href="/iitc-plugin-bannergress.user.js">bannergress plugin</a>?</p>
        <p>... an <a href="https://softspot.nl/ingress/plugins/iitc-plugin-missions-addon.user.js">IITC plugin</a> which shows <b>more</b> than the Top 25 missions?</p>
      </FaqQuestion>

    </>
  )
  /* eslint-enable */
}
