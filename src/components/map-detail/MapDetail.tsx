import { LatLngBounds, Map as LeafletMap } from 'leaflet'
import React, { Fragment } from 'react'
import { MapContainer } from 'react-leaflet'

import { Banner } from '../../features/banner'
import { showBannerRouteOnMap } from './showBannerRouteOnMap'
import {
  showMissionPortalsAndRoutes,
  showMissionStartPointsOnMap,
} from './showMissionsOnMap'
import { getAttributionLayer } from './getAttributionLayer'
import MapCluster from './MapCluster'

import './map.less'

const onMapCreated = (map: LeafletMap) => {
  map.createPane('poi')
  const missionsPane = map.getPane('poi')
  if (missionsPane) {
    missionsPane.style.zIndex = '550'
  }
}

export const MapDetail: React.FC<MapDetailProps> = ({
  banner,
  bounds,
  openedMissionIndexes,
  onOpenMission,
}) => (
  <Fragment>
    <MapContainer bounds={bounds} whenCreated={onMapCreated}>
      {getAttributionLayer()}
      {banner.missions &&
        openedMissionIndexes &&
        openedMissionIndexes.length > 0 && (
          <MapCluster pane="poi">
            {showMissionPortalsAndRoutes(banner.missions, openedMissionIndexes)}
          </MapCluster>
        )}
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
