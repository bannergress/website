import { divIcon, LatLng } from 'leaflet'
import React from 'react'
import { Marker, Polyline, Tooltip } from 'react-leaflet'
import _ from 'underscore'

import { NumDictionary } from '../../features/banner'
import {
  FieldTripWaypointPOI,
  mapMissions,
  Mission,
  PortalPOI,
} from '../../features/mission'
import POIMarker from './POIMarker'
import { hasLatLng } from './showBannerRouteOnMap'

export const showMissionStartPointsOnMap = (
  missions: NumDictionary<Mission>,
  onOpenMission: (index: number) => void
) => {
  let missionNumber = 1
  return mapMissions(missions, (mission, index) => {
    // let color = '#6832da'
    let startLat = 0
    let startLng = 0
    let icon = null
    if (mission && mission?.steps!) {
      // get the first available waypoint in the mission and set it as start point
      const firstStep = mission.steps.find(hasLatLng)
      if (firstStep && firstStep.poi && firstStep.poi.type !== 'unavailable') {
        startLat = firstStep.poi.latitude
        startLng = firstStep.poi.longitude
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
        // color = 'green'
        icon = iconHidden
      } else {
        // color = '#6832da'
        icon = iconNormal
      }

      missionNumber += 1
      return (
        <Marker
          key={mission.id}
          icon={icon}
          position={[startLat, startLng]}
          eventHandlers={{
            click: () => onOpenMission(index),
          }}
        >
          <Tooltip offset={[20, 0]}>{mission.title}</Tooltip>
        </Marker>
      )
    }
    return undefined
  })
}

export const showMissionPortalsAndRoutes = (
  missions: NumDictionary<Mission>,
  indexes: Array<number>
) => {
  let pois: Array<PortalPOI | FieldTripWaypointPOI> = []
  const lines: Array<JSX.Element> = []
  const lineStyle = {
    color: 'rgba(0, 0, 0, 0.4)',
    weight: 3,
    dashArray: '3, 5',
  }

  indexes.forEach((index) => {
    const mission = missions[index]
    const { steps } = mission
    if (steps) {
      const missionPortals = steps
        .map((s) => (s.poi && s.poi.type !== 'unavailable' ? s.poi : undefined))
        .filter((p): p is PortalPOI | FieldTripWaypointPOI => !!p)
      if (missionPortals && missionPortals.length) {
        lineStyle.color =
          mission.type === 'sequential'
            ? 'rgba(0, 0, 0, 0.4)'
            : 'rgba(255, 0, 0, 0.4)'
        lines.push(
          <Polyline
            key={`mission-route-${mission.id}`}
            pathOptions={{ ...lineStyle }}
            positions={missionPortals.map(
              (p) => new LatLng(p.latitude, p.longitude)
            )}
          />
        )
      }
      pois = _(pois)
        .chain()
        .union(missionPortals)
        .uniq(false, (p) => p.id)
        .value()
    }
  })
  return (
    <>
      {lines}
      {pois.map((poi) => (
        <POIMarker key={poi.id} poi={poi} />
      ))}
    </>
  )
}