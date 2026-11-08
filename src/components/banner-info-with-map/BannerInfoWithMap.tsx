import React, { createRef } from 'react'
import { LatLngBounds } from 'leaflet'
import _ from 'underscore'
import { withTranslation, WithTranslationProps } from 'react-i18next'
import { useKeycloak } from '@react-keycloak/web'
import { useLocation } from 'react-router-dom'
import { useBannerComments } from '../../features/comments/useBannerComments'
import { BannerComments } from '../banner-comments/BannerComments'

import { Banner, getBannerBounds } from '../../features/banner'
import { mapMissions } from '../../features/mission'
import { BannerInfoOverview, BannerInfoView } from '../banner-info-overview'
import {
  BannerInfoMobileSwitch,
  BannerInfoMobileView,
} from '../banner-info-mobile-switch'
import { MapDetail } from '../map-detail'
import { IssuesList, Issue } from '../Issues-list'
import SVGBackArrow from '../../assets/img/icons/back-arrow.svg?react'

import './BannerInfoWithMap.scss'

class BannerInfoWithMapLayout extends React.Component<
  BannerInfoWithMapLayoutProps,
  BannerInfoWithMapState
> {
  mapRef: React.RefObject<MapDetail | null>

  viewWasMapBefore: boolean = false

  constructor(props: BannerInfoWithMapLayoutProps) {
    super(props)

    this.mapRef = createRef()

    this.state = {
      expanded: false,
      expandedMissionIndexes: [],
      scrollMissionIndex: undefined,
      mobileView: props.commentTargetId ? 'comments' : 'info',
      desktopView: props.commentTargetId ? 'comments' : 'info',
    }
  }

  componentDidUpdate(previous: BannerInfoWithMapLayoutProps) {
    if (
      this.props.commentTargetId &&
      this.props.commentTargetId !== previous.commentTargetId
    ) {
      this.onDesktopViewChanged('comments')
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
      if (banner?.missions) {
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
      mapControls,
      submitDisabled,
      showMissionOrder,
      i18n,
      comments,
      commentsCount,
    } = this.props
    const {
      expanded,
      expandedMissionIndexes,
      scrollMissionIndex,
      mobileView,
      desktopView,
    } = this.state

    const infoPaneClassName = mobileView === 'map' ? 'hide-on-mobile' : ''
    const infoPaneViewClassName = `banner-info-left-pane-${mobileView}`
    const mapPaneClassName = mobileView === 'map' ? '' : 'hide-on-mobile'

    this.viewWasMapBefore = this.viewWasMapBefore || mobileView === 'map'

    if (banner?.missions) {
      const bounds = getBannerBounds(banner)
      const issues: Array<Issue> = []
      if (!bounds) {
        issues.push({
          key: 'banner-no-bounds',
          type: 'error',
          message:
            i18n?.t('banner.errors.noPois', {
              defaultValue: 'Banner has no POIs currently available',
            }) ?? 'Banner has no POIs currently available',
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
              submitDisabled={submitDisabled}
              showComments={!!comments}
              commentsCount={commentsCount}
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
                    disabled={submitDisabled}
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
                visible={mobileView !== 'map'}
                expanded={expanded}
                expandedMissionIndexes={expandedMissionIndexes}
                scrollMissionIndex={scrollMissionIndex}
                view={desktopView}
                onChangeView={this.onDesktopViewChanged}
                onExpand={this.onExpand}
                onExpandAll={this.onExpandAll}
                hideControls={hideControls}
                comments={comments?.(
                  desktopView === 'comments' && mobileView !== 'map'
                )}
                commentsCount={commentsCount}
              />
            </div>
            <div className={`banner-info-additional ${mapPaneClassName} `}>
              {mapControls && (
                <div className="banner-info-map-controls">{mapControls}</div>
              )}
              {bounds && (
                <MapDetail
                  banner={banner}
                  bounds={new LatLngBounds(bounds)}
                  openedMissionIndexes={expandedMissionIndexes}
                  onOpenMission={this.onExpandFromMap}
                  ref={this.mapRef}
                  showMissionOrder={showMissionOrder}
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

export interface BannerInfoWithMapProps extends WithTranslationProps {
  banner: Banner
  hideControls?: boolean
  submitButton?: string
  onSubmitButtonClicked?: () => void
  goBackLabel?: string
  onGoBack?: () => void
  mapControls?: React.ReactNode
  submitDisabled?: boolean
  showMissionOrder?: boolean
  showComments?: boolean
}

interface BannerInfoWithMapLayoutProps extends BannerInfoWithMapProps {
  comments?: (active: boolean) => React.ReactNode
  commentsCount?: number
  commentTargetId?: string
}

interface BannerInfoWithMapState {
  expanded: boolean
  expandedMissionIndexes: Array<number>
  scrollMissionIndex: number | undefined
  mobileView: BannerInfoMobileView
  desktopView: BannerInfoView
}

const TranslatedLayout = withTranslation()(BannerInfoWithMapLayout)

function BannerInfoWithComments({
  authenticated,
  initialized,
  ...props
}: BannerInfoWithMapProps & { authenticated: boolean; initialized: boolean }) {
  const { hash } = useLocation()
  const targetId = /^#comment-([a-zA-Z0-9-]+)$/.exec(hash)?.[1]
  const comments = useBannerComments(
    props.banner.id,
    authenticated,
    initialized,
    targetId
  )
  return (
    <TranslatedLayout
      {...props}
      commentTargetId={targetId}
      commentsCount={
        comments.loading || comments.error
          ? undefined
          : comments.page.publishedCount
      }
      comments={(active) => (
        <BannerComments
          state={comments}
          authenticated={authenticated && initialized}
          active={active}
          targetId={targetId}
        />
      )}
    />
  )
}

export default function BannerInfoWithMap(props: BannerInfoWithMapProps) {
  const { keycloak, initialized } = useKeycloak()
  if (!props.showComments || props.hideControls) {
    return <TranslatedLayout {...props} />
  }
  const authenticated = initialized && keycloak.authenticated === true
  return (
    <BannerInfoWithComments
      key={`${props.banner.id}:${authenticated ? keycloak.subject : 'guest'}:${initialized}`}
      {...props}
      authenticated={authenticated}
      initialized={initialized}
    />
  )
}
