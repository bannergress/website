import { LatLngBounds, Map } from 'leaflet'
import React, { Fragment } from 'react'
import { MapContainer, Pane, useMap } from 'react-leaflet'

import { Banner } from '../../features/banner'
import { getAttributionLayer } from './getAttributionLayer'
import MissionStartMarkerList from './MissionStartMarkerList'
import MissionPoiMarkerList from './MissionPoiMarkerList'

import './map.less'
import { LocateControl } from '../locate'
import { MapLoadingControl } from '../map-loading-control'
import { MapZoomControl } from '../map-zoom-control'
import i18n from '../../i18n'

export class MapDetail extends React.Component<MapDetailProps> {
  mapRef: Map | undefined

  boundsAppliedWhileVisible: boolean = false

  componentDidMount() {
    window.addEventListener('resize', this.handleResizedScreen)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResizedScreen)
  }

  isVisible = () => {
    return this.mapRef?.getContainer()?.offsetParent !== null
  }

  // In Mobile mode, the map isn't visible at first
  // and only shown when the user switches to the map
  // or increased the window size.
  // When the map isn't visible when it is mounted, the bounds aren't applied.
  // We need to apply them then the first time, it becomes visible
  handleResizedScreen = () => {
    if (this.isVisible()) {
      if (!this.boundsAppliedWhileVisible) {
        if (this.mapRef) {
          const minZoom = this.mapRef.getMinZoom()
          const zoom = this.mapRef.getZoom()

          if (minZoom === zoom) {
            this.applyBounds()
          }
        }
      }
    }
  }

  RefSetup: React.FC = () => {
    const map = useMap()
    this.mapRef = map
    // eslint-disable-next-line no-param-reassign
    map.zoomControl.options.zoomInText = i18n!.t('map.zoomIn')
    return null
  }

  /**
   * Tell the map to recalculate its size.
   * Use if the map was resized while it was invisible
   * or was created as invisible in the first place
   */
  public invalidateMapSize() {
    setTimeout(() => {
      this.mapRef?.invalidateSize()
    }, 1)
  }

  /**
   * Re-apply the bounds set as property the first time the map becomes visible
   */
  public applyBounds() {
    const inner = () => {
      if (!this.boundsAppliedWhileVisible && this.isVisible()) {
        const { bounds } = this.props
        this.mapRef?.fitBounds(bounds)

        this.boundsAppliedWhileVisible = true
      }
    }

    setTimeout(inner, 1)
  }

  render() {
    const { bounds, banner, openedMissionIndexes, onOpenMission } = this.props

    return (
      <Fragment>
        <MapContainer bounds={bounds} tap={false}>
          <this.RefSetup />
          <MapZoomControl />
          <LocateControl />
          <MapLoadingControl />
          {getAttributionLayer()}
          <Pane name="poi" style={{ zIndex: 550 }}>
            {banner.missions &&
              openedMissionIndexes &&
              openedMissionIndexes.length > 0 && (
                <MissionPoiMarkerList
                  missions={banner.missions}
                  openedMissionIndexes={openedMissionIndexes}
                />
              )}
          </Pane>
          <Pane name="finalPane" style={{ zIndex: 580 }} />
          {banner.missions && (
            <MissionStartMarkerList
              banner={banner}
              openedMissionIndexes={openedMissionIndexes}
              onOpenMission={onOpenMission}
            />
          )}
        </MapContainer>
      </Fragment>
    )
  }
}

export interface MapDetailProps {
  banner: Banner
  bounds: LatLngBounds
  openedMissionIndexes: Array<number>
  onOpenMission: (index: number) => void
}
