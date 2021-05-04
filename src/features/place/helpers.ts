import { generatePath } from 'react-router-dom'

import { Place, PlaceSortOrder } from './types'

export const createMapUri = (place: Place) => {
  // syntax bounds=latLowerLeft,lngLowerLeft,latUpperRight,lngUpperRight
  const coordinates = `${place.boundaryMinLatitude},${place.boundaryMinLongitude},${place.boundaryMaxLatitude},${place.boundaryMaxLongitude}`
  return generatePath('/map?bounds=:coords', { coords: coordinates })
}

export const createBrowseUri = (place: Place) => {
  return generatePath('/browse/:id', { id: place.id })
}

export const sortPlaces = (places: Place[], order: PlaceSortOrder) => {
  const sorted = [...places]

  const sortFunc =
    order === 'name'
      ? (a: Place, b: Place) => a.longName.localeCompare(b.longName)
      : (a: Place, b: Place) => b.numberOfBanners - a.numberOfBanners

  sorted.sort(sortFunc)

  return sorted
}
