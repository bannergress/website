/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { LatLng } from 'leaflet'
import React, { Fragment } from 'react'
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
} from 'react-leaflet'
import { Banner, Mission, NumDictionary } from '../../features/banner'
import './map.less'

// set to null if all missions should be rendered
const missionsToShow = 6
const showMissionStartPointsOnMap = (
  missions: NumDictionary<Mission>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  numberOfMissions: number
) => {
  const missionStartPoints: Array<JSX.Element> = []
  const forVariable = missionsToShow ?? numberOfMissions
  for (let i = 0; i < forVariable; i += 1) {
    if (missions[i] !== undefined) {
      missionStartPoints.push(
        <CircleMarker
          pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 1 }}
          radius={5}
          center={[
            missions[i].steps[0].poi.latitude,
            missions[i].steps[0].poi.longitude,
          ]}
        >
          <Tooltip permanent>{missions[i].title}</Tooltip>
        </CircleMarker>
      )
    }
  }
  return missionStartPoints
}

const showMissionRoutesOnMap = (
  missions: NumDictionary<Mission>,
  numberOfMissions: number
) => {
  // eslint-disable-next-line no-debugger
  // debugger
  // console.log('showMissionRoutesOnMap', numberOfMissions)
  let missionPolylinesTemp: LatLng[] = []
  const missionPolylines: Array<JSX.Element> = []
  const forVariable = missionsToShow ?? numberOfMissions
  for (let i = 0; i < forVariable; i += 1) {
    for (let j = 0; j < missions[i].steps.length; j += 1) {
      if (missions[i] !== undefined) {
        missionPolylinesTemp.push(
          new LatLng(
            missions[i].steps[j].poi.latitude,
            missions[i].steps[j].poi.longitude
          )
        )
      }
    }
    // defines lineStyle based on the mission type
    let lineStyle
    if (missions[i].type === 'anyOrder')
      lineStyle = {
        color: `#${(0x1000000 + Math.random() * 0xffffff)
          .toString(16)
          .substr(1, 6)}`,
        dashArray: '10, 10',
      }
    if (missions[i].type === 'sequential')
      lineStyle = {
        color: `#${(0x1000000 + Math.random() * 0xffffff)
          .toString(16)
          .substr(1, 6)}`,
      }
    missionPolylines.push(
      <Polyline pathOptions={lineStyle} positions={missionPolylinesTemp} />
    )
    missionPolylinesTemp = []
    // console.log('missionPolylinesTemp', missionPolylinesTemp)
    // eslint-disable-next-line no-debugger
    // debugger
  }
  return missionPolylines
}

export const MapDetail: React.FC<MapDetailProps> = ({ banner }) => (
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

export interface MapDetailProps {
  banner: Banner
}
