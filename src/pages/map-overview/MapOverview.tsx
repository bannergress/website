import React, { Fragment } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { RouteComponentProps } from 'react-router-dom'
import './map.less'

export class MapOverview extends React.Component<MapOverviewProps> {
  constructor(props: MapOverviewProps) {
    super(props)
    this.state = {}
  }

  render() {
    const { match } = this.props
    let lat = Number(match.params.lat)
    let lng = Number(match.params.lng)
    let zoom = 12
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      lat = 0
      lng = 0
      zoom = 3
    }
    return (
      <Fragment>
        <MapContainer center={[lat, lng]} zoom={zoom}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </Fragment>
    )
  }
}
export interface MapOverviewProps
  extends RouteComponentProps<{ lat: string; lng: string }> {}
