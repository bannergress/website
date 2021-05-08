import React from 'react'
import { LatLng } from 'leaflet'
import { Polyline } from 'react-leaflet'
import _ from 'underscore'

import { Banner } from '../../features/banner'
import { mapMissions, Step } from '../../features/mission'
import SquareMarker from './SquareMarker'

const hasLatLng = (step: Step) =>
  step.poi &&
  step.poi.type !== 'unavailable' &&
  step.poi.latitude &&
  step.poi.longitude

export const showBannerRouteOnMap = (banner: Banner) => {
  const missionPolylines: LatLng[] = []
  let lastMissionCoords: LatLng | undefined
  mapMissions(banner.missions, (mission) => {
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
        }
      }
    }
  })
  const lineStyle = {
    color: 'rgba(0, 0, 0, 0.4)',
    weight: 8,
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
        <SquareMarker bounds={lastCoordinates!} />
      </>
    )
  }
  return undefined
}
