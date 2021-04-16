import React, { Fragment } from 'react'

import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Layout, Row, Col } from 'antd'

import { RootState } from '../../storeTypes'

import {
  Banner,
  getBanner as getBannerSelector,
  loadBanner,
} from '../../features/banner'

import BannerCard from '../../components/banner-card'
import MissionList from '../../components/mission-list'
import { Map } from '../map'

import './Banner-info.less'

class BannerInfo extends React.Component<BannerInfoProps, BannerInfoState> {
  constructor(props: BannerInfoProps) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

  componentDidMount() {
    const { fetchBanner, match } = this.props
    fetchBanner(match.params.id)
  }

  onExpand = () => {
    const { expanded } = this.state
    this.setState({ expanded: !expanded })
  }

  render() {
    const { getBanner, match } = this.props
    const { expanded } = this.state
    const banner = getBanner(match.params.id)
    if (banner) {
      const { missions, numberOfMissions } = banner
      return (
        <Fragment>
          <Row justify="center" className="banner-info">
            <Layout>
              <Row>
                <Col span={8}>
                  <BannerCard banner={banner} />
                  <div className="mt-1" />
                  <MissionList
                    missions={missions}
                    numberOfMissions={numberOfMissions}
                    expanded={expanded}
                    onExpand={this.onExpand}
                  />
                </Col>
                <Col span={16}>
                  <Map banner={banner} />
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

export interface BannerInfoProps extends RouteComponentProps<{ id: string }> {
  getBanner: (id: string) => Banner | undefined
  fetchBanner: (id: string) => Promise<void>
}

interface BannerInfoState {
  expanded: boolean
}

const mapStateToProps = (state: RootState) => ({
  getBanner: (id: string) => getBannerSelector(state, id),
})

const mapDispatchToProps = {
  fetchBanner: (id: string) => loadBanner(id),
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BannerInfo))
