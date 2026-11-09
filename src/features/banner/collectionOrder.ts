import { getPath } from 'held-karp'
import type { Mission } from '../mission/types'

// held-karp allocates n * 2^n * 9 bytes: 40.5 MiB at 18, 3.375 GiB at 24.
export const FULL_ORDER_LIMIT = 24
export const COLLECTION_ORDER_LIMIT = 200
export type CollectionOrderMode = 'fast' | 'full'

type Coordinate = { latitude: number; longitude: number }
type Endpoints = { start: Coordinate; end: Coordinate }

export interface CollectionOrderResult {
  order: number[]
  beforeMeters: number
  afterMeters: number
  exact: boolean
  elapsedMilliseconds: number
}

const isCoordinate = (poi: Coordinate) =>
  Number.isFinite(poi.latitude) &&
  Number.isFinite(poi.longitude) &&
  Math.abs(poi.latitude) <= 90 &&
  Math.abs(poi.longitude) <= 180

export const getMissionEndpoints = (
  mission: Mission
): Endpoints | undefined => {
  let start: Coordinate | undefined
  let end: Coordinate | undefined
  for (const { poi } of mission.steps ?? []) {
    if (poi && poi.type !== 'unavailable' && isCoordinate(poi)) {
      start ??= poi
      end = poi
    }
  }
  return start && end ? { start, end } : undefined
}

const distance = (from: Coordinate, to: Coordinate) => {
  const radians = Math.PI / 180
  const a =
    Math.sin(((to.latitude - from.latitude) * radians) / 2) ** 2 +
    Math.cos(from.latitude * radians) *
      Math.cos(to.latitude * radians) *
      Math.sin(((to.longitude - from.longitude) * radians) / 2) ** 2
  return 6371008.8 * 2 * Math.asin(Math.sqrt(Math.min(1, a)))
}

export const getCollectionDistanceMatrix = (missions: readonly Mission[]) => {
  const endpoints = missions.map((mission) => {
    const points = getMissionEndpoints(mission)
    if (!points) throw new Error('Missing mission coordinates')
    return points
  })
  return endpoints.map((from, i) =>
    endpoints.map((to, j) => (i === j ? 0 : distance(from.end, to.start)))
  )
}

export const getOrderDistance = (matrix: number[][], order: number[]) =>
  order.reduce(
    (total, current, index) =>
      total + (index ? matrix[order[index - 1]][current] : 0),
    0
  )

// Relocate one mission at a time. Reversing a segment (ordinary 2-opt) is not
// valid here: end-to-start distances form a directed, asymmetric matrix.
const improveOrder = (matrix: number[][], order: number[]) => {
  const n = order.length
  const edge = (a: number | undefined, b: number | undefined) =>
    a === undefined || b === undefined ? 0 : matrix[a][b]
  for (let pass = 0; pass < 20; pass++) {
    let bestDelta = -1e-8
    let removeAt = -1
    let insertAt = -1
    for (let from = 0; from < n; from++) {
      const mission = order[from]
      const previous = order[from - 1]
      const next = order[from + 1]
      const removal =
        edge(previous, next) - edge(previous, mission) - edge(mission, next)
      // Insert before `to`; n means after the last mission.
      for (let to = 0; to <= n; to++) {
        if (to === from || to === from + 1) continue
        const left = order[to - 1]
        const right = order[to]
        const delta =
          removal +
          edge(left, mission) +
          edge(mission, right) -
          edge(left, right)
        if (delta < bestDelta) {
          bestDelta = delta
          removeAt = from
          insertAt = to
        }
      }
    }
    if (removeAt < 0) break
    const [mission] = order.splice(removeAt, 1)
    order.splice(insertAt > removeAt ? insertAt - 1 : insertAt, 0, mission)
  }
  return order
}

export const getHeuristicOrder = (matrix: number[][]) => {
  const n = matrix.length
  // Include the user's order so the result can never be worse than the input.
  let best = improveOrder(
    matrix,
    Array.from({ length: n }, (_, i) => i)
  )
  let bestDistance = getOrderDistance(matrix, best)
  // Try every starting mission for small collections; bound work for larger ones.
  const starts = Math.min(n, 32)
  for (let attempt = 0; attempt < starts; attempt++) {
    const order = [Math.floor((attempt * n) / starts)]
    const visited = new Uint8Array(n)
    visited[order[0]] = 1
    while (order.length < n) {
      const last = order[order.length - 1]
      let nearest = -1
      let nearestDistance = Infinity
      for (let candidate = 0; candidate < n; candidate++) {
        if (!visited[candidate] && matrix[last][candidate] < nearestDistance) {
          nearest = candidate
          nearestDistance = matrix[last][candidate]
        }
      }
      visited[nearest] = 1
      order.push(nearest)
    }
    improveOrder(matrix, order)
    const length = getOrderDistance(matrix, order)
    if (length < bestDistance) {
      best = order
      bestDistance = length
    }
  }
  return best
}

export const optimizeCollectionOrder = (
  missions: readonly Mission[],
  mode: CollectionOrderMode = 'fast'
): CollectionOrderResult => {
  if (missions.length < 2 || missions.length > COLLECTION_ORDER_LIMIT) {
    throw new Error('Unsupported collection size')
  }
  if (mode === 'full' && missions.length > FULL_ORDER_LIMIT) {
    throw new Error('Too many missions for full search')
  }
  const started = performance.now()
  const matrix = getCollectionDistanceMatrix(missions)
  const exact = mode === 'full'
  const order = exact ? getPath(matrix).path : getHeuristicOrder(matrix)
  return {
    order,
    beforeMeters: getOrderDistance(
      matrix,
      missions.map((_, i) => i)
    ),
    afterMeters: getOrderDistance(matrix, order),
    exact,
    elapsedMilliseconds: performance.now() - started,
  }
}
