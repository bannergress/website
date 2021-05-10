import React from 'react'
import { LatLng } from 'leaflet'
import { Polyline, Tooltip } from 'react-leaflet'
import _ from 'underscore'

import { Banner } from '../../features/banner'
import { mapMissions, Step } from '../../features/mission'
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
  const missionPolylines: LatLng[] = []
  let lastMissionCoords: LatLng | undefined
  let lastMissionTitle: string | undefined
  mapMissions(banner.missions, (mission, index) => {
    if (mission) {
      const { steps } = mission
      if (steps) {
        const firstPOI = steps.find(hasLatLng)?.poi
        const lastPOI = _([...steps])
          .chain()
          .filter(hasLatLng)
          .last()
          .value()?.poi
        if (firstPOI && firstPOI.type !== 'unavailable') {
          missionPolylines.push(
            new LatLng(firstPOI.latitude, firstPOI.longitude)
          )
        }
        if (lastPOI && lastPOI.type !== 'unavailable') {
          lastMissionCoords = new LatLng(lastPOI.latitude, lastPOI.longitude)
          if (openedMissionIndexes.includes(index)) {
            lastMissionTitle = lastPOI.title
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
    missionPolylines.push(lastMissionCoords)
  }
  if (missionPolylines && missionPolylines.length) {
    const lastCoordinates = _.last(missionPolylines)
    return (
      <>
        <Polyline
          key={`steps-${banner.id}`}
          pathOptions={lineStyle}
          positions={missionPolylines}
        />
        <SquareMarker coords={lastCoordinates!} color={color}>
          {lastMissionTitle && (
            <Tooltip offset={[20, 0]}>{lastMissionTitle}</Tooltip>
          )}
        </SquareMarker>
      </>
    )
  }
  return undefined
}
