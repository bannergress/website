import React from 'react'
import { LatLng } from 'leaflet'
import { Polyline } from 'react-leaflet'

import { Banner } from '../../features/banner'
import { mapMissions } from '../../features/mission'

export const showBannerRouteOnMap = (banner: Banner) => {
  const missionPolylines: LatLng[] = []
  mapMissions(banner.missions, (mission) => {
    if (mission) {
      const { steps } = mission
      if (steps) {
        const step = steps.find(
          (s) => s.poi && s.poi.latitude && s.poi.longitude
        )
        if (step)
          missionPolylines.push(
            new LatLng(step.poi!.latitude, step.poi!.longitude)
          )
      }
    }
  })
  const lineStyle = {
    color: 'rgba(0, 0, 0, 0.4)',
    weight: 8,
  }
  if (missionPolylines && missionPolylines.length) {
    return (
      <Polyline
        key={`steps-${banner.id}`}
        pathOptions={lineStyle}
        positions={missionPolylines}
      />
    )
  }
  return undefined
}
