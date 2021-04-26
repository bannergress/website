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

const createHierarchy = (): { [key: string]: string; } => ({
  'FL': 'US',
  'CT': 'ES',
  'BY': 'DE'
});

export const getCountries = () =>
  isMock
    ? { data: createPlaces().filter(place => !createHierarchy()[place.id]), ok: true, status: 200 }
    : api.get<Array<Place>>('places', {
        used: true,
        type: 'country',
      })

export const getAdministrativeAreas = (parentPlaceId: string) =>
  isMock
  ? { data: createPlaces().filter(place => createHierarchy()[place.id] === parentPlaceId), ok: true, status: 200 }
  : api.get<Array<Place>>('places', {
        used: 'true',
        parentPlaceId,
      })
