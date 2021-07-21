import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Row, Layout } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { RootState } from '../../storeTypes'
import {
  Banner,
  BannerListType,
  BannerOrder,
  BannerOrderDirection,
  getUserBannerListBanners,
  getHasMoreUserBannerListBanners,
  loadUserBannerListBanners as loadUserBannerListBannersAction,
  getBannerListTypeText,
} from '../../features/banner'

import { withAuthenticated } from '../../hocs/WithAuthenticated'

import BannerOrderChooser from '../../components/banner-order-chooser'
import BannerListTypeNavigation from '../../components/banner-list-type-navigation'
import BannerList from '../../components/banner-list'
import FooterMain from '../../components/footer-main'
import IfUserInitializing from '../../components/login/if-user-initializing'
import IfUserLoggedIn from '../../components/login/if-user-logged-in'
import IfUserLoggedOut from '../../components/login/if-user-logged-out'

import './user-banner-list.less'

class UserBannerList extends React.Component<
  UserBannerListProps,
  UserBannerListState
> {
  constructor(props: UserBannerListProps) {
    super(props)
    this.state = {
      selectedOrder: 'listAdded',
      selectedDirection: 'DESC',
      listType: 'none',
      pageBanners: 0,
      bannersStatus: 'initial',
    }
  }

  static getDerivedStateFromProps(
    props: UserBannerListProps,
    state: UserBannerListState
  ) {
    const { match } = props
    const { listType } = state
    const newListType = decodeURIComponent(match.params.listType)

    if (listType !== newListType) {
      return {
        listType: newListType,
        pageBanners: 0,
      }
    }

    return null
  }

  componentDidMount() {
    const { selectedDirection, selectedOrder, listType } = this.state

    this.doFetchBanners(listType, selectedOrder, selectedDirection, 0)
  }

  componentDidUpdate(
    prevProps: UserBannerListProps,
    prevState: UserBannerListState
  ) {
    const { authenticated: prevAuthenticated } = prevProps
    const { authenticated } = this.props

    const { listType: prevListType } = prevState
    const { listType, selectedOrder, selectedDirection } = this.state

    if (prevListType !== listType || prevAuthenticated !== authenticated) {
      this.doFetchBanners(listType, selectedOrder, selectedDirection, 0)
    }
  }

  onOrderSelected = (newOrder: BannerOrder) => {
    const { selectedOrder, selectedDirection, listType } = this.state
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
    this.doFetchBanners(listType, newOrder, newDirection, 0)
  }

  onLoadMoreBanners = () => {
    const { fetchBanners } = this.props
    const {
      selectedOrder,
      selectedDirection,
      pageBanners,
      listType,
    } = this.state
    this.setState({ pageBanners: pageBanners + 1 })
    return fetchBanners(
      listType,
      selectedOrder,
      selectedDirection,
      pageBanners + 1
    )
  }

  getPageTitle() {
    const { listType } = this.state
    const title = `My ${getBannerListTypeText(listType)} Banners`
    return title
  }

  async doFetchBanners(
    listType: BannerListType,
    order: BannerOrder,
    orderDirection: BannerOrderDirection,
    pageBanners: number
  ) {
    const { fetchBanners, authenticated } = this.props

    if (authenticated) {
      this.setState({ bannersStatus: 'loading' })
      await fetchBanners(listType, order, orderDirection, pageBanners)
      this.setState({ bannersStatus: 'success' })
    }
  }

  render() {
    const title: string = this.getPageTitle()
    const {
      bannersStatus,
      selectedDirection,
      selectedOrder,
      listType,
    } = this.state
    const { banners, hasMoreBanners } = this.props

    const noBannersMessage = `Mark banners as ${getBannerListTypeText(
      listType
    )} to see them here.`

    return (
      <Fragment>
        <Helmet defer={false}>
          <title>{title}</title>
        </Helmet>
        <div className="user-banner-list-page page-container">
          <div className="user-banner-list-content">
            <BannerListTypeNavigation
              bannerListType={listType}
              baseUrl="/user/banners/"
            />

            <IfUserInitializing>Loading...</IfUserInitializing>

            <IfUserLoggedOut>
              <div>You must log in first to see this information</div>
            </IfUserLoggedOut>

            <IfUserLoggedIn>
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
                            includeAddedList
                          />
                        </Row>

                        <Row>
                          <BannerList
                            banners={banners}
                            hasMoreBanners={hasMoreBanners}
                            loadMoreBanners={this.onLoadMoreBanners}
                            applyBannerListStlyes
                            hideBlacklisted={false}
                          />
                        </Row>
                      </>
                    )}

                    {banners.length === 0 && (
                      <>
                        <Row>{noBannersMessage}</Row>
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

export interface UserBannerListProps
  extends RouteComponentProps<{ listType: BannerListType }> {
  banners: Array<Banner>
  hasMoreBanners: Boolean
  fetchBanners: (
    listType: BannerListType,
    order: BannerOrder,
    orderDirection: BannerOrderDirection,
    pageBanners: number
  ) => Promise<void>
  authenticated: Boolean
}

interface UserBannerListState {
  selectedOrder: BannerOrder
  selectedDirection: BannerOrderDirection
  listType: BannerListType
  pageBanners: number
  bannersStatus: 'initial' | 'success' | 'loading' | 'error'
}

const mapStateToProps = (state: RootState) => ({
  banners: getUserBannerListBanners(state),
  hasMoreBanners: getHasMoreUserBannerListBanners(state),
})

const mapDispatchToProps = {
  fetchBanners: loadUserBannerListBannersAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuthenticated(withRouter(UserBannerList)))
