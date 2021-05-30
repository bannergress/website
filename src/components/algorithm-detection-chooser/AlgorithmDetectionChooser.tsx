import React, { FC } from 'react'
import { Radio, Tooltip } from 'antd'

import { ReactComponent as SVGHelp } from '../../img/icons/help-round.svg'

import './algorithm-detection-chooser.less'

const extractionHelp = (
  <>
    <p>
      <b>Manual:</b> Title will be detected automatically from missions. Mission
      numbering will be sequential starting from 1.
    </p>
    <p>
      <b>Automatic:</b> Automatic title/numbering detection. With long banners
      could be slower.
    </p>
    <p>
      * If detection is changed to advanced, title and numbering may change as
      it will be reevaluated.
      <br />
      * If title is changed manually, it won&apos;t be changed automatically
      when new missions are added.
      <br />* If a mission number is changed manually, Manual detection will be
      activated.
    </p>
  </>
)

const AlgorithmDetectionChooser: FC<AlgorithmDetectionChooserProps> = ({
  selected,
  loading,
  onChange,
}) => {
  const getOption = (algorithm: Algorithm, title: string) => (
    <Radio.Button value={algorithm}>{title}</Radio.Button>
  )

  return (
    <div className="algo-detection-chooser">
      <h3>
        Detection{' '}
        <Tooltip placement="right" title={extractionHelp}>
          <SVGHelp />
        </Tooltip>
      </h3>
      <div className={`lds-ellipsis display-${loading}`}>
        <div />
        <div />
        <div />
        <div />
      </div>
      <Radio.Group value={selected} onChange={(e) => onChange(e.target.value)}>
        {getOption('none', 'Manual')}
        {getOption('advanced', 'Automatic')}
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
