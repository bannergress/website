import React, { FC } from 'react'

import { Place } from '../../features/place'

import './PlaceEntry.scss'

import SVGLocality from '../../assets/img/icons/locality.svg?react'
import SVGArea from '../../assets/img/icons/area.svg?react'

const PlaceEntry: FC<PlaceProps> = ({
  place,
  showNumbers,
  attribute,
  aligned,
}) => (
  <>
    {place.type === 'country' && (
      <>
        <span className="place-flag">
          {String.fromCodePoint.apply(
            undefined,
            Array.from(place.shortName).map(
              (c) => c.charCodeAt(0) + 0x1f1e6 - 0x41
            )
          )}
        </span>{' '}
      </>
    )}
    {place.type === 'locality' && (
      <>
        <SVGLocality className="place-icon" />{' '}
      </>
    )}
    {aligned && place.type !== 'locality' && place.type !== 'country' && (
      <>
        <SVGArea className="place-icon" />{' '}
      </>
    )}
    <span className="place-name" title={place[attribute]}>
      {place[attribute]}
    </span>

    {showNumbers && (
      <span className="place-number-of-banners">({place.numberOfBanners})</span>
    )}
  </>
)

export interface PlaceProps {
  place: Place
  showNumbers: boolean
  attribute: 'longName' | 'formattedAddress'
  aligned?: boolean
}

export default PlaceEntry
