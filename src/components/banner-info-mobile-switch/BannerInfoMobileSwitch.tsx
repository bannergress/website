import { HTMLAttributes } from 'enzyme'
import React, { FC } from 'react'
import { useHistory } from 'react-router'

import { Banner } from '../../features/banner'

import { ReactComponent as SVGBackArrow } from '../../img/icons/back-arrow.svg'

import './banner-info-mobile-switch.less'

export type BannerInfoMobileView = 'info' | 'map' | 'missions'

const BannerInfoMobileSwitch: FC<BannerInfoMobileSwitchProps> = ({
  banner,
  selectedView,
  onChanged,
}) => {
  const history = useHistory()

  const toggleBannerInfo = (newView: BannerInfoMobileView) => {
    if (newView !== selectedView) {
      onChanged(newView)
    }
  }

  const goBack = () => {
    history?.goBack()
  }

  const createButton = (view: BannerInfoMobileView, label: string) => {
    const attributes: HTMLAttributes = {}

    if (selectedView === view) {
      attributes.className = 'active'
    }

    return (
      <button
        {...attributes}
        type="button"
        onClick={() => toggleBannerInfo(view)}
      >
        {label}
      </button>
    )
  }

  return (
    <div className="banner-info-mobile-switch">
      <div className="mobile-switch-title-row">
        {history.length > 1 && (
          <button
            className="banner-info-mobile-switch-back"
            type="button"
            onClick={goBack}
          >
            <SVGBackArrow title="Back" />
          </button>
        )}
        <span className="mobile-switch-title" title={banner.title}>
          {banner.title}
        </span>
      </div>
      <div className="mobile-switch-tabs-row" role="tablist">
        {createButton('info', 'Info')}
        {createButton('missions', 'Missions')}
        {createButton('map', 'Map')}
      </div>
    </div>
  )
}

export interface BannerInfoMobileSwitchProps {
  banner: Banner
  selectedView: BannerInfoMobileView
  onChanged: (view: BannerInfoMobileView) => void
}

export default BannerInfoMobileSwitch
