import { Modal } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import SVGBackArrowSmall from '../../img/icons/back-arrow-small.svg?react'

import './banner-order-chooser.less'
import { BannerFilter, BannerOrder } from '../../features/banner/filter'
import Order, { hasBothDirections } from './Order'
import Switch from '../switch/Switch'

const BannerOrderChooser: FC<BannerOrderChooserProps> = ({
  filter,
  onFilterChanged,
  includeAddedList = false,
  includeRelevance = false,
  includeSorting = true,
  includeOfficial = false,
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false)
  const [currentFilter, setCurrentFilter] = useState<BannerFilter>(filter)
  const { t } = useTranslation()
  useEffect(() => {
    if (loadingLocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLoadingLocation(false)
          updateFilter({
            ...currentFilter,
            orderBy: 'proximityStartPoint',
            orderDirection: 'ASC',
            proximityLatitude: pos.coords.latitude,
            proximityLongitude: pos.coords.longitude,
          })
        },
        () => {
          setLoadingLocation(false)
        },
        { maximumAge: 0, enableHighAccuracy: true }
      )
    }
  })

  const show = () => {
    setOpen(true)
  }

  const hide = () => {
    setLoadingLocation(false)
    setOpen(false)
  }

  const updateFilter = (newFilter: BannerFilter) => {
    setCurrentFilter(newFilter)
    onFilterChanged(newFilter)
  }

  const getDefaultDirection = (type: BannerOrder) => {
    switch (type) {
      case 'created':
      case 'relevance':
      case 'listAdded':
        return 'DESC'
      default:
        return 'ASC'
    }
  }

  const onOrderClicked = (type: BannerOrder) => {
    if (type !== currentFilter.orderBy) {
      if (type === 'proximityStartPoint') {
        setLoadingLocation(true)
      } else {
        updateFilter({
          ...currentFilter,
          orderBy: type,
          orderDirection: getDefaultDirection(type),
          proximityLatitude: undefined,
          proximityLongitude: undefined,
        })
      }
    } else if (hasBothDirections(currentFilter.orderBy)) {
      updateFilter({
        ...currentFilter,
        orderDirection: currentFilter.orderDirection === 'ASC' ? 'DESC' : 'ASC',
      })
    }
  }

  const onOfficialChanged = (includeUnofficial: boolean) => {
    updateFilter({
      ...currentFilter,
      onlyOfficialMissions: includeUnofficial ? undefined : true,
    })
  }

  const onOnlineChanged = (showOffline: boolean) => {
    updateFilter({
      ...currentFilter,
      online: showOffline ? undefined : true,
    })
  }

  const getButtonClass = (type: BannerOrder) => {
    let classNames = 'order-button'
    if (type === currentFilter.orderBy) {
      classNames += ' selected'
    }
    return classNames
  }

  const getButtonDirection = (type: BannerOrder) => {
    return type === currentFilter.orderBy
      ? currentFilter.orderDirection
      : getDefaultDirection(type)
  }

  const getButton = (orderBy: BannerOrder) => (
    <button
      type="button"
      className={getButtonClass(orderBy)}
      onClick={() => onOrderClicked(orderBy)}
    >
      <div className="order-button-inner">
        <Order orderBy={orderBy} orderDirection={getButtonDirection(orderBy)} />
      </div>
    </button>
  )

  return (
    <div className="filter-and-sort">
      <Modal
        open={open}
        onCancel={hide}
        closable={false}
        footer={null}
        centered
        className="filter-and-sort-modal"
      >
        <button type="button" className="back-button" onClick={hide}>
          <SVGBackArrowSmall />
        </button>
        <div className="filter-and-sort-content">
          <h2>
            {includeSorting ? t('order.filterAndSort') : t('order.filter')}
          </h2>
          <div className="filter-and-sort-switch-row">
            <h3>{t('order.showOfflineBanners')}</h3>
            <Switch
              checked={!currentFilter.online}
              onChange={onOnlineChanged}
            />
          </div>
          {includeOfficial && (
            <div className="filter-and-sort-switch-row">
              <h3>{t('order.showUnofficialBanners')}</h3>
              <Switch
                checked={!currentFilter.onlyOfficialMissions}
                onChange={onOfficialChanged}
              />
            </div>
          )}
          {includeSorting && (
            <>
              <h3>{t('order.sortBy')}</h3>
              <div className="filter-and-sort-button-row">
                {includeRelevance && getButton('relevance')}
                {includeAddedList && getButton('listAdded')}
                {getButton('created')}
                {getButton('title')}
                {getButton('lengthMeters')}
                {getButton('numberOfMissions')}
                {getButton('proximityStartPoint')}
              </div>
            </>
          )}
        </div>
      </Modal>
      <button type="button" onClick={show} className="order-button selected">
        <div className="order-button-inner">
          {includeSorting ? t('order.filterAndSort') : t('order.filter')}
        </div>
      </button>
      <div>
        {includeSorting && (
          <>
            <Trans
              i18nKey="order.sortedBy"
              components={{
                order: (
                  <Order
                    orderBy={currentFilter.orderBy}
                    orderDirection={currentFilter.orderDirection}
                  />
                ),
              }}
            />
            {' / '}
          </>
        )}
        {currentFilter.online
          ? t('order.text.excludeOffline')
          : t('order.text.includeOffline')}
        {currentFilter.onlyOfficialMissions && (
          <>
            {' / '}
            {t('order.onlyOfficial')}
          </>
        )}
      </div>
    </div>
  )
}

export interface BannerOrderChooserProps {
  filter: BannerFilter
  onFilterChanged: (filter: BannerFilter) => void
  includeAddedList?: boolean
  includeRelevance?: boolean
  includeSorting?: boolean
  includeOfficial?: boolean
}

export default BannerOrderChooser
