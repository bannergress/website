import React, { FC } from 'react'
import { Col, Radio, Row, Slider, Tooltip } from 'antd'

import { BannerType } from '../../features/banner'
import { ReactComponent as SVGHelp } from '../../img/icons/help-round.svg'

import './advanced-options.less'

const typeHelp = (
  <>
    <p>
      <b>Banner:</b> Collection of missions that must be completed in sequence
      to complete the picture in your profile.
    </p>
    <b>Collection:</b> Collection of missions that can be completed in any order
    as they don&apos;t form a picture.
  </>
)

const AdvancedOptions: FC<AdvancedOptionsProps> = ({
  type,
  width,
  onChange,
}) => (
  <Row className="banner-advanced-options">
    <Col span={12}>
      <Tooltip placement="right" title={typeHelp}>
        <h4>
          Banner type
          <SVGHelp />
        </h4>
      </Tooltip>
    </Col>
    <Col span={12}>
      <Radio.Group
        value={type}
        onChange={(e) => onChange(e.target.value, 'bannerType')}
      >
        <Radio.Button value="sequential">Banner</Radio.Button>
        <Radio.Button value="anyOrder">Collection</Radio.Button>
      </Radio.Group>
    </Col>
    <Col span={12}>
      <h4>Banner width</h4>
    </Col>
    <Col span={12}>
      <Slider
        min={1}
        max={6}
        onChange={(val: number) => onChange(val, 'bannerWidth')}
        value={width}
      />
    </Col>
  </Row>
)

export interface AdvancedOptionsProps {
  type: BannerType
  width: number
  onChange: (val: string | number, type: 'bannerType' | 'bannerWidth') => void
}

export default AdvancedOptions
