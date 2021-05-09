import React, { FC } from 'react'
import { Link } from 'react-router-dom'

import { Place, createMapUri, createBrowseUri } from '../../features/place'

import { ReactComponent as SVGMap } from '../../img/icons/map.svg'
import { ReactComponent as SVGBrowse } from '../../img/icons/browse.svg'

import './place-card.less'

function getPlaceSymbol(place: Place) {
  if (place.type === 'country') {
    return String.fromCodePoint.apply(
      undefined,
      Array.from(place.shortName).map((c) => c.charCodeAt(0) + 0x1f1e6 - 0x41)
    )
  }
  if (place.type === 'locality') {
    return '🏙️'
  }

  return '🌄'
}

function getPlaceTypeTitle(place: Place) {
  if (place.type === 'country') {
    return 'Country'
  }
  if (place.type === 'locality') {
    return 'Municipality'
  }

  return 'Region'
}

const PlaceCard: FC<PlaceProps> = ({ place, showNumbers }) => (
  <div className="place-card">
    <Link className="place-card-link" to={createBrowseUri(place)}>
      <div className="place-card-title">
        <div className="place-card-name" title={place.longName}>
          {place.longName}
        </div>

        {showNumbers && (
          <div className="place-card-number-of-banners">
            &nbsp; ({place.numberOfBanners})
          </div>
        )}
      </div>
      <div className="place-card-formatted-address">
        {place.formattedAddress}
      </div>
    </Link>
    <div className="place-card-icon-row">
      <div className="place-card-icon-container">
        <Link to={createBrowseUri(place)}>
          <SVGBrowse className="place-card-icon" title="Browse" />
        </Link>
      </div>
      <div className="place-card-icon-container">
        <Link to={createMapUri(place)}>
          <SVGMap className="place-card-icon" title="Map" />
        </Link>
      </div>
      <div title={getPlaceTypeTitle(place)} className="place-card-symbol">
        {getPlaceSymbol(place)}
      </div>
    </div>
  </div>
)

export interface PlaceProps {
  place: Place
  showNumbers: boolean
}

export default PlaceCard
