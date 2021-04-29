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
import { Banner, NumDictionary } from '../../features/banner'
import { mapMissions, Mission } from '../../features/mission'
import './map.less'

// set to null if all missions should be rendered
const missionsToShow = 6
const showMissionStartPointsOnMap = (missions: NumDictionary<Mission>) => {
  const missionStartPoints: Array<JSX.Element> = []
  mapMissions(missions, (mission) => {
    if (mission && mission.startLatitude && mission.startLongitude) {
      missionStartPoints.push(
        <CircleMarker
          key={mission.id}
          pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 1 }}
          radius={5}
          center={[mission.startLatitude, mission.startLongitude]}
        >
          <Tooltip permanent>{mission.title}</Tooltip>
        </CircleMarker>
      )
    }
  })
  // const forVariable = missionsToShow ?? numberOfMissions
  // for (let i = 0; i < forVariable; i += 1) {
  //   if (missions[i] !== undefined) {
  //     const { steps } = missions[i]
  //     if (steps) {
  //       missionStartPoints.push(
  //         <CircleMarker
  //           pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 1 }}
  //           radius={5}
  //           center={[steps[0].poi.latitude, steps[0].poi.longitude]}
  //         >
  //           <Tooltip permanent>{missions[i].title}</Tooltip>
  //         </CircleMarker>
  //       )
  //     }
  //   }
  // }
  return missionStartPoints
}

const showMissionRoutesOnMap = (missions: NumDictionary<Mission>) => {
  // eslint-disable-next-line no-debugger
  // debugger
  // console.log('showMissionRoutesOnMap', numberOfMissions)
  let missionPolylinesTemp: LatLng[] = []
  const missionPolylines: Array<JSX.Element> = []
  mapMissions(missions, (mission) => {
    if (mission) {
      const { steps } = mission
      if (steps) {
        steps.forEach((step) => {
          if (step.poi.latitude && step.poi.longitude) {
            missionPolylinesTemp.push(
              new LatLng(step.poi.latitude, step.poi.longitude)
            )
          }
        })
      }
      // defines lineStyle based on the mission type
      let lineStyle
      if (mission.type === 'anyOrder')
        lineStyle = {
          color: `#${(0x1000000 + Math.random() * 0xffffff)
            .toString(16)
            .substr(1, 6)}`,
          dashArray: '10, 10',
        }
      if (mission.type === 'sequential')
        lineStyle = {
          color: `#${(0x1000000 + Math.random() * 0xffffff)
            .toString(16)
            .substr(1, 6)}`,
        }
      missionPolylines.push(
        <Polyline
          key={`steps-${mission.id}`}
          pathOptions={lineStyle}
          positions={missionPolylinesTemp}
        />
      )
      missionPolylinesTemp = []
      // console.log('missionPolylinesTemp', missionPolylinesTemp)
      // eslint-disable-next-line no-debugger
      // debugger
    }
  })
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
      {banner?.missions ? showMissionStartPointsOnMap(banner?.missions) : null}

      {banner?.missions ? showMissionRoutesOnMap(banner?.missions) : null}
    </MapContainer>
  </Fragment>
)

export interface MapDetailProps {
  banner: Banner
}
