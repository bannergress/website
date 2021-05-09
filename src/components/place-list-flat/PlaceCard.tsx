import React, { FC } from 'react'
import { Link } from 'react-router-dom'

import { Place, createBrowseUri } from '../../features/place'

import './place-card.less'
import PlaceEntry from '../place-list/PlaceEntry'

const PlaceCard: FC<PlaceProps> = ({ place }) => (
  <Link className="place-card-link" to={createBrowseUri(place)}>
    <div className="place-card">
      <div className="place-card-title">
        <PlaceEntry place={place} showNumbers attribute="formattedAddress" />
      </div>
    </div>
  </Link>
)

export interface PlaceProps {
  place: Place
}

export default PlaceCard
