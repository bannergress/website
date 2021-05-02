import React, { Fragment, FC } from 'react'
import { Row } from 'antd'
import Layout from 'antd/es/layout/layout'

import { Step } from '../../features/mission'

import './step-card.less'

const StepCard: FC<StepProps> = ({ step, indexPortal }) => {
  if (step) {
    return (
      <Fragment>
        <Row className="step-card">
          <Layout>
            <div className="px1">
              <span>
                Portal {indexPortal + 1} - {step.objective}
              </span>
            </div>
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

export interface StepProps {
  step: Step | undefined
  indexPortal: number
}

export default StepCard
