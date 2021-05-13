import React from 'react'
import { divIcon, LatLng } from 'leaflet'
import { Marker, Polyline, Tooltip } from 'react-leaflet'
import _ from 'underscore'
import { renderToStaticMarkup } from 'react-dom/server'
import { NumDictionary } from '../../features/banner'
import {
  FieldTripWaypointPOI,
  mapMissions,
  Mission,
  PortalPOI,
} from '../../features/mission'
import POIMarker from './POIMarker'
import { hasLatLng } from './showBannerRouteOnMap'
import { ReactComponent as EyeOffSVG } from '../../img/icons/eye-off-outline.svg'

export const showMissionStartPointsOnMap = (
  missions: NumDictionary<Mission>,
  openedMissionIndexes: Array<number>,
  isSequential: boolean,
  onOpenMission: (index: number) => void
) => {
  let firstMission = true
  return mapMissions(missions, (mission, index) => {
    if (mission && mission?.steps!) {
      let startLat = 0
      let startLng = 0
      let icon = null
      let title = <>{mission.title}</>
      // get the first available waypoint in the mission and set it as start point
      const firstStep = mission.steps.find(hasLatLng)
      if (firstStep && firstStep.poi && firstStep.poi.type !== 'unavailable') {
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

      // use custom icon
      const hiddenMarkerContents = renderToStaticMarkup(
        <div className="marker-pin">
          {index + 1}
          <EyeOffSVG />
        </div>
      )
      const iconHidden = divIcon({
        className: 'custom-div-icon',
        html: hiddenMarkerContents,
        iconAnchor: [0, 0],
      })
      const iconNormal = divIcon({
        className: `custom-div-icon-${firstMission && isSequential}`,
        html: `<div class='marker-pin-${firstMission && isSequential}'>${
          index + 1
        }</div>`,
        iconAnchor: [0, 0],
      })
      if (mission.type === 'hidden') {
        icon = iconHidden
      } else {
        icon = iconNormal
      }
      firstMission = false
      return (
        <Marker
          key={mission.id}
          icon={icon}
          position={[startLat, startLng]}
          eventHandlers={{
            click: () => onOpenMission(index),
          }}
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
  indexes: Array<number>
) => {
  let pois: Array<PortalPOI | FieldTripWaypointPOI> = []
  const lines: Array<JSX.Element> = []
  const lineStyle = {
    color: 'rgba(27, 27, 27, 0.8)',
    weight: 6,
    dashArray: '0',
  }

  indexes.forEach((index) => {
    const mission = missions[index]
    const { steps } = mission
    if (steps) {
      const missionPortals = steps
        .map((s) => (s.poi && s.poi.type !== 'unavailable' ? s.poi : undefined))
        .filter((p): p is PortalPOI | FieldTripWaypointPOI => !!p)
      if (missionPortals && missionPortals.length) {
        lineStyle.dashArray = mission.type === 'sequential' ? '0' : '10'
        lines.push(
          <Polyline
            key={`mission-route-${mission.id}`}
            pathOptions={{ ...lineStyle }}
            positions={missionPortals.map(
              (p) => new LatLng(p.latitude, p.longitude)
            )}
          >
            <Tooltip sticky>{mission.title}</Tooltip>
          </Polyline>
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
