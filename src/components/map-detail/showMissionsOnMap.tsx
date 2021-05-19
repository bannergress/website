import React from 'react'
import { LatLng, LatLngBounds } from 'leaflet'
import { Marker, Polyline, Tooltip } from 'react-leaflet'
import _ from 'underscore'

import { NumDictionary } from '../../features/banner'
import {
  mapMissions,
  Mission,
  getFirstAvailableStep,
  getAvailableSteps,
  AvailableStep,
} from '../../features/mission'
import POIMarker from './POIMarker'
import { MissionMarkerData, setMarkerData } from './MarkerData'
import { getMarkerDataIcon } from './MarkerIcons'

export const showMissionStartPointsOnMap = (
  missions: NumDictionary<Mission>,
  openedMissionIndexes: Array<number>,
  isSequential: boolean,
  onOpenMission: (index: number) => void
) => {
  return mapMissions(missions, (mission, index) => {
    if (mission && mission?.steps!) {
      let startLat = 0
      let startLng = 0
      let title = <>{mission.title}</>

      // get the first available waypoint in the mission and set it as start point
      const firstStep = getFirstAvailableStep(mission)
      if (firstStep) {
        startLat = firstStep.poi.latitude
        startLng = firstStep.poi.longitude
        if (openedMissionIndexes.includes(index)) {
          title = (
            <>
              {title}
              <br />
              {firstStep.poi.title}
            </>
          )
        }
      }

      const markerData: MissionMarkerData = {
        markerType: 'mission',
        mission,
        index,
        isSequential,
      }

      const icon = getMarkerDataIcon(markerData)

      return (
        <Marker
          key={mission.id}
          icon={icon}
          position={[startLat, startLng]}
          eventHandlers={{
            click: () => onOpenMission(index),
          }}
          ref={(el) => setMarkerData(el, markerData)}
        >
          <Tooltip offset={[20, 0]}>{title}</Tooltip>
        </Marker>
      )
    }
    return undefined
  })
}

export const showMissionPortalsAndRoutes = (
  missions: NumDictionary<Mission>,
  indexes: Array<number>,
  bounds: LatLngBounds
) => {
  let pois: AvailableStep[] = []
  const lines: Array<JSX.Element> = []
  const lineStyle = {
    color: 'rgba(27, 27, 27, 0.8)',
    weight: 6,
    dashArray: '0',
  }

  indexes.forEach((index) => {
    const mission = missions[index]
    const availableSteps = getAvailableSteps(mission)

    if (availableSteps && availableSteps.length) {
      const missionRoute = availableSteps.map(
        (p) => new LatLng(p.poi.latitude, p.poi.longitude)
      )
      // Only show visible markers and lines in map
      const visibleSteps = availableSteps.filter((s) =>
        bounds.contains(new LatLng(s.poi.latitude, s.poi.longitude))
      )
      if (visibleSteps.length > 0) {
        lineStyle.dashArray = mission.type === 'sequential' ? '0' : '10'
        lines.push(
          <Polyline
            key={`mission-route-${mission.id}`}
            pathOptions={{ ...lineStyle }}
            positions={missionRoute}
          >
            <Tooltip sticky pane="tooltipPane">
              {mission.title}
            </Tooltip>
          </Polyline>
        )
        pois = _(pois)
          .chain()
          .union(visibleSteps)
          .uniq(false, (p) => p.poi.id)
          .value()
      }
    }
  })

  return (
    <>
      {lines}
      {pois.map((step) => (
        <POIMarker key={step.poi.id} poi={step.poi} />
      ))}
    </>
  )
}
