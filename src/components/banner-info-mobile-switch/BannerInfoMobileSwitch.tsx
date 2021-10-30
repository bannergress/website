import { HTMLAttributes } from 'enzyme'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

import { ReactComponent as SVGBackArrow } from '../../img/icons/back-arrow.svg'

import './banner-info-mobile-switch.less'

export type BannerInfoMobileView = 'info' | 'map' | 'missions'

const BannerInfoMobileSwitch: FC<BannerInfoMobileSwitchProps> = ({
  title,
  submitButton,
  selectedView,
  onChanged,
  onSubmitButtonClicked,
  onGoBack,
}) => {
  const history = useHistory()
  const { t } = useTranslation()

  const showGoBack = onGoBack || history.length > 1

  const toggleBannerInfo = (newView: BannerInfoMobileView) => {
    if (newView !== selectedView) {
      onChanged(newView)
    }
  }

  const goBack = () => {
    if (onGoBack) {
      onGoBack()
    } else {
      history?.goBack()
    }
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
        {showGoBack && (
          <button
            className="banner-info-mobile-switch-back"
            type="button"
            onClick={goBack}
          >
            <SVGBackArrow title={t('buttons.back')} />
          </button>
        )}
        <span className="mobile-switch-title" title={title}>
          {title}
        </span>
        {createSubmitButton()}
      </div>
      <div className="mobile-switch-tabs-row" role="tablist">
        {createModeSwitchButton('info', t('buttons.info'))}
        {createModeSwitchButton('missions', t('buttons.missions'))}
        {createModeSwitchButton('map', t('buttons.map'))}
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
  onGoBack?: () => void
}

export default BannerInfoMobileSwitch
