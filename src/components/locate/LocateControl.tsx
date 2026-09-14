import { FC, useEffect } from 'react'
import { useLeafletContext } from '@react-leaflet/core'
import { useTranslation } from 'react-i18next'
import { LocateControl as LeafletLocateControl } from 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.css'

import './LocateControl.scss'

const LocateControl: FC = () => {
  const context = useLeafletContext()
  const { t } = useTranslation()

  useEffect(() => {
    const control = new LeafletLocateControl({
      showCompass: false,
      strings: { title: t('map.locate') },
    }).addTo(context.map)
    return () => {
      control.remove()
    }
  }, [context.map, t])

  return null
}

export default LocateControl
