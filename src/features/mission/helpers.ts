import _ from 'underscore'
import { NumDictionary } from '../banner/types'
import { Mission } from './types'

export const mapMissions = <T>(
  missions: NumDictionary<Mission> | undefined,
  handler: (mission: Mission | undefined, index: number) => T | undefined | null
): Array<T> => {
  if (!missions) return []
  const result: Array<T> = []
  const keys = Object.keys(missions)
    .map((k) => parseInt(k, 10))
    .sort((a, b) => a - b)
  const maxKey: number = _(keys).last() || 0
  for (let i = 0; i <= maxKey; i += 1) {
    const val = handler(missions[i], i)
    if (val) {
      result.push(val)
    }
  }
  return result
}

export const mapMissionsInverse = <T>(
  missions: NumDictionary<Mission> | undefined,
  handler: (mission: Mission | undefined, index: number) => T | undefined | null
): Array<T> => {
  if (!missions) return []
  const result: Array<T> = []
  const keys = Object.keys(missions)
    .map((k) => parseInt(k, 10))
    .sort((a, b) => a - b)
  const maxKey: number = _(keys).last() || 0
  for (let i = maxKey; i >= 0; i -= 1) {
    const val = handler(missions[i], i)
    if (val) {
      result.push(val)
    }
  }
  return result
}
