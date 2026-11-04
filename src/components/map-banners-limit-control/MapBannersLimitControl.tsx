import { useEffect } from 'react'
import { Control, DomEvent, DomUtil } from 'leaflet'
import { useMap } from 'react-leaflet'
import { useTranslation } from 'react-i18next'

import './MapBannersLimitControl.scss'

export const MapBannersLimitControl = () => {
  const map = useMap()
  const { t } = useTranslation()

  useEffect(() => {
    const control = new Control({ position: 'topright' })
    control.onAdd = () => {
      const container = DomUtil.create('div', 'map-banners-limit')
      const button = DomUtil.create('button', '', container)
      button.type = 'button'
      button.title = t('map.bannersLimit')
      button.setAttribute('aria-label', t('map.bannersLimit'))
      const icon = DomUtil.create('span', 'map-banners-limit-icon', button)
      icon.setAttribute('aria-hidden', 'true')
      const label = DomUtil.create('span', 'map-banners-limit-label', button)
      const title = DomUtil.create('span', 'map-banners-limit-title', label)
      title.textContent = t('map.bannersLimitTitle')
      const action = DomUtil.create('span', 'map-banners-limit-action', label)
      action.textContent = t('map.bannersLimitAction')
      DomEvent.disableClickPropagation(container)
      DomEvent.disableScrollPropagation(container)
      DomEvent.on(button, 'click', () => map.zoomIn(1))
      return container
    }
    control.addTo(map)

    return () => {
      control.remove()
    }
  }, [map, t])

  return null
}
