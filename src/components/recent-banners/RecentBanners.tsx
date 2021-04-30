import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import {
  getRecentBanners,
  loadRecentBanners,
  Banner,
} from '../../features/banner'
import { RootState } from '../../storeTypes'
import BannerList from '../banner-list'

import './recent-banners.less'
import IfUserLoggedIn from '../login/if-user-logged-in'

export class RecentBanners extends React.Component<RecentBannersProps, {}> {
  componentDidMount() {
    const { fetchRecentBanners } = this.props
    fetchRecentBanners()
  }

  onCreateBanner = () => {
    const { history } = this.props
    history.push('/new-banner')
  }

  render() {
    const { titleList, banners } = this.props
    return (
      <div className="recent-banners">
        <div className="recent-banners-title">
          <h1>{titleList}</h1>
          <IfUserLoggedIn>
            <Button
              onClick={this.onCreateBanner}
              className="bg-button bg-button-default"
            >
              Submit a New Banner
            </Button>
          </IfUserLoggedIn>
        </div>
        <BannerList banners={banners} hasMoreBanners={false} />
      </div>
    )
  }
}

export interface RecentBannersProps extends RouteComponentProps {
  titleList: string
  banners: Array<Banner>
  fetchRecentBanners: Function
}

const mapStateToProps = (state: RootState) => ({
  banners: getRecentBanners(state),
})

const mapDispatchToProps = {
  fetchRecentBanners: loadRecentBanners,
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RecentBanners)
)
