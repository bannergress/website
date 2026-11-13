import React, { FC, useId } from 'react'
import { Col, Row, Slider, Tooltip } from 'antd'
import { Trans, useTranslation } from 'react-i18next'

import { BannerType } from '../../features/banner'
import SVGHelp from '../../assets/img/icons/help-round.svg?react'

import './AdvancedOptions.scss'
import { DatePicker } from '../date-picker/DatePicker'
import { useUserLoggedIn } from '../../hooks/UserLoggedIn'
import { ChoiceButtons } from '../choice-buttons/ChoiceButtons'

const typeHelp = (
  <>
    <p>
      <Trans
        i18nKey="banners.creation.step3.help.banner"
        components={{
          b: <b />,
        }}
      />
    </p>
    <p>
      <Trans
        i18nKey="banners.creation.step3.help.collection"
        components={{
          b: <b />,
        }}
      />
    </p>
  </>
)

const AdvancedOptions: FC<AdvancedOptionsProps> = ({
  type,
  width,
  plannedOfflineDate,
  eventStartDate,
  eventEndDate,
  onChange,
  isEdit,
}) => {
  const { authenticated: manageBannersRole } = useUserLoggedIn('manage-banners')
  const { t } = useTranslation()
  const typeLabelId = useId()

  return (
    <Row className="banner-advanced-options">
      <Col span={12}>
        <h4 id={typeLabelId}>
          <Trans
            i18nKey="banners.creation.step3.type"
            components={{
              icon: (
                <Tooltip
                  placement="top"
                  trigger={['hover', 'focus']}
                  title={typeHelp}
                >
                  <button
                    type="button"
                    className="banner-type-help"
                    aria-label={t('buttons.info')}
                  >
                    <SVGHelp />
                  </button>
                </Tooltip>
              ),
            }}
          />
        </h4>
      </Col>
      <Col span={12}>
        <ChoiceButtons<BannerType>
          value={type}
          labelledBy={typeLabelId}
          onChange={(value) => onChange(value, 'bannerType')}
          options={[
            { value: 'sequential', label: t('banners.banner') },
            { value: 'anyOrder', label: t('banners.collection') },
          ]}
        />
      </Col>
      <Col span={12}>
        <h4>{t('banners.width')}</h4>
      </Col>
      <Col span={12}>
        <Slider
          min={1}
          max={6}
          onChange={(val: number) => onChange(val, 'bannerWidth')}
          value={width}
        />
      </Col>
      {(isEdit || manageBannersRole) && (
        <>
          <Col span={12}>
            <h4>{t('banners.creation.step3.plannedOfflineDate.title')}</h4>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <DatePicker
              onChange={(value: string | undefined) =>
                onChange(value, 'bannerPlannedOfflineDate')
              }
              value={plannedOfflineDate}
              emptyText={t('banners.creation.step3.plannedOfflineDate.empty')}
            />
          </Col>
        </>
      )}
      {manageBannersRole && (
        <>
          <Col span={12}>
            <h4>{t('banners.creation.step3.eventStartDate.title')}</h4>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <DatePicker
              onChange={(value: string | undefined) =>
                onChange(value, 'bannerEventStartDate')
              }
              value={eventStartDate}
              emptyText={t('banners.creation.step3.eventStartDate.empty')}
            />
          </Col>
          <Col span={12}>
            <h4>{t('banners.creation.step3.eventEndDate.title')}</h4>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <DatePicker
              onChange={(value: string | undefined) =>
                onChange(value, 'bannerEventEndDate')
              }
              value={eventEndDate}
              emptyText={t('banners.creation.step3.eventEndDate.empty')}
            />
          </Col>
        </>
      )}
    </Row>
  )
}

export interface AdvancedOptionsProps {
  type: BannerType
  width: number
  plannedOfflineDate: string | undefined
  eventStartDate: string | undefined
  eventEndDate: string | undefined
  isEdit: boolean
  onChange: (
    val: string | number | undefined,
    type:
      | 'bannerType'
      | 'bannerWidth'
      | 'bannerPlannedOfflineDate'
      | 'bannerEventStartDate'
      | 'bannerEventEndDate'
  ) => void
}

export default AdvancedOptions
