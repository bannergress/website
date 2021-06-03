import React, { Fragment } from 'react'
import { StaticContext } from 'react-router'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { divIcon, LatLng, LatLngBounds, Map as LeafletMap } from 'leaflet'
import { MapContainer, Pane, TileLayer } from 'react-leaflet'
import _ from 'underscore'
import MarkerClusterGroup from 'react-leaflet-cluster'

import { Banner, getBannerBounds } from '../../features/banner'
import BannerMarker from './BannerMarker'
import { showBannerRouteOnMap } from '../map-detail/showBannerRouteOnMap'
import { getAttributionLayer } from '../map-detail/getAttributionLayer'
import { LocateControl } from '../locate'
import { MapLoadingControl } from '../map-loading-control'

import './banners-map.less'
import 'leaflet/dist/leaflet.css'

class BannersMap extends React.Component<BannersMapProps, BannersMapState> {
  private map: LeafletMap | undefined = undefined

  private programaticChange: boolean = false

  constructor(props: BannersMapProps) {
    super(props)
    const { location } = this.props
    const urlParams = new URLSearchParams(location.search)
    const [lat, lng, zoom] = BannersMap.getCenterAndZoomFromUrlParameters(
      urlParams
    )
    const initialBounds = BannersMap.getBoundsFromUrlParameters(urlParams)

    this.state = {
      initialBounds,
      center: new LatLng(lat || 0, lng || 0),
      zoom: zoom || 3,
    }
  }

  shouldComponentUpdate(nextProps: Readonly<BannersMapProps>) {
    const {
      banners,
      loading,
      selectedBannerId,
      location,
      onMapChanged,
    } = this.props

    if (this.map && loading !== nextProps.loading) {
      this.map.fireEvent(nextProps.loading ? 'dataloading' : 'dataload')
    }

    const urlParams = new URLSearchParams(nextProps.location.search)
    const [lat, lng, zoom] = BannersMap.getCenterAndZoomFromUrlParameters(
      urlParams
    )
    const oldUrlParams = new URLSearchParams(location.search)
    const [
      oldLat,
      oldLng,
      oldZoom,
    ] = BannersMap.getCenterAndZoomFromUrlParameters(oldUrlParams)
    if (
      zoom &&
      !Number.isNaN(oldLat) &&
      !Number.isNaN(lat) &&
      !Number.isNaN(oldLng) &&
      !Number.isNaN(lng) &&
      oldZoom &&
      (lat !== oldLat || lng !== oldLng || oldZoom !== zoom)
    ) {
      if (this.programaticChange) {
        this.programaticChange = false
      } else {
        this.map!.off('zoomend dragend')
        this.map!.on('zoomend dragend', this.onFlyToEnded)
        this.map!.invalidateSize()
        this.map!.flyTo(new LatLng(lat, lng), zoom, {
          animate: false,
        })
        onMapChanged(this.map!.getBounds())
      }
    }
    const nextId = nextProps.history.location.state?.selectedBannerId
    const prevId = location.state?.selectedBannerId
    if (nextId !== prevId && nextId !== nextProps.selectedBannerId) {
      const selectedBanner = banners.find((b) => b.id === nextId)
      this.onSelectBanner(selectedBanner)
    }

    if (selectedBannerId !== nextProps.selectedBannerId) {
      const banner = banners.find((b) => b.id === nextProps.selectedBannerId)
      if (banner) {
        setTimeout(() => {
          this.map!.invalidateSize()
          const bounds = getBannerBounds(banner)
          if (bounds) {
            this.map!.flyToBounds(new LatLngBounds(bounds), {
              animate: false,
              maxZoom: 15,
            })
          }
        }, 100)
      } else {
        setTimeout(() => {
          this.map!.invalidateSize()
        }, 100)
      }
      return true
    }
    if (
      nextProps.banners.length !== banners.length ||
      !_.isEqual(nextProps.banners, banners)
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
          const minLat = Number(initialBoundArray[0])
          let minLng = Number(initialBoundArray[1])
          const maxLat = Number(initialBoundArray[2])
          let maxLng = Number(initialBoundArray[3])
          // If longitude crosses 180th meridian, apply correction
          if (maxLng < minLng) {
            if (Math.abs(maxLng) < Math.abs(minLng)) {
              minLng -= 360
            } else {
              maxLng += 360
            }
          }
          result = new LatLngBounds(
            new LatLng(minLat, minLng),
            new LatLng(maxLat, maxLng)
          )
        }
      } catch (error) {
        // Just ignore bound if not in a valid format
        console.log('Invalid bounds', bounds)
      }
    }
    return result
  }

  static getCenterAndZoomFromUrlParameters(urlParams: URLSearchParams) {
    const lat = Number(urlParams.get('lat'))
    const lng = Number(urlParams.get('lng'))
    const zoom = Number(urlParams.get('zoom'))
    return [lat, lng, zoom]
  }

  onFlyToEnded = () => {
    this.map!.off('zoomend dragend')
    this.map!.on('zoomend dragend', this.onMapDraggedOrZoomed)
  }

  onMapDraggedOrZoomed = () => {
    const { location, history, onMapChanged, selectedBannerId } = this.props
    const urlParams = new URLSearchParams(location.search)
    const center = this.map!.getCenter()
    const zoom = this.map!.getZoom()

    urlParams.set('lat', center.lat.toString())
    urlParams.set('lng', center.lng.toString())
    urlParams.set('zoom', zoom.toString())
    urlParams.delete('bounds')
    this.programaticChange = true
    history.push({
      pathname: location.pathname,
      search: urlParams.toString(),
      state: { selectedBannerId },
    })
    this.setState({
      center,
      zoom,
      initialBounds: null,
    })
    onMapChanged(this.map!.getBounds())
  }

  // unselects banner overview route, when clicked outside the starting point
  onMapClicked = () => {
    const { selectedBannerId, banners } = this.props
    const selectedBanner = banners.find((b) => b.id === selectedBannerId)
    if (selectedBanner) {
      this.onSelectBanner(selectedBanner)
    }
  }

  onMapCreated = (map: LeafletMap) => {
    this.map = map
    map.on('dragend zoomend', this.onMapDraggedOrZoomed)
    map.on('click', this.onMapClicked)
    this.onMapDraggedOrZoomed()
  }

  onSelectBanner = (banner: Banner | undefined) => {
    const { onSelectBanner } = this.props
    onSelectBanner(banner)
  }

  showBannersOnMap = () => {
    const { banners, selectedBannerId } = this.props
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
    const { banners, selectedBannerId } = this.props
    const selectedBanner = banners.find((b) => b.id === selectedBannerId)
    if (selectedBanner && selectedBanner.missions) {
      return showBannerRouteOnMap(selectedBanner, [], 'green')
    }
    return undefined
  }

  createClusterCustomIcon = (cluster: any) => {
    const numberMarkers = cluster.getChildCount()
    if (numberMarkers > 1)
      return divIcon({
        className: 'custom-div-icon',
        html: `<div class='marker-pin-medium-false'>${numberMarkers}</div>`,
        iconAnchor: [0, 0],
      })
    return divIcon({
      className: 'custom-div-icon',
      html: `<div class='marker-pin-medium-false'></div>`,
      iconAnchor: [0, 0],
    })
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
          minZoom={3}
          worldCopyJump
        >
          <LocateControl />
          <MapLoadingControl />
          {getAttributionLayer()}
          <Pane name="finalPane" style={{ zIndex: 580 }} />
          <MarkerClusterGroup
            maxClusterRadius={25}
            singleMarkerMode
            iconCreateFunction={this.createClusterCustomIcon}
          >
            {this.showBannersOnMap()}
          </MarkerClusterGroup>

          {this.showSelectedBannerRoute()}
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </Fragment>
    )
  }
}
export interface BannersMapProps
  extends RouteComponentProps<
    {},
    StaticContext,
    { selectedBannerId?: string }
  > {
  banners: Array<Banner>
  loading: boolean
  selectedBannerId?: string
  onMapChanged: (bounds: LatLngBounds) => void
  onSelectBanner: (banner: Banner | undefined) => void
}

interface BannersMapState {
  initialBounds: LatLngBounds | null
  center: LatLng
  zoom: number
}

export default withRouter(BannersMap)
