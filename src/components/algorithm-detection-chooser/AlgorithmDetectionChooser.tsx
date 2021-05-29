import React, { FC } from 'react'
import { Radio, Tooltip } from 'antd'

import { ReactComponent as SVGHelp } from '../../img/icons/help-round.svg'

import './algorithm-detection-chooser.less'

const extractionHelp = (
  <>
    <p>
      <b>None:</b> No title/numbering detection will be applied. Numbering will
      be assigned sequentially.
    </p>
    <p>
      <b>Title:</b> Title will be detected with the advanced algorithm. No
      numbering detection will be applied. Numbering will be assigned
      sequentially.
    </p>
    <p>
      <b>Simple*:</b> Basic title/numbering detection.
    </p>
    <p>
      <b>Advanced*:</b> Advanced title/numbering detection that handles more
      sofisticated cases. With long banners could be slower.
    </p>
    <p>
      * if detection is changed, title and numbering may change as it will be
      reevaluated.
    </p>
  </>
)

const AlgorithmDetectionChooser: FC<AlgorithmDetectionChooserProps> = ({
  selected,
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
      <Radio.Group value={selected} onChange={(e) => onChange(e.target.value)}>
        {getOption('none', 'None')}
        {getOption('title', 'Title')}
        {getOption('simple', 'Simple')}
        {getOption('advanced', 'Advanced')}
      </Radio.Group>
    </div>
  )
}

export type Algorithm = 'none' | 'title' | 'simple' | 'advanced'

export interface AlgorithmDetectionChooserProps {
  selected: Algorithm
  onChange: (val: Algorithm) => void
}

export default AlgorithmDetectionChooser
