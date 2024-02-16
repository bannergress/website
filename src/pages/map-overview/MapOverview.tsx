import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Col, Row } from 'antd'
import { LatLngBounds } from 'leaflet'
import Scrollbars from 'react-custom-scrollbars-2'
import { Trans, withTranslation, WithTranslationProps } from 'react-i18next'

import { RootState } from '../../storeTypes'
import {
  Banner,
  getMapBanners,
  loadMapBanners,
  loadBanner,
  getFullBanner as getBannerSelector,
  extendSorted,
  resetMapBanners,
} from '../../features/banner'
import BannerList from '../../components/banner-list'
import BannersMap from '../../components/banners-map'
import BannersAccordion from '../../components/banners-accordion'

import './map.less'
import { BannerFilter } from '../../features/banner/filter'
import BannerOrderChooser from '../../components/banner-order-chooser'
import { SettingsState } from '../../features/settings/types'
import { updateSettingsAction } from '../../features/settings/actions'
import { getDefaultOnline } from '../../features/settings/selectors'

class MapOverview extends React.Component<MapOverviewProps, MapOverviewState> {
  constructor(props: MapOverviewProps) {
    super(props)

    const { location, defaultOnline } = this.props
    const urlParams = new URLSearchParams(location.search)
    const onlyOfficial = urlParams.get('onlyOfficial') !== null

    this.state = {
      bounds: undefined,
      selectedBannerId: undefined,
      selectedBounds: undefined,
      status: 'initial',
      filter: {
        orderBy: 'created',
        orderDirection: 'DESC',
        online: defaultOnline,
        onlyOfficialMissions: onlyOfficial || undefined,
      },
    }
  }

  onMapChanged = (bounds: LatLngBounds) => {
    const { filter } = this.state
    this.setState({ bounds })
    this.onLoadBanners(bounds, filter)
  }

  onFilterChanged = (filter: BannerFilter) => {
    const { bounds } = this.state
    const { location, history, resetBanners, updateSettings } = this.props
    const urlParams = new URLSearchParams(location.search)

    if (filter.onlyOfficialMissions) {
      urlParams.set('onlyOfficial', '1')
    } else {
      urlParams.delete('onlyOfficial')
    }

    history.replace({
      pathname: location.pathname,
      search: urlParams.toString(),
    })

    this.setState({ filter })

    updateSettings({
      defaultOnline: filter.online,
    })
    resetBanners()
    this.onLoadBanners(bounds!, filter)
  }

  onSelectBanner = async (banner: Banner) => {
    const { fetchPreviewBanner } = this.props
    const { selectedBannerId, bounds } = this.state
    if (selectedBannerId !== banner.id) {
      this.setState({ status: 'loading' })
      await fetchPreviewBanner(banner.id)
      this.setState({
        selectedBannerId: banner.id,
        status: 'ready',
        selectedBounds: bounds,
      })
    } else {
      this.setState({ selectedBannerId: undefined, selectedBounds: undefined })
    }
  }

  onLoadBanners = async (bounds: LatLngBounds, filter: BannerFilter) => {
    const { fetchBanners } = this.props

    if (bounds) {
      this.setState({ status: 'loading' })
      try {
        const northEast = bounds.getNorthEast()
        const southWest = bounds.getSouthWest()
        if (Math.abs(northEast.lng - southWest.lng) >= 360) {
          await fetchBanners(northEast.lat, 180, southWest.lat, -180, filter)
        }
        await fetchBanners(
          northEast.lat,
          northEast.wrap().lng,
          southWest.lat,
          southWest.wrap().lng,
          filter
        )
        this.setState({ status: 'ready' })
      } catch {
        this.setState({ status: 'error' })
      }
    }
  }

  render() {
    const { getBanners, getBanner, i18n } = this.props
    const { bounds, selectedBannerId, status, selectedBounds, filter } =
      this.state
    let banners: Array<Banner> = []
    const boundsToUse = selectedBounds ?? bounds
    if (boundsToUse) {
      const norhtEast = boundsToUse.getNorthEast()
      const southWest = boundsToUse.getSouthWest()
      // If there are banners on the other side of the new day line, show them with modified coordinates
      if (norhtEast.lng > 180) {
        const bannersAux = getBanners(
          norhtEast.lat,
          norhtEast.lng - 360,
          southWest.lat,
          -180
        )
        banners = extendSorted(
          bannersAux.map((b) => ({
            ...b,
            startLongitude: b.startLongitude + 360,
          })),
          banners
        )
      }
      if (southWest.lng < -180) {
        const bannersAux = getBanners(
          norhtEast.lat,
          180,
          southWest.lat,
          southWest.lng + 360
        )
        banners = extendSorted(
          bannersAux.map((b) => ({
            ...b,
            startLongitude: b.startLongitude - 360,
          })),
          banners
        )
      }
      banners = extendSorted(
        getBanners(norhtEast.lat, norhtEast.lng, southWest.lat, southWest.lng),
        banners
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
        <Helmet defer>
          <title>{i18n?.t('map.title')}</title>
        </Helmet>
        <Row className="map-overview">
          <Col className="map-banners hide-on-mobile">
            <h2>
              <Trans i18nKey="map.area">Banners in This Area</Trans>
            </h2>
            <BannerOrderChooser
              filter={filter}
              onFilterChanged={this.onFilterChanged}
              includeOfficial
              includeSorting={false}
            />
            <Scrollbars className="banners-scroll">
              <BannerList
                banners={banners}
                hasMoreBanners={false}
                selectedBannerId={selectedBannerId}
                onSelectBanner={this.onSelectBanner}
                applyBannerListStlyes
                hideBlacklisted
                showDetailsButton
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
            <BannersAccordion
              banners={banners}
              hasMoreBanners={false}
              selectedBannerId={selectedBannerId}
              onSelectBanner={this.onSelectBanner}
              filter={filter}
              onFilterChanged={this.onFilterChanged}
            />
          </Col>
        </Row>
      </Fragment>
    )
  }
}
export type MapOverviewProps = {
  getBanners: (
    topRightLat: number,
    topRightLng: number,
    bottomLeftLat: number,
    bottomLeftLng: number
  ) => Array<Banner>
  resetBanners: () => void
  fetchBanners: (
    topRightLat: number,
    topRightLng: number,
    bottomLeftLat: number,
    bottomLeftLng: number,
    filter: BannerFilter
  ) => Promise<void>
  fetchPreviewBanner: (id: string) => Promise<void>
  getBanner: (bannerId: string) => Banner | undefined
  defaultOnline: boolean | undefined
  updateSettings: (settings: Partial<SettingsState>) => void
} & RouteComponentProps &
  WithTranslationProps

interface MapOverviewState {
  bounds: LatLngBounds | undefined
  selectedBannerId: string | undefined
  selectedBounds: LatLngBounds | undefined
  filter: BannerFilter
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
  defaultOnline: getDefaultOnline(state),
})

const mapDispatchToProps = {
  resetBanners: resetMapBanners,
  fetchBanners: loadMapBanners,
  fetchPreviewBanner: loadBanner,
  updateSettings: updateSettingsAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(MapOverview)))
