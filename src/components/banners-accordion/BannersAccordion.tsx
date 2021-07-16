import React, { FC, useState } from 'react'
import { generatePath } from 'react-router-dom'
import { Button } from 'antd'

import { Banner } from '../../features/banner'
import BannerCard from '../banner-card'
import BannerList from '../banner-list'
import { ReactComponent as SVGTriangle } from '../../img/icons/triangle.svg'

import './banners-accordion.less'

const BannerAccordion: FC<BannerAccordionProps> = ({
  banners,
  hasMoreBanners,
  selectedBannerId,
  loadMoreBanners,
  onSelectBanner,
}) => {
  const [expanded, setExpanded] = useState(false)
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
      <Button onClick={() => setExpanded(!expanded)}>
        Banners in This Area{' '}
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
        <BannerList
          banners={banners}
          selectedBannerId={selectedBannerId}
          hasMoreBanners={hasMoreBanners}
          onSelectBanner={onSelectBannerCallback}
          loadMoreBanners={loadMoreBanners}
          applyBannerListStlyes
          hideBlacklisted
        />
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
}

export default BannerAccordion
