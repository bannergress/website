import React, { Fragment, useEffect } from 'react'
import { RouteComponentProps, withRouter } from '../../hocs/withRouter'
import {
  divIcon,
  LatLng,
  LatLngBounds,
  Map as LeafletMap,
  MarkerCluster,
} from 'leaflet'
import { MapContainer, Pane, TileLayer, useMap } from 'react-leaflet'
import _ from 'underscore'
import MarkerClusterGroup from 'react-leaflet-cluster'

import { Banner, getBannerBounds } from '../../features/banner'
import { BannerMarker, getBannerFromMarker } from './BannerMarker'
import { showBannerRouteOnMap } from '../map-detail/showBannerRouteOnMap'
import { getAttributionLayer } from '../map-detail/getAttributionLayer'
import { LocateControl } from '../locate'
import { MapLoadingControl } from '../map-loading-control'
import { MapZoomControl } from '../map-zoom-control'

import './BannersMap.scss'
import 'leaflet/dist/leaflet.css'

const RefSetup: React.FC<{
  onMapReady: (map: LeafletMap) => void
  onMapDraggedOrZoomed: () => void
  onMapClicked: () => void
}> = ({ onMapReady, onMapDraggedOrZoomed, onMapClicked }) => {
  const map = useMap()
  useEffect(() => {
    onMapReady(map)
    map.on('dragend zoomend', onMapDraggedOrZoomed)
    map.on('click', onMapClicked)
    onMapDraggedOrZoomed()
    return () => {
      map.off('dragend zoomend', onMapDraggedOrZoomed)
      map.off('click', onMapClicked)
    }
  }, [map, onMapReady, onMapDraggedOrZoomed, onMapClicked])
  return null
}

class BannersMap extends React.Component<BannersMapProps, BannersMapState> {
  private map: LeafletMap | undefined = undefined

  /** search string this component itself last wrote via history.replace, so
   * componentDidUpdate can tell that navigation apart from external
   * navigation (e.g. the browser back/forward buttons) that requires the
   * leaflet view to be re-synced from the url. */
  private lastAppliedSearch: string | undefined = undefined

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
    }
    this.lastAppliedSearch = location.search
  }

  onMapReady = (map: LeafletMap) => {
    this.map = map
  }

  shouldComponentUpdate(nextProps: Readonly<BannersMapProps>) {
    const { banners, loading, selectedBannerId, location } = this.props
    return (
      loading !== nextProps.loading ||
      location.search !== nextProps.location.search ||
      selectedBannerId !== nextProps.selectedBannerId ||
      !_.isEqual(nextProps.banners, banners)
    )
  }

  componentDidUpdate(prevProps: Readonly<BannersMapProps>) {
    const { loading, selectedBannerId, banners, location } = this.props
    if (prevProps.loading !== loading) {
      this.map?.fireEvent(loading ? 'dataloading' : 'dataload')
    }
    if (prevProps.location.search !== location.search) {
      this.syncViewFromLocation(location)
    }

    const selectedBanner = banners.find(
      (banner) => banner.id === selectedBannerId
    )
    const previousBanner = prevProps.banners.find(
      (banner) => banner.id === prevProps.selectedBannerId
    )
    if (
      selectedBannerId !== prevProps.selectedBannerId ||
      selectedBanner?.missions !== previousBanner?.missions
    ) {
      this.map?.invalidateSize()
      const bounds = selectedBanner && getBannerBounds(selectedBanner)
      if (bounds)
        this.map?.fitBounds(new LatLngBounds(bounds), {
          animate: true,
          maxZoom: 15,
        })
    }
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
      } catch {
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
    this.lastAppliedSearch = `?${urlParams.toString()}`
    history.replace({
      pathname: location.pathname,
      search: this.lastAppliedSearch,
    })
    this.setState({
      center,
      zoom,
      initialBounds: null,
    })
    onMapChanged(this.map!.getBounds())
  }

  /** brings the leaflet view in line with the url after navigation this
   * component didn't itself cause (e.g. the browser back/forward buttons) */
  syncViewFromLocation = (location: BannersMapProps['location']) => {
    if (!this.map || location.search === this.lastAppliedSearch) {
      return
    }
    this.lastAppliedSearch = location.search
    const urlParams = new URLSearchParams(location.search)
    const bounds = BannersMap.getBoundsFromUrlParameters(urlParams)
    if (bounds) {
      this.map.fitBounds(bounds, { animate: true })
      return
    }
    const lat = Number(urlParams.get('lat')) || 0
    const lng = Number(urlParams.get('lng')) || 0
    const zoom = Number(urlParams.get('zoom')) || 3
    const center = this.map.getCenter()
    if (
      Math.abs(center.lat - lat) > 1e-6 ||
      Math.abs(center.lng - lng) > 1e-6 ||
      this.map.getZoom() !== zoom
    ) {
      this.map.setView(new LatLng(lat, lng), zoom, { animate: true })
    }
  }

  /** unselects an banner overview route, when clicked outside the starting point */
  onMapClicked = () => {
    const { selectedBannerId, banners } = this.props
    const selectedBanner = banners.find((b) => b.id === selectedBannerId)
    if (selectedBanner) {
      this.onSelectBanner(selectedBanner)
    }
  }

  onSelectBanner = (banner: Banner) => {
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

  createClusterCustomIcon = (cluster: MarkerCluster) => {
    const { selectedBannerId } = this.props
    const numberMarkers = cluster.getChildCount()

    if (numberMarkers > 1) {
      // Currently used logic for clusters:
      // count all occurrences of banner types
      // and set two or three colors depending on the available type

      const children = cluster.getAllChildMarkers()

      let countDone = 0
      let countTodo = 0
      let countNormal = 0
      let anySelected = false

      children.forEach((marker) => {
        const banner = getBannerFromMarker(marker)
        if (banner?.listType === 'todo') countTodo += 1
        if (banner?.listType === 'done') countDone += 1
        if (banner?.listType === undefined) countNormal += 1
        if (banner?.id === selectedBannerId) anySelected = true
      })
      let listTypeClassName = ''

      if (anySelected) {
        listTypeClassName = 'marker-pin-true'
      } else if (countDone > 0 && countTodo > 0 && countNormal === 0) {
        listTypeClassName = 'marker-pin-done-todo'
      } else if (countDone === 0 && countTodo > 0 && countNormal > 0) {
        listTypeClassName = 'marker-pin-normal-todo'
      } else if (countDone > 0 && countTodo === 0 && countNormal > 0) {
        listTypeClassName = 'marker-pin-normal-done'
      } else if (countDone > 0 && countTodo === 0 && countNormal === 0) {
        listTypeClassName = 'marker-pin-done'
      } else if (countDone === 0 && countTodo > 0 && countNormal === 0) {
        listTypeClassName = 'marker-pin-todo'
      } else if (countDone > 0 && countTodo > 0 && countNormal > 0) {
        listTypeClassName = 'marker-pin-all'
      }

      return divIcon({
        className: 'custom-div-icon',
        html: `<div class='marker-pin-medium-false ${listTypeClassName}'>${numberMarkers}</div>`,
        iconAnchor: [0, 0],
      })
    }

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
        <MapContainer {...startParams} minZoom={3} worldCopyJump>
          <RefSetup
            onMapReady={this.onMapReady}
            onMapDraggedOrZoomed={this.onMapDraggedOrZoomed}
            onMapClicked={this.onMapClicked}
          />
          <MapZoomControl />
          <LocateControl />
          <MapLoadingControl />
          {getAttributionLayer()}
          <Pane name="finalPane" style={{ zIndex: 580 }} />
          <MarkerClusterGroup
            maxClusterRadius={25}
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
}

export default withRouter(BannersMap)
