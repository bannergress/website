import React, { FC } from 'react'
import { useHistory } from 'react-router'
import { ReactComponent as SVGBackArrow } from '../../img/icons/back-arrow.svg'

import './banner-info-mobile-switch.less'

export type BannerInfoView = 'info' | 'map'

const BannerInfoMobileSwitch: FC<BannerInfoMobileSwitchProps> = ({
  selectedView,
  onChanged,
}) => {
  const history = useHistory()

  const toggleBannerInfo = () => {
    const newView = selectedView === 'info' ? 'map' : 'info'
    onChanged(newView)
  }

  const goBack = () => {
    history?.goBack()
  }

  return (
    <div className="banner-info-mobile-switch">
      <div>
        {history.length > 1 && (
          <button
            className="banner-info-mobile-switch-back"
            type="button"
            onClick={goBack}
          >
            <SVGBackArrow title="Back" />
          </button>
        )}
      </div>

      <button
        className="banner-info-mobile-switch-toggle"
        type="button"
        onClick={toggleBannerInfo}
      >
        <h2>{selectedView === 'info' ? 'View on Map' : 'Banner Info'}</h2>
      </button>
    </div>
  )
}

export interface BannerInfoMobileSwitchProps {
  selectedView: BannerInfoView
  onChanged: (view: BannerInfoView) => void
}

export default BannerInfoMobileSwitch
