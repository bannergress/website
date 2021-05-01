import React, { Fragment } from 'react'
import { Col, Row } from 'antd'
import { Prompt, RouteComponentProps, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Location } from 'history'

import BannerCard from '../../components/banner-card'
import MissionList from '../../components/mission-list'
import {
  Banner,
  getCreatedBanner,
  submitBanner as submitBannerAction,
} from '../../features/banner'
import { MapDetail } from '../map-detail'
import { RootState } from '../../storeTypes'

import './preview-banner.less'

class PreviewBanner extends React.Component<
  PreviewBannerProps,
  PreviewBannerState
> {
  constructor(props: PreviewBannerProps) {
    super(props)
    this.state = {
      loading: false,
      expanded: false,
    }
  }

  componentDidMount() {
    const { history, banner } = this.props
    if (!banner) {
      history.goBack()
    }
  }

  onSubmitBanner = () => {
    const { submitBanner, history } = this.props
    this.setState({ loading: true })
    submitBanner()
      .then((bannerId) => {
        history.push(`/banner/${bannerId}`)
      })
      .catch(() => this.setState({ loading: false }))
  }

  onExpand = () => {
    const { expanded } = this.state
    this.setState({ expanded: !expanded })
  }

  getPromptMessage = (location: Location<unknown>) => {
    const { loading } = this.state
    if (loading || location.pathname.includes('new-banner')) {
      return true
    }
    return 'Are you sure you want to leave and discard this banner?'
  }

  render() {
    const { banner, history } = this.props
    const { loading, expanded } = this.state
    if (!banner) {
      return <Fragment />
    }
    const { missions } = banner

    return (
      <Fragment>
        {loading && <Fragment>Saving banner...</Fragment>}
        <Prompt message={this.getPromptMessage} />
        <Row>
          <Col span={1}>
            <button type="button" onClick={() => history.goBack()}>
              &lt;
            </button>
          </Col>
          <Col span={8}>
            <BannerCard banner={banner} />
            <div className="mt-1" />
            {missions && (
              <MissionList
                missions={missions}
                expanded={expanded}
                onExpand={this.onExpand}
              />
            )}
          </Col>
          <Col span={15} className="mt-1 pl-1 pr-1">
            <Row>
              <MapDetail banner={banner} />
            </Row>
            <Row>
              <button type="button" onClick={this.onSubmitBanner}>
                Submit Banner
              </button>
            </Row>
          </Col>
        </Row>
      </Fragment>
    )
  }
}

export interface PreviewBannerProps extends RouteComponentProps {
  banner: Banner | undefined
  submitBanner: () => Promise<string>
}

interface PreviewBannerState {
  loading: boolean
  expanded: boolean
}

const mapStateToProps = (state: RootState) => ({
  banner: getCreatedBanner(state),
})

const mapDispatchToProps = {
  submitBanner: submitBannerAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PreviewBanner))
