import { handlePromise } from '../../features/utils/async'
import React, { FC, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import SVGBackArrow from '../../assets/img/icons/back-arrow.svg?react'
import { ChoiceButtons } from '../choice-buttons/ChoiceButtons'

import './BannerInfoMobileSwitch.scss'

export type BannerInfoMobileView = 'info' | 'map' | 'missions'

const BannerInfoMobileSwitch: FC<BannerInfoMobileSwitchProps> = ({
  title,
  submitButton,
  selectedView,
  onChanged,
  onSubmitButtonClicked,
  onGoBack,
  submitDisabled,
}) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const titleId = useId()

  const showGoBack = onGoBack || window.history.length > 1

  const toggleBannerInfo = (newView: BannerInfoMobileView) => {
    if (newView !== selectedView) {
      onChanged(newView)
    }
  }

  const goBack = () => {
    if (onGoBack) {
      onGoBack()
    } else {
      handlePromise(navigate(-1))
    }
  }

  const createSubmitButton = () => {
    if (submitButton && onSubmitButtonClicked) {
      const attributes = {
        className: 'positive-action-button mobile-switch-submit-button',
      }

      return (
        <button
          {...attributes}
          type="button"
          onClick={() => onSubmitButtonClicked()}
          disabled={submitDisabled}
        >
          {submitButton}
        </button>
      )
    }

    return null
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
        <span id={titleId} className="mobile-switch-title" title={title}>
          {title}
        </span>
        {createSubmitButton()}
      </div>
      <ChoiceButtons
        className="mobile-switch-tabs-row"
        value={selectedView}
        onChange={toggleBannerInfo}
        labelledBy={titleId}
        options={[
          { value: 'info', label: t('buttons.info') },
          { value: 'missions', label: t('buttons.missions') },
          { value: 'map', label: t('buttons.map') },
        ]}
      />
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
  submitDisabled?: boolean
}

export default BannerInfoMobileSwitch
