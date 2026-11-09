import { latLng } from 'leaflet'
import { ComponentProps, useMemo } from 'react'
import { Marker } from 'react-leaflet'

const MapMarker = ({ position, ...props }: ComponentProps<typeof Marker>) => {
  const { lat, lng, alt } = latLng(position)
  // React Leaflet compares positions by reference. Moving an unchanged marker
  // makes MarkerCluster remove and reinsert it, which can change the clusters.
  const stablePosition = useMemo(() => latLng(lat, lng, alt), [lat, lng, alt])

  return <Marker {...props} position={stablePosition} />
}

export default MapMarker
