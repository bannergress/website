import React, { Fragment } from 'react'
import { Col, Row } from 'antd'
import { Prompt, RouteComponentProps, withRouter } from 'react-router'
import { connect } from 'react-redux'

import BannerCard from '../../components/banner-card'
import MissionList from '../../components/mission-list'
import { Banner, getCreatedBanner } from '../../features/banner'
import { MapDetail } from '../map-detail'
import { submitBanner as submitBannerAction } from '../../features/banner/actions'

import './preview-banner.less'
import { RootState } from '../../storeTypes'

class PreviewBanner extends React.Component<
  PreviewBannerProps,
  PreviewBannerState
> {
  constructor(props: PreviewBannerProps) {
    super(props)
    this.state = {
      loading: false,
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
        history.push(`/banner-info/${bannerId}`)
      })
      .finally(() => this.setState({ loading: false }))
  }

  render() {
    const { banner } = this.props
    const { loading } = this.state
    if (!banner) {
      return <Fragment />
    }
    const { missions } = banner

    return (
      <Fragment>
        {loading && <Fragment>Saving banner...</Fragment>}
        <Prompt
          message={(location) =>
            location.pathname.includes('new-banner')
              ? true
              : 'Are you sure you want to leave and discard this banner?'
          }
        />
        <Row>
          <Col span={8}>
            <BannerCard banner={banner} />
            <div className="mt-1" />
            {missions && <MissionList missions={missions} expanded={false} />}
          </Col>
          <Col span={16} className="mt-1 pl-1 pr-1">
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
