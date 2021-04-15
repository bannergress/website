import React, { Fragment } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { Banner, Mission, NumDictionary } from '../../features/banner'
import './map.less'

const showMissionsOnMap = (
  missions: NumDictionary<Mission>,
  numberOfMissions: number
) => {
  console.log(missions[0].steps[0].poi.latitude)
  const missionStartPoints: Array<JSX.Element> = []
  for (let i = 0; i < numberOfMissions; i += 1) {
    missionStartPoints.push(
      <Marker
        position={[
          missions[0].steps[0].poi.latitude,
          missions[0].steps[0].poi.longitude,
        ]}
      />
    )
  }
  return missionStartPoints
}

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
      {banner?.missions
        ? showMissionsOnMap(banner?.missions, banner?.numberOfMissions)
        : null}
    </MapContainer>
  </Fragment>
)

export interface MapProps {
  banner: Banner
}
