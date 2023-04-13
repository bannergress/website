import React from 'react'
import { useTranslation } from 'react-i18next'

export const Distance: React.FC<DistanceProps> = ({ distanceMeters }) => {
  const { t } = useTranslation()
  const formatMetric = (meters: number) => {
    const parsed = Number(meters.toPrecision(2))
    return parsed >= 1000
      ? t('banners.distance.km', { distance: parsed / 1000 })
      : t('banners.distance.m', { distance: parsed })
  }
  return <span className="nobr">{formatMetric(distanceMeters)}</span>
}

export interface DistanceProps {
  distanceMeters: number
}
