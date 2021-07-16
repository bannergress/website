import React, { Fragment } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import {
  divIcon,
  LatLng,
  LatLngBounds,
  Map as LeafletMap,
  LayersControlEvent,
  MarkerCluster,
} from 'leaflet'
import {
  MapContainer,
  Pane,
  TileLayer,
  LayersControl,
  Circle,
} from 'react-leaflet'
import _ from 'underscore'
import MarkerClusterGroup from 'react-leaflet-cluster'

import { Banner, getBannerBounds } from '../../features/banner'
import { BannerMarker, getBannerFromMarker } from './BannerMarker'
import { showBannerRouteOnMap } from '../map-detail/showBannerRouteOnMap'
import { getAttributionLayer } from '../map-detail/getAttributionLayer'
import { LocateControl } from '../locate'
import { MapLoadingControl } from '../map-loading-control'

import './banners-map.less'
import 'leaflet/dist/leaflet.css'

class BannersMap extends React.Component<BannersMapProps, BannersMapState> {
  private map: LeafletMap | undefined = undefined

  private onlyOfficialText = 'Show only official Niantic banners'

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
  }

  shouldComponentUpdate(nextProps: Readonly<BannersMapProps>) {
    const { banners, loading, selectedBannerId } = this.props

    if (this.map && loading !== nextProps.loading) {
      this.map.fireEvent(nextProps.loading ? 'dataloading' : 'dataload')
    }

    if (selectedBannerId !== nextProps.selectedBannerId) {
      const banner = banners.find((b) => b.id === nextProps.selectedBannerId)
      if (banner) {
        setTimeout(() => {
          this.map!.invalidateSize()
          const bounds = getBannerBounds(banner)
          if (bounds) {
            this.map!.fitBounds(new LatLngBounds(bounds), {
              animate: true,
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

  /** unselects an banner overview route, when clicked outside the starting point */
  onMapClicked = () => {
    const { selectedBannerId, banners } = this.props
    const selectedBanner = banners.find((b) => b.id === selectedBannerId)
    if (selectedBanner) {
      this.onSelectBanner(selectedBanner)
    }
  }

  onOverlayAdded = (e: LayersControlEvent) => {
    if (e.name === this.onlyOfficialText) {
      const { onChangeOnlyOfficial } = this.props
      onChangeOnlyOfficial(true)
    }
  }

  onOverlayRemoved = (e: LayersControlEvent) => {
    if (e.name === this.onlyOfficialText) {
      const { onChangeOnlyOfficial } = this.props
      onChangeOnlyOfficial(false)
    }
  }

  onMapCreated = (map: LeafletMap) => {
    this.map = map
    map.addEventListener('dragend', this.onMapDraggedOrZoomed)
    map.addEventListener('zoomend', this.onMapDraggedOrZoomed)
    map.addEventListener('click', this.onMapClicked)
    map.addEventListener('overlayadd', this.onOverlayAdded)
    map.addEventListener('overlayremove', this.onOverlayRemoved)
    this.onMapDraggedOrZoomed()
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
    const numberMarkers = cluster.getChildCount()

    if (numberMarkers > 1) {

      // Currently used logic for clusters:
      // When all banners done, show as done
      // When at least one banner is todo, show as todo
      // Else show as normal

      const children = cluster.getAllChildMarkers()

      let hasTodo = false
      let hasAllDone = true

      children.forEach((marker) => {
        const banner = getBannerFromMarker(marker)
        if (banner?.listType === 'todo') {
          hasTodo = true
        }
        if (banner?.listType !== 'done') {
          hasAllDone = false
        }
      })

      let listTypeClassName = ''
      if (hasAllDone) {
        listTypeClassName = 'marker-pin-done'
      } else if (hasTodo) {
        listTypeClassName = 'marker-pin-todo'
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
    const { onlyOfficial } = this.props

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
          <LayersControl position="topright">
            <LayersControl.Overlay
              checked={onlyOfficial}
              name={this.onlyOfficialText}
            >
              <Circle center={center} radius={0} />
            </LayersControl.Overlay>
          </LayersControl>

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
  onlyOfficial: boolean
  onChangeOnlyOfficial: (onlyOfficial: boolean) => void
}

interface BannersMapState {
  initialBounds: LatLngBounds | null
  center: LatLng
  zoom: number
}

export default withRouter(BannersMap)
