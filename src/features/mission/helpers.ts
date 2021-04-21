import { NumDictionary } from '../banner/types'
import { Mission } from './types'

export const mapMissions = <T>(
  missions: NumDictionary<Mission>,
  numberOfMissions: number,
  handler: (mission: Mission) => T | undefined | null
): Array<T> => {
  const result: Array<T> = []
  for (let i = 0; i < numberOfMissions; i += 1) {
    const val = handler(missions[i])
    if (val) {
      result.push(val)
    }
  }
  return result
}

export const mapMissionsInverse = <T>(
  missions: NumDictionary<Mission>,
  numberOfMissions: number,
  handler: (mission: Mission) => T | undefined | null
): Array<T> => {
  const result: Array<T> = []
  for (let i = numberOfMissions - 1; i >= 0; i -= 1) {
    const val = handler(missions[i])
    if (val) {
      result.push(val)
    }
  }
  return result
}
