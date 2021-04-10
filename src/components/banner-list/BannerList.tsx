import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Row, Layout, Button } from 'antd'
import BannerCard from '../banner-card'
import { getRecentBanners, loadRecentBanners } from '../../features/banner'
import { Banner } from '../../features/banner/types'
import { RootState } from '../../storeTypes'

export class BannerList extends React.Component<BannerListProps, {}> {
  componentDidMount() {
    const { fetchRecentBanners } = this.props
    fetchRecentBanners()
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
                <a href={`/banner/${bannerItem.id}`}>
                  <BannerCard banner={bannerItem} key={bannerItem.id} />
                </a>
              ))}
            </Row>
          </Layout>
        </Row>
      </Fragment>
    )
  }
}

export interface BannerListProps {
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

export default connect(mapStateToProps, mapDispatchToProps)(BannerList)
