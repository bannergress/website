import { Modal } from 'antd'
import React, { FC, useEffect, useId, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import SVGBackArrowSmall from '../../assets/img/icons/back-arrow-small.svg?react'

import './BannerOrderChooser.scss'
import { BannerFilter, BannerOrder } from '../../features/banner/filter'
import Order, { hasBothDirections } from './Order'
import Switch from '../switch/Switch'
import { ChoiceButtons } from '../choice-buttons/ChoiceButtons'
import { ChoiceButton } from '../choice-buttons/ChoiceButton'

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
  const offlineLabelId = useId()
  const unofficialLabelId = useId()
  const sortLabelId = useId()
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

  const getButtonDirection = (type: BannerOrder) => {
    return type === filter.orderBy
      ? filter.orderDirection
      : getDefaultDirection(type)
  }

  const orders: BannerOrder[] = [
    'created',
    'title',
    'lengthMeters',
    'numberOfMissions',
    'proximityStartPoint',
  ]
  if (includeAddedList) orders.unshift('listAdded')
  if (includeRelevance) orders.unshift('relevance')

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
        <button
          type="button"
          className="back-button"
          onClick={hide}
          aria-label={t('buttons.back')}
        >
          <SVGBackArrowSmall />
        </button>
        <div className="filter-and-sort-content">
          <h2>
            {includeSorting ? t('order.filterAndSort') : t('order.filter')}
          </h2>
          <div className="filter-and-sort-switch-row">
            <h3 id={offlineLabelId}>{t('order.showOfflineBanners')}</h3>
            <Switch
              checked={!filter.online}
              onChange={onOnlineChanged}
              labelledBy={offlineLabelId}
            />
          </div>
          {includeOfficial && (
            <div className="filter-and-sort-switch-row">
              <h3 id={unofficialLabelId}>{t('order.showUnofficialBanners')}</h3>
              <Switch
                checked={!filter.onlyOfficialMissions}
                onChange={onOfficialChanged}
                labelledBy={unofficialLabelId}
              />
            </div>
          )}
          {includeSorting && (
            <>
              <h3 id={sortLabelId}>{t('order.sortBy')}</h3>
              <ChoiceButtons
                value={filter.orderBy}
                onChange={onOrderClicked}
                labelledBy={sortLabelId}
                options={orders.map((orderBy) => ({
                  value: orderBy,
                  label: (
                    <Order
                      orderBy={orderBy}
                      orderDirection={getButtonDirection(orderBy)}
                    />
                  ),
                }))}
              />
            </>
          )}
        </div>
      </Modal>
      <ChoiceButton onClick={show} aria-expanded={open}>
        {includeSorting ? t('order.filterAndSort') : t('order.filter')}
      </ChoiceButton>
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
