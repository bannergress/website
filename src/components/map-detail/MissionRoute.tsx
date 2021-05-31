import { LatLngExpression, PathOptions } from 'leaflet'
import React, { FC, useMemo } from 'react'
import { Polyline, Tooltip } from 'react-leaflet'

const MissionRoute: FC<MissionRouteProps> = ({ options, route, title }) =>
  useMemo(
    () => (
      <Polyline pathOptions={options} positions={route}>
        <Tooltip sticky pane="tooltipPane">
          {title}
        </Tooltip>
      </Polyline>
    ),
    [options, route, title]
  )

export interface MissionRouteProps {
  options: PathOptions
  route: Array<LatLngExpression>
  title: string
}

export default MissionRoute
