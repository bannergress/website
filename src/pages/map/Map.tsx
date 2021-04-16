import React, { Fragment } from 'react'
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet'
import { Banner, Mission, NumDictionary } from '../../features/banner'
import './map.less'

const showMissionStartPointsOnMap = (
  missions: NumDictionary<Mission>,
  numberOfMissions: number
) => {
  // eslint-disable-next-line no-debugger
  // debugger
  console.log(numberOfMissions)
  const missionStartPoints: Array<JSX.Element> = []
  for (let i = 0; i < 1; i += 1) {
    missionStartPoints.push(
      <Marker
        position={[
          missions[i].steps[0].poi.latitude,
          missions[i].steps[0].poi.longitude,
        ]}
      />
    )
    // eslint-disable-next-line no-debugger
    // debugger
  }
  // eslint-disable-next-line no-debugger
  // debugger
  return missionStartPoints
}

const showMissionRoutesOnMap = (
  missions: NumDictionary<Mission>,
  numberOfMissions: number
) => {
  // eslint-disable-next-line no-debugger
  // debugger
  console.log(numberOfMissions)
  const missionPolylinesTemp: Number[][] = []
  const missionPolylines: Array<JSX.Element> = []

  for (let i = 0; i < 1; i += 1) {
    for (let j = 0; j < missions[i].steps.length; j += 1) {
      missionPolylinesTemp.push([
        missions[i].steps[j].poi.latitude,
        missions[i].steps[j].poi.longitude,
      ])
    }
    missionPolylines.push(
      <Polyline
        pathOptions={{ color: 'black' }}
        positions={[
          [5, 6],
          [4, 7],
        ]}
      />
    )
    console.log(missionPolylinesTemp)
    // eslint-disable-next-line no-debugger
    // debugger
  }
  // eslint-disable-next-line no-debugger
  // debugger
  return missionPolylines
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
        ? showMissionStartPointsOnMap(
            banner?.missions,
            banner?.numberOfMissions
          )
        : null}

      {banner?.missions
        ? showMissionRoutesOnMap(banner?.missions, banner?.numberOfMissions)
        : null}
    </MapContainer>
  </Fragment>
)

export interface MapProps {
  banner: Banner
}
