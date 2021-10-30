import React, { FC } from 'react'
import { Trans } from 'react-i18next'

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

  const getButton = (type: BannerOrder) => (
    <button
      type="button"
      className={getButtonClass(type)}
      onClick={() => onOrderClicked(type)}
    >
      <div className="order-button-inner">
        <Trans i18nKey={`order.${type}`}>
          {{ type }} <SVGUpArrow className="arrow" />
        </Trans>
      </div>
    </button>
  )

  return (
    <div className="order-chooser">
      <div>
        <h4>
          <Trans i18nKey="order.sortBy">Sort by</Trans>
        </h4>
        {includeAddedList && getButton('listAdded')}
        {getButton('created')}
        {getButton('title')}
        {getButton('lengthMeters')}
        {getButton('numberOfMissions')}
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
