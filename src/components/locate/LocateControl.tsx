import { FC, useEffect } from 'react'
import L from 'leaflet'
import { useLeafletContext } from '@react-leaflet/core'
import 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.css'

import './locate-control.less'

const LocateControl: FC = () => {
  const context = useLeafletContext()
  useEffect(() => {
    L.control.locate().addTo(context.map)
  }, [context.map])

  return null
}

export default LocateControl
