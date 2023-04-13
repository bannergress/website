import _ from 'underscore'
import { NumDictionary } from '../banner/types'
import { AvailableStep, Mission, Step } from './types'

export const mapMissions = <T>(
  missions: NumDictionary<Mission> | undefined,
  handler: (
    mission: Mission | undefined,
    /**
     * The 0 based index according to the position in the
     * banner image. Holes in the banner increase the index
     */
    index: number,
    /**
     * The 1 based index according list of missions. Holes in the banner
     * have no sequence number
     */
    sequence: number | undefined
  ) => T | undefined | null
): Array<T> => {
  if (!missions) return []
  const result: Array<T> = []
  const keys = Object.keys(missions)
    .map((k) => parseInt(k, 10))
    .sort((a, b) => a - b)
  const maxKey: number = _(keys).last() || 0

  let sequenceCounter = 0
  for (let i = 0; i <= maxKey; i += 1) {
    const sequence = missions[i] ? (sequenceCounter += 1) : undefined
    const val = handler(missions[i], i, sequence)
    if (val !== undefined && val !== null) {
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
    if (val !== undefined && val !== null) {
      result.push(val)
    }
  }
  return result
}

export const searchMissionIndex = (
  missions: NumDictionary<Mission>,
  mission: Mission
) => {
  const key = Object.keys(missions).find(
    (k) => missions[Number(k)].id === mission.id
  )
  if (key) {
    return Number(key)
  }
  return undefined
}

export const getMissionBounds = (mission: Mission) => {
  let maxLatitude = mission.startLatitude
  let maxLongitude = mission.startLongitude
  let minLatitude = mission.startLatitude
  let minLongitude = mission.startLongitude
  if (mission.steps) {
    mission.steps.forEach((step) => {
      if (step.poi && step.poi.type !== 'unavailable') {
        if (!maxLatitude || step.poi.latitude > maxLatitude) {
          maxLatitude = step.poi.latitude
        }
        if (!minLatitude || step.poi.latitude < minLatitude) {
          minLatitude = step.poi.latitude
        }
        if (!maxLongitude || step.poi.longitude > maxLongitude) {
          maxLongitude = step.poi.longitude
        }
        if (!minLongitude || step.poi.longitude < minLongitude) {
          minLongitude = step.poi.longitude
        }
      }
    })
  }
  return [
    [minLatitude, minLongitude],
    [maxLatitude, maxLongitude],
  ]
}

export const hasLatLng = (step: Step) =>
  step.poi &&
  step.poi.type !== 'unavailable' &&
  step.poi.latitude &&
  step.poi.longitude

export const getFirstAvailableStep: (
  mission: Mission
) => AvailableStep | null = (mission: Mission) => {
  const firstStep = mission?.steps?.find(hasLatLng)

  if (firstStep && firstStep.poi && firstStep.poi.type !== 'unavailable') {
    return firstStep as AvailableStep
  }

  return null
}

export const getLastAvailableStep: (
  mission: Mission
) => AvailableStep | null = (mission: Mission) => {
  if (mission.steps) {
    const lastStep = _([...mission.steps])
      .chain()
      .filter(hasLatLng)
      .last()
      .value()

    if (lastStep && lastStep.poi && lastStep.poi.type !== 'unavailable') {
      return lastStep as AvailableStep
    }
  }

  return null
}

export const getAvailableSteps: (mission: Mission) => AvailableStep[] = (
  mission: Mission
) => {
  if (mission.steps) {
    const availableSteps = mission.steps.filter(hasLatLng)

    return availableSteps as AvailableStep[]
  }

  return []
}

export const createMissionIntelLink = (missionId: string) => {
  return `https://intel.ingress.com/mission/${missionId}`
}

export const createMissionScannerLink = (missionId: string) => {
  return `https://link.ingress.com/?link=https%3a%2f%2fintel.ingress.com%2fmission%2f${missionId}&apn=com.nianticproject.ingress&isi=576505181&ibi=com.google.ingress&ifl=https%3a%2f%2fapps.apple.com%2fapp%2fingress%2fid576505181&ofl=https%3a%2f%2fintel.ingress.com%2fmission%2f${missionId}`
}

export const isPlaceholder = (mission: Mission) =>
  !mission.id || mission.id.startsWith('placeholder')

export const getPlaceholderId = () =>
  `placeholder-${Math.random().toString(36).substr(2, 9)}`

export const managePlaceholder = (mission: Mission): Mission =>
  !isPlaceholder(mission) ? mission : ({} as Mission)
