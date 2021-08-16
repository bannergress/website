import _ from 'underscore'

import { BannerType } from '../../features/banner'
import { Mission } from '../../features/mission'
import { Issue } from '../../components/Issues-list'

export const MIN_MISSIONS = 2
export const MAX_MISSIONS = 3000
export const MIN_TITLE_LENGTH = 3
export const MAX_TITLE_LENGTH = 200

const hasGaps = (indexes: Array<number | undefined>) => {
  if (indexes.length > 0) {
    const sorted = _([...indexes]).sortBy()
    if (sorted[0] !== 1 || sorted[sorted.length - 1] !== sorted.length) {
      return true
    }
  }
  return false
}

export const getBannerIssues = (
  missions: Array<Mission & { index?: number }>,
  bannerType: BannerType,
  bannerWidth: number,
  bannerTitle: string | undefined,
  detectedLength: number
) => {
  const issues: Array<Issue> = []

  const indexes = missions.map((mission) => mission.index)
  const duplicates = _(indexes)
    .chain()
    .countBy()
    .pairs()
    .filter((p) => p[1] > 1)
    .value()

  if (missions.length > 0 && missions.every((mission) => !mission.id)) {
    issues.push({
      key: 'missions-placeholder',
      type: 'error',
      field: 'missions',
      message: `A banner must contain an accepted mission.`,
    })
  }
  if (missions.length < MIN_MISSIONS || missions.length > MAX_MISSIONS) {
    issues.push({
      key: 'missions-length',
      type: 'error',
      field: 'missions',
      message: `A banner must contain between ${MIN_MISSIONS} and ${MAX_MISSIONS} missions.`,
    })
  }
  if (bannerType === 'sequential' && duplicates.length) {
    issues.push({
      key: 'missions-duplicates',
      type: 'error',
      field: 'missions',
      message: `Duplicate indexes: ${duplicates.map((d) => d[0]).join(', ')}`,
    })
  }
  if (
    bannerType === 'sequential' &&
    _(missions).any((m) => m.index === undefined || m.index <= 0)
  ) {
    issues.push({
      key: 'missions-invalid-index',
      type: 'error',
      field: 'missions',
      message:
        'There are at least a mission with an invalid index. Indexes must be positive integers.',
    })
  }
  if (
    !bannerTitle ||
    bannerTitle.length < MIN_TITLE_LENGTH ||
    bannerTitle.length > MAX_TITLE_LENGTH
  ) {
    issues.push({
      key: 'title-length',
      type: 'error',
      field: 'title',
      message: `The title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`,
    })
  }
  if (bannerType === 'sequential' && hasGaps(indexes)) {
    issues.push({
      key: 'mission-gaps',
      type: 'warning',
      field: 'missions',
      message: 'The banner could be incomplete, as it has gaps',
    })
  }
  if (bannerType === 'sequential' && indexes.length % bannerWidth !== 0) {
    issues.push({
      key: 'missions-divisible',
      type: 'warning',
      field: 'missions',
      message: `The banner could be incomplete, as the number of missions is not divisible by the selected width: ${bannerWidth}`,
    })
  }
  if (detectedLength && detectedLength !== indexes.length) {
    issues.push({
      key: 'missions-total',
      type: 'warning',
      field: 'missions',
      message: `The banner could be incomplete, as the length differs from the detected length in the title: ${detectedLength}`,
    })
  }

  return issues
}
