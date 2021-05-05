export interface Dictionary<T> {
  [key: string]: T
}

export interface Place {
  id: string
  formattedAddress: string
  longName: string
  shortName: string
  numberOfBanners: number
  boundaryMinLatitude: number
  boundaryMinLongitude: number
  boundaryMaxLatitude: number
  boundaryMaxLongitude: number
  parentPlace?: Place
  parentPlaceId?: string
  type?:
    | 'country'
    | 'administrative_area_level_1'
    | 'administrative_area_level_2'
    | 'administrative_area_level_3'
    | 'administrative_area_level_4'
    | 'administrative_area_level_5'
    | 'locality'
}

export interface PlaceState {
  allPlaces: Dictionary<Place>
  countries: Array<Place>
  administrativeAreas: Dictionary<Array<Place>>
}

export type PlaceSortOrder = 'name' | 'numberOfBanners'
