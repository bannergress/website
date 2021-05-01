import React, { Fragment, FC } from 'react'
import { Row } from 'antd'
import Layout from 'antd/es/layout/layout'

import { Step } from '../../features/mission'
import StepCard from '../step-card'

import './step-list.less'

const StepList: FC<StepListProps> = ({ steps }) => {
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
    <Fragment>
      <Row>Loading</Row>
    </Fragment>
  )
}

export interface StepListProps {
  steps: Array<Step> | undefined
}

export default StepList
