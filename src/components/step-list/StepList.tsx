import React, { Fragment, FC } from 'react'
import { Row } from 'antd'

import './step-list.less'

import Layout from 'antd/es/layout/layout'
import { Step } from '../../features/banner'
import StepCard from '../step-card'

const StepList: FC<StepListProps> = ({ steps }) => {
  if (steps && steps.length > 0) {
    return (
      <Fragment>
        <Row className="step-list mt-1">
          <Layout>
            {steps.map((step, indx) => (
              <StepCard
                step={step}
                indexPortal={indx}
                key={`step-${indx + 1}`}
              />
            ))}
          </Layout>
        </Row>
      </Fragment>
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
