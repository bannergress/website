import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { LatLngBounds } from 'leaflet'
import _ from 'underscore'

import { RootState } from '../../storeTypes'
import {
  Banner,
  getBanner as getBannerSelector,
  getBannerBounds,
  loadBanner,
} from '../../features/banner'
import LoadingOverlay from '../../components/loading-overlay'
import { MapDetail } from '../../components/map-detail'

import './banner-info.less'
import { mapMissions } from '../../features/mission'
import BannerInfoOverview from '../../components/banner-info-overview'

class BannerInfo extends React.Component<BannerInfoProps, BannerInfoState> {
  constructor(props: BannerInfoProps) {
    super(props)
    this.state = {
      expanded: false,
      expandedMissionIndexes: [],
      scrollMissionIndex: undefined,
      status: 'initial',
    }
  }

  componentDidMount() {
    const { fetchBanner, match } = this.props
    fetchBanner(match.params.id)
      .then(() => this.setState({ status: 'ready' }))
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
    const { getBanner, match } = this.props
    const { expanded } = this.state
    if (expanded) {
      this.setState({ expanded: false, expandedMissionIndexes: [] })
    } else {
      const banner = getBanner(match.params.id)
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

  render() {
    const { getBanner, match } = this.props
    const {
      expanded,
      expandedMissionIndexes,
      status,
      scrollMissionIndex,
    } = this.state
    const banner = getBanner(match.params.id)
    if (banner) {
      return (
        <div className="banner-info">
          <Helmet>
            <title>{banner.title}</title>
          </Helmet>
          <BannerInfoOverview
            banner={banner}
            expanded={expanded}
            expandedMissionIndexes={expandedMissionIndexes}
            scrollMissionIndex={scrollMissionIndex}
            onExpand={this.onExpand}
            onExpandAll={this.onExpandAll}
          />
          <div className="banner-info-additional">
            {status === 'ready' && (
              <MapDetail
                banner={banner}
                bounds={new LatLngBounds(getBannerBounds(banner))}
                openedMissionIndexes={expandedMissionIndexes}
                onOpenMission={this.onExpandFromMap}
              />
            )}
          </div>
        </div>
      )
    }
    if (status !== 'error') {
      return <LoadingOverlay active spinner text="Loading..." fadeSpeed={500} />
    }
    return <Fragment>No banners found with that id</Fragment>
  }
}

export interface BannerInfoProps extends RouteComponentProps<{ id: string }> {
  getBanner: (id: string) => Banner | undefined
  fetchBanner: (id: string) => Promise<void>
}

interface BannerInfoState {
  expanded: boolean
  expandedMissionIndexes: Array<number>
  scrollMissionIndex: number | undefined
  status: 'initial' | 'loading' | 'ready' | 'error'
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
