import React, { FC } from 'react'
import { Row } from 'antd'
import { useTranslation } from 'react-i18next'

import { Step } from '../../features/mission'
import StepCard from '../step-card'

import './step-list.less'

const StepList: FC<StepListProps> = ({ steps }) => {
  const { t } = useTranslation()
  if (steps && steps.length > 0) {
    return (
      <div className="step-list">
        {steps.map((step, indx) => (
          <StepCard step={step} key={`step-${indx + 1}`} />
        ))}
      </div>
    )
  }
  return (
    <>
      <Row>{t('loading')}</Row>
    </>
  )
}

export interface StepListProps {
  steps: Array<Step> | undefined
}

export default StepList
