export interface Dictionary<T> {
  [key: string]: T
}

export interface Place {
  id: string
  formattedAddress: string
  longName: string
  shortName: string
  type: 'country' | 'administrative_area_level_1'
}

export interface PlaceState {
  countries: Array<Place>
  administrativeAreas: Dictionary<Array<Place>>
}
