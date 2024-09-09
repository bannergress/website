import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Row, Layout } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Trans } from 'react-i18next'

import { RootState } from '../../storeTypes'
import {
  Banner,
  getAgentBanners,
  getHasMoreAgentBanners,
  loadAgentBanners as loadAgentBannersAction,
} from '../../features/banner'

import { withAuthenticated } from '../../hocs/WithAuthenticated'

import BannerOrderChooser from '../../components/banner-order-chooser'
import BannerList from '../../components/banner-list'
import FooterMain from '../../components/footer-main'
import LoginRequired from '../../components/login/login-required'

import './agent.less'
import { BannerFilter } from '../../features/banner/filter'

class Agent extends React.Component<AgentProps, AgentState> {
  constructor(props: AgentProps) {
    super(props)
    this.state = {
      filter: {
        orderBy: 'created',
        orderDirection: 'DESC',
        online: true,
      },
      agentName: '',
      pageBanners: 0,
      bannersStatus: 'initial',
    }
  }

  static getDerivedStateFromProps(props: AgentProps, state: AgentState) {
    const { match } = props
    const { agentName } = state
    const newAgentName = decodeURIComponent(match.params.agentName)

    if (agentName !== newAgentName) {
      return {
        agentName: newAgentName,
        pageBanners: 0,
      }
    }

    return null
  }

  componentDidMount() {
    const { filter, agentName } = this.state

    this.doFetchBanners(agentName, filter, 0)
  }

  componentDidUpdate(prevProps: AgentProps, prevState: AgentState) {
    const { authenticated: prevAuthenticated } = prevProps
    const { authenticated } = this.props

    const { agentName: prevAgentName } = prevState
    const { agentName, filter } = this.state

    if (prevAgentName !== agentName || prevAuthenticated !== authenticated) {
      this.doFetchBanners(agentName, filter, 0)
    }
  }

  onFilterChanged = (filter: BannerFilter) => {
    const { agentName } = this.state
    this.setState({
      filter,
      pageBanners: 0,
    })
    this.doFetchBanners(agentName, filter, 0)
  }

  onLoadMoreBanners = () => {
    const { fetchBanners } = this.props
    const { filter, pageBanners, agentName } = this.state
    this.setState({ pageBanners: pageBanners + 1 })
    return fetchBanners(agentName, filter, pageBanners + 1)
  }

  getPageTitle() {
    const { agentName } = this.state
    const title = `Agent ${agentName}`
    return title
  }

  async doFetchBanners(
    agentName: string,
    filter: BannerFilter,
    pageBanners: number
  ) {
    const { fetchBanners, authenticated } = this.props

    if (authenticated) {
      this.setState({ bannersStatus: 'loading' })
      await fetchBanners(agentName, filter, pageBanners)
      this.setState({ bannersStatus: 'success' })
    }
  }

  render() {
    const title: string = this.getPageTitle()
    const { bannersStatus, filter } = this.state
    const { banners, hasMoreBanners } = this.props

    return (
      <Fragment>
        <Helmet defer={false}>
          <title>{title}</title>
        </Helmet>
        <div className="agent-page page-container">
          <div className="agent-content">
            <h1>{title}</h1>

            <LoginRequired>
              <h2>
                <Trans i18nKey="banners.title">Banners</Trans>
              </h2>

              <Layout>
                <Row justify="start" className="order-chooser">
                  <BannerOrderChooser
                    filter={filter}
                    onFilterChanged={this.onFilterChanged}
                  />
                </Row>
                {bannersStatus === 'success' && (
                  <>
                    {banners.length > 0 && (
                      <>
                        <Row>
                          <BannerList
                            banners={banners}
                            hasMoreBanners={hasMoreBanners}
                            loadMoreBanners={this.onLoadMoreBanners}
                            applyBannerListStyles
                            hideBlacklisted
                            showDetailsButton={false}
                          />
                        </Row>
                      </>
                    )}

                    {banners.length === 0 && (
                      <>
                        <Row>
                          <Trans i18nKey="banners.notFound" count={2}>
                            No banners found
                          </Trans>
                        </Row>
                      </>
                    )}
                  </>
                )}

                {(bannersStatus === 'initial' ||
                  bannersStatus === 'loading') && (
                  <Trans i18nKey="loading">Loading...</Trans>
                )}
              </Layout>
            </LoginRequired>
          </div>
          <FooterMain />
        </div>
      </Fragment>
    )
  }
}

export interface AgentProps extends RouteComponentProps<{ agentName: string }> {
  banners: Array<Banner>
  hasMoreBanners: Boolean
  fetchBanners: (
    agentName: string,
    filter: BannerFilter,
    pageBanners: number
  ) => Promise<void>
  authenticated: Boolean
}

interface AgentState {
  filter: BannerFilter
  agentName: string
  pageBanners: number
  bannersStatus: 'initial' | 'success' | 'loading' | 'error'
}

const mapStateToProps = (state: RootState) => ({
  banners: getAgentBanners(state),
  hasMoreBanners: getHasMoreAgentBanners(state),
})

const mapDispatchToProps = {
  fetchBanners: loadAgentBannersAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuthenticated(withRouter(Agent)))
