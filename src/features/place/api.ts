import { api } from '../../api'
import { Place } from './types'

const isMock = process.env.REACT_APP_USE_MOCK === 'true'

const createPlaces = (): Array<Place> => [
  {
    id: 'DE',
    formattedAddress: 'Germany',
    longName: 'Germany',
    shortName: 'DE',
    numberOfBanners: 12,
    boundaryMinLatitude: 0,
    boundaryMinLongitude: 0,
    boundaryMaxLatitude: 0,
    boundaryMaxLongitude: 0,
  },
  {
    id: 'FR',
    formattedAddress: 'France',
    longName: 'France',
    shortName: 'FR',
    numberOfBanners: 6,
    boundaryMinLatitude: 0,
    boundaryMinLongitude: 0,
    boundaryMaxLatitude: 0,
    boundaryMaxLongitude: 0,
  },
  {
    id: 'US',
    formattedAddress: 'USA',
    longName: 'United States',
    shortName: 'US',
    numberOfBanners: 8,
    boundaryMinLatitude: 0,
    boundaryMinLongitude: 0,
    boundaryMaxLatitude: 0,
    boundaryMaxLongitude: 0,
  },
  {
    id: 'ES',
    formattedAddress: 'Spain',
    longName: 'Spain',
    shortName: 'ES',
    numberOfBanners: 9,
    boundaryMinLatitude: 0,
    boundaryMinLongitude: 0,
    boundaryMaxLatitude: 0,
    boundaryMaxLongitude: 0,
  },
  {
    id: 'FI',
    formattedAddress: 'Finland',
    longName: 'Finland',
    shortName: 'Fi',
    numberOfBanners: 10,
    boundaryMinLatitude: 0,
    boundaryMinLongitude: 0,
    boundaryMaxLatitude: 0,
    boundaryMaxLongitude: 0,
  },
  {
    id: 'BY',
    formattedAddress: 'Bavaria, Germany',
    longName: 'Bavaria',
    shortName: 'BY',
    numberOfBanners: 5,
    boundaryMinLatitude: 0,
    boundaryMinLongitude: 0,
    boundaryMaxLatitude: 0,
    boundaryMaxLongitude: 0,
  },
  {
    id: 'CT',
    formattedAddress: 'Catalonia, Spain',
    longName: 'Catalonia',
    shortName: 'CT',
    numberOfBanners: 2,
    boundaryMinLatitude: 0,
    boundaryMinLongitude: 0,
    boundaryMaxLatitude: 0,
    boundaryMaxLongitude: 0,
  },
  {
    id: 'FL',
    formattedAddress: 'Florida',
    longName: 'Florida, United States',
    shortName: 'FL',
    numberOfBanners: 1,
    boundaryMinLatitude: 0,
    boundaryMinLongitude: 0,
    boundaryMaxLatitude: 0,
    boundaryMaxLongitude: 0,
  },
]

const createHierarchy = (): { [key: string]: string } => ({
  FL: 'US',
  CT: 'ES',
  BY: 'DE',
})

export const getCountries = () =>
  isMock
    ? {
        data: createPlaces().filter((place) => !createHierarchy()[place.id]),
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
          (place) => createHierarchy()[place.id] === parentPlaceId
        ),
        ok: true,
        status: 200,
      }
    : api.get<Array<Place>>('places', {
        used: 'true',
        parentPlaceId,
      })
