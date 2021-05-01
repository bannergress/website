import React, { Fragment } from 'react'
import { LatLng, LatLngBounds, Map as LeafletMap } from 'leaflet'
import { CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import 'leaflet-loading'

import { Banner } from '../../features/banner'

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
    this.state = {
      center: new LatLng(lat, lng),
      zoom,
      selectedBannerId: undefined,
    }
  }

  onMapDragged = () => {
    const { location, history, onMapChanged } = this.props
    const urlParams = new URLSearchParams(location.search)
    const center = this.map!.getCenter()
    urlParams.set('lat', center.lat.toString())
    urlParams.set('lng', center.lng.toString())
    history.replace({
      pathname: location.pathname,
      search: urlParams.toString(),
    })
    this.setState({ center })
    onMapChanged(this.map!.getBounds())
  }

  onMapZoom = () => {
    const { location, history, onMapChanged } = this.props
    const urlParams = new URLSearchParams(location.search)
    const zoom = this.map!.getZoom()
    urlParams.set('zoom', zoom.toString())
    history.replace({
      pathname: location.pathname,
      search: urlParams.toString(),
    })
    this.setState({ zoom })
    onMapChanged(this.map!.getBounds())
  }

  onMapCreated = (map: LeafletMap) => {
    const { onMapChanged } = this.props
    this.map = map
    map.addEventListener('dragend', this.onMapDragged)
    map.addEventListener('zoomend', this.onMapZoom)
    onMapChanged(map.getBounds())
  }

  onSelectBanner = (banner: Banner) => {
    const { onSelectBanner } = this.props
    onSelectBanner(banner)
    this.setState({ selectedBannerId: banner.uuid })
  }

  showBannersOnMap = () => {
    const { banners } = this.props
    const { selectedBannerId } = this.state
    return banners.map((banner: Banner) => (
      <CircleMarker
        key={banner.uuid}
        pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 1 }}
        radius={5}
        center={[banner.startLatitude, banner.startLongitude]}
        eventHandlers={{
          click: () => this.onSelectBanner(banner),
        }}
        className={selectedBannerId === banner.uuid ? 'selected' : ''}
      >
        <Tooltip permanent>{banner.title}</Tooltip>
      </CircleMarker>
    ))
  }

  render() {
    const { loading } = this.props
    const { center, zoom } = this.state
    // if bounds parameter is set, use this, otherwise use lat,lng,zoom to center the map
    // if (parameterMap.has('bounds')) {
    //   parameterMap.set('bounds', parameterMap.get('bounds').split(','))
    //   return (
    //     <Fragment>
    //       <Helmet>
    //         <title>Map</title>
    //       </Helmet>
    //       <MapContainer
    //         bounds={
    //           new LatLngBounds(
    //             new LatLng(
    //               Number(parameterMap.get('bounds')[0]),
    //               Number(parameterMap.get('bounds')[1])
    //             ),
    //             new LatLng(
    //               Number(parameterMap.get('bounds')[2]),
    //               Number(parameterMap.get('bounds')[3])
    //             )
    //           )
    //         }
    //         whenCreated={this.onMapCreated}
    //       >
    //         <TileLayer
    //           attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    //           url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
    //         />
    //       </MapContainer>
    //     </Fragment>
    //   )
    // }
    return (
      <Fragment>
        <MapContainer
          center={center}
          zoom={zoom}
          whenCreated={this.onMapCreated}
          // @ts-ignore
          loadingControl={loading}
        >
          {this.showBannersOnMap()}
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
          />
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
  center: LatLng
  zoom: number
  selectedBannerId: string | undefined
}

export default withRouter(BannersMap)
