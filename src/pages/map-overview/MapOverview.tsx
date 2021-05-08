import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Col, Row } from 'antd'
import { LatLngBounds } from 'leaflet'
import Scrollbars from 'react-custom-scrollbars'

import { RootState } from '../../storeTypes'
import {
  Banner,
  getMapBanners,
  loadMapBanners,
  loadBanner,
  getBanner as getBannerSelector,
  extendSorted,
} from '../../features/banner'
import BannerList from '../../components/banner-list'
import BannersMap from '../../components/banners-map'

import './map.less'

class MapOverview extends React.Component<MapOverviewProps, MapOverviewState> {
  constructor(props: MapOverviewProps) {
    super(props)
    this.state = {
      bounds: undefined,
      selectedBannerId: undefined,
      status: 'initial',
    }
  }

  onMapChanged = (bounds: LatLngBounds) => {
    this.setState({ bounds })
    this.onLoadBanners(bounds)
  }

  onSelectBanner = async (banner: Banner) => {
    const { fetchPreviewBanner } = this.props
    const { selectedBannerId } = this.state
    if (selectedBannerId !== banner.id) {
      this.setState({ status: 'loading' })
      await fetchPreviewBanner(banner.id)
      this.setState({ selectedBannerId: banner.id, status: 'ready' })
    } else {
      this.setState({ selectedBannerId: undefined })
    }
  }

  onLoadBanners = async (bounds: LatLngBounds) => {
    const { fetchBanners } = this.props
    if (bounds) {
      this.setState({ status: 'loading' })
      try {
        await fetchBanners(
          bounds.getNorth(),
          bounds.getEast(),
          bounds.getSouth(),
          bounds.getWest()
        )
        this.setState({ status: 'ready' })
      } catch {
        this.setState({ status: 'error' })
      }
    }
  }

  render() {
    const { getBanners, getBanner } = this.props
    const { bounds, selectedBannerId, status } = this.state
    let banners: Array<Banner> = []
    if (bounds) {
      banners = getBanners(
        bounds.getNorth(),
        bounds.getEast(),
        bounds.getSouth(),
        bounds.getWest()
      )
    }
    if (selectedBannerId) {
      const selectedBanner = getBanner(selectedBannerId)
      if (selectedBanner) {
        banners = extendSorted(banners, [selectedBanner])
      }
    }
    return (
      <Fragment>
        <Helmet>
          <title>Map</title>
        </Helmet>
        <Row className="map-overview">
          <Col className="map-banners">
            <h2>Banners in This Area</h2>
            <Scrollbars className="banners-scroll">
              <BannerList
                banners={banners}
                hasMoreBanners={false}
                selectedBannerId={selectedBannerId}
                onSelectBanner={this.onSelectBanner}
              />
            </Scrollbars>
          </Col>
          <Col className="map-explorer">
            <BannersMap
              banners={banners}
              onMapChanged={this.onMapChanged}
              selectedBannerId={selectedBannerId}
              onSelectBanner={this.onSelectBanner}
              loading={status === 'loading'}
            />
          </Col>
        </Row>
      </Fragment>
    )
  }
}
export interface MapOverviewProps extends RouteComponentProps {
  getBanners: (
    topRightLat: number,
    topRightLng: number,
    bottomLeftLat: number,
    bottomLeftLng: number
  ) => Array<Banner>
  fetchBanners: (
    topRightLat: number,
    topRightLng: number,
    bottomLeftLat: number,
    bottomLeftLng: number
  ) => Promise<void>
  fetchPreviewBanner: (id: string) => Promise<void>
  getBanner: (bannerId: string) => Banner | undefined
}

interface MapOverviewState {
  bounds: LatLngBounds | undefined
  selectedBannerId: string | undefined
  status: 'initial' | 'loading' | 'ready' | 'error'
}

const mapStateToProps = (state: RootState) => ({
  getBanners: (
    topRightLat: number,
    topRightLng: number,
    bottomLeftLat: number,
    bottomLeftLng: number
  ) =>
    getMapBanners(
      state,
      topRightLat,
      topRightLng,
      bottomLeftLat,
      bottomLeftLng
    ),
  getBanner: (bannerId: string) => getBannerSelector(state, bannerId),
})

const mapDispatchToProps = {
  fetchBanners: loadMapBanners,
  fetchPreviewBanner: loadBanner,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MapOverview))
