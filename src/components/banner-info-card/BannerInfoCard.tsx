import React, { FC, Fragment } from 'react'
import _ from 'underscore'
import { LatLng } from 'leaflet'

import { Banner } from '../../features/banner'
import {
  mapMissions,
  MissionType,
  Objective,
  POI,
  PortalPOI,
} from '../../features/mission'
import { ReactComponent as SVGList } from '../../img/icons/list.svg'
import { ReactComponent as SVGExplorer } from '../../img/icons/explorer.svg'
import { ReactComponent as SVGTimer } from '../../img/icons/timer.svg'
import { ReactComponent as SVGHand } from '../../img/icons/hand.svg'
import { ReactComponent as SVGCompass } from '../../img/icons/compass.svg'
import { Agent } from '../agent/Agent'
import { hasLatLng } from '../map-detail/showBannerRouteOnMap'

import './banner-info-card.less'
import IfUserLoggedIn from '../login/if-user-logged-in'
import { Distance } from '../distance/Distance'
import { Duration } from '../duration/Duration'

const getAgents = (banner: Banner) =>
  _(mapMissions(banner.missions, (mission) => mission?.author))
    .uniq(false, (agent) => agent.name)
    .map((agent, index) => (
      <Fragment key={`${agent.name}-container`}>
        {index > 0 && ','} <Agent key={agent.name} agent={agent} />
      </Fragment>
    ))

const getTypeName = (key: MissionType) => {
  switch (key) {
    case 'hidden':
      return 'Hidden'
    case 'anyOrder':
      return 'Any Order'
    case 'sequential':
      return 'Sequential'
    default:
      return ''
  }
}

const getMissionTypes = (banner: Banner) => {
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
          Mission Type{keys.length > 1 ? '(s)' : ''}
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

const getTotalDistance = (banner: Banner) => {
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
        <div className="info-title">Total Distance</div>
        <div className="info-content">
          {banner.lengthMeters && (
            <Distance distanceMeters={banner.lengthMeters} />
          )}
        </div>
      </div>
      {length !== undefined && length > 100 && (
        <div className="info-subrow">
          <div className="info-subtitle">Last to first waypoint</div>
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
    return totalTimeInMS
  }

  return 0
}

const getInGameTime = (banner: Banner) => {
  const totalTimeInMS =
    banner.averageDurationMilliseconds ?? getTotalTime(banner)

  return (
    <div className="info-row">
      <div className="info-icon">
        <SVGTimer />
      </div>
      <div className="info-title">In-game Time</div>
      <div className="info-content">
        <Duration durationMilliseconds={totalTimeInMS} />
      </div>
    </div>
  )
}

const getObjectiveName = (objective: Objective) => {
  switch (objective) {
    case 'captureOrUpgrade':
      return 'Capture or Upgrade'
    case 'createField':
      return 'Create Field'
    case 'createLink':
      return 'Create Link'
    case 'enterPassphrase':
      return 'Enter Passphrase'
    case 'hack':
      return 'Hack'
    case 'installMod':
      return 'Install Mod'
    case 'takePhoto':
      return 'Take Photo'
    case 'viewWaypoint':
      return 'View Waypoint'
    default:
      return ''
  }
}

const getActions = (banner: Banner) => {
  const types = _(mapMissions(banner.missions, (mission) => mission?.steps))
    .chain()
    .flatten()
    .map((step) => step.objective)
    .countBy()
    .value()
  const keys = Object.keys(types) as Array<Objective>
  const totalCount = _(keys)
    .chain()
    .map((key) => types[key])
    .reduce((prev, next) => prev + next, 0)
    .value()

  const mainActionLabel =
    keys.length === 1 ? `Action: ${getObjectiveName(keys[0])}` : 'Actions'

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
            <div className="info-subtitle">{getObjectiveName(k)}</div>
            <div className="info-subcontent">{types[k]}</div>
          </div>
        ))}
    </>
  )
}

const getUniqueVisits = (banner: Banner) => {
  const count = _(mapMissions(banner.missions, (mission) => mission?.steps))
    .chain()
    .flatten()
    .map((step) =>
      step.poi && step.poi.type === 'portal' ? step.poi : undefined
    )
    .filter((p): p is PortalPOI => !!p)
    .uniq(false, (poi) => poi!.id)
    .value().length

  return (
    <div className="info-row">
      <div className="info-icon">
        <SVGCompass />
      </div>
      <div className="info-title">Unique Visits</div>
      <div className="info-content">{count}</div>
    </div>
  )
}

const getStartPointButton = (banner: Banner) => {
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
    url = `https://www.google.com/maps/search/?api=1&query=${firstPOI.latitude},${firstPOI.longitude}`
  }
  return (
    <>
      {url && (
        <a
          className="banner-info-button"
          href={url}
          target="_blank"
          rel="noreferer noreferrer"
        >
          Go to Banner Starting Point
        </a>
      )}
    </>
  )
}

const BannerInfoCard: FC<BannerInfoCardProps> = ({ banner }) => (
  <div className="banner-info-card">
    <p>{banner.description}</p>
    <IfUserLoggedIn>
      <p>Created by {getAgents(banner)}</p>
    </IfUserLoggedIn>
    {getMissionTypes(banner)}
    {getTotalDistance(banner)}
    {getInGameTime(banner)}
    {getActions(banner)}
    {getUniqueVisits(banner)}
    {getStartPointButton(banner)}
  </div>
)

export interface BannerInfoCardProps {
  banner: Banner
}

export default BannerInfoCard
