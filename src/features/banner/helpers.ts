import { mapMissions } from '../mission'
import { getMissionBounds } from '../mission/helpers'
import { Banner } from './types'

const BOUNDS_MARGIN = 0.0001

export const contains = (left: number, middle: number, right: number) =>
  left <= middle && middle <= right

export const containsBanner = (
  banner: Banner,
  topRightLat: number,
  topRightLng: number,
  bottomLeftLat: number,
  bottomLeftLng: number
) =>
  contains(bottomLeftLat, banner.startLatitude, topRightLat) &&
  contains(bottomLeftLng, banner.startLongitude, topRightLng)

export const getBannerBounds = (
  banner: Banner
): [[number, number], [number, number]] => {
  let maxLatitude = banner.startLatitude
  let maxLongitude = banner.startLongitude
  let minLatitude = banner.startLatitude
  let minLongitude = banner.startLongitude
  if (banner.missions) {
    mapMissions(banner.missions, (mission) => {
      if (mission) {
        const [[minLat, minLong], [maxLat, maxLong]] = getMissionBounds(mission)
        if (minLat && minLat < minLatitude) {
          minLatitude = minLat
        }
        if (minLong && minLong < minLongitude) {
          minLongitude = minLong
        }
        if (maxLat && maxLat > maxLatitude) {
          maxLatitude = maxLat
        }
        if (maxLong && maxLong > maxLongitude) {
          maxLongitude = maxLong
        }
      }
      return undefined
    })
  }
  return [
    [maxLatitude + BOUNDS_MARGIN, maxLongitude + BOUNDS_MARGIN],
    [minLatitude - BOUNDS_MARGIN, minLongitude - BOUNDS_MARGIN],
  ]
}
