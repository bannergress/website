import { generatePath } from 'react-router-dom'

import { Place } from './types'

export const createMapUri = (place: Place) => {
  // syntax bounds=latLowerLeft,lngLowerLeft,latUpperRight,lngUpperRight
  const coordinates = `${place.boundaryMinLatitude},${place.boundaryMinLongitude},${place.boundaryMaxLatitude},${place.boundaryMaxLongitude}`
  return generatePath('/map?bounds=:coords', { coords: coordinates })
}
