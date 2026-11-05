import { BannerFilter, BannerOrder } from './filter'
import { BannerListType } from './types'

export type BannerFilterKey =
  'browse' | 'search' | 'map' | 'agent' | 'events' | `user:${BannerListType}`

const storageKey = (key: BannerFilterKey) => `bannerFilter:${key}`

const commonOrders: BannerOrder[] = [
  'created',
  'title',
  'lengthMeters',
  'numberOfMissions',
  'proximityStartPoint',
]

export const loadBannerFilter = (
  key: BannerFilterKey,
  defaults: BannerFilter
): BannerFilter => {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(storageKey(key)) ?? 'null'
    )
    if (typeof stored !== 'object' || stored === null) return defaults

    const saved = stored as Record<string, unknown>
    const filter = { ...defaults }
    if (typeof saved.online === 'boolean' || saved.online === null) {
      filter.online = saved.online ?? undefined
    }
    if (
      (key === 'browse' || key === 'map') &&
      (typeof saved.onlyOfficialMissions === 'boolean' ||
        saved.onlyOfficialMissions === null)
    ) {
      filter.onlyOfficialMissions = saved.onlyOfficialMissions ?? undefined
    }

    const allowedOrders = [
      ...commonOrders,
      ...(key === 'search' ? ['relevance'] : []),
      ...(key.startsWith('user:') ? ['listAdded'] : []),
    ]
    if (
      key !== 'map' &&
      typeof saved.orderBy === 'string' &&
      allowedOrders.includes(saved.orderBy) &&
      (saved.orderDirection === 'ASC' || saved.orderDirection === 'DESC')
    ) {
      if (saved.orderBy === 'proximityStartPoint') {
        if (
          typeof saved.proximityLatitude !== 'number' ||
          !Number.isFinite(saved.proximityLatitude) ||
          Math.abs(saved.proximityLatitude) > 90 ||
          typeof saved.proximityLongitude !== 'number' ||
          !Number.isFinite(saved.proximityLongitude) ||
          Math.abs(saved.proximityLongitude) > 180
        )
          return filter
        filter.proximityLatitude = saved.proximityLatitude
        filter.proximityLongitude = saved.proximityLongitude
      } else {
        filter.proximityLatitude = undefined
        filter.proximityLongitude = undefined
      }
      filter.orderBy = saved.orderBy as BannerOrder
      filter.orderDirection = saved.orderDirection
    }
    return filter
  } catch {
    // Storage may be unavailable, or contain data from an older version.
    return defaults
  }
}

export const saveBannerFilter = (
  key: BannerFilterKey,
  filter: BannerFilter
) => {
  try {
    localStorage.setItem(
      storageKey(key),
      JSON.stringify({
        orderBy: filter.orderBy,
        orderDirection: filter.orderDirection,
        // JSON omits undefined; null records the explicit "show all" choice.
        online: filter.online ?? null,
        onlyOfficialMissions: filter.onlyOfficialMissions ?? null,
        proximityLatitude: filter.proximityLatitude,
        proximityLongitude: filter.proximityLongitude,
      })
    )
  } catch {
    // Filtering still works when browser storage is disabled or full.
  }
}
