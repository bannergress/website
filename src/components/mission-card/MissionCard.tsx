import React, { Fragment, FC, useState } from "react"
import { Card, Row } from "antd"

// import { Scrollbars } from 'react-custom-scrollbars'
import { ReactComponent as SVGChevron } from "../../img/icons/chevron.svg"

import StepList from "../step-list"

import "./mission-card.less"

import { Mission } from "../../features/banner/types"

const MissionCard: FC<MissionCardProps> = ({ mission }) => {

  const [isShow, setShow] = useState(false)

  const toggleShow = () => {
    setShow(!isShow)
  }

  return (
    <Fragment>
      <div className="mission-card" key={mission?.id}>
        <Card style={{ width: 448, backgroundColor: "#404040" }}>
          {/* <Scrollbars autoHeight autoHeightMin={100} autoHeightMax={284}> */}
          <Row align="middle" justify="space-between" className="mission-content" onClick={toggleShow}>
            <div>
              <Row align="middle">
                <div
                  className="mission-circle"
                  color="#000"
                  title={mission?.title}
                  key={mission?.id}
                  style={{
                    backgroundImage: `url('${mission?.picture}')`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100%"
                  }}
                />
                <div className="pl-1">{mission?.title}</div>
              </Row>
            </div>
            <div className="p-1">
              <SVGChevron fill="#FFF" className={`icon ${isShow ? "open" : ""}`} key="showpanel" />
            </div>
          </Row>
          {/* </Scrollbars> */}
          {isShow ? <StepList steps={mission?.steps} /> : null}
        </Card>
      </div>
    </Fragment>
  )
}


export interface MissionCardProps {
  mission: Mission | undefined
}

export default MissionCard
