import React, { Fragment } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import './map.less'

export const Map: React.FC = () => (
  <Fragment>
    <MapContainer center={[55.753669, 37.619847]} zoom={9}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
      />
    </MapContainer>
  </Fragment>
)
