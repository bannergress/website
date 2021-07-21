import React, { FC } from 'react'

import { BannerOrder, BannerOrderDirection } from '../../features/banner'
import { ReactComponent as SVGUpArrow } from '../../img/icons/up-arrow.svg'

import './banner-order-chooser.less'

const BannerOrderChooser: FC<BannerOrderChooserProps> = ({
  selectedOrder,
  selectedDirection,
  onOrderClicked,
  includeAddedList = false,
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
      <div className="order-button-inner">
        {title} <SVGUpArrow className="arrow" />
      </div>
    </button>
  )

  return (
    <div className="order-chooser">
      <div>
        <h4>Sort by</h4>
        {includeAddedList && getButton('Date Added', 'listAdded')}
        {getButton('Date Created', 'created')}
        {getButton('A-Z', 'title')}
        {getButton('Distance', 'lengthMeters')}
        {getButton('Total Missions', 'numberOfMissions')}
      </div>
    </div>
  )
}

export interface BannerOrderChooserProps {
  selectedOrder: BannerOrder
  selectedDirection: BannerOrderDirection
  onOrderClicked: (order: BannerOrder) => void
  includeAddedList?: boolean
}

export default BannerOrderChooser
