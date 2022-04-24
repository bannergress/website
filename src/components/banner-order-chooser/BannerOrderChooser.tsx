import { Modal, Switch } from 'antd'
import React, { FC, useState } from 'react'
import { Trans } from 'react-i18next'

import { ReactComponent as SVGBackArrowSmall } from '../../img/icons/back-arrow-small.svg'

import './banner-order-chooser.less'
import { BannerFilter, BannerOrder } from '../../features/banner/filter'
import Order, { hasBothDirections } from './Order'

const BannerOrderChooser: FC<BannerOrderChooserProps> = ({
  filter,
  onFilterChanged,
  includeAddedList = false,
  includeRelevance = false,
  includeSorting = true,
  includeOfficial = false,
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [currentFilter, setCurrentFilter] = useState<BannerFilter>(filter)

  const show = () => {
    setOpen(true)
  }

  const hide = () => {
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
        return 'DESC'
      default:
        return 'ASC'
    }
  }

  const onOrderClicked = (type: BannerOrder) => {
    if (type !== currentFilter.orderBy) {
      updateFilter({
        ...currentFilter,
        orderBy: type,
        orderDirection: getDefaultDirection(type),
      })
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
        visible={open}
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
            {includeSorting ? (
              <Trans i18nKey="order.filterAndSort">Filter and Sort</Trans>
            ) : (
              <Trans i18nKey="order.filter">Filter</Trans>
            )}
          </h2>
          <div className="filter-and-sort-switch-row">
            <h3>
              <Trans i18nKey="order.showOfflineBanners">
                Show offline banners
              </Trans>
            </h3>
            <Switch
              checked={!currentFilter.online}
              onChange={onOnlineChanged}
            />
          </div>
          {includeOfficial && (
            <div className="filter-and-sort-switch-row">
              <h3>
                <Trans i18nKey="order.showUnofficialBanners">
                  Show non-Niantic missions
                </Trans>
              </h3>
              <Switch
                checked={!currentFilter.onlyOfficialMissions}
                onChange={onOfficialChanged}
              />
            </div>
          )}
          {includeSorting && (
            <>
              <h3>
                <Trans i18nKey="order.sortBy">Sort by</Trans>
              </h3>
              <div className="filter-and-sort-button-row">
                {includeRelevance && getButton('relevance')}
                {includeAddedList && getButton('listAdded')}
                {getButton('created')}
                {getButton('title')}
                {getButton('lengthMeters')}
                {getButton('numberOfMissions')}
              </div>
            </>
          )}
        </div>
      </Modal>
      <button type="button" onClick={show} className="order-button selected">
        <div className="order-button-inner">
          {includeSorting ? (
            <Trans i18nKey="order.filterAndSort">Filter and Sort</Trans>
          ) : (
            <Trans i18nKey="order.filter">Filter</Trans>
          )}
        </div>
      </button>
      <div>
        {includeSorting && (
          <>
            <Trans i18nKey="order.text.sortedBy">
              Sorted by{' '}
              <Order
                orderBy={currentFilter.orderBy}
                orderDirection={currentFilter.orderDirection}
              />
            </Trans>
            {' / '}
          </>
        )}
        {currentFilter.online ? (
          <Trans i18nKey="order.text.excludeOffline">Excluding Offline</Trans>
        ) : (
          <Trans i18nKey="order.text.includeOffline">Showing Offline</Trans>
        )}
        {currentFilter.onlyOfficialMissions && (
          <>
            {' / '}
            <Trans i18nKey="order.text.onlyOfficial">
              Niantic missions only
            </Trans>
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
