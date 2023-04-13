import { FC, useEffect } from 'react'
import L from 'leaflet'
import { useLeafletContext } from '@react-leaflet/core'
import { useTranslation } from 'react-i18next'
import 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.css'

import './locate-control.less'

const LocateControl: FC = () => {
  const context = useLeafletContext()
  const { t } = useTranslation()

  useEffect(() => {
    L.control
      .locate({
        showCompass: false,
        strings: { title: t('map.locate') },
      } as any)
      .addTo(context.map)
  }, [context.map, t])

  return null
}

export default LocateControl
