import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Prompt, RouteComponentProps, withRouter } from 'react-router'
import { Location } from 'history'
import { Helmet } from 'react-helmet'
import { LatLngBounds } from 'leaflet'
import _ from 'underscore'

import { RootState } from '../../storeTypes'
import {
  Banner,
  getCreatedBanner,
  submitBanner as submitBannerAction,
  removePendingBanner as removePendingBannerAction,
  getBannerBounds,
} from '../../features/banner'
import { mapMissions } from '../../features/mission'
import LoadingOverlay from '../../components/loading-overlay'
import { MapDetail } from '../../components/map-detail'
import BannerInfoOverview from '../../components/banner-info-overview'
import { ReactComponent as SVGBackArrow } from '../../img/icons/back-arrow.svg'

import './preview-banner.less'

class PreviewBanner extends React.Component<
  PreviewBannerProps,
  PreviewBannerState
> {
  constructor(props: PreviewBannerProps) {
    super(props)
    this.state = {
      status: 'initial',
      expanded: false,
      expandedMissionIndexes: [],
      scrollMissionIndex: undefined,
    }
  }

  componentDidMount() {
    const { history, banner } = this.props
    if (!banner) {
      history.goBack()
    }
  }

  componentWillUnmount() {
    const { removePendingBanner } = this.props
    const { status } = this.state
    if (status === 'loading') {
      removePendingBanner()
    }
  }

  onSubmitBanner = () => {
    const { submitBanner, history } = this.props
    this.setState({ status: 'loading' })
    submitBanner()
      .then((bannerId) => {
        history.push(`/banner/${bannerId}`)
      })
      .catch(() => this.setState({ status: 'error' }))
  }

  onExpandFromMap = (index: number) => this.onExpand(index, true)

  onExpand = (index: number, scrollTo: boolean = false) => {
    const { expandedMissionIndexes } = this.state

    if (expandedMissionIndexes.indexOf(index) >= 0) {
      const indexes = _(expandedMissionIndexes).without(index)
      this.setState({
        expandedMissionIndexes: indexes,
        expanded: indexes.length > 0,
        scrollMissionIndex: undefined,
      })
    } else {
      this.setState({
        expandedMissionIndexes: [...expandedMissionIndexes, index],
        scrollMissionIndex: scrollTo ? index : undefined,
      })
    }
  }

  onExpandAll = () => {
    const { banner } = this.props
    const { expanded } = this.state
    if (expanded) {
      this.setState({ expanded: false, expandedMissionIndexes: [] })
    } else {
      let missionIndexes: Array<number> = []
      if (banner && banner.missions) {
        missionIndexes = mapMissions(
          banner.missions,
          (mission, index) => mission && index
        )
      }
      this.setState({ expanded: true, expandedMissionIndexes: missionIndexes })
    }
  }

  getPromptMessage = (location: Location<unknown>) => {
    const { status } = this.state
    if (status !== 'initial' || location.pathname.includes('new-banner')) {
      return true
    }
    return 'Are you sure you want to leave and discard this banner?'
  }

  onBack = () => {
    const { history } = this.props
    this.setState({ status: 'regress' }, () => history.goBack())
  }

  render() {
    const { banner } = this.props
    const {
      status,
      expanded,
      expandedMissionIndexes,
      scrollMissionIndex,
    } = this.state
    if (!banner) {
      return <Fragment />
    }

    return (
      <div className="banner-preview">
        <Helmet>Create Banner</Helmet>
        <Prompt message={this.getPromptMessage} />
        <LoadingOverlay
          active={status === 'loading'}
          text="Saving..."
          spinner
          fadeSpeed={500}
        />
        <div className="banner-preview-header">
          <button type="button" className="back-button" onClick={this.onBack}>
            <SVGBackArrow />
          </button>
          <h1>Review</h1>
        </div>
        <div className="banner-preview-content">
          <BannerInfoOverview
            banner={banner}
            expanded={expanded}
            expandedMissionIndexes={expandedMissionIndexes}
            scrollMissionIndex={scrollMissionIndex}
            onExpand={this.onExpand}
            onExpandAll={this.onExpandAll}
            hideControls
          />
          <div className="banner-preview-additional">
            <MapDetail
              banner={banner}
              bounds={new LatLngBounds(getBannerBounds(banner))}
              openedMissionIndexes={expandedMissionIndexes}
              onOpenMission={this.onExpandFromMap}
            />
            <button
              type="button"
              className="positive-action-button"
              onClick={this.onSubmitBanner}
            >
              Submit Banner
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export interface PreviewBannerProps extends RouteComponentProps {
  banner: Banner | undefined
  submitBanner: () => Promise<string>
  removePendingBanner: () => void
}

interface PreviewBannerState {
  expanded: boolean
  expandedMissionIndexes: Array<number>
  scrollMissionIndex: number | undefined
  status: 'initial' | 'loading' | 'regress' | 'error'
}

const mapStateToProps = (state: RootState) => ({
  banner: getCreatedBanner(state),
})

const mapDispatchToProps = {
  submitBanner: submitBannerAction,
  removePendingBanner: removePendingBannerAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PreviewBanner))
