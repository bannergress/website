import React from 'react'
import { useTranslation } from 'react-i18next'

const SECONDS_IN_MINUTE = 60
const MINUTES_IN_HOUR = 60
const HOURS_IN_DAY = 24
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * MINUTES_IN_HOUR
const SECONDS_IN_DAY = SECONDS_IN_HOUR * HOURS_IN_DAY

const toPrecisionByFactor = (x: number, base: number, precision: number) => {
  return Number((x / base).toPrecision(precision)) * base
}

const roundDuration = (durationSeconds: number) => {
  if (durationSeconds < SECONDS_IN_MINUTE * 10) {
    // Less than 10 minutes
    return toPrecisionByFactor(durationSeconds, 1, 2)
  }
  if (durationSeconds < SECONDS_IN_HOUR * 10) {
    // Between 10 minutes and 10 hours
    return toPrecisionByFactor(durationSeconds, SECONDS_IN_MINUTE, 2)
  }
  if (durationSeconds < SECONDS_IN_HOUR * 100) {
    // Between 10 and 100 hours
    return toPrecisionByFactor(durationSeconds, SECONDS_IN_HOUR, 2)
  }
  if (durationSeconds < SECONDS_IN_DAY * 10) {
    // Between 100 hours and 10 days (= 240 hours)
    return toPrecisionByFactor(durationSeconds, SECONDS_IN_HOUR, 3)
  }
  // More than 10 days
  return toPrecisionByFactor(durationSeconds, SECONDS_IN_DAY, 2)
}

const divideWithRemainder = (dividend: number, divisor: number) => {
  const remainder = dividend % divisor
  return [(dividend - remainder) / divisor, remainder]
}

export const Duration: React.FC<DurationProps> = ({ durationMilliseconds }) => {
  const { t } = useTranslation()

  const formatDuration = (duration: number) => {
    const durationSeconds = duration / 1000
    const durationSecondsPrecision = roundDuration(durationSeconds)

    const [days, daysRemainder] = divideWithRemainder(
      durationSecondsPrecision,
      SECONDS_IN_DAY
    )
    const [hours, hoursRemainder] = divideWithRemainder(
      daysRemainder,
      SECONDS_IN_HOUR
    )
    const [minutes, seconds] = divideWithRemainder(
      hoursRemainder,
      SECONDS_IN_MINUTE
    )

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
