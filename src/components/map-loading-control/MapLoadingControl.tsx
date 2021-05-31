import { FC, useEffect } from 'react'
import L from 'leaflet'
import { useLeafletContext } from '@react-leaflet/core'
import 'leaflet-loading'

const MapLoadingControl: FC = () => {
  const context = useLeafletContext()
  useEffect(() => {
    L.Control.loading({ separate: true }).addTo(context.map)
  }, [context.map])

  return null
}

export default MapLoadingControl
