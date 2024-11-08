import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { POI, Step } from '../../features/mission'
import {
  createExternalNavigationUri,
  getExternalLinkAttributes,
} from '../../features/utils'

import './StepCard.scss'

const getStepNameLink = (title: string, poi?: POI) => {
  if (poi && poi.type !== 'unavailable') {
    return (
      <a
        {...getExternalLinkAttributes()}
        href={createExternalNavigationUri(poi.latitude, poi.longitude)}
      >
        {title}
      </a>
    )
  }

  return title
}

const StepCard: FC<StepProps> = ({ step }) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'missions.objective' })

  let className
  let title
  if (step.objective && step.poi) {
    if (step.poi.type === 'unavailable') {
      className = 'step-card-unavailable'
      title = t('unavailable')
    } else {
      className = ''
      title = step.poi.title
    }
  } else {
    className = 'step-card-hidden'
    title = t('hide')
  }
  return (
    <div className={`step-card ${className}`}>
      <div className="step-card-title">{getStepNameLink(title, step.poi)}</div>
      <div className="step-card-objective">
        {step.objective && t(step.objective)}
      </div>
    </div>
  )
}

export interface StepProps {
  step: Step
}

export default StepCard
