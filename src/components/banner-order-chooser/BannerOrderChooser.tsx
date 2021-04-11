import React, { Fragment, FC } from 'react'
import { Row } from 'antd'

import { BannerOrder, BannerOrderDirection } from '../../features/banner'
import { ReactComponent as SVGUpArrow } from '../../img/icons/up-arrow.svg'

import './banner-order-chooser.less'

const BannerOrderChooser: FC<BannerOrderChooserProps> = ({
  selectedOrder,
  selectedDirection,
  onOrderClicked,
}) => {
  const getButtonClass = (type: BannerOrder) => {
    let classNames = 'order-button'
    if (type === selectedOrder) {
      classNames += ' selected'
      if (selectedDirection === 'DESC') {
        classNames += ' inverse'
      }
    }
    return classNames
  }

  const getButton = (title: string, type: BannerOrder) => (
    <button
      type="button"
      className={getButtonClass(type)}
      onClick={() => onOrderClicked(type)}
    >
      {title} <SVGUpArrow className="arrow" />
    </button>
  )

  return (
    <Fragment>
      <Row justify="start">
        <h4>Sort by</h4>
      </Row>
      <Row className="order-chooser">
        {getButton('Date Created', 'created')}
        {getButton('A-Z', 'name')}
        {getButton('Distance', 'distance')}
        {getButton('Total Missions', 'totalmissions')}
      </Row>
    </Fragment>
  )
}

export interface BannerOrderChooserProps {
  selectedOrder: BannerOrder
  selectedDirection: BannerOrderDirection
  onOrderClicked: (order: BannerOrder) => void
}

export default BannerOrderChooser
