import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BannerFilter } from './filter'
import {
  BannerFilterKey,
  loadBannerFilter,
  saveBannerFilter,
} from './filterStorage'

const defaults: BannerFilter = {
  orderBy: 'created',
  orderDirection: 'DESC',
  online: true,
}

const stored = new Map<string, string>()

beforeEach(() => {
  stored.clear()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => stored.get(key) ?? null,
    setItem: (key: string, value: string) => stored.set(key, value),
  })
})

afterEach(() => vi.unstubAllGlobals())

describe('saved banner filters', () => {
  it('keeps every view and personal list independent', () => {
    const keys: BannerFilterKey[] = [
      'browse',
      'search',
      'map',
      'agent',
      'events',
      'user:todo',
      'user:done',
      'user:blacklist',
      'user:none',
    ]

    for (const selected of keys) {
      stored.clear()
      saveBannerFilter(selected, {
        ...defaults,
        online: undefined,
        orderBy: 'title',
        orderDirection: 'ASC',
      })

      for (const key of keys) {
        const restored = loadBannerFilter(key, defaults)
        expect(restored.online).toBe(key === selected ? undefined : true)
        expect(restored.orderBy).toBe(
          key === selected && key !== 'map' ? 'title' : 'created'
        )
        expect(restored.orderDirection).toBe(
          key === selected && key !== 'map' ? 'ASC' : 'DESC'
        )
      }
    }
  })

  it.each([true, false, undefined])(
    'restores online=%s explicitly',
    (online) => {
      saveBannerFilter('browse', { ...defaults, online })
      expect(loadBannerFilter('browse', defaults).online).toBe(online)
    }
  )

  it.each(['browse', 'map'] as const)(
    'restores and clears the official missions option in %s',
    (key) => {
      saveBannerFilter(key, { ...defaults, onlyOfficialMissions: true })
      expect(loadBannerFilter(key, defaults).onlyOfficialMissions).toBe(true)

      saveBannerFilter(key, defaults)
      expect(
        loadBannerFilter(key, { ...defaults, onlyOfficialMissions: true })
          .onlyOfficialMissions
      ).toBeUndefined()
    }
  )

  it('preserves the current author, list and event dates instead of saving them', () => {
    saveBannerFilter('agent', {
      ...defaults,
      author: 'PreviousAgent',
      listTypes: 'done',
      minEventTimestamp: '2025-01-01',
      maxEventTimestamp: '2025-01-02',
      orderBy: 'lengthMeters',
      orderDirection: 'ASC',
    })
    const current: BannerFilter = {
      ...defaults,
      author: 'CurrentAgent',
      listTypes: 'todo',
      minEventTimestamp: '2026-10-20',
      maxEventTimestamp: '2026-10-21',
    }

    expect(loadBannerFilter('agent', current)).toEqual({
      ...current,
      orderBy: 'lengthMeters',
      orderDirection: 'ASC',
    })
    const serialized = [...stored.values()].join('')
    expect(serialized).not.toMatch(/author|listTypes|EventTimestamp/)
    expect(current).toEqual({ ...current, orderBy: 'created' })
  })

  it.each([
    ['search', 'relevance'],
    ['user:todo', 'listAdded'],
  ] as const)('restores the special order for %s', (key, orderBy) => {
    saveBannerFilter(key, { ...defaults, orderBy })
    expect(loadBannerFilter(key, defaults).orderBy).toBe(orderBy)
  })

  it('ignores sorts and switches that are unavailable in the view', () => {
    saveBannerFilter('events', {
      ...defaults,
      orderBy: 'relevance',
      onlyOfficialMissions: true,
    })
    expect(loadBannerFilter('events', defaults)).toEqual(defaults)
  })

  it('restores proximity sorting with its coordinates', () => {
    const filter: BannerFilter = {
      ...defaults,
      orderBy: 'proximityStartPoint',
      orderDirection: 'ASC',
      proximityLatitude: 52.52,
      proximityLongitude: 13.405,
    }
    saveBannerFilter('browse', filter)
    expect(loadBannerFilter('browse', defaults)).toEqual(filter)
  })

  it.each([
    {},
    { proximityLatitude: 91, proximityLongitude: 13 },
    { proximityLatitude: 52, proximityLongitude: -181 },
    { proximityLatitude: '52', proximityLongitude: 13 },
  ])('rejects unusable proximity coordinates: %s', (coordinates) => {
    stored.set(
      'bannerFilter:browse',
      JSON.stringify({
        ...coordinates,
        online: null,
        orderBy: 'proximityStartPoint',
        orderDirection: 'ASC',
      })
    )
    expect(loadBannerFilter('browse', defaults)).toEqual({
      ...defaults,
      online: undefined,
    })
  })

  it.each([
    'invalid JSON',
    'null',
    '42',
    '[]',
    '{"online":"false","orderBy":"unknown","orderDirection":"sideways"}',
  ])('falls back safely for invalid saved data: %s', (serialized) => {
    stored.set('bannerFilter:search', serialized)
    expect(loadBannerFilter('search', defaults)).toEqual(defaults)
  })

  it('keeps filtering usable when storage fails', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('Storage disabled')
      },
      setItem: () => {
        throw new Error('Storage full')
      },
    })
    expect(loadBannerFilter('browse', defaults)).toBe(defaults)
    expect(() => saveBannerFilter('browse', defaults)).not.toThrow()
  })
})
