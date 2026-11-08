import React, { FC, useId } from 'react'
import { Tooltip } from 'antd'
import { Trans, useTranslation } from 'react-i18next'

import SVGHelp from '../../assets/img/icons/help-round.svg?react'
import { ChoiceButtons } from '../choice-buttons/ChoiceButtons'

import './AlgorithmDetectionChooser.scss'

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
  const labelId = useId()

  return (
    <div className="algo-detection-chooser">
      <Tooltip placement="right" title={extractionHelp}>
        <h3 id={labelId}>
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
      <ChoiceButtons<Algorithm>
        value={selected}
        labelledBy={labelId}
        onChange={onChange}
        options={[
          { value: 'none', label: t('manual') },
          { value: 'advanced', label: t('automatic') },
        ]}
      />
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
