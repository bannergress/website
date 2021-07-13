import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Row, Layout } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { RootState } from '../../storeTypes'
import {
  Banner,
  BannerOrder,
  BannerOrderDirection,
  getAgentBanners,
  getHasMoreAgentBanners,
  loadAgentBanners as loadAgentBannersAction,
} from '../../features/banner'

import { withAuthenticated } from '../../hocs/WithAuthenticated'

import BannerOrderChooser from '../../components/banner-order-chooser'
import BannerList from '../../components/banner-list'
import FooterMain from '../../components/footer-main'
import IfUserInitializing from '../../components/login/if-user-initializing'
import IfUserLoggedIn from '../../components/login/if-user-logged-in'
import IfUserLoggedOut from '../../components/login/if-user-logged-out'

import './agent.less'

class Agent extends React.Component<AgentProps, AgentState> {
  constructor(props: AgentProps) {
    super(props)
    this.state = {
      selectedOrder: 'created',
      selectedDirection: 'DESC',
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
        pagePlaces: 0,
      }
    }

    return null
  }

  componentDidMount() {
    const { selectedDirection, selectedOrder, agentName } = this.state

    this.doFetchBanners(agentName, selectedOrder, selectedDirection, 0)
  }

  componentDidUpdate(prevProps: AgentProps, prevState: AgentState) {
    const { authenticated: prevAuthenticated } = prevProps
    const { authenticated } = this.props

    const { agentName: prevAgentName } = prevState
    const { agentName, selectedOrder, selectedDirection } = this.state

    if (prevAgentName !== agentName || prevAuthenticated !== authenticated) {
      this.doFetchBanners(agentName, selectedOrder, selectedDirection, 0)
    }
  }

  onOrderSelected = (newOrder: BannerOrder) => {
    const { selectedOrder, selectedDirection, agentName } = this.state
    let newDirection: BannerOrderDirection = 'ASC'
    if (newOrder === selectedOrder) {
      newDirection = selectedDirection === 'ASC' ? 'DESC' : 'ASC'
      this.setState({
        selectedDirection: newDirection,
        pageBanners: 0,
      })
    } else {
      this.setState({
        selectedOrder: newOrder,
        selectedDirection: newDirection,
        pageBanners: 0,
      })
    }
    this.doFetchBanners(agentName, newOrder, newDirection, 0)
  }

  onLoadMoreBanners = () => {
    const { fetchBanners } = this.props
    const {
      selectedOrder,
      selectedDirection,
      pageBanners,
      agentName,
    } = this.state
    this.setState({ pageBanners: pageBanners + 1 })
    return fetchBanners(
      agentName,
      selectedOrder,
      selectedDirection,
      pageBanners + 1
    )
  }

  getPageTitle() {
    const { agentName } = this.state
    const title = `Agent ${agentName}`
    return title
  }

  async doFetchBanners(
    agentName: string,
    order: BannerOrder,
    orderDirection: BannerOrderDirection,
    pageBanners: number
  ) {
    const { fetchBanners, authenticated } = this.props

    if (authenticated) {
      this.setState({ bannersStatus: 'loading' })
      await fetchBanners(agentName, order, orderDirection, pageBanners)
      this.setState({ bannersStatus: 'success' })
    }
  }

  render() {
    const title: string = this.getPageTitle()
    const { bannersStatus, selectedDirection, selectedOrder } = this.state
    const { banners, hasMoreBanners } = this.props

    return (
      <Fragment>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <div className="agent-page page-container">
          <div className="agent-content">
            <h1>{title}</h1>

            <IfUserInitializing>Loading...</IfUserInitializing>

            <IfUserLoggedOut>
              <div>You must log in first to see this information</div>
            </IfUserLoggedOut>

            <IfUserLoggedIn>
              <h2>Banners</h2>

              <Layout>
                {bannersStatus === 'success' && (
                  <>
                    {banners.length > 0 && (
                      <>
                        <Row justify="start" className="order-chooser">
                          <BannerOrderChooser
                            selectedOrder={selectedOrder}
                            selectedDirection={selectedDirection}
                            onOrderClicked={this.onOrderSelected}
                          />
                        </Row>

                        <Row>
                          <BannerList
                            banners={banners}
                            hasMoreBanners={hasMoreBanners}
                            loadMoreBanners={this.onLoadMoreBanners}
                          />
                        </Row>
                      </>
                    )}

                    {banners.length === 0 && (
                      <>
                        <Row>No banners found</Row>
                      </>
                    )}
                  </>
                )}

                {(bannersStatus === 'initial' ||
                  bannersStatus === 'loading') && <>Loading...</>}
              </Layout>
            </IfUserLoggedIn>
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
    order: BannerOrder,
    orderDirection: BannerOrderDirection,
    pageBanners: number
  ) => Promise<void>
  authenticated: Boolean
}

interface AgentState {
  selectedOrder: BannerOrder
  selectedDirection: BannerOrderDirection
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
