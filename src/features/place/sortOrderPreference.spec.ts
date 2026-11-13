import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getPlaceSortOrder,
  loadPlaceSortOrders,
  savePlaceSortOrders,
} from './sortOrderPreference'

describe('place order preference', () => {
  beforeEach(() => {
    const storage = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    })
  })

  afterEach(() => vi.unstubAllGlobals())

  it('uses defaults until an explicit valid choice is stored', () => {
    expect(loadPlaceSortOrders()).toEqual({})
    expect(getPlaceSortOrder({}, 0)).toBe('numberOfBanners')
    expect(getPlaceSortOrder({}, 1)).toBe('name')
    expect(getPlaceSortOrder({}, 2)).toBe('name')
    localStorage.setItem('placeSortOrders', 'invalid')
    expect(loadPlaceSortOrders()).toEqual({})
  })

  it.each(['name', 'numberOfBanners'] as const)('remembers %s', (order) => {
    savePlaceSortOrders({ 0: 'name', 1: order, 2: 'numberOfBanners' })
    const orders = loadPlaceSortOrders()
    expect(getPlaceSortOrder(orders, 0)).toBe('name')
    expect(getPlaceSortOrder(orders, 1)).toBe(order)
    expect(getPlaceSortOrder(orders, 2)).toBe('numberOfBanners')
  })

  it('ignores invalid levels and orders without losing valid choices', () => {
    localStorage.setItem(
      'placeSortOrders',
      JSON.stringify({ 0: 'name', 1: 'invalid', '-1': 'name', country: 'name' })
    )
    expect(loadPlaceSortOrders()).toEqual({ 0: 'name' })
  })

  it('handles blocked storage without breaking browsing', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('Storage blocked')
      },
      setItem: () => {
        throw new Error('Storage blocked')
      },
    })
    expect(loadPlaceSortOrders()).toEqual({})
    expect(() => savePlaceSortOrders({ 0: 'name' })).not.toThrow()
  })
})
