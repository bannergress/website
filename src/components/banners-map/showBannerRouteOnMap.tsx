import React from 'react'
import { LatLng } from 'leaflet'
import { Polyline } from 'react-leaflet'
import _ from 'underscore'

import { Banner } from '../../features/banner'
import { mapMissions } from '../../features/mission'
import SquareMarker from './SquareMarker'

export const showBannerRouteOnMap = (banner: Banner) => {
  const missionPolylines: LatLng[] = []
  let lastMissionCoords: LatLng | undefined
  mapMissions(banner.missions, (mission) => {
    if (mission) {
      const { steps } = mission
      if (steps) {
        const step = steps.find(
          (s) => s.poi && s.poi.latitude && s.poi.longitude
        )
        const last = _([...steps])
          .chain()
          .filter((s) => s.poi && s.poi.latitude && s.poi.longitude)
          .last()
          .value()
        if (step) {
          missionPolylines.push(
            new LatLng(step.poi!.latitude, step.poi!.longitude)
          )
        }
        if (last) {
          lastMissionCoords = new LatLng(
            last.poi!.latitude,
            last.poi!.longitude
          )
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
