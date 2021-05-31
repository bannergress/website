import React from 'react'

const formatMetric = (distanceMeters: number) => {
  const distanceMetersPrecision = Number(distanceMeters.toPrecision(2))
  return distanceMetersPrecision >= 1000
    ? `${distanceMetersPrecision / 1000}\u00A0km`
    : `${distanceMetersPrecision}\u00A0m`
}

export const Distance: React.FC<DistanceProps> = ({ distanceMeters }) => {
  return <>{formatMetric(distanceMeters)}</>
}

export interface DistanceProps {
  distanceMeters: number
}
