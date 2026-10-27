// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { Map as LeafletMap } from 'leaflet'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MapBannersLimitControl } from './MapBannersLimitControl'

let map: LeafletMap
const translate = (key: string) => key

vi.mock('react-leaflet', () => ({ useMap: () => map }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: translate }),
}))

describe('MapBannersLimitControl', () => {
  let container: HTMLDivElement
  let mapContainer: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    container = document.createElement('div')
    mapContainer = document.createElement('div')
    document.body.append(container, mapContainer)
    root = createRoot(container)
    map = new LeafletMap(mapContainer).setView([0, 0], 3)
  })

  afterEach(() => {
    act(() => root.unmount())
    map.remove()
    container.remove()
    mapContainer.remove()
    vi.unstubAllGlobals()
  })

  it('shows the translated warning and zooms in one level without clicking the map', () => {
    const onMapClick = vi.fn()
    map.on('click', onMapClick)
    act(() => root.render(<MapBannersLimitControl />))
    const button = mapContainer.querySelector('button')!

    expect(button.textContent).toContain('map.bannersLimitTitle')
    expect(button.textContent).toContain('map.bannersLimitAction')
    expect(button.getAttribute('aria-label')).toBe('map.bannersLimit')
    expect(button.title).toBe('map.bannersLimit')
    expect(button.closest('.leaflet-top.leaflet-right')).not.toBeNull()
    button.click()

    expect(map.getZoom()).toBe(4)
    expect(onMapClick).not.toHaveBeenCalled()
  })

  it('removes the warning when hidden and does not duplicate it when shown again', () => {
    act(() => root.render(<MapBannersLimitControl />))
    act(() => root.render(null))
    expect(mapContainer.querySelector('.map-banners-limit')).toBeNull()

    act(() => root.render(<MapBannersLimitControl />))
    expect(mapContainer.querySelectorAll('.map-banners-limit')).toHaveLength(1)
  })
})
