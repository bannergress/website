import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { RootState } from '../../storeTypes'
import {
  Banner,
  BannerListType,
  BannerOrder,
  BannerOrderDirection,
  getUserBannerListBanners,
  loadUserBannerListBanners as loadUserBannerListBannersAction,
  getBannerListTypeText,
} from '../../features/banner'

import { withAuthenticated } from '../../hocs/WithAuthenticated'

import BannerListTypeNavigation from '../banner-list-type-navigation'
import BannerList from '../banner-list'
import IfUserLoggedIn from '../login/if-user-logged-in'

import './user-banner-list-preview.less'

class UserBannerListPreview extends React.Component<
  UserBannerListProps,
  UserBannerListState
> {
  constructor(props: UserBannerListProps) {
    super(props)
    this.state = {
      listType: 'todo',
      bannersStatus: 'initial',
    }
  }

  componentDidMount() {
    const { listType } = this.state
    this.doFetchBanners(listType)
  }

  componentDidUpdate(
    prevProps: UserBannerListProps,
    prevState: UserBannerListState
  ) {
    const { authenticated: prevAuthenticated } = prevProps
    const { authenticated } = this.props

    const { listType: prevListType } = prevState
    const { listType } = this.state

    if (prevListType !== listType || prevAuthenticated !== authenticated) {
      this.doFetchBanners(listType)
    }
  }

  onLoadMoreBanners = () => {}

  listTypeChanged = async (listType: BannerListType) => {
    this.setState({ listType })
  }

  async doFetchBanners(listType: BannerListType) {
    const { fetchBanners, authenticated } = this.props

    if (authenticated) {
      this.setState({ bannersStatus: 'loading' })
      await fetchBanners(listType, 'listAdded', 'DESC', 0)
      this.setState({ bannersStatus: 'success' })
    }
  }

  render() {
    const { bannersStatus, listType } = this.state
    const { banners } = this.props

    const noBannersMessage = `Mark banners as ${getBannerListTypeText(
      listType
    )} to see them here.`

    return (
      <IfUserLoggedIn>
        <div className="user-banner-list-preview">
          <BannerListTypeNavigation
            onClickListType={this.listTypeChanged}
            bannerListType={listType}
          />

          {bannersStatus === 'success' && (
            <>
              {banners.length > 0 && (
                <>
                  <BannerList
                    banners={banners}
                    hasMoreBanners={false}
                    applyBannerListStlyes
                    hideBlacklisted={false}
                  />

                  <div className="seeFullList">
                    <Link to={`/user/banners/${listType}`}>See Full List</Link>
                  </div>
                </>
              )}

              {banners.length === 0 && (
                <>
                  <div>{noBannersMessage}</div>
                </>
              )}
            </>
          )}

          {(bannersStatus === 'initial' || bannersStatus === 'loading') && (
            <>Loading...</>
          )}
        </div>
      </IfUserLoggedIn>
    )
  }
}

interface UserBannerListProps {
  banners: Array<Banner>
  fetchBanners: (
    listType: BannerListType,
    order: BannerOrder,
    orderDirection: BannerOrderDirection,
    pageBanners: number
  ) => Promise<void>
  authenticated: Boolean
}

interface UserBannerListState {
  listType: BannerListType
  bannersStatus: 'initial' | 'success' | 'loading' | 'error'
}

const mapStateToProps = (state: RootState) => ({
  banners: getUserBannerListBanners(state).slice(0, 3),
})

const mapDispatchToProps = {
  fetchBanners: loadUserBannerListBannersAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuthenticated(UserBannerListPreview))
