import React from 'react'
import { LatLng } from 'leaflet'
import { Polyline, Tooltip } from 'react-leaflet'
import _ from 'underscore'

import { Banner } from '../../features/banner'
import { mapMissions, Step, getAvailableSteps } from '../../features/mission'
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
  const missionMultiPolylines: LatLng[][] = []
  let lastMissionTitle: string | undefined
  let prevMission = 0
  const connectMissions = banner.type !== 'anyOrder'

  mapMissions(banner.missions, (mission, index) => {
    if (mission) {
      const availableSteps = getAvailableSteps(mission)

      if (availableSteps && availableSteps.length) {
        const firstPOI = availableSteps[0].poi

        if (connectMissions) {
          if (firstPOI && prevMission + 1 === index) {
            missionMultiPolylines[missionMultiPolylines.length - 1].push(
              new LatLng(firstPOI.latitude, firstPOI.longitude)
            )
          }
        }
        prevMission = index

        missionMultiPolylines.push(
          availableSteps.map((p) => new LatLng(p.poi.latitude, p.poi.longitude))
        )

        const lastPOI = _.last(availableSteps)!.poi
        if (lastPOI) {
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

  if (missionMultiPolylines && missionMultiPolylines.length) {
    const lastCoordinates = _.last(_.last(missionMultiPolylines)!)
    return (
      <>
        <Polyline
          key={`steps-${banner.id}`}
          pathOptions={lineStyle}
          positions={missionMultiPolylines}
        />
        {connectMissions && (
          <SquareMarker
            coords={lastCoordinates!}
            color={color}
            pane="finalPane"
          >
            {lastMissionTitle && (
              <Tooltip offset={[20, 0]}>{lastMissionTitle}</Tooltip>
            )}
          </SquareMarker>
        )}
      </>
    )
  }
  return undefined
}
