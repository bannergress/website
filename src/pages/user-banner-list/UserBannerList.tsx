import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Row, Layout } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Trans, withTranslation, WithTranslationProps } from 'react-i18next'

import { RootState } from '../../storeTypes'
import {
  Banner,
  BannerListType,
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
import LoginRequired from '../../components/login/login-required'
import './user-banner-list.less'
import { BannerFilter } from '../../features/banner/filter'

class UserBannerList extends React.Component<
  UserBannerListProps,
  UserBannerListState
> {
  constructor(props: UserBannerListProps) {
    super(props)
    this.state = {
      filter: {
        orderBy: 'listAdded',
        orderDirection: 'DESC',
        online: undefined,
      },
      listType: 'none',
      pageBanners: 0,
      bannersStatus: 'initial',
    }
  }

  static getDerivedStateFromProps(
    props: Readonly<UserBannerListProps>,
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
    const { filter, listType } = this.state

    this.doFetchBanners(listType, filter, 0)
  }

  componentDidUpdate(
    prevProps: UserBannerListProps,
    prevState: UserBannerListState
  ) {
    const { authenticated: prevAuthenticated } = prevProps
    const { authenticated } = this.props

    const { listType: prevListType } = prevState
    const { listType, filter } = this.state

    if (prevListType !== listType || prevAuthenticated !== authenticated) {
      this.doFetchBanners(listType, filter, 0)
    }
  }

  onFilterChanged = (filter: BannerFilter) => {
    const { listType } = this.state
    this.setState({
      filter,
      pageBanners: 0,
    })
    this.doFetchBanners(listType, filter, 0)
  }

  onLoadMoreBanners = () => {
    const { fetchBanners } = this.props
    const { filter, pageBanners, listType } = this.state
    this.setState({ pageBanners: pageBanners + 1 })
    return fetchBanners(listType, filter, pageBanners + 1)
  }

  getPageTitle() {
    const { i18n } = this.props
    const { listType } = this.state
    return (
      i18n?.t('banners.mine', { type: getBannerListTypeText(listType) }) ??
      `My ${getBannerListTypeText(listType)} Banners`
    )
  }

  async doFetchBanners(
    listType: BannerListType,
    filter: BannerFilter,
    pageBanners: number
  ) {
    const { fetchBanners, authenticated } = this.props

    if (authenticated) {
      this.setState({ bannersStatus: 'loading' })
      await fetchBanners(listType, filter, pageBanners)
      this.setState({ bannersStatus: 'success' })
    }
  }

  render() {
    const title: string = this.getPageTitle()
    const { bannersStatus, filter, listType } = this.state
    const { banners, hasMoreBanners } = this.props

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

            <LoginRequired>
              <Layout>
                <Row justify="start" className="order-chooser">
                  <BannerOrderChooser
                    filter={filter}
                    onFilterChanged={this.onFilterChanged}
                    includeAddedList
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
                            applyBannerListStlyes
                            hideBlacklisted={false}
                            showDetailsButton={false}
                          />
                        </Row>
                      </>
                    )}

                    {banners.length === 0 && (
                      <>
                        <Row>
                          <Trans
                            i18nKey="banners.markinfo"
                            values={{ type: getBannerListTypeText(listType) }}
                          >
                            Mark banners as{' '}
                            {{ type: getBannerListTypeText(listType) }} to see
                            see them here.
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

export type UserBannerListProps = {
  banners: Array<Banner>
  hasMoreBanners: Boolean
  fetchBanners: (
    listType: BannerListType,
    filter: BannerFilter,
    pageBanners: number
  ) => Promise<void>
  authenticated: Boolean
} & RouteComponentProps<{ listType: BannerListType }> &
  WithTranslationProps

interface UserBannerListState {
  filter: BannerFilter
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
)(withAuthenticated(withRouter(withTranslation()(UserBannerList))))
