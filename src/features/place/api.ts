import { api } from '../../api'
import { Place } from './types'

const isMock = process.env.REACT_APP_USE_MOCK === 'true'
export const PAGE_SIZE = 9

const createPlaces = (): Array<Place> => [
  {
    // 0
    id: 'DE',
    formattedAddress: 'Germany',
    longName: 'Germany',
    shortName: 'DE',
    numberOfBanners: 12,
    boundaryMinLatitude: 0,
    boundaryMinLongitude: 0,
    boundaryMaxLatitude: 0,
    boundaryMaxLongitude: 0,
    type: 'country',
  },
  {
    // 1
    id: 'FR',
    formattedAddress: 'France',
    longName: 'France',
    shortName: 'FR',
    numberOfBanners: 6,
    boundaryMinLatitude: 0,
    boundaryMinLongitude: 0,
    boundaryMaxLatitude: 0,
    boundaryMaxLongitude: 0,
    type: 'country',
  },
  {
    // 2
    id: 'US',
    formattedAddress: 'USA',
    longName: 'United States',
    shortName: 'US',
    numberOfBanners: 8,
    boundaryMinLatitude: 0,
    boundaryMinLongitude: 0,
    boundaryMaxLatitude: 0,
    boundaryMaxLongitude: 0,
    type: 'country',
  },
  {
    // 3
    id: 'ES',
    formattedAddress: 'Spain',
    longName: 'Spain',
    shortName: 'ES',
    numberOfBanners: 9,
    boundaryMinLatitude: 0,
    boundaryMinLongitude: 0,
    boundaryMaxLatitude: 0,
    boundaryMaxLongitude: 0,
    type: 'country',
  },
  {
    // 4
    id: 'FI',
    formattedAddress: 'Finland',
    longName: 'Finland',
    shortName: 'Fi',
    numberOfBanners: 10,
    boundaryMinLatitude: 0,
    boundaryMinLongitude: 0,
    boundaryMaxLatitude: 0,
    boundaryMaxLongitude: 0,
    type: 'country',
  },
  {
    // 5
    id: 'BY',
    formattedAddress: 'Bavaria, Germany',
    longName: 'Bavaria',
    shortName: 'BY',
    numberOfBanners: 5,
    boundaryMinLatitude: 0,
    boundaryMinLongitude: 0,
    boundaryMaxLatitude: 0,
    boundaryMaxLongitude: 0,
    parentPlaceId: 'DE',
    type: 'administrative_area_level_1',
  },
  {
    // 6
    id: 'CT',
    formattedAddress: 'Catalonia, Spain',
    longName: 'Catalonia',
    shortName: 'CT',
    numberOfBanners: 2,
    boundaryMinLatitude: 0,
    boundaryMinLongitude: 0,
    boundaryMaxLatitude: 0,
    boundaryMaxLongitude: 0,
    parentPlaceId: 'ES',
    type: 'administrative_area_level_1',
  },
  {
    // 7
    id: 'FL',
    formattedAddress: 'Florida',
    longName: 'Florida, United States',
    shortName: 'FL',
    numberOfBanners: 1,
    boundaryMinLatitude: 0,
    boundaryMinLongitude: 0,
    boundaryMaxLatitude: 0,
    boundaryMaxLongitude: 0,
    parentPlaceId: 'US',
    type: 'administrative_area_level_1',
  },
]

export const getCountries = () =>
  isMock
    ? {
        data: createPlaces().filter((place) => place.type === 'country'),
        ok: true,
        status: 200,
      }
    : api.get<Array<Place>>('places', {
        used: true,
        type: 'country',
      })

export const getAdministrativeAreas = (parentPlaceId: string) =>
  isMock
    ? {
        data: createPlaces().filter(
          (place) => place.parentPlaceId === parentPlaceId
        ),
        ok: true,
        status: 200,
      }
    : api.get<Array<Place>>('places', {
        used: 'true',
        parentPlaceId,
      })

export const getPlace = (placeId: string) =>
  isMock
    ? {
        data: createPlaces().find((place) => place.id === placeId),
        ok: true,
        status: 200,
      }
    : api.get<Place>(`places/${placeId}`)

export const searchPlaces = (searchTerm: string, page: number) =>
  isMock
    ? { data: createPlaces(), ok: true, status: 200 }
    : api.get<Array<Place>>('places', {
        used: true,
        collapsePlaces: true,
        query: searchTerm,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      })
