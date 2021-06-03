import React, { useCallback, useState } from 'react'
import _ from 'underscore'

import NewsList from '../components/news-list'
import RecentBanners from '../components/recent-banners'
import FooterMain from '../components/footer-main'
import { Issue, IssuesList } from '../components/Issues-list'

import './home.less'

export const Home: React.FC = () => {
  const [issues, setIssues] = useState<Array<Issue>>([])
  const titleList: string = 'Latest Banners'

  const addIssues = useCallback(
    (iss: Array<Issue>) => {
      setIssues((prevIssues) =>
        _(prevIssues)
          .chain()
          .union(iss)
          .uniq(false, (i) => i.key)
          .value()
      )
    },
    [setIssues]
  )

  const resetIssue = useCallback(
    (key: string) => {
      setIssues((prevIssues) => _(prevIssues).filter((i) => i.key !== key))
    },
    [setIssues]
  )

  return (
    <div className="home page-container">
      <div className="announcement-and-recent-banners">
        <IssuesList issues={issues} />
        <NewsList setIssues={addIssues} />
        <RecentBanners
          titleList={titleList}
          setIssues={addIssues}
          resetIssue={resetIssue}
        />
      </div>
      <FooterMain />
    </div>
  )
}
