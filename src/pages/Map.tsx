import React, { Fragment } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import './Map.css'

export const Map: React.FC = () => {
  return (
    <Fragment>
      <MapContainer center={[51.96, 7.62]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </Fragment>
  )
}
