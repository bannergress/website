import { Banner } from './types'

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
