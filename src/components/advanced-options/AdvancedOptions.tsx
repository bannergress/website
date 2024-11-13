import React, { FC } from 'react'
import { Col, Radio, Row, Slider, Tooltip } from 'antd'
import { Trans, useTranslation } from 'react-i18next'

import { BannerType } from '../../features/banner'
import SVGHelp from '../../assets/img/icons/help-round.svg?react'

import './AdvancedOptions.scss'
import { DatePicker } from '../date-picker/DatePicker'
import { useUserLoggedIn } from '../../hooks/UserLoggedIn'

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

  return (
    <Row className="banner-advanced-options">
      <Col span={12}>
        <Tooltip placement="right" title={typeHelp}>
          <h4>
            <Trans
              i18nKey="banners.creation.step3.type"
              components={{
                icon: <SVGHelp />,
              }}
            />
          </h4>
        </Tooltip>
      </Col>
      <Col span={12}>
        <Radio.Group
          value={type}
          onChange={(e) => onChange(e.target.value, 'bannerType')}
        >
          <Radio.Button value="sequential">{t('banners.banner')}</Radio.Button>
          <Radio.Button value="anyOrder">
            {t('banners.collection')}
          </Radio.Button>
        </Radio.Group>
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
