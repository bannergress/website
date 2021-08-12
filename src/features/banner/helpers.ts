import _ from 'underscore'

import { mapMissions } from '../mission'
import { getMissionBounds } from '../mission/helpers'
import { Banner, BannerListType } from './types'

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
): [[number, number], [number, number]] | undefined => {
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
  if (!maxLatitude || !minLatitude || !maxLongitude || !minLongitude) {
    return undefined
  }
  return [
    [maxLatitude + BOUNDS_MARGIN, maxLongitude + BOUNDS_MARGIN],
    [minLatitude - BOUNDS_MARGIN, minLongitude - BOUNDS_MARGIN],
  ]
}

export const extend = <T extends { id?: string; title?: string }>(
  source: Array<T>,
  target: Array<T>
) => _.uniq(_.flatten([source, target]), false, (a) => a.id)

export const extendSorted = <T extends { id?: string; title?: string }>(
  source: Array<T>,
  target: Array<T>
) => _.sortBy(extend(target, source), (b) => b.title)
// Use target as source so that changed banners overwrite old banner information

export const getBannerListTypeText = (listType: BannerListType) => {
  switch (listType) {
    case 'blacklist':
      return 'Hidden'
      break
    case 'done':
      return 'Done'
      break
    case 'todo':
      return 'To-Do'
      break
    default:
      throw new Error('Unknown banner list type')
      break
  }
}

export const isBannerFullyOnline = (banner: Banner) => {
  return (
    banner?.numberOfDisabledMissions === 0 &&
    banner?.numberOfSubmittedMissions === 0
  )
}
