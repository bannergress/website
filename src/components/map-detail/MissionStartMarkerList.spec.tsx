// @vitest-environment jsdom
import { createLeafletContext, LeafletContext } from '@react-leaflet/core'
import { Browser, Map as LeafletMap, Marker, MarkerClusterGroup } from 'leaflet'
import { act } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Banner } from '../../features/banner'
import MissionStartMarkerList from './MissionStartMarkerList'
import { getMarkerData } from './MarkerData'

vi.mock('../../i18n', () => ({ default: { t: (key: string) => key } }))

const banner: Banner = {
  id: 'banner',
  title: 'Test banner',
  numberOfMissions: 3,
  numberOfSubmittedMissions: 3,
  numberOfDisabledMissions: 0,
  startLatitude: 52,
  startLongitude: 13,
  type: 'sequential',
  missions: Object.fromEntries(
    [0, 1, 2].map((index) => [
      index,
      {
        id: `mission-${index}`,
        title: `Mission ${index}`,
        picture: '',
        steps: [
          {
            poi: {
              id: `poi-${index}`,
              title: `Portal ${index}`,
              type: 'fieldTripWaypoint' as const,
              latitude: 52 + index * 0.0001,
              longitude: 13,
            },
          },
        ],
      },
    ])
  ),
}

describe('mission start clusters', () => {
  let map: LeafletMap
  let root: Root
  let container: HTMLDivElement
  const onOpenMission = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    // jsdom supports SVG elements but lacks Leaflet's SVG feature detection.
    vi.spyOn(Browser, 'svg', 'get').mockReturnValue(true)
    container = document.createElement('div')
    document.body.appendChild(container)
    Object.defineProperties(container, {
      clientWidth: { value: 800 },
      clientHeight: { value: 600 },
    })
    map = new LeafletMap(container, {
      center: [52, 13],
      zoom: 16,
      maxZoom: 20,
      zoomAnimation: false,
      fadeAnimation: false,
      markerZoomAnimation: false,
    })
    map.createPane('finalPane')
    root = createRoot(document.createElement('div'))
    onOpenMission.mockClear()
  })

  afterEach(() => {
    act(() => root.unmount())
    map.remove()
    container.remove()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  const render = async (currentBanner: Banner, opened: number[] = []) => {
    await act(async () => {
      root.render(
        <LeafletContext value={createLeafletContext(map)}>
          <MissionStartMarkerList
            banner={currentBanner}
            openedMissionIndexes={opened}
            onOpenMission={onOpenMission}
          />
        </LeafletContext>
      )
      // MarkerCluster batches additions in a microtask.
      await Promise.resolve()
    })
  }

  const getCluster = () => {
    let cluster: MarkerClusterGroup | undefined
    map.eachLayer((layer) => {
      if (layer instanceof MarkerClusterGroup) cluster = layer
    })
    return cluster!
  }

  it('keeps markers and clusters in place across Todo/Done and mission expansion', async () => {
    await render(banner)
    const cluster = getCluster()
    const markers = cluster
      .getLayers()
      .filter((layer) => layer instanceof Marker)
    expect(markers).toHaveLength(4)
    const parents = markers.map((marker) => cluster.getVisibleParent(marker))
    expect(parents[0]).toBe(parents[1])
    const moved = vi.fn()
    markers.forEach((marker) => marker.on('move', moved))

    for (const listType of ['todo', 'done', 'none'] as const) {
      await render({ ...banner, listType })
    }
    await render(banner, [0, 2])

    expect(moved).not.toHaveBeenCalled()
    expect(getCluster()).toBe(cluster)
    expect(
      cluster.getLayers().filter((layer) => layer instanceof Marker)
    ).toEqual(markers)
    expect(markers.map((marker) => cluster.getVisibleParent(marker))).toEqual(
      parents
    )
    const firstMarker = markers.find((marker) => {
      const data = getMarkerData(marker)
      return data?.markerType === 'mission' && data.index === 0
    })!
    // Reveal the individual marker and open its tooltip to render its content.
    act(() => {
      map.setZoom(20)
      firstMarker.openTooltip()
    })
    moved.mockClear()
    expect(firstMarker.getTooltip()?.getElement()?.textContent).toContain(
      'Portal 0'
    )
    firstMarker.fire('click')
    expect(onOpenMission).toHaveBeenCalledWith(0)

    await render(banner, [])
    expect(moved).not.toHaveBeenCalled()
    expect(firstMarker.getTooltip()?.getElement()?.textContent).not.toContain(
      'Portal 0'
    )
  })

  it('moves markers when mission coordinates actually change', async () => {
    await render(banner)
    const markers = getCluster()
      .getLayers()
      .filter((layer) => layer instanceof Marker)
    const moved = vi.fn()
    markers.forEach((marker) => marker.on('move', moved))
    const updatedBanner = structuredClone(banner)
    const poi = updatedBanner.missions![2].steps![0].poi!
    if (poi.type === 'unavailable') throw new Error('Expected an available POI')
    poi.latitude = 53

    await render(updatedBanner)

    // The last mission's start and the banner finish both follow this POI.
    expect(moved).toHaveBeenCalledTimes(2)
    expect(
      markers.filter((marker) => marker.getLatLng().lat === 53)
    ).toHaveLength(2)
  })
})
