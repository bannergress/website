/* eslint-disable @typescript-eslint/no-unused-vars */
import { divIcon, LatLng, LatLngBounds, point } from 'leaflet'
import React, { Fragment } from 'react'
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
} from 'react-leaflet'

import MarkerClusterGroup from 'react-leaflet-cluster'

import { Banner, NumDictionary } from '../../features/banner'
import { mapMissions, Mission } from '../../features/mission'

import './map.less'

// set to null if all missions should be rendered
const missionsToShow = 6
const showMissionStartPointsOnMap = (missions: NumDictionary<Mission>) => {
  const missionStartPoints: Array<JSX.Element> = []
  let color = '#6832da'
  let startLat = 0
  let startLng = 0
  let missionNumber = 1
  let icon = null
  mapMissions(missions, (mission) => {
    if (mission && mission?.steps!) {
      // get the first available waypoint in the mission and set it as start point
      for (let i = 0; i < mission.steps.length; i += 1) {
        if (mission.steps[i].poi?.latitude && mission.steps[i].poi?.latitude) {
          startLat = mission.steps[i].poi!.latitude
          startLng = mission.steps[i].poi!.longitude
          break
        }
      }

      // use custom icon
      const iconHidden = divIcon({
        className: 'custom-div-icon',
        html: `<div class='marker-pin'>${missionNumber}<sup>H</sup></div>`,
        iconAnchor: [0, 0],
      })
      const iconNormal = divIcon({
        className: 'custom-div-icon',
        html: `<div class='marker-pin'>${missionNumber}</div>`,
        iconAnchor: [0, 0],
      })
      // change color temporary to visualize hidden missions
      if (mission.type === 'hidden') {
        color = 'green'
        icon = iconHidden
      } else {
        color = '#6832da'
        icon = iconNormal
      }

      missionStartPoints.push(
        <Marker
          key={mission.id}
          icon={icon}
          position={[startLat, startLng]}
          eventHandlers={{
            click: (e) => {
              console.log('marker clicked', e)
            },
          }}
        >
          <Tooltip offset={[20, 0]}>{mission.title}</Tooltip>
        </Marker>
      )
      missionNumber += 1
    }
  })
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
          if (step.poi && step.poi.latitude && step.poi.longitude) {
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
          color: 'rgba(0, 0, 0, 0.4)',
          dashArray: '10, 10',
          weight: 8,
        }
      if (mission.type === 'sequential')
        lineStyle = {
          color: 'rgba(0, 0, 0, 0.4)',
          weight: 8,
        }
      missionPolylines.push(
        <Polyline
          key={`steps-${mission.id}`}
          pathOptions={lineStyle}
          positions={missionPolylinesTemp}
        >
          <Tooltip sticky>{mission.title}</Tooltip>
        </Polyline>
      )
      missionPolylinesTemp = []
      // console.log('missionPolylinesTemp', missionPolylinesTemp)
      // eslint-disable-next-line no-debugger
      // debugger
    }
  })
  return missionPolylines
}

export const MapDetail: React.FC<MapDetailProps> = ({ banner, bounds }) => (
  <Fragment>
    <MapContainer bounds={bounds}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup showCoverageOnHover={false} maxClusterRadius="5">
        {banner?.missions
          ? showMissionStartPointsOnMap(banner?.missions)
          : null}
      </MarkerClusterGroup>

      {banner?.missions ? showMissionRoutesOnMap(banner?.missions) : null}
    </MapContainer>
  </Fragment>
)

export interface MapDetailProps {
  banner: Banner
  bounds: LatLngBounds
}
