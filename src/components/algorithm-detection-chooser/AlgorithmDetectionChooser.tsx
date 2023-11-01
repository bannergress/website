import React, { FC } from 'react'
import { Radio, Tooltip } from 'antd'
import { Trans, useTranslation } from 'react-i18next'

import SVGHelp from '../../img/icons/help-round.svg?react'

import './algorithm-detection-chooser.less'

const extractionHelp = (
  <Trans
    i18nKey="banners.creation.algorithm.help"
    components={{
      b: <b />,
      p: <p />,
      ul: <ul />,
      li: <li />,
    }}
  />
)

const AlgorithmDetectionChooser: FC<AlgorithmDetectionChooserProps> = ({
  selected,
  loading,
  onChange,
}) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: 'banners.creation.algorithm',
  })
  const getOption = (algorithm: Algorithm, title: string) => (
    <Radio.Button value={algorithm}>{title}</Radio.Button>
  )

  return (
    <div className="algo-detection-chooser">
      <Tooltip placement="right" title={extractionHelp}>
        <h3>
          <Trans
            i18nKey="banners.creation.algorithm.detection"
            components={{
              icon: <SVGHelp />,
            }}
          />
        </h3>
      </Tooltip>
      <div className={`lds-ellipsis display-${loading}`}>
        <div />
        <div />
        <div />
        <div />
      </div>
      <Radio.Group value={selected} onChange={(e) => onChange(e.target.value)}>
        {getOption('none', t('manual'))}
        {getOption('advanced', t('automatic'))}
      </Radio.Group>
    </div>
  )
}

export type Algorithm = 'none' | 'title' | 'simple' | 'advanced'

export interface AlgorithmDetectionChooserProps {
  selected: Algorithm
  loading: boolean
  onChange: (val: Algorithm) => void
}

export default AlgorithmDetectionChooser
