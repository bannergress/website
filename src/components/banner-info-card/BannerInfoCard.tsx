import React, { FC, Fragment } from 'react'
import _ from 'underscore'
import { LatLng } from 'leaflet'
import { Trans, useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { Tooltip } from 'antd'

import { Banner } from '../../features/banner'
import {
  mapMissions,
  isPlaceholder,
  MissionType,
  Objective,
  POI,
  PortalPOI,
} from '../../features/mission'
import {
  createExternalNavigationUri,
  getExternalLinkAttributes,
} from '../../features/utils'
import { Agent } from '../agent/Agent'
import { Distance } from '../distance/Distance'
import { Duration } from '../duration/Duration'
import IfUserLoggedIn from '../login/if-user-logged-in'
import IfUserLoggedOut from '../login/if-user-logged-out'
import LoginButton from '../login/login-button'
import { hasLatLng } from '../map-detail/showBannerRouteOnMap'
import SVGList from '../../img/icons/list.svg?react'
import SVGExplorer from '../../img/icons/explorer.svg?react'
import SVGTimer from '../../img/icons/timer.svg?react'
import SVGHand from '../../img/icons/hand.svg?react'
import SVGCompass from '../../img/icons/compass.svg?react'
import SVGChecked from '../../img/icons/checked.svg?react'
import SVGOffline from '../../img/icons/offline.svg?react'
import i18n from '../../i18n'

import './banner-info-card.less'
import { PlainDate } from '../plain-date'

const getAgentList = (banner: Banner) =>
  _(mapMissions(banner.missions, (mission) => mission?.author))
    .uniq(false, (agent) => agent.name)
    .map((agent, index) => (
      <Fragment key={`${agent.name}-container`}>
        {index > 0 && ','}{' '}
        <Agent key={agent.name} agent={agent} linkToAgentProfile />
      </Fragment>
    ))

const getCreatedBy = (banner: Banner, t: TFunction) => {
  const agents = getAgentList(banner)
  if (agents && agents.length) {
    return (
      <p>
        {t('banners.createdBy')}
        {agents}
      </p>
    )
  }
  return undefined
}

const getEvent = (banner: Banner, t: TFunction) => {
  if (banner.eventStartDate) {
    let text
    if (banner.eventEndDate === banner.eventStartDate) {
      return (
        <p>
          <Trans
            i18nKey="events.eventAt"
            components={{
              at: <PlainDate date={banner.eventStartDate} />,
            }}
          />
        </p>
      )
    } else {
      return (
        <p>
          <Trans
            i18nKey="events.eventFromTo"
            components={{
              from: <PlainDate date={banner.eventStartDate} />,
              to: <PlainDate date={banner.eventEndDate!} />,
            }}
          />
        </p>
      )
    }
    return <p>{text}</p>
  }
  return undefined
}

const getRemainingDaysCategory = (days: number) => {
  if (days <= 0) {
    return 'error-text'
  }
  if (days <= 14) {
    return 'warning-text'
  }
  return undefined
}

const getPlannedOfflineDate = (banner: Banner, t: TFunction) => {
  if (
    banner.plannedOfflineDate &&
    banner.numberOfDisabledMissions === 0 &&
    banner.numberOfSubmittedMissions === 0
  ) {
    const diff =
      new Date(banner.plannedOfflineDate).getTime() - new Date().getTime()
    const diffDays = diff / 86_400_000
    const className = getRemainingDaysCategory(diffDays)
    return (
      <div className="info-row">
        <div className="info-icon">
          <SVGOffline />
        </div>
        <div className="info-title">{t('banners.plannedOfflineDate')}</div>
        <div className="info-content">
          <span className={className}>
            <PlainDate date={banner.plannedOfflineDate} />
          </span>
        </div>
      </div>
    )
  }
  return undefined
}

const getLatestUpdateStatus = (banner: Banner, t: TFunction) => {
  const updateDates = mapMissions(banner.missions, (mission) =>
    mission?.latestUpdateStatus
      ? new Date(mission?.latestUpdateStatus)
      : undefined
  )
  let latestUpdate: Date | undefined
  if (updateDates.length !== banner.numberOfMissions) {
    latestUpdate = undefined
  } else {
    latestUpdate = updateDates.reduce((first, second) =>
      first.getTime() < second.getTime() ? first : second
    )
  }
  if (latestUpdate) {
    const date = new Date(latestUpdate).toISOString().substring(0, 10)
    return (
      <div className="info-row">
        <div className="info-icon">
          <SVGChecked />
        </div>
        <div className="info-title">{t('banners.latestUpdateStatus')}</div>
        <div className="info-content">
          <PlainDate date={date} />
        </div>
      </div>
    )
  }
  return undefined
}

const getTypeName = (key: MissionType) => i18n.t(`banners.types.${key}`)

const getMissionTypes = (banner: Banner, t: TFunction) => {
  const types = _(
    mapMissions(banner.missions, (mission) => mission?.type)
  ).countBy()
  const keys = Object.keys(types) as Array<MissionType>
  return (
    <>
      <div className="info-row">
        <div className="info-icon">
          <SVGList />
        </div>
        <div className="info-title">
          {t('banners.types.title', { count: keys.length })}
        </div>
        {keys.length === 1 && (
          <div className="info-content">{getTypeName(keys[0])}</div>
        )}
      </div>
      {keys.length > 1 &&
        keys.map((k) => (
          <div key={k} className="info-subrow">
            <div className="info-subtitle">{getTypeName(k)}</div>
            <div className="info-subcontent">{types[k]}</div>
          </div>
        ))}
    </>
  )
}

const getTotalDistance = (banner: Banner, t: TFunction) => {
  let firstPOI: POI | undefined
  let lastPOI: POI | undefined
  let length: number | undefined
  if (banner.missions) {
    const keys = Object.keys(banner.missions)
      .map((k) => Number(k))
      .sort((a, b) => a - b)
    let { steps } = banner.missions[keys[0]]
    if (steps) {
      firstPOI = steps.find(hasLatLng)?.poi
    }
    steps = banner.missions[_(keys).last()!].steps
    if (steps) {
      lastPOI = _([...steps])
        .chain()
        .filter(hasLatLng)
        .last()
        .value()?.poi
    }
  }
  if (
    firstPOI &&
    firstPOI.type !== 'unavailable' &&
    lastPOI &&
    lastPOI.type !== 'unavailable'
  ) {
    length = new LatLng(firstPOI.latitude, firstPOI.longitude).distanceTo(
      new LatLng(lastPOI.latitude, lastPOI.longitude)
    )
  }
  return (
    <>
      <div className="info-row">
        <div className="info-icon">
          <SVGExplorer />
        </div>
        <div className="info-title">{t('banners.distance.title')}</div>
        <div className="info-content">
          {banner.lengthMeters && (
            <Distance distanceMeters={banner.lengthMeters} />
          )}
        </div>
      </div>
      {length !== undefined && length > 100 && (
        <div className="info-subrow">
          <div className="info-subtitle">{t('banners.distance.route')}</div>
          <div className="info-subcontent">
            <Distance distanceMeters={length} />
          </div>
        </div>
      )}
    </>
  )
}

const getTotalTime = (banner: Banner) => {
  if (banner.missions) {
    const totalTimeInMS = mapMissions(
      banner.missions,
      (mission) => mission?.averageDurationMilliseconds ?? 0
    ).reduce((t, sum) => sum + t)

    const AnyWithoutTime = mapMissions(
      banner.missions,
      (mission) =>
        mission === undefined ||
        isPlaceholder(mission) ||
        mission.status !== 'published' ||
        (mission.averageDurationMilliseconds ?? 0) === 0
    ).reduce((offline, result) => result || offline)

    return AnyWithoutTime ? 0 : totalTimeInMS
  }

  return 0
}

const getInGameTime = (banner: Banner, t: TFunction) => {
  const totalTimeInMS =
    banner.averageDurationMilliseconds ?? getTotalTime(banner)

  return (
    <div className="info-row">
      <div className="info-icon">
        <SVGTimer />
      </div>
      <div className="info-title">{t('banners.time.title')}</div>
      <div className="info-content">
        {totalTimeInMS === 0 ? (
          <Tooltip placement="right" title={i18n.t('banners.time.warning')}>
            <span>{t('banners.missingData')}</span>
          </Tooltip>
        ) : (
          <Duration durationMilliseconds={totalTimeInMS} />
        )}
      </div>
    </div>
  )
}

const getObjectiveName = (objective: Objective, count: number, t: TFunction) =>
  t(`banners.objective.${objective}`, { count })

const getActions = (banner: Banner, t: TFunction) => {
  const types = _(mapMissions(banner.missions, (mission) => mission?.steps))
    .chain()
    .flatten()
    // Filter out unavailable waypoints, include hidden ones (no objective) and those not marked unavailable
    .filter((p) => !p.objective || (p.poi && p.poi?.type !== 'unavailable'))
    .map((step) => step.objective || 'hidden')
    .countBy()
    .value()
  const keys = Object.keys(types) as Array<Objective>
  const totalCount = _(keys)
    .chain()
    .map((key) => types[key])
    .reduce((prev, next) => prev + next, 0)
    .value()

  const mainActionLabel =
    keys.length > 1
      ? t('banners.objective.title', { count: keys.length })
      : getObjectiveName(keys[0], types[keys[0]], t)

  return (
    <>
      <div className="info-row">
        <div className="info-icon">
          <SVGHand />
        </div>
        <div className="info-title">{mainActionLabel}</div>
        <div className="info-content">{totalCount}</div>
      </div>
      {keys.length > 1 &&
        keys.map((k) => (
          <div key={k} className="info-subrow">
            <div className="info-subtitle">
              {getObjectiveName(k, types[k], t)}
            </div>
            <div className="info-subcontent">{types[k]}</div>
          </div>
        ))}
    </>
  )
}

const getUniqueVisits = (banner: Banner, t: TFunction) => {
  const count = _(mapMissions(banner.missions, (mission) => mission?.steps))
    .chain()
    .flatten()
    .map((step) =>
      step.poi && step.poi.type === 'portal' ? step.poi : undefined
    )
    .filter((p): p is PortalPOI => !!p)
    .uniq(false, (poi) => poi!.id)
    .value().length

  const hasHidden = _(
    mapMissions(banner.missions, (mission) => mission?.type === 'hidden')
  ).any((t) => t)

  return (
    <div className="info-row">
      <div className="info-icon">
        <SVGCompass />
      </div>
      <div className="info-title">{t('banners.uniques')}</div>
      <div className="info-content">
        {count}
        {hasHidden && '+'}
      </div>
    </div>
  )
}

const getStartPointButton = (banner: Banner, t: TFunction) => {
  let firstPOI: POI | undefined
  let url: string | undefined
  if (banner.missions) {
    const keys = Object.keys(banner.missions)
      .map((k) => Number(k))
      .sort((a, b) => a - b)
    const { steps } = banner.missions[keys[0]]
    if (steps) {
      firstPOI = steps.find(hasLatLng)?.poi
    }
  }
  if (firstPOI && firstPOI.type !== 'unavailable') {
    url = createExternalNavigationUri(firstPOI.latitude, firstPOI.longitude)
  }
  return (
    <>
      {url && (
        <a
          {...getExternalLinkAttributes()}
          className="banner-info-button"
          href={url}
        >
          {t('banners.goToStart')}
        </a>
      )}
    </>
  )
}

const BannerInfoCard: FC<BannerInfoCardProps> = ({ banner }) => {
  const { t } = useTranslation()
  return (
    <div className="banner-info-card">
      {getEvent(banner, t)}
      {banner.warning && <p className="warning-text">{banner.warning}</p>}
      {banner.description && <p>{banner.description}</p>}
      <IfUserLoggedIn>{getCreatedBy(banner, t)}</IfUserLoggedIn>
      <IfUserLoggedOut>
        <p>
          <Trans
            i18nKey="banners.authorLogin"
            components={{
              login: <LoginButton className="button-as-link" type="button" />,
            }}
          />
        </p>
      </IfUserLoggedOut>
      {getPlannedOfflineDate(banner, t)}
      {getMissionTypes(banner, t)}
      {getTotalDistance(banner, t)}
      {getInGameTime(banner, t)}
      {getActions(banner, t)}
      {getUniqueVisits(banner, t)}
      {getLatestUpdateStatus(banner, t)}
      {getStartPointButton(banner, t)}
    </div>
  )
}

export interface BannerInfoCardProps {
  banner: Banner
}

export default BannerInfoCard
