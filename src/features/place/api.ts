import { api } from '../../api'
import { Place } from './types'

const isMock = process.env.REACT_APP_USE_MOCK

const createCountries = () => [
  {
    id: 'ChIJa76xwh5ymkcRW-WRjmtd6HU',
    formattedAddress: 'Germany',
    longName: 'Germany',
    shortName: 'DE',
  },
  {
    id: 'ChIJa76xwh5ymkcRW-WRjmtd6HZ',
    formattedAddress: 'France',
    longName: 'France',
    shortName: 'FR',
  },
  {
    id: 'ChIJa76xwh5ymkcRW-WRjmtd6HX',
    formattedAddress: 'USA',
    longName: 'United States',
    shortName: 'US',
  },
  {
    id: 'ChIJa76xwh5ymkcRW-WRjmtd6HP',
    formattedAddress: 'Spain',
    longName: 'Spain',
    shortName: 'ES',
  },
  {
    id: 'ChIJa76xwh5ymkcRW-WRjmtd6HK',
    formattedAddress: 'Finland',
    longName: 'Finland',
    shortName: 'Fi',
  },
]

const createAdministrativeAreas = () => [
  {
    id: 'EhIJa76xwh5ymkcRW-WRjmtd6HU',
    formattedAddress: 'Bavaria, Germany',
    longName: 'Bavaria',
    shortName: 'BY',
  },
  {
    id: 'EhIJa76xwh5ymkcRW-WRjmtd6HZ',
    formattedAddress: 'Catalonia, Spain',
    longName: 'Catalonia',
    shortName: 'CT',
  },
  {
    id: 'EhIJa76xwh5ymkcRW-WRjmtd6HX',
    formattedAddress: 'Florida',
    longName: 'Florida, United States',
    shortName: 'FL',
  },
]

export const getCountries = () =>
  isMock
    ? { data: createCountries(), ok: true, status: 200 }
    : api.get<Array<Place>>('places', {
        used: true,
        type: 'country',
      })

export const getAdministrativeAreas = (countryId: string) =>
  isMock
    ? { data: createAdministrativeAreas(), ok: true, status: 200 }
    : api.get<Array<Place>>('places', {
        used: 'true',
        type: 'administrative_area_level_1',
        parentPlaceId: countryId,
      })
