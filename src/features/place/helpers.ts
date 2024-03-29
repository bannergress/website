import { generatePath } from 'react-router-dom'
import _ from 'underscore'

import { Place, PlaceSortOrder } from './types'

export const createMapUri = (place: Place) => {
  // syntax bounds=latLowerLeft,lngLowerLeft,latUpperRight,lngUpperRight
  const coordinates = `${place.boundaryMinLatitude},${place.boundaryMinLongitude},${place.boundaryMaxLatitude},${place.boundaryMaxLongitude}`
  return generatePath('/map?bounds=:coords', { coords: coordinates })
}

export const createBrowseUri = (place: Place | string) => {
  const placeId = typeof place === 'string' ? place : place.id
  return generatePath('/browse/:id', { id: placeId })
}

export const sortPlaces = (places: Place[], order: PlaceSortOrder) => {
  let sorted = _([...places]).chain()

  // Sort places by name
  sorted = sorted.sortBy((p) => p.longName)

  if (order === 'numberOfBanners') {
    // Apply order by number of banners
    sorted = sorted
      .reverse()
      .sortBy((p) => p.numberOfBanners)
      .reverse()
  }

  return sorted.value()
}

export const extend = <T extends { id?: string }>(
  source: Array<T>,
  target: Array<T>
) => _.uniq(_.flatten([source, target]), false, (a) => a.id)
