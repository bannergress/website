import { handlePromise } from '../../features/utils/async'
import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from '../../hocs/withRouter'
import { PageTitle } from '../../components/page-title/PageTitle'
import { Col, Row } from 'antd'
import { LatLngBounds, LatLngLiteral } from 'leaflet'
import { Scrollbars } from '../../components/scrollbars/Scrollbars'
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

import './MapOverview.scss'
import { BannerFilter } from '../../features/banner/filter'
import BannerOrderChooser from '../../components/banner-order-chooser'
import { SettingsState } from '../../features/settings/types'
import { updateSettingsAction } from '../../features/settings/actions'
import { getDefaultOnline } from '../../features/settings/selectors'
import { ScrollRestoration } from '../../features/scroll-restoration'

const isCoordinate = (value: unknown): value is LatLngLiteral =>
  typeof value === 'object' &&
  value !== null &&
  'lat' in value &&
  typeof value.lat === 'number' &&
  Number.isFinite(value.lat) &&
  'lng' in value &&
  typeof value.lng === 'number' &&
  Number.isFinite(value.lng)

class MapOverview extends React.Component<MapOverviewProps, MapOverviewState> {
  scrollbarsRef = React.createRef<HTMLDivElement>()
  scrollRestoration = new ScrollRestoration({
    key: 'mapScrollPosition',
    preserveOn: (pathname) => pathname.startsWith('/banner/'),
    target: {
      getScrollTop: () => this.scrollbarsRef.current?.scrollTop,
      setScrollTop: (scrollTop) => {
        const target = this.scrollbarsRef.current
        if (!target) return false
        target.scrollTo({ top: scrollTop })
        return true
      },
    },
  })

  saveBounds = (bounds: LatLngBounds) => {
    const northEast = bounds.getNorthEast()
    const southWest = bounds.getSouthWest()
    sessionStorage.setItem(
      'mapBounds',
      JSON.stringify({
        northEast: { lat: northEast.lat, lng: northEast.lng },
        southWest: { lat: southWest.lat, lng: southWest.lng },
      })
    )
  }

  loadBounds = (): LatLngBounds | undefined => {
    const serialized = sessionStorage.getItem('mapBounds')
    if (!serialized) return undefined
    try {
      const parsed: unknown = JSON.parse(serialized)
      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        !('northEast' in parsed) ||
        !isCoordinate(parsed.northEast) ||
        !('southWest' in parsed) ||
        !isCoordinate(parsed.southWest)
      )
        return undefined
      return new LatLngBounds(parsed.southWest, parsed.northEast)
    } catch {
      return undefined
    }
  }

  constructor(props: MapOverviewProps) {
    super(props)

    const { location, defaultOnline } = this.props
    const urlParams = new URLSearchParams(location.search)
    const onlyOfficial = urlParams.get('onlyOfficial') !== null
    const restoredBounds = this.loadBounds()

    this.state = {
      bounds: restoredBounds,
      selectedBannerId: urlParams.get('banner') ?? undefined,
      selectedBounds: urlParams.has('banner') ? restoredBounds : undefined,
      status: 'initial',
      filter: {
        orderBy: 'created',
        orderDirection: 'DESC',
        online: defaultOnline,
        onlyOfficialMissions: onlyOfficial || undefined,
      },
    }
  }

  componentDidMount() {
    const restoredBounds = this.loadBounds()
    if (restoredBounds) {
      this.setState({
        bounds: restoredBounds,
        status: this.props.mapBannersCount > 0 ? 'ready' : 'initial',
      })
      if (this.props.mapBannersCount === 0) {
        handlePromise(this.onLoadBanners(restoredBounds, this.state.filter))
      }
    }

    const { selectedBannerId } = this.state
    if (selectedBannerId) {
      handlePromise(this.props.fetchPreviewBanner(selectedBannerId))
    }

    this.scrollRestoration.mount(this.props.history)
  }

  componentDidUpdate(prevProps: MapOverviewProps, prevState: MapOverviewState) {
    if (
      this.state.status === 'ready' &&
      (this.state.bounds !== prevState.bounds ||
        this.state.status !== prevState.status)
    ) {
      this.scrollRestoration.restore()
    }

    if (prevProps.location.search !== this.props.location.search) {
      const urlParams = new URLSearchParams(this.props.location.search)
      const bannerId = urlParams.get('banner') ?? undefined
      if (bannerId !== this.state.selectedBannerId) {
        handlePromise(this.applySelectedBanner(bannerId))
      }
    }
  }

  componentWillUnmount() {
    this.scrollRestoration.unmount()
  }

  onMapChanged = (bounds: LatLngBounds) => {
    const { filter } = this.state
    this.saveBounds(this.state.selectedBounds ?? bounds)
    this.setState({ bounds })
    this.scrollRestoration.invalidate()
    handlePromise(this.onLoadBanners(bounds, filter))
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
    this.scrollRestoration.invalidate()

    updateSettings({
      defaultOnline: filter.online,
    })
    resetBanners()
    handlePromise(this.onLoadBanners(bounds!, filter))
  }

  onSelectBanner = (banner: Banner) => {
    const { location, history } = this.props
    const { selectedBannerId } = this.state
    const urlParams = new URLSearchParams(location.search)
    if (selectedBannerId !== banner.id) {
      urlParams.set('banner', banner.id)
      history.push({
        pathname: location.pathname,
        search: urlParams.toString(),
      })
    } else {
      urlParams.delete('banner')
      history.replace({
        pathname: location.pathname,
        search: urlParams.toString(),
      })
    }
  }

  /** Brings component state in line with the (possibly browser-navigated) `banner` url param */
  applySelectedBanner = async (bannerId: string | undefined) => {
    const { fetchPreviewBanner } = this.props
    const { bounds, selectedBounds } = this.state
    if (bannerId) {
      const listBounds = selectedBounds ?? bounds
      this.setState({
        selectedBannerId: bannerId,
        status: 'loading',
        selectedBounds: listBounds,
      })
      if (listBounds) this.saveBounds(listBounds)
      try {
        await fetchPreviewBanner(bannerId)
        if (this.state.selectedBannerId === bannerId)
          this.setState({ status: 'ready' })
      } catch (error) {
        if (this.state.selectedBannerId === bannerId)
          this.setState({ status: 'error' })
        throw error
      }
    } else {
      this.setState({
        selectedBannerId: undefined,
        selectedBounds: undefined,
        status: 'ready',
      })
      if (bounds) this.saveBounds(bounds)
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
        <PageTitle title={i18n?.t('map.title')} />
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
            <Scrollbars className="banners-scroll" ref={this.scrollbarsRef}>
              <BannerList
                banners={banners}
                hasMoreBanners={false}
                selectedBannerId={selectedBannerId}
                onSelectBanner={this.onSelectBanner}
                applyBannerListStyles
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
  mapBannersCount: number
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
  mapBannersCount: state.banner.mapBanners.length,
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
