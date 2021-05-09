import { LatLngBounds } from 'leaflet'
import React, { Fragment } from 'react'
import { MapContainer } from 'react-leaflet'

import { Banner } from '../../features/banner'
import { showBannerRouteOnMap } from './showBannerRouteOnMap'
import {
  showMissionPortalsAndRoutes,
  showMissionStartPointsOnMap,
} from './showMissionsOnMap'
import { getAttributionLayer } from './getAttributionLayer'

import './map.less'
import MapCluster from './MapCluster'

export const MapDetail: React.FC<MapDetailProps> = ({
  banner,
  bounds,
  openedMissionIndexes,
  onOpenMission,
}) => (
  <Fragment>
    <MapContainer bounds={bounds}>
      {getAttributionLayer()}
      <MapCluster>
        {banner.missions &&
          openedMissionIndexes &&
          openedMissionIndexes.length > 0 &&
          showMissionPortalsAndRoutes(banner.missions, openedMissionIndexes)}
      </MapCluster>
      <MapCluster>
        {banner.missions &&
          showMissionStartPointsOnMap(
            banner.missions,
            openedMissionIndexes,
            onOpenMission
          )}
        {banner.missions &&
          banner.type !== 'anyOrder' &&
          showBannerRouteOnMap(banner, openedMissionIndexes, 'green')}
      </MapCluster>
    </MapContainer>
  </Fragment>
)

export interface MapDetailProps {
  banner: Banner
  bounds: LatLngBounds
  openedMissionIndexes: Array<number>
  onOpenMission: (index: number) => void
}
