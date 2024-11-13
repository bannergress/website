import React, { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import SVGUpArrow from '../../assets/img/icons/up-arrow.svg?react'

import './Order.scss'
import { BannerOrder, BannerOrderDirection } from '../../features/banner/filter'

export const hasBothDirections = (type: BannerOrder) => {
  switch (type) {
    case 'relevance':
    case 'proximityStartPoint':
      return false
    default:
      return true
  }
}

const Order: FC<OrderProps> = ({ orderBy, orderDirection }) => {
  const { t } = useTranslation()
  let classNames = 'banner-order-arrow'
  if (orderDirection === 'DESC') {
    classNames += ' banner-order-inverse'
  }

  return hasBothDirections(orderBy) ? (
    <Trans
      i18nKey={`order.${orderBy}`}
      components={{
        icon: <SVGUpArrow className={classNames} />,
      }}
    />
  ) : (
    <>{t(`order.${orderBy}`)}</>
  )
}

export interface OrderProps {
  orderBy: BannerOrder
  orderDirection: BannerOrderDirection
}

export default Order
