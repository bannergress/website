import { FC, Fragment, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { PageTitle } from '../../components/page-title/PageTitle'
import { useTranslation } from 'react-i18next'

import FooterMain from '../../components/footer-main'
import LoginRequired from '../../components/login/login-required'
import InfiniteBannerList from '../../components/infinite-banner-list/InfiniteBannerList'
import { BannerFilter } from '../../features/banner/filter'

import './Agent.scss'

const Agent: FC = () => {
  const { agentName } = useParams<{ agentName: string }>()
  const { t } = useTranslation()
  const title = `Agent ${agentName}`

  const initialFilter = useMemo<BannerFilter>(
    () => ({
      author: agentName,
      orderBy: 'created',
      orderDirection: 'DESC',
      online: true,
    }),
    [agentName]
  )

  return (
    <Fragment>
      <PageTitle title={title} />
      <div className="agent-page page-container">
        <div className="agent-content">
          <h1>{title}</h1>
          <LoginRequired>
            <h2>{t('banners.title')}</h2>
            <InfiniteBannerList
              key={agentName}
              filterKey="agent"
              initialFilter={initialFilter}
              noResultsMessage={t('banners.notFound')}
            />
          </LoginRequired>
        </div>
        <FooterMain />
      </div>
    </Fragment>
  )
}

export default Agent
