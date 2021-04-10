import React, { Fragment, FC } from "react"
import { Card, Row } from "antd"

import { Scrollbars } from "react-custom-scrollbars"

import "./Banner-card.less"

import { RouteComponentProps, withRouter } from "react-router-dom"
import { ReactComponent as SVGExplorer } from "../../img/icons/explorer.svg"
import { ReactComponent as SVGPointer } from "../../img/icons/pointer.svg"
import { Banner, Dictionary, Mission } from "../../features/banner/types"


const getDistance = (distance: number) => `${distance / 100}km`
const renderMissions = (
  missions: Dictionary<Mission>,
  numberOfMissions: number
) => {
  const renderedMissions: Array<JSX.Element> = []
  for (let i = 0; i < numberOfMissions; i += 1) {
    renderedMissions.push(
      <div
        className="banner-circle"
        color="#000"
        title={missions[i].title}
        key={missions[i].id}
        style={{
          backgroundImage: `url('${missions[i].picture}')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100%'
        }}
      />
    )
  }
  return renderedMissions
}

const BannerCard: FC<BannerCardProps> = ({ banner, history }) => {
  const goBanner = (bannerId?:any) => {
    history.push(`/banner/${bannerId}`)
  }
  return (
    <Fragment>
      <Row justify="center" onClick={() => goBanner(banner?.id)}>
        <div className="banner-card" key={banner?.id}>
          <Card title={banner?.title} style={{ width: 448, backgroundColor: "#404040" }}>
            <Scrollbars autoHeight autoHeightMin={100} autoHeightMax={284}>
              <Row align="top" justify="start" className="banner-pic">
                {banner?.missions
                  ? renderMissions(banner?.missions, banner?.numberOfMissions)
                  : null}
              </Row>
            </Scrollbars>
            <div className="mt-1" />
            <Row align="middle">
              <SVGExplorer fill="#1DA57A" className="icon" />
              {banner?.numberOfMissions} Missions,{" "}
              {banner ? getDistance(banner?.lenghtMeters) : null}
            </Row>
            <Row align="middle">
              <SVGPointer fill="#1DA57A" className="icon" />
              New York, NY
            </Row>
          </Card>
        </div>
      </Row>
    </Fragment>
  )
}

export interface BannerCardProps extends RouteComponentProps<any> {
  banner: Banner | undefined
}

export default withRouter(BannerCard)
