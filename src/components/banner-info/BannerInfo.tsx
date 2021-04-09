import React, { Fragment } from "react"

import { connect } from "react-redux"
import { withRouter, RouteComponentProps } from "react-router-dom"
import { Layout, Row, Col } from "antd"

import { RootState } from "../../store"

import {
  getBanner as getBannerSelector,
  loadBanner
} from "../../features/banner"

import BannerCard from "../banner-card"
import MissionList from "../mission-list"
import { Map } from "../../pages/Map"


import "./Banner-info.less"

interface BannerProps extends RouteComponentProps<any> {
  getBanner: Function
  fetchBanner: Function
}

export class BannerInfo extends React.Component<BannerProps, {}> {
  componentDidMount() {
    const { fetchBanner, match } = this.props
    fetchBanner(parseInt(match.params.id, 10))
  }

  render() {
    const { getBanner, match } = this.props
    const banner = getBanner(parseInt(match.params.id, 10))
    if (banner) {
      const { missions } = banner
      return (
        <Fragment>
          <Row justify="center" className="banner-info">

            <Layout>
              <Row>
                <Col span={8}>
                  <BannerCard banner={banner}/>
                  <div className="mt-1" />
                  <MissionList missions={missions} />
                </Col>
                <Col span={16}>
                  <Map />
                </Col>
              </Row>
            </Layout>
          </Row>
        </Fragment>
      )
    }
    return <Fragment>loading</Fragment>
  }
}

const mapStateToProps = (state: RootState) => ({
  getBanner: (id: number) => getBannerSelector(state.banner, id)
})

const mapDispatchToProps = {
  fetchBanner: (id: number) => loadBanner(id)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BannerInfo))
