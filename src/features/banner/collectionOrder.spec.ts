import { describe, expect, it } from 'vitest'
import type { Mission } from '../mission/types'
import {
  COLLECTION_ORDER_LIMIT,
  getCollectionDistanceMatrix,
  getHeuristicOrder,
  getMissionEndpoints,
  getOrderDistance,
  optimizeCollectionOrder,
} from './collectionOrder'

const mission = (id: string, start: number, end = start): Mission => ({
  id,
  title: id,
  picture: '',
  steps: [start, end].map((longitude) => ({
    poi: { id, title: id, type: 'fieldTripWaypoint', latitude: 0, longitude },
  })),
})

const bruteForceDistance = (matrix: number[][]) => {
  let best = Infinity
  const visit = (order: number[], remaining: number[]) => {
    if (!remaining.length)
      best = Math.min(best, getOrderDistance(matrix, order))
    for (const next of remaining) {
      visit(
        [...order, next],
        remaining.filter((value) => value !== next)
      )
    }
  }
  visit(
    [],
    matrix.map((_, i) => i)
  )
  return best
}

describe('collection ordering', () => {
  it('uses a free start/end and directed end-to-start distances, without a return leg', () => {
    const missions = [
      mission('C', 10, 12),
      mission('A', 0, 2),
      mission('B', 4, 6),
    ]
    const snapshot = structuredClone(missions)
    const result = optimizeCollectionOrder(missions, 'full')
    expect(result.order).toEqual([1, 2, 0])
    expect(result.exact).toBe(true)
    expect(result.afterMeters).toBeCloseTo(667170.4814, 3)
    expect(missions).toEqual(snapshot)
    const matrix = getCollectionDistanceMatrix(missions)
    expect(matrix[0][1]).not.toEqual(matrix[1][0])
  })

  it('matches exhaustive enumeration on directed geographic routes', () => {
    const missions = [
      mission('a', 0, 20),
      mission('b', 4, 1),
      mission('c', 18, 7),
      mission('d', 9, 12),
      mission('e', 30, 8),
      mission('f', 13, 29),
    ]
    const matrix = getCollectionDistanceMatrix(missions)
    const result = optimizeCollectionOrder(missions, 'full')
    expect(new Set(result.order).size).toBe(missions.length)
    expect(result.afterMeters).toBeCloseTo(bruteForceDistance(matrix), 6)
  })

  it('accepts coordinates on the equator and skips unavailable/invalid waypoints', () => {
    const value = mission('a', 0, 1)
    value.steps!.unshift({ poi: { id: 'missing', type: 'unavailable' } })
    value.steps!.push(...mission('invalid', NaN, 181).steps!)
    expect(getMissionEndpoints(value)).toMatchObject({
      start: { latitude: 0, longitude: 0 },
      end: { latitude: 0, longitude: 1 },
    })
    expect(
      getMissionEndpoints({ id: 'empty', title: '', picture: '' })
    ).toBeUndefined()
  })

  it('rejects unknown coordinates and oversized inputs before allocating a table', () => {
    expect(() => optimizeCollectionOrder([])).toThrow(
      'Unsupported collection size'
    )
    expect(() => optimizeCollectionOrder([mission('only', 0)])).toThrow()
    expect(() =>
      optimizeCollectionOrder(
        Array.from({ length: COLLECTION_ORDER_LIMIT + 1 }, () =>
          mission('a', 0)
        )
      )
    ).toThrow('Unsupported collection size')
    expect(() =>
      optimizeCollectionOrder([
        mission('a', 0),
        { id: 'unknown', title: '', picture: '' },
      ])
    ).toThrow('Missing mission coordinates')
  })

  it('handles coincident endpoints and preserves each mission exactly once', () => {
    const missions = Array.from({ length: 24 }, (_, i) => mission(String(i), 0))
    const result = optimizeCollectionOrder(missions)
    expect(result.exact).toBe(false)
    expect(result.afterMeters).toBe(0)
    expect([...result.order].sort((a, b) => a - b)).toEqual(
      missions.map((_, i) => i)
    )
  })

  it('keeps even small collections approximate in fast mode and rejects full search above 24', () => {
    expect(
      optimizeCollectionOrder([mission('a', 0), mission('b', 1)]).exact
    ).toBe(false)
    const missions = Array.from({ length: 25 }, (_, i) => mission(String(i), i))
    expect(() => optimizeCollectionOrder(missions, 'full')).toThrow(
      'Too many missions for full search'
    )
    expect(optimizeCollectionOrder(missions, 'fast').order).toHaveLength(25)
  })

  it('improves a shuffled collection without mutating input', () => {
    const missions = Array.from({ length: 24 }, (_, i) => {
      const index = (i * 7) % 24
      return mission(String(index), index * 0.01, index * 0.01 + 0.005)
    })
    const snapshot = structuredClone(missions)
    const result = optimizeCollectionOrder(missions)
    expect(result.exact).toBe(false)
    expect(new Set(result.order).size).toBe(24)
    expect(result.afterMeters).toBeLessThan(result.beforeMeters * 0.85)
    expect(missions).toEqual(snapshot)
  })

  it('never worsens directed routes, including an already optimized input', () => {
    for (let seed = 1; seed <= 8; seed++) {
      let state = seed
      const matrix = Array.from({ length: 24 }, (_, i) =>
        Array.from({ length: 24 }, (_, j) => {
          state = (Math.imul(state, 1664525) + 1013904223) >>> 0
          return i === j ? 0 : state % 10000
        })
      )
      const order = getHeuristicOrder(matrix)
      expect([...order].sort((a, b) => a - b)).toEqual(matrix.map((_, i) => i))
      expect(getOrderDistance(matrix, order)).toBeLessThanOrEqual(
        getOrderDistance(
          matrix,
          matrix.map((_, i) => i)
        )
      )
      const reordered = order.map((from) => order.map((to) => matrix[from][to]))
      expect(
        getOrderDistance(reordered, getHeuristicOrder(reordered))
      ).toBeLessThanOrEqual(getOrderDistance(matrix, order))
    }
  })
})
