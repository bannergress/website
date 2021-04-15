import React, { Fragment } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { Banner } from '../../features/banner'
import './map.less'

export const Map: React.FC<MapProps> = ({ banner }) => (
  <Fragment>
    <MapContainer
      center={[banner?.startLatitude, banner?.startLongitude]}
      zoom={12}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
      />
    </MapContainer>
  </Fragment>
)

export interface MapProps {
  banner: Banner
}
