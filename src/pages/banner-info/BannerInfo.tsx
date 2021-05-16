import React, { createRef, Fragment } from 'react'
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
import {
  BannerInfoOverview,
  BannerInfoView,
} from '../../components/banner-info-overview'
import {
  BannerInfoMobileSwitch,
  BannerInfoMobileView,
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
      scrollMissionIndex: undefined,
      status: 'initial',
      mobileView: 'info',
      desktopView: 'info',
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

  onMobileViewChanged = (view: BannerInfoMobileView) => {
    let newState: object = { mobileView: view }

    // Changing mobile view also changes desktop view if compatible
    if (view !== 'map') {
      newState = { ...newState, desktopView: view }
    }

    this.setState(newState)

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

  onDesktopViewChanged = (view: BannerInfoView) => {
    // Changing desktop view also changes mobile view
    this.setState({ desktopView: view, mobileView: view })
  }

  render() {
    const { getBanner, match } = this.props
    const {
      expanded,
      expandedMissionIndexes,
      status,
      scrollMissionIndex,
      mobileView,
      desktopView,
    } = this.state
    const banner = getBanner(match.params.id)

    const infoPaneClassName = mobileView !== 'map' ? '' : 'hide-on-mobile'
    const infoPaneViewClassName = `banner-info-left-pane-${mobileView}`
    const mapPaneClassName = mobileView === 'map' ? '' : 'hide-on-mobile'

    this.viewWasMapBefore = this.viewWasMapBefore || mobileView === 'map'

    if (banner) {
      return (
        <>
          <Helmet>
            <title>{banner.title}</title>
          </Helmet>
          <div className="banner-info-container">
            <div className="hide-on-desktop">
              <BannerInfoMobileSwitch
                banner={banner}
                selectedView={mobileView}
                onChanged={this.onMobileViewChanged}
              />
            </div>
            <div className="banner-info">
              <div
                className={`banner-info-left-pane ${infoPaneClassName} ${infoPaneViewClassName}`}
              >
                <BannerInfoOverview
                  banner={banner}
                  expanded={expanded}
                  expandedMissionIndexes={expandedMissionIndexes}
                  scrollMissionIndex={
                    desktopView === 'missions' ? scrollMissionIndex : undefined
                  }
                  disableShowMissionsOnScroll={mobileView === 'map'}
                  view={desktopView}
                  onChangeView={this.onDesktopViewChanged}
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
                    onOpenMission={this.onExpandFromMap}
                    ref={this.mapRef}
                  />
                )}
              </div>
            </div>
          </div>
        </>
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
  mobileView: BannerInfoMobileView
  desktopView: BannerInfoView
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
