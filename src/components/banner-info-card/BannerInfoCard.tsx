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

const getDistance = (distance: number) => `${(distance / 1000).toFixed(1)} km`

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
        <div className="info-title">Total distance</div>
        <div className="info-content">
          {banner.lengthMeters && getDistance(banner.lengthMeters)}
        </div>
      </div>
      {length !== undefined && length > 100 && (
        <div className="info-subrow">
          <div className="info-subtitle">Last to first waypoint</div>
          <div className="info-subcontent">{getDistance(length)}</div>
        </div>
      )}
    </>
  )
}

const formatTime = (time: number) => {
  let s = time
  const ms = s % 1000
  s = (s - ms) / 1000
  const secs = s % 60
  s = (s - secs) / 60
  const mins = s % 60
  let hrs = (s - mins) / 60
  const days = hrs / 24
  hrs -= days * 24

  return `${days ? `${days} d ` : ''}${hrs ? `${hrs} h ` : ''}${mins} min`
}

const getInGameTime = (banner: Banner) => (
  <div className="info-row">
    <div className="info-icon">
      <SVGTimer />
    </div>
    <div className="info-title">In-game time</div>
    <div className="info-content">
      {banner.averageDurationMilliseconds &&
        formatTime(banner.averageDurationMilliseconds)}
    </div>
  </div>
)

const getObjectiveName = (objective: Objective) => {
  switch (objective) {
    case 'captureOrUpgrade':
      return 'Capture or upgrade'
    case 'createField':
      return 'Create field'
    case 'createLink':
      return 'Create link'
    case 'enterPassphrase':
      return 'Enter passphrase'
    case 'hack':
      return 'Hack'
    case 'installMod':
      return 'Install mod'
    case 'takePhoto':
      return 'Take photo'
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

  return (
    <>
      <div className="info-row">
        <div className="info-icon">
          <SVGHand />
        </div>
        <div className="info-title">Actions</div>
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
      <div className="info-title">Unique visits</div>
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
