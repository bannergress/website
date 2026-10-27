import React, { FC, useState } from 'react'
import { generatePath } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Banner } from '../../features/banner'
import BannerCard from '../banner-card'
import BannerList from '../banner-list'
import SVGTriangle from '../../assets/img/icons/triangle.svg?react'

import './BannersAccordion.scss'
import BannerOrderChooser from '../banner-order-chooser'
import { BannerFilter } from '../../features/banner/filter'

const BannerAccordion: FC<BannerAccordionProps> = ({
  banners,
  hasMoreBanners,
  selectedBannerId,
  loadMoreBanners,
  onSelectBanner,
  onFilterChanged,
  filter,
}) => {
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation()
  const onSelectBannerCallback = (banner: Banner) => {
    setExpanded(false)
    onSelectBanner(banner)
  }
  const selectedBanner = banners?.find((b) => b.id === selectedBannerId)

  return (
    <div
      className={`banner-accordion ${expanded && 'expanded'} ${
        selectedBanner && 'banner-selected'
      } hide-on-desktop`}
    >
      <button
        type="button"
        className="banner-accordion-expander"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      >
        <span>{t('map.area')}</span>
        <span className="banner-accordion-chevron" aria-hidden="true">
          <SVGTriangle />
        </span>
      </button>
      {!expanded && selectedBanner && (
        <div
          role="button"
          title={selectedBanner.title}
          onClick={() => onSelectBanner(selectedBanner)}
          onKeyDown={(e) => e.key === 'Enter' && onSelectBanner(selectedBanner)}
          className="banner-card-link"
          tabIndex={0}
        >
          <BannerCard
            banner={selectedBanner}
            selected
            detailsUrl={generatePath('/banner/:id', { id: selectedBanner.id })}
            linkStartPlace={false}
            applyBannerListStlye
          />
        </div>
      )}
      {expanded && (
        <div className="banner-accordion-content">
          <BannerOrderChooser
            filter={filter}
            onFilterChanged={onFilterChanged}
            includeOfficial
            includeSorting={false}
          />
          <div className="banner-accordion-list">
            <BannerList
              banners={banners}
              selectedBannerId={selectedBannerId}
              hasMoreBanners={hasMoreBanners}
              onSelectBanner={onSelectBannerCallback}
              loadMoreBanners={loadMoreBanners}
              applyBannerListStyles
              hideBlacklisted
              showDetailsButton
            />
          </div>
        </div>
      )}
    </div>
  )
}

export interface BannerAccordionProps {
  banners: Array<Banner> | undefined
  hasMoreBanners: boolean
  selectedBannerId?: string
  loadMoreBanners?: () => Promise<void>
  onSelectBanner: (banner: Banner) => void
  onFilterChanged: (filter: BannerFilter) => void
  filter: BannerFilter
}

export default BannerAccordion
