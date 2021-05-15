import { LatLngBounds } from 'leaflet'
import React, { Fragment } from 'react'
import { MapContainer, Pane } from 'react-leaflet'

import { Banner } from '../../features/banner'
import { showBannerRouteOnMap } from './showBannerRouteOnMap'
import {
  showMissionPortalsAndRoutes,
  showMissionStartPointsOnMap,
} from './showMissionsOnMap'
import { getAttributionLayer } from './getAttributionLayer'
import MapCluster from './MapCluster'

import './map.less'

export const MapDetail: React.FC<MapDetailProps> = ({
  banner,
  bounds,
  openedMissionIndexes,
  onOpenMission,
}) => (
  <Fragment>
    <MapContainer bounds={bounds}>
      {getAttributionLayer()}
      <Pane name="poi" style={{ zIndex: 550 }}>
        {banner.missions &&
          openedMissionIndexes &&
          openedMissionIndexes.length > 0 && (
            <MapCluster pane="poi">
              {showMissionPortalsAndRoutes(
                banner.missions,
                openedMissionIndexes
              )}
            </MapCluster>
          )}
      </Pane>
      <Pane name="finalPane" style={{ zIndex: 580 }} />
      <MapCluster>
        {banner.missions &&
          showMissionStartPointsOnMap(
            banner.missions,
            openedMissionIndexes,
            banner.type === 'sequential',
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
