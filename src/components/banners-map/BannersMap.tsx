import React, { Fragment } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { LatLng, LatLngBounds, Map as LeafletMap } from 'leaflet'
import { MapContainer } from 'react-leaflet'
import 'leaflet-loading'
import _ from 'underscore'

import { Banner, getBannerBounds } from '../../features/banner'
import BannerMarker from './BannerMarker'

import './banners-map.less'

import 'leaflet/dist/leaflet.css'
import { showBannerRouteOnMap } from './showBannerRouteOnMap'
import { getAttributionLayer } from './getAttributionLayer'

class BannersMap extends React.Component<BannersMapProps, BannersMapState> {
  private map: LeafletMap | undefined = undefined

  constructor(props: BannersMapProps) {
    super(props)
    const { location } = this.props
    const urlParams = new URLSearchParams(location.search)
    const lat = Number(urlParams.get('lat')) || 0
    const lng = Number(urlParams.get('lng')) || 0
    const zoom = Number(urlParams.get('zoom')) || 3
    const initialBounds = BannersMap.getBoundsFromUrlParameters(urlParams)

    this.state = {
      initialBounds,
      center: new LatLng(lat, lng),
      zoom,
      selectedBannerId: undefined,
    }
  }

  shouldComponentUpdate(
    nextProps: Readonly<BannersMapProps>,
    nexState: Readonly<BannersMapState>
  ) {
    const {
      banners,
      loading,
      selectedBannerId: selectedBannerFromPropsId,
    } = this.props
    const { selectedBannerId: selectedBannerFromStateId } = this.state

    if (this.map && loading !== nextProps.loading) {
      this.map.fireEvent(nextProps.loading ? 'dataloading' : 'dataload')
    }

    if (selectedBannerFromPropsId !== nextProps.selectedBannerId) {
      this.setState({ selectedBannerId: nextProps.selectedBannerId })
      const banner = banners.find((b) => b.id === nextProps.selectedBannerId)
      if (banner) {
        this.map!.fitBounds(new LatLngBounds(getBannerBounds(banner)), {
          animate: true,
        })
      }
      return true
    }
    if (
      nextProps.banners.length !== banners.length ||
      !_.isEqual(nextProps.banners, banners) ||
      selectedBannerFromStateId !== nexState.selectedBannerId
    ) {
      return true
    }
    return false
  }

  static getBoundsFromUrlParameters(urlParams: URLSearchParams) {
    let result = null
    const bounds = urlParams.get('bounds') || ''
    if (bounds !== '') {
      try {
        const initialBoundArray = bounds.split(',')

        if (initialBoundArray.length === 4) {
          result = new LatLngBounds(
            new LatLng(
              Number(initialBoundArray[0]),
              Number(initialBoundArray[1])
            ),
            new LatLng(
              Number(initialBoundArray[2]),
              Number(initialBoundArray[3])
            )
          )
        }
      } catch (error) {
        // Just ignore bound if not in a valid format
        console.log('Invalid bounds', bounds)
      }
    }
    return result
  }

  onMapDraggedOrZoomed = () => {
    const { location, history, onMapChanged } = this.props
    const urlParams = new URLSearchParams(location.search)
    const center = this.map!.getCenter()
    const zoom = this.map!.getZoom()
    urlParams.set('lat', center.lat.toString())
    urlParams.set('lng', center.lng.toString())
    urlParams.set('zoom', zoom.toString())
    urlParams.delete('bounds')
    history.replace({
      pathname: location.pathname,
      search: urlParams.toString(),
    })
    this.setState({
      center,
      zoom,
      initialBounds: null,
    })
    onMapChanged(this.map!.getBounds())
  }

  onMapCreated = (map: LeafletMap) => {
    this.map = map
    map.addEventListener('dragend', this.onMapDraggedOrZoomed)
    map.addEventListener('zoomend', this.onMapDraggedOrZoomed)
    this.onMapDraggedOrZoomed()
  }

  onSelectBanner = (banner: Banner) => {
    const { onSelectBanner } = this.props
    onSelectBanner(banner)
  }

  showBannersOnMap = () => {
    const { banners } = this.props
    const { selectedBannerId } = this.state
    return banners.map((banner: Banner) => (
      <BannerMarker
        key={banner.id}
        banner={banner}
        selected={selectedBannerId === banner.id}
        onSelect={() => this.onSelectBanner(banner)}
      />
    ))
  }

  showSelectedBannerRoute = () => {
    const { banners } = this.props
    const { selectedBannerId } = this.state
    const selectedBanner = banners.find((b) => b.id === selectedBannerId)
    if (selectedBanner && selectedBanner.missions) {
      return showBannerRouteOnMap(selectedBanner)
    }
    return undefined
  }

  render() {
    const { initialBounds, center, zoom } = this.state

    const startParams = initialBounds
      ? { bounds: initialBounds }
      : { center, zoom }

    return (
      <Fragment>
        <MapContainer
          {...startParams}
          whenCreated={this.onMapCreated}
          // @ts-ignore
          loadingControl
          minZoom={3}
        >
          {getAttributionLayer()}
          {this.showBannersOnMap()}
          {this.showSelectedBannerRoute()}
        </MapContainer>
      </Fragment>
    )
  }
}
export interface BannersMapProps extends RouteComponentProps {
  banners: Array<Banner>
  loading: boolean
  selectedBannerId?: string
  onMapChanged: (bounds: LatLngBounds) => void
  onSelectBanner: (banner: Banner) => void
}

interface BannersMapState {
  initialBounds: LatLngBounds | null
  center: LatLng
  zoom: number
  selectedBannerId: string | undefined
}

export default withRouter(BannersMap)
