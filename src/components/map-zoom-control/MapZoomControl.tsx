import { FC, useEffect } from 'react'
import L from 'leaflet'
import { useLeafletContext } from '@react-leaflet/core'
import 'leaflet-loading'
import { useTranslation } from 'react-i18next'

const MapZoomControl: FC = () => {
  const context = useLeafletContext()
  const { t } = useTranslation()

  useEffect(() => {
    context.map.zoomControl.remove()
    L.control
      .zoom({
        zoomInTitle: t('map.zoomIn'),
        zoomOutTitle: t('map.zoomOut'),
      })
      .addTo(context.map)
  }, [context.map, t])

  return null
}

export default MapZoomControl
