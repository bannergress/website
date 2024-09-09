import React, { FC, useState } from 'react'
import { generatePath } from 'react-router-dom'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'

import { Banner } from '../../features/banner'
import BannerCard from '../banner-card'
import BannerList from '../banner-list'
import SVGTriangle from '../../assets/img/icons/triangle.svg?react'

import './banners-accordion.less'
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
      <Button
        className="banner-accordion-expander"
        onClick={() => setExpanded(!expanded)}
      >
        {t('map.area') + ' '}
        <span className={`carot-${expanded}`}>
          <SVGTriangle />
        </span>
      </Button>
      {!expanded && selectedBanner && (
        <div
          role="button"
          title={selectedBanner.title}
          onClick={() => onSelectBanner(selectedBanner)}
          onKeyPress={(e) =>
            e.key === 'Enter' && onSelectBanner(selectedBanner)
          }
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
        <>
          <BannerOrderChooser
            filter={filter}
            onFilterChanged={onFilterChanged}
            includeOfficial
            includeSorting={false}
          />
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
        </>
      )}
    </div>
  )
}

export interface BannerAccordionProps {
  banners: Array<Banner> | undefined
  hasMoreBanners: Boolean
  selectedBannerId?: string
  loadMoreBanners?: () => Promise<void>
  onSelectBanner: (banner: Banner) => void
  onFilterChanged: (filter: BannerFilter) => void
  filter: BannerFilter
}

export default BannerAccordion
