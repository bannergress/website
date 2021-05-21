import { HTMLAttributes } from 'enzyme'
import React, { FC } from 'react'
import { useHistory } from 'react-router'

import { ReactComponent as SVGBackArrow } from '../../img/icons/back-arrow.svg'

import './banner-info-mobile-switch.less'

export type BannerInfoMobileView = 'info' | 'map' | 'missions'

export interface BannerInfoMobileContainer {}

const BannerInfoMobileSwitch: FC<BannerInfoMobileSwitchProps> = ({
  title,
  submitButton,
  selectedView,
  onChanged,
  onSubmitButtonClicked,
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

  const createSubmitButton = () => {
    if (submitButton && onSubmitButtonClicked) {
      const attributes: HTMLAttributes = {
        className: 'positive-action-button mobile-switch-submit-button',
      }

      return (
        <button
          {...attributes}
          type="button"
          onClick={() => onSubmitButtonClicked()}
        >
          {submitButton}
        </button>
      )
    }

    return null
  }

  const createModeSwitchButton = (
    view: BannerInfoMobileView,
    label: string
  ) => {
    const attributes: HTMLAttributes = {
      className: 'mobile-switch-switch-button',
    }

    if (selectedView === view) {
      attributes.className = `${attributes.className} active`
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
        <span className="mobile-switch-title" title={title}>
          {title}
        </span>
        {createSubmitButton()}
      </div>
      <div className="mobile-switch-tabs-row" role="tablist">
        {createModeSwitchButton('info', 'Info')}
        {createModeSwitchButton('missions', 'Missions')}
        {createModeSwitchButton('map', 'Map')}
      </div>
    </div>
  )
}

export interface BannerInfoMobileSwitchProps {
  title: string
  submitButton?: string
  selectedView: BannerInfoMobileView
  onChanged: (view: BannerInfoMobileView) => void
  onSubmitButtonClicked?: () => void
}

export default BannerInfoMobileSwitch
