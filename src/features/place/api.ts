import { api } from '../../api'
import { Place } from './types'

const isMock = process.env.REACT_APP_USE_MOCK === 'true'

const createCountries = (): Array<Place> => [
  {
    id: 'DE',
    formattedAddress: 'Germany',
    longName: 'Germany',
    shortName: 'DE',
    numberOfBanners: 12,
  },
  {
    id: 'FR',
    formattedAddress: 'France',
    longName: 'France',
    shortName: 'FR',
    numberOfBanners: 6,
  },
  {
    id: 'US',
    formattedAddress: 'USA',
    longName: 'United States',
    shortName: 'US',
    numberOfBanners: 8,
  },
  {
    id: 'ES',
    formattedAddress: 'Spain',
    longName: 'Spain',
    shortName: 'ES',
    numberOfBanners: 9,
  },
  {
    id: 'FI',
    formattedAddress: 'Finland',
    longName: 'Finland',
    shortName: 'Fi',
    numberOfBanners: 10,
  },
]

const createAdministrativeAreas = (): Array<Place> => [
  {
    id: 'BY',
    formattedAddress: 'Bavaria, Germany',
    longName: 'Bavaria',
    shortName: 'BY',
    numberOfBanners: 5,
  },
  {
    id: 'CT',
    formattedAddress: 'Catalonia, Spain',
    longName: 'Catalonia',
    shortName: 'CT',
    numberOfBanners: 2,
  },
  {
    id: 'FL',
    formattedAddress: 'Florida',
    longName: 'Florida, United States',
    shortName: 'FL',
    numberOfBanners: 1,
  },
]

export const getCountries = () =>
  isMock
    ? { data: createCountries(), ok: true, status: 200 }
    : api.get<Array<Place>>('places', {
        used: true,
        type: 'country',
      })

export const getAdministrativeAreas = (countryId: string, level: number) =>
  isMock
    ? {
        data: level === 1 ? createAdministrativeAreas() : [],
        ok: true,
        status: 200,
      }
    : api.get<Array<Place>>('places', {
        used: 'true',
        type: `administrative_area_level_${level}`,
        parentPlaceId: countryId,
      })
