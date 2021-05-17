import React from 'react'

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
  return Number((durationSeconds / 3_600).toPrecision(2)) * 86_400
}

const formatDuration = (durationMilliseconds: number) => {
  const durationSeconds = durationMilliseconds / 1000
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
    result += `${days} d `
  }
  if (hours) {
    result += `${hours} h `
  }
  if (minutes) {
    result += `${minutes} min `
  }
  if (seconds) {
    result += `${seconds} s `
  }
  return result.trim()
}

export const Duration: React.FC<DurationProps> = ({ durationMilliseconds }) => {
  return <>{formatDuration(durationMilliseconds)}</>
}

export interface DurationProps {
  durationMilliseconds: number
}
