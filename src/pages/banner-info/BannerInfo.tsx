import React, { createRef } from 'react'
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
import {
  BannerInfoMobileSwitch,
  BannerInfoView,
} from '../../components/banner-info-mobile-switch'

class BannerInfo extends React.Component<BannerInfoProps, BannerInfoState> {
  mapRef: React.RefObject<MapDetail>

  viewWasMapBefore: boolean = false

  constructor(props: BannerInfoProps) {
    super(props)

    this.mapRef = createRef()

    this.state = {
      expanded: false,
      expandedMissionIndexes: [],
      status: 'initial',
      view: 'info',
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

  onViewChanged = (view: BannerInfoView) => {
    this.setState({ view })

    // The used leaflet map behaves irregularly when it is created while
    // invisible. It it then becomes visible, we need to tell it to recalculate
    // its size. And when this is the first time we show the map, we need to set
    // the bounds again afterwards.
    if (view === 'map') {
      this.mapRef.current?.invalidateMapSize()

      if (!this.viewWasMapBefore) {
        this.mapRef.current?.applyBounds()
      }
    }
  }

  render() {
    const { getBanner, match } = this.props
    const { expanded, expandedMissionIndexes, status, view } = this.state
    const banner = getBanner(match.params.id)

    const infoPaneClassName = view === 'info' ? '' : 'hide-on-mobile'
    const mapPaneClassName = view === 'map' ? '' : 'hide-on-mobile'

    this.viewWasMapBefore = this.viewWasMapBefore || view === 'map'

    if (banner) {
      return (
        <>
          <Helmet>
            <title>{banner.title}</title>
          </Helmet>
          <div className="banner-info-container">
            <div className="hide-on-desktop">
              <BannerInfoMobileSwitch
                selectedView={view}
                onChanged={this.onViewChanged}
              />
            </div>
            <div className="banner-info">
              <div className={`banner-info-left-pane ${infoPaneClassName}`}>
                <BannerInfoOverview
                  banner={banner}
                  expanded={expanded}
                  expandedMissionIndexes={expandedMissionIndexes}
                  onExpand={this.onExpand}
                  onExpandAll={this.onExpandAll}
                />
              </div>
              <div className={`banner-info-additional ${mapPaneClassName} `}>
                {status === 'ready' && (
                  <MapDetail
                    banner={banner}
                    bounds={new LatLngBounds(getBannerBounds(banner))}
                    openedMissionIndexes={expandedMissionIndexes}
                    onOpenMission={this.onExpand}
                    ref={this.mapRef}
                  />
                )}
              </div>
            </div>
          </div>
        </>
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
  view: BannerInfoView
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
