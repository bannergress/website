import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Row, Layout, Button } from 'antd'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import BannerCard from '../banner-card'
import { getRecentBanners, loadRecentBanners } from '../../features/banner'
import { Banner } from '../../features/banner/types'
import { RootState } from '../../storeTypes'

import './Banner-list.less'

export class BannerList extends React.Component<BannerListProps, {}> {
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
            <Row
              justify="space-around"
              className="banner-list"
              gutter={[16, 16]}
            >
              {banners?.map((bannerItem) => (
                <div
                  className="banner-card"
                  onClick={() => this.goToBanner(bannerItem.id)}
                  onKeyPress={() => this.goToBanner(bannerItem.id)}
                  role="link"
                  tabIndex={0}
                >
                  <BannerCard banner={bannerItem} key={bannerItem.id} />
                </div>
              ))}
            </Row>
          </Layout>
        </Row>
      </Fragment>
    )
  }
}

export interface BannerListProps extends RouteComponentProps {
  titleList: string
  banners: Array<Banner>
  fetchRecentBanners: Function
}

const mapStateToProps = (state: RootState) => ({
  banners: getRecentBanners(state.banner),
})

const mapDispatchToProps = {
  fetchRecentBanners: loadRecentBanners,
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BannerList)
)
