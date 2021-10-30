import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Place, createBrowseUri } from '../../features/place'
import PlaceEntry from '../place-list/PlaceEntry'

import './place-card.less'

const PlaceCard: FC<PlaceProps> = ({ place }) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'places.types' })

  const mapPlaceType = (p: Place) => {
    switch (p.type) {
      case 'country':
        return t('country')
      case 'administrative_area_level_1':
        return t('level1')
      case 'administrative_area_level_2':
        return t('level2')
      case 'administrative_area_level_3':
        return t('level3')
      case 'administrative_area_level_4':
        return t('level4')
      case 'administrative_area_level_5':
        return t('level5')
      case 'locality':
        return t('locality')
      default:
        return t('error')
    }
  }

  return (
    <Link className="place-card-link" to={createBrowseUri(place)}>
      <div className="place-card">
        <div className="place-card-title">
          <PlaceEntry place={place} showNumbers attribute="formattedAddress" />
        </div>
        <div className="place-card-type">{mapPlaceType(place)}</div>
      </div>
    </Link>
  )
}

export interface PlaceProps {
  place: Place
}

export default PlaceCard
