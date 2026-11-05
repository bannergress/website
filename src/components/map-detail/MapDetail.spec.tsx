// @vitest-environment jsdom
import React, { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { createLeafletContext, LeafletContext } from '@react-leaflet/core'
import { LatLngBounds, Map as LeafletMap } from 'leaflet'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MapDetail } from './MapDetail'
import type { Banner } from '../../features/banner/types'

const context = vi.hoisted(() => ({ map: undefined as LeafletMap | undefined }))
vi.mock('react-leaflet', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-leaflet')>()),
  MapContainer: ({ children }: { children: ReactNode }) => (
    <LeafletContext value={createLeafletContext(context.map!)}>
      {children}
    </LeafletContext>
  ),
}))
vi.mock('../../i18n', () => ({ default: { t: (key: string) => key } }))
vi.mock('./getAttributionLayer', () => ({ getAttributionLayer: () => null }))
vi.mock('./MissionStartMarkerList', () => ({ default: () => null }))
vi.mock('./MissionPoiMarkerList', () => ({ default: () => null }))
vi.mock('../locate', () => ({ LocateControl: () => null }))
vi.mock('../map-loading-control', () => ({ MapLoadingControl: () => null }))
vi.mock('../map-zoom-control', () => ({ MapZoomControl: () => null }))

class TestResizeObserver {
  static current: TestResizeObserver
  observe = vi.fn()
  disconnect = vi.fn()
  constructor(public callback: () => void) {
    TestResizeObserver.current = this
  }
}

const banner: Banner = {
  id: 'preview',
  title: 'Preview',
  numberOfMissions: 0,
  numberOfSubmittedMissions: 0,
  numberOfDisabledMissions: 0,
  startLatitude: 52,
  startLongitude: 13,
  missions: {},
}

describe('detail map layout changes', () => {
  let root: Root
  let container: HTMLDivElement
  let height: number
  const render = (openedMissionIndexes: number[] = []) =>
    act(() =>
      root.render(
        <MapDetail
          banner={banner}
          bounds={
            new LatLngBounds([
              [51, 12],
              [53, 14],
            ])
          }
          openedMissionIndexes={openedMissionIndexes}
          onOpenMission={() => {}}
        />
      )
    )

  beforeEach(() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    vi.stubGlobal('ResizeObserver', TestResizeObserver)
    height = 400
    container = document.createElement('div')
    document.body.appendChild(container)
    Object.defineProperties(container, {
      clientWidth: { get: () => 800 },
      clientHeight: { get: () => height },
    })
    context.map = new LeafletMap(container, {
      center: [52, 13],
      zoom: 12,
      zoomAnimation: false,
    })
    root = createRoot(document.createElement('div'))
  })
  afterEach(() => {
    act(() => root.unmount())
    context.map!.remove()
    container.remove()
    vi.unstubAllGlobals()
  })

  it('recalculates Leaflet dimensions after mission expansion without a window resize', () => {
    render()
    const observer = TestResizeObserver.current
    expect(observer.observe).toHaveBeenCalledWith(container)
    expect(context.map!.getSize().y).toBe(400)
    height = 900
    render([0])
    expect(TestResizeObserver.current).toBe(observer)
    act(() => observer.callback())
    expect(context.map!.getSize().y).toBe(900)
    height = 500
    act(() => observer.callback())
    expect(context.map!.getSize().y).toBe(500)
    act(() => root.render(null))
    expect(observer.disconnect).toHaveBeenCalledOnce()
  })

  it('waits until the map becomes visible before invalidating a hidden pane', () => {
    render()
    const invalidate = vi.spyOn(context.map!, 'invalidateSize')
    height = 0
    act(() => TestResizeObserver.current.callback())
    expect(invalidate).not.toHaveBeenCalled()
    height = 600
    act(() => TestResizeObserver.current.callback())
    expect(invalidate).toHaveBeenCalledWith({
      pan: false,
      debounceMoveend: true,
    })
    expect(context.map!.getSize().y).toBe(600)
  })
})
