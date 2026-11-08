import { PlaceSortOrder } from './types'

const storageKey = 'placeSortOrders'

export type PlaceSortOrders = Partial<Record<number, PlaceSortOrder>>

export const getPlaceSortOrder = (orders: PlaceSortOrders, level: number) =>
  orders[level] ?? (level === 0 ? 'numberOfBanners' : 'name')

export const loadPlaceSortOrders = (): PlaceSortOrders => {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '{}')
    if (!stored || typeof stored !== 'object' || Array.isArray(stored))
      return {}
    return Object.fromEntries(
      Object.entries(stored).filter(
        ([level, order]) =>
          /^(0|[1-9]\d*)$/.test(level) &&
          (order === 'name' || order === 'numberOfBanners')
      )
    )
  } catch {
    // Browsing still works when local storage is unavailable.
    return {}
  }
}

export const savePlaceSortOrders = (orders: PlaceSortOrders) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(orders))
  } catch {
    // Keep the in-memory choice for this visit if storage is unavailable.
  }
}
