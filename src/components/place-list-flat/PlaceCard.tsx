import React, { FC } from 'react'
import { Link } from 'react-router-dom'

import { Place, createBrowseUri } from '../../features/place'

import './place-card.less'
import PlaceEntry from '../place-list/PlaceEntry'

const mapPlaceType = (place: Place) => {
  switch (place.type) {
    case 'country':
      return 'Country'
    case 'administrative_area_level_1':
      return 'First-level administrative division'
    case 'administrative_area_level_2':
      return 'Second-level administrative division'
    case 'administrative_area_level_3':
      return 'Third-level administrative division'
    case 'administrative_area_level_4':
      return 'Fourth-level administrative division'
    case 'administrative_area_level_5':
      return 'Fifth-level administrative division'
    case 'locality':
      return 'Town / city'
    default:
      return 'error'
  }
}

const PlaceCard: FC<PlaceProps> = ({ place }) => (
  <Link className="place-card-link" to={createBrowseUri(place)}>
    <div className="place-card">
      <div className="place-card-title">
        <PlaceEntry place={place} showNumbers attribute="formattedAddress" />
      </div>
      <div className="place-card-type">{mapPlaceType(place)}</div>
    </div>
  </Link>
)

export interface PlaceProps {
  place: Place
}

export default PlaceCard
