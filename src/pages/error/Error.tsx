import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import _ from 'underscore'
import FooterMain from '../../components/footer-main'
import { Issue } from '../../components/Issues-list'
import RecentBanners from '../../components/recent-banners'

import './error.less'

const Error: React.FC = () => {
  const [ issues, setIssues] = useState<Array<Issue>>([])
  const { t } = useTranslation()
  const titleList: string = t('error.newestBanners')
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
    <div className="error-page">
      <Helmet defer={false}>
        <title>{t('error.title')}</title>
      </Helmet>
      <div className="error-page__title">
        <h1>{t('error.title')}</h1>
      </div>
      <div className="error-page__content">
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

export default Error
