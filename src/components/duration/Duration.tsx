import React from 'react'
import { useTranslation } from 'react-i18next'

const roundDuration = (durationSeconds: number) => {
  if (durationSeconds < 595) {
    return Number(durationSeconds.toPrecision(2))
  }
  if (durationSeconds < 35_700) {
    const precision = durationSeconds < 3_600 ? 2 : 1
    return Number((durationSeconds / 60).toPrecision(precision)) * 60
  }
  if (durationSeconds < 862_200) {
    const precision = durationSeconds < 86_400 ? 2 : 1
    return Number((durationSeconds / 3_600).toPrecision(precision)) * 3_600
  }
  return Number((durationSeconds / 86_400).toPrecision(2)) * 86_400
}

export const Duration: React.FC<DurationProps> = ({ durationMilliseconds }) => {
  const { t } = useTranslation()

  const formatDuration = (duration: number) => {
    const durationSeconds = duration / 1000
    const durationSecondsPrecision = roundDuration(durationSeconds)

    let remainder = durationSecondsPrecision
    const seconds = remainder % 60
    remainder = (remainder - seconds) / 60
    const minutes = remainder % 60
    remainder = (remainder - minutes) / 60
    const hours = remainder % 24
    remainder = (remainder - hours) / 24
    const days = remainder

    let result = ''
    if (days) {
      result += t('duration.days', { count: days })
    }
    if (hours) {
      result += t('duration.hours', { count: hours })
    }
    if (minutes) {
      result += t('duration.minutes', { count: minutes })
    }
    if (seconds) {
      result += t('duration.seconds', { count: seconds })
    }
    return result.trim()
  }

  return <>{formatDuration(durationMilliseconds)}</>
}

export interface DurationProps {
  durationMilliseconds: number
}
