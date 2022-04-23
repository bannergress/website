import React, { FC } from 'react'
import { Trans } from 'react-i18next'

import { ReactComponent as SVGUpArrow } from '../../img/icons/up-arrow.svg'

import './order.less'
import { BannerOrder, BannerOrderDirection } from '../../features/banner/filter'

export const hasBothDirections = (type: BannerOrder) => {
  switch (type) {
    case 'relevance':
      return false
    default:
      return true
  }
}

const Order: FC<OrderProps> = ({ orderBy, orderDirection }) => {
  let classNames = 'banner-order-arrow'
  if (orderDirection === 'DESC') {
    classNames += ' banner-order-inverse'
  }

  return hasBothDirections(orderBy) ? (
    <Trans i18nKey={`order.${orderBy}`}>
      {{ orderBy }} <SVGUpArrow className={classNames} />
    </Trans>
  ) : (
    <Trans i18nKey={`order.${orderBy}`}>{orderBy}</Trans>
  )
}

export interface OrderProps {
  orderBy: BannerOrder
  orderDirection: BannerOrderDirection
}

export default Order
