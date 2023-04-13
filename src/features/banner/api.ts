import { api } from '../../api'
import { Mission } from '../mission/types'
import { BannerFilter } from './filter'
import { Banner, BannerListType, BannerSettings } from './types'

export const PAGE_SIZE = 9

const getRandomInt = (max: number, multiplier: number, min: number) =>
  Math.floor(Math.random() * (max + 1)) * multiplier + min

const selectMissionType = (): Mission['type'] => {
  const missionTypeInt = getRandomInt(3, 1, 0)
  if (missionTypeInt === 1) return 'hidden'
  if (missionTypeInt === 2) return 'anyOrder'
  return 'sequential'
}

export const getBanner = (id: string) => api.get<Banner>(`bnrs/${id}`)

export const getRecentBanners = (numberOfBanners: number) =>
  api.get<Array<Banner>>('bnrs', {
    orderBy: 'created',
    orderDirection: 'DESC',
    limit: numberOfBanners,
    online: true,
  })

export const getBanners = (
  placeId: string | undefined,
  filter: BannerFilter,
  page: number
) =>
  api.get<Array<Banner>>('bnrs', {
    ...filter,
    placeId,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  })

export const getBannerList = (
  filter: BannerFilter,
  offset: number,
  limit: number
) =>
  api.get<Array<Banner>>('bnrs', {
    ...filter,
    offset,
    limit,
  })

export const searchBanners = (
  searchTerm: string,
  filter: BannerFilter,
  page: number
) =>
  api.get<Array<Banner>>('bnrs', {
    ...filter,
    query: searchTerm,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  })

export const listAgentBanners = (
  agentName: string,
  filter: BannerFilter,
  page: number
) =>
  api.get<Array<Banner>>('bnrs', {
    ...filter,
    author: agentName,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  })

export const listUserBannerListBanners = (
  listType: BannerListType,
  filter: BannerFilter,
  page: number
) =>
  api.get<Array<Banner>>('bnrs', {
    ...filter,
    listTypes: listType,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  })

export const postBanner = (banner: Partial<Banner>) =>
  api.post<Banner>('bnrs', banner)

export const updateBanner = (banner: Partial<Banner>) =>
  api.put<Banner>(`bnrs/${banner.id}`, banner)

export const deleteBanner = (banner: Partial<Banner>) =>
  api.delete<void>(`bnrs/${banner.id}`)

export const postBannerPreview = (banner: Partial<Banner>) =>
  api.post<Banner>('bnrs/preview', banner)

export const changeBannerSettings = (
  banner: Banner,
  bannerSettings: BannerSettings
) => api.post<void>(`bnrs/${banner.id}/settings`, bannerSettings, true)

export const searchMapBanners = (
  topRightLat: number,
  topRightLng: number,
  bottomLeftLat: number,
  bottomLeftLng: number,
  filter: BannerFilter
) =>
  api.get<Array<Banner>>('bnrs', {
    ...filter,
    minLatitude: bottomLeftLat,
    maxLatitude: topRightLat,
    minLongitude: bottomLeftLng,
    maxLongitude: topRightLng,
    limit: 50,
  })
