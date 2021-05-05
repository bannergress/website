import React, { Fragment } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { LatLng, LatLngBounds, Map as LeafletMap } from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet-loading'
import _ from 'underscore'

import { Banner } from '../../features/banner'
import BannerMarker from './BannerMarker'

import './banners-map.less'

class BannersMap extends React.Component<MapOverviewProps, MapOverviewState> {
  private map: LeafletMap | undefined = undefined

  constructor(props: MapOverviewProps) {
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
    nextProps: Readonly<MapOverviewProps>,
    nexState: Readonly<MapOverviewState>
  ) {
    const { banners, loading } = this.props
    const { selectedBannerId, zoom } = this.state
    if (
      nextProps.banners.length !== banners.length ||
      !_.isEqual(nextProps.banners, banners) ||
      selectedBannerId !== nexState.selectedBannerId ||
      (zoom <= 15 && nexState.zoom > 15) ||
      (zoom > 15 && nexState.zoom <= 15)
    ) {
      return true
    }
    if (this.map && loading !== nextProps.loading) {
      this.map.fireEvent(nextProps.loading ? 'dataloading' : 'dataload')
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
      selectedBannerId: undefined,
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
    this.setState({ selectedBannerId: banner.id })
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
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
          />
          {this.showBannersOnMap()}
        </MapContainer>
      </Fragment>
    )
  }
}
export interface MapOverviewProps extends RouteComponentProps {
  banners: Array<Banner>
  loading: boolean
  onMapChanged: (bounds: LatLngBounds) => void
  onSelectBanner: (banner: Banner) => void
}

interface MapOverviewState {
  initialBounds: LatLngBounds | null
  center: LatLng
  zoom: number
  selectedBannerId: string | undefined
}

export default withRouter(BannersMap)
