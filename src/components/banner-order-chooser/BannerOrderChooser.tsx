import { Modal } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import SVGBackArrowSmall from '../../assets/img/icons/back-arrow-small.svg?react'

import './BannerOrderChooser.scss'
import { BannerFilter, BannerOrder } from '../../features/banner/filter'
import Order, { hasBothDirections } from './Order'
import Switch from '../switch/Switch'
import { useUserLoggedIn } from '../../hooks/UserLoggedIn'
import { BannerListType } from '../../features/banner/types'

const ALL_LIST_TYPES: BannerListType[] = ['none', 'todo', 'done', 'blacklist']

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
  const { t } = useTranslation()
  const { authenticated } = useUserLoggedIn()
  const canFilterLists = authenticated && !includeAddedList
  const isListShown = (type: BannerListType) =>
    filter.listTypes === undefined || filter.listTypes.includes(type)

  const onListShownChanged = (type: BannerListType, shown: boolean) => {
    const listTypes = ALL_LIST_TYPES.filter((item) =>
      item === type ? shown : isListShown(item)
    )
    updateFilter({
      ...filter,
      listTypes:
        listTypes.length === ALL_LIST_TYPES.length ? undefined : listTypes,
    })
  }
  useEffect(() => {
    if (loadingLocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLoadingLocation(false)
          updateFilter({
            ...filter,
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
  }, [loadingLocation, setLoadingLocation, filter]) /* eslint-disable-line */

  const show = () => {
    setOpen(true)
  }

  const hide = () => {
    setLoadingLocation(false)
    setOpen(false)
  }

  const updateFilter = (newFilter: BannerFilter) => {
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
    if (type !== filter.orderBy) {
      if (type === 'proximityStartPoint') {
        setLoadingLocation(true)
      } else {
        updateFilter({
          ...filter,
          orderBy: type,
          orderDirection: getDefaultDirection(type),
          proximityLatitude: undefined,
          proximityLongitude: undefined,
        })
      }
    } else if (hasBothDirections(filter.orderBy)) {
      updateFilter({
        ...filter,
        orderDirection: filter.orderDirection === 'ASC' ? 'DESC' : 'ASC',
      })
    }
  }

  const onOfficialChanged = (includeUnofficial: boolean) => {
    updateFilter({
      ...filter,
      onlyOfficialMissions: includeUnofficial ? undefined : true,
    })
  }

  const onOnlineChanged = (showOffline: boolean) => {
    updateFilter({
      ...filter,
      online: showOffline ? undefined : true,
    })
  }

  const getButtonClass = (type: BannerOrder) => {
    let classNames = 'order-button'
    if (type === filter.orderBy) {
      classNames += ' selected'
    }
    return classNames
  }

  const getButtonDirection = (type: BannerOrder) => {
    return type === filter.orderBy
      ? filter.orderDirection
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
            <Switch checked={!filter.online} onChange={onOnlineChanged} />
          </div>
          {includeOfficial && (
            <div className="filter-and-sort-switch-row">
              <h3>{t('order.showUnofficialBanners')}</h3>
              <Switch
                checked={!filter.onlyOfficialMissions}
                onChange={onOfficialChanged}
              />
            </div>
          )}
          {canFilterLists && (
            <>
              <div className="filter-and-sort-switch-row">
                <h3>{t('order.showDone')}</h3>
                <Switch
                  checked={isListShown('done')}
                  onChange={(shown) => onListShownChanged('done', shown)}
                  aria-label={t('order.showDone')}
                />
              </div>
              <div className="filter-and-sort-switch-row">
                <h3>{t('order.showTodo')}</h3>
                <Switch
                  checked={isListShown('todo')}
                  onChange={(shown) => onListShownChanged('todo', shown)}
                  aria-label={t('order.showTodo')}
                />
              </div>
            </>
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
                    orderBy={filter.orderBy}
                    orderDirection={filter.orderDirection}
                  />
                ),
              }}
            />
            {' / '}
          </>
        )}
        {filter.online
          ? t('order.text.excludeOffline')
          : t('order.text.includeOffline')}
        {filter.onlyOfficialMissions && (
          <>
            {' / '}
            {t('order.onlyOfficial')}
          </>
        )}
        {canFilterLists && !isListShown('done') && (
          <> / {t('order.hideDone')}</>
        )}
        {canFilterLists && !isListShown('todo') && (
          <> / {t('order.hideTodo')}</>
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
