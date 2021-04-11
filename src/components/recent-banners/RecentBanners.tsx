import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Row, Layout, Button } from 'antd'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import {
  getRecentBanners,
  loadRecentBanners,
  Banner,
} from '../../features/banner'
import { RootState } from '../../storeTypes'
import BannerList from '../banner-list'

import './recent-banners.less'

export class RecentBanners extends React.Component<RecentBannersProps, {}> {
  componentDidMount() {
    const { fetchRecentBanners } = this.props
    fetchRecentBanners()
  }

  goToBanner(bannerId: number) {
    const { history } = this.props
    history.push(`/banner/${bannerId}`)
  }

  render() {
    const { titleList, banners } = this.props
    return (
      <Fragment>
        <Row justify="center">
          <Layout className="px1">
            <Row justify="space-between" className="pr-1">
              <h2>{titleList}</h2>
              <Button>Submit a New Banner</Button>
            </Row>
            <BannerList banners={banners} />
          </Layout>
        </Row>
      </Fragment>
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
