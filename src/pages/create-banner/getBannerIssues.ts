import _ from 'underscore'

import { BannerType } from '../../features/banner'
import { isPlaceholder, Mission } from '../../features/mission'
import { Issue } from '../../components/Issues-list'
import i18n from '../../i18n'

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

  if (
    missions.length > 0 &&
    missions.every((mission) => isPlaceholder(mission))
  ) {
    issues.push({
      key: 'missions-placeholder',
      type: 'error',
      field: 'missions',
      message: i18n.t('banners.creation.errors.noMissions'),
    })
  }
  if (missions.length < MIN_MISSIONS || missions.length > MAX_MISSIONS) {
    issues.push({
      key: 'missions-length',
      type: 'error',
      field: 'missions',
      message: i18n.t('banners.creation.errors.numberOfMissions', {
        min: MIN_MISSIONS,
        max: MAX_MISSIONS,
      }),
    })
  }
  if (bannerType === 'sequential' && duplicates.length) {
    issues.push({
      key: 'missions-duplicates',
      type: 'error',
      field: 'missions',
      message: i18n.t('banners.creation.errors.duplicates', {
        duplicates: duplicates.map((d) => d[0]).join(', '),
      }),
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
      message: i18n.t('banners.creation.errors.invalidIndex'),
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
      message: i18n.t('banners.creation.errors.titleLength', {
        min: MIN_TITLE_LENGTH,
        max: MAX_TITLE_LENGTH,
      }),
    })
  }
  if (bannerType === 'sequential' && hasGaps(indexes)) {
    issues.push({
      key: 'mission-gaps',
      type: 'warning',
      field: 'missions',
      message: i18n.t('banners.creation.warnings.incomplete'),
    })
  }
  if (bannerType === 'sequential' && indexes.length % bannerWidth !== 0) {
    issues.push({
      key: 'missions-divisible',
      type: 'warning',
      field: 'missions',
      message: i18n.t('banners.creation.warnings.divisible', {
        width: bannerWidth,
      }),
    })
  }
  if (detectedLength && detectedLength !== indexes.length) {
    issues.push({
      key: 'missions-total',
      type: 'warning',
      field: 'missions',
      message: i18n.t('banners.creation.warnings.length', {
        length: detectedLength,
      }),
    })
  }

  return issues
}
