import { generatePath } from 'react-router-dom'
import _ from 'underscore'

import { Place, PlaceSortOrder } from './types'

export const createMapUri = (place: Place) => {
  // syntax bounds=latLowerLeft,lngLowerLeft,latUpperRight,lngUpperRight
  const coordinates = `${place.boundaryMinLatitude},${place.boundaryMinLongitude},${place.boundaryMaxLatitude},${place.boundaryMaxLongitude}`
  // generatePath doesn't support params embedded in a query string, so the
  // URL is built directly instead.
  return `/map?bounds=${coordinates}`
}

export const createBrowseUri = (place: Place | string) => {
  const placeId = typeof place === 'string' ? place : place.id
  return generatePath('/browse/:id', { id: placeId })
}

export const sortPlaces = (
  places: readonly Place[],
  order: PlaceSortOrder,
  locale?: string
) => {
  const collator = new Intl.Collator(locale, { sensitivity: 'base' })
  return [...places].sort((a, b) => {
    if (order === 'numberOfBanners') {
      const countDifference = b.numberOfBanners - a.numberOfBanners
      if (countDifference !== 0) return countDifference
    }
    return collator.compare(a.longName, b.longName)
  })
}

export const extend = <T extends { id?: string }>(
  source: Array<T>,
  target: Array<T>
) => _.uniq(_.flatten([source, target]), false, (a) => a.id)
