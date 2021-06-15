import React, { createRef } from 'react'
import { LatLngBounds } from 'leaflet'
import _ from 'underscore'

import { Banner, getBannerBounds } from '../../features/banner'
import { MapDetail } from '../map-detail'

import './banner-info-with-map.less'
import { mapMissions } from '../../features/mission'
import { BannerInfoOverview, BannerInfoView } from '../banner-info-overview'
import {
  BannerInfoMobileSwitch,
  BannerInfoMobileView,
} from '../banner-info-mobile-switch'
import { IssuesList, Issue } from '../Issues-list'

import { ReactComponent as SVGBackArrow } from '../../img/icons/back-arrow.svg'

class BannerInfoWithMap extends React.Component<
  BannerInfoWithMapProps,
  BannerInfoWithMapState
> {
  mapRef: React.RefObject<MapDetail>

  viewWasMapBefore: boolean = false

  constructor(props: BannerInfoWithMapProps) {
    super(props)

    this.mapRef = createRef()

    this.state = {
      expanded: false,
      expandedMissionIndexes: [],
      scrollMissionIndex: undefined,
      mobileView: 'info',
      desktopView: 'info',
    }
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
    const {
      banner,
      hideControls,
      submitButton,
      onSubmitButtonClicked,
      goBackLabel,
      onGoBack,
    } = this.props
    const {
      expanded,
      expandedMissionIndexes,
      scrollMissionIndex,
      mobileView,
      desktopView,
    } = this.state

    const infoPaneClassName = mobileView !== 'map' ? '' : 'hide-on-mobile'
    const infoPaneViewClassName = `banner-info-left-pane-${mobileView}`
    const mapPaneClassName = mobileView === 'map' ? '' : 'hide-on-mobile'

    this.viewWasMapBefore = this.viewWasMapBefore || mobileView === 'map'

    if (banner && banner.missions) {
      const bounds = getBannerBounds(banner)
      const issues: Array<Issue> = []
      if (!bounds) {
        issues.push({
          key: 'banner-no-bounds',
          type: 'error',
          message: 'Banner has no POIs currently available',
          field: 'bounds',
        })
      }
      return (
        <div className="banner-info-with-map-container">
          <div className="hide-on-desktop">
            <BannerInfoMobileSwitch
              title={goBackLabel || banner.title}
              selectedView={mobileView}
              onChanged={this.onMobileViewChanged}
              submitButton={submitButton}
              onSubmitButtonClicked={onSubmitButtonClicked}
            />
          </div>
          <div className="banner-info-with-map-goback hide-on-mobile">
            {goBackLabel && onGoBack && (
              <>
                <button
                  type="button"
                  className="back-button"
                  onClick={onGoBack}
                >
                  <SVGBackArrow />
                </button>
                <h1>{goBackLabel}</h1>
                {submitButton && onSubmitButtonClicked && (
                  <button
                    type="button"
                    className="banner-info-with-map-submit positive-action-button hide-on-mobile"
                    onClick={onSubmitButtonClicked}
                  >
                    {submitButton}
                  </button>
                )}
              </>
            )}
          </div>
          <div className="banner-info-with-map">
            <div
              className={`banner-info ${infoPaneClassName} ${infoPaneViewClassName}`}
            >
              <BannerInfoOverview
                banner={banner}
                expanded={expanded}
                expandedMissionIndexes={expandedMissionIndexes}
                scrollMissionIndex={scrollMissionIndex}
                view={desktopView}
                onChangeView={this.onDesktopViewChanged}
                onExpand={this.onExpand}
                onExpandAll={this.onExpandAll}
                hideControls={hideControls}
              />
            </div>
            <div className={`banner-info-additional ${mapPaneClassName} `}>
              {bounds && (
                <MapDetail
                  banner={banner}
                  bounds={new LatLngBounds(bounds)}
                  openedMissionIndexes={expandedMissionIndexes}
                  onOpenMission={this.onExpandFromMap}
                  ref={this.mapRef}
                />
              )}
              {issues.length > 0 && <IssuesList issues={issues} />}
            </div>
          </div>
        </div>
      )
    }

    return null
  }
}

export interface BannerInfoWithMapProps {
  banner: Banner
  hideControls?: boolean
  submitButton?: string
  onSubmitButtonClicked?: () => void
  goBackLabel?: string
  onGoBack?: () => void
}

interface BannerInfoWithMapState {
  expanded: boolean
  expandedMissionIndexes: Array<number>
  scrollMissionIndex: number | undefined
  mobileView: BannerInfoMobileView
  desktopView: BannerInfoView
}

export default BannerInfoWithMap
