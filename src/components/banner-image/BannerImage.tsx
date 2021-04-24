import React, { Fragment, FC } from 'react'
import { Row } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'
import _ from 'underscore'

import { Mission } from '../../features/mission'

import './banner-image.less'

const BannerImage: FC<BannerImageProps> = ({ missions }) => {
  return (
    <Fragment>
      <Scrollbars autoHeight autoHeightMin={100} autoHeightMax={284}>
        <Row align="top" justify="start" className="banner-image">
          {_([...missions])
            .chain()
            .reverse()
            .map((m) => (
              <div
                className="banner-circle"
                color="#000"
                title={m.title}
                key={m.id}
                style={{
                  backgroundImage: `url('${m.picture}')`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100%',
                }}
              />
            ))
            .value()}
        </Row>
      </Scrollbars>
    </Fragment>
  )
}

export interface BannerImageProps {
  missions: Array<Mission>
}

export default BannerImage
