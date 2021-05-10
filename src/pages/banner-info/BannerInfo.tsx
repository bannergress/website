import React from 'react'
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
import BannerCard from '../../components/banner-card'
import MissionList from '../../components/mission-list'
import LoadingOverlay from '../../components/loading-overlay'
import { MapDetail } from '../../components/map-detail'

import './banner-info.less'
import { mapMissions } from '../../features/mission'

class BannerInfo extends React.Component<BannerInfoProps, BannerInfoState> {
  constructor(props: BannerInfoProps) {
    super(props)
    this.state = {
      expanded: false,
      expandedMissionIndexes: [],
      status: 'initial',
    }
  }

  componentDidMount() {
    const { fetchBanner, match } = this.props
    fetchBanner(match.params.id)
      .then(() => this.setState({ status: 'ready' }))
      .catch(() => this.setState({ status: 'error' }))
  }

  onExpand = (index: number) => {
    const { expandedMissionIndexes } = this.state
    // console.log('EMI', expandedMissionIndexes)
    if (expandedMissionIndexes.indexOf(index) >= 0) {
      const indexes = _(expandedMissionIndexes).without(index)
      this.setState({
        expandedMissionIndexes: indexes,
        expanded: indexes.length > 0,
      })
    } else {
      this.setState({
        expandedMissionIndexes: [...expandedMissionIndexes, index],
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
    const { expanded, expandedMissionIndexes, status } = this.state
    const banner = getBanner(match.params.id)
    if (banner) {
      const { missions } = banner
      return (
        <div className="banner-info">
          <Helmet>
            <title>{banner.title}</title>
          </Helmet>
          <div className="banner-info-overview">
            <BannerCard banner={banner} selected={false} showFullImage />
            {missions && (
              <MissionList
                missions={missions}
                expandedMissionIndexes={expandedMissionIndexes}
                expanded={expanded}
                onExpand={this.onExpand}
                onExpandAll={this.onExpandAll}
              />
            )}
          </div>
          <div className="banner-info-additional">
            {status === 'ready' && (
              <MapDetail
                banner={banner}
                bounds={new LatLngBounds(getBannerBounds(banner))}
                openedMissionIndexes={expandedMissionIndexes}
                onOpenMission={this.onExpand}
              />
            )}
          </div>
        </div>
      )
    }
    return <LoadingOverlay active spinner text="Loading..." fadeSpeed={500} />
  }
}

export interface BannerInfoProps extends RouteComponentProps<{ id: string }> {
  getBanner: (id: string) => Banner | undefined
  fetchBanner: (id: string) => Promise<void>
}

interface BannerInfoState {
  expanded: boolean
  expandedMissionIndexes: Array<number>
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
