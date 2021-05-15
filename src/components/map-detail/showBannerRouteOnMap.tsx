import React from 'react'
import { LatLng } from 'leaflet'
import { Polyline, Tooltip } from 'react-leaflet'
import _ from 'underscore'

import { Banner } from '../../features/banner'
import {
  mapMissions,
  Step,
  getFirstAvailableStep,
  getLastAvailableStep,
} from '../../features/mission'
import SquareMarker from './SquareMarker'

export const hasLatLng = (step: Step) =>
  step.poi &&
  step.poi.type !== 'unavailable' &&
  step.poi.latitude &&
  step.poi.longitude

export const showBannerRouteOnMap = (
  banner: Banner,
  openedMissionIndexes: Array<number>,
  color: 'green' | 'blue'
) => {
  const missionMultiPolylines: LatLng[][] = [[]]
  let lastMissionCoords: LatLng | undefined
  let lastMissionTitle: string | undefined
  mapMissions(banner.missions, (mission, index) => {
    if (mission) {
      const { steps } = mission
      if (steps) {
        const firstPOI = getFirstAvailableStep(mission)?.poi
        const lastPOI = getLastAvailableStep(mission)?.poi
        if (firstPOI) {
          missionMultiPolylines[missionMultiPolylines.length - 1].push(
            new LatLng(firstPOI.latitude, firstPOI.longitude)
          )
        }
        if (lastPOI) {
          lastMissionCoords = new LatLng(lastPOI.latitude, lastPOI.longitude)
          if (openedMissionIndexes.includes(index)) {
            lastMissionTitle = lastPOI.title
            missionMultiPolylines.push([
              new LatLng(lastPOI.latitude, lastPOI.longitude),
            ])
          } else {
            lastMissionTitle = undefined
          }
        }
      }
    }
  })
  const lineStyle = {
    color: 'rgba(0, 0, 0, 0.4)',
    weight: 4,
  }
  if (lastMissionCoords) {
    missionMultiPolylines[missionMultiPolylines.length - 1].push(
      lastMissionCoords
    )
  }
  if (missionMultiPolylines && missionMultiPolylines.length) {
    const lastCoordinates = _.last(_.last(missionMultiPolylines) as LatLng[])
    return (
      <>
        <Polyline
          key={`steps-${banner.id}`}
          pathOptions={lineStyle}
          positions={missionMultiPolylines}
        />
        <SquareMarker coords={lastCoordinates!} color={color} pane="finalPane">
          {lastMissionTitle && (
            <Tooltip offset={[20, 0]}>{lastMissionTitle}</Tooltip>
          )}
        </SquareMarker>
      </>
    )
  }
  return undefined
}
