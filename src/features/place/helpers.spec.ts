import { describe, expect, it } from 'vitest'
import { sortPlaces } from './helpers'
import { Place } from './types'

const place = (longName: string, numberOfBanners: number): Place => ({
  id: longName,
  longName,
  shortName: longName,
  formattedAddress: longName,
  numberOfBanners,
  boundaryMinLatitude: 0,
  boundaryMinLongitude: 0,
  boundaryMaxLatitude: 1,
  boundaryMaxLongitude: 1,
})

describe('place sorting', () => {
  it('uses the interface locale and ignores case when comparing names', () => {
    const places = [place('Zürich', 1), place('Älmhult', 1), place('berlin', 1)]
    expect(sortPlaces(places, 'name', 'de').map((p) => p.longName)).toEqual([
      'Älmhult',
      'berlin',
      'Zürich',
    ])
    expect(sortPlaces(places, 'name', 'sv').map((p) => p.longName)).toEqual([
      'berlin',
      'Zürich',
      'Älmhult',
    ])
  })

  it('sorts by descending count with alphabetical ties without mutating data', () => {
    const places = Object.freeze([
      place('Zürich', 10),
      place('Berlin', 0),
      place('Älmhult', 10),
    ])
    const sorted = sortPlaces(places, 'numberOfBanners', 'de')
    expect(sorted.map((p) => p.longName)).toEqual([
      'Älmhult',
      'Zürich',
      'Berlin',
    ])
    expect(places.map((p) => p.longName)).toEqual([
      'Zürich',
      'Berlin',
      'Älmhult',
    ])
  })
})
